const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');
const accountRoutes = require('./routes/accountRoutes');
const cartRoutes = require('./routes/cartRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
const productController = require('./controllers/productController');

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); 
app.use('/api', productRoutes);
app.use('/api', accountRoutes);
app.use('/api', cartRoutes);
app.use('/api', feedbackRoutes);


app.post('/api/chat', async (req, res) => {
  const userQuery = req.body.message.toLowerCase();

  try {
    if (userQuery.includes("who developed this shop") || userQuery.includes("who made this")) {
      return res.json({ response: 'This shop was developed by Dondon Bautista with assistance from ChatGPT..' });
    }

    if (userQuery.startsWith("do you have")) {
      const searchTerm = userQuery.replace("do you have", "").trim(); 
      const products = await productController.getAllProductForChatBoT();

      if (!products || products.length === 0) {
        return res.json({ response: 'Sorry, no products found in our database.' });
      }

      console.log('User query:', userQuery); 

      const matchedProduct = products.find(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );

      let response = '';
      if (matchedProduct) {
        response = `Yes, we have ${matchedProduct.name} available for ₱${matchedProduct.price}!`;
      } else {
        response = `Sorry, we don't have a product like "${searchTerm}". Could you specify another product?`;
      }

      console.log('Bot response:', response); 
      res.json({ response });
    } else {

      const products = await productController.getAllProductForChatBoT();

      if (!products || products.length === 0) {
        return res.json({ response: 'Sorry, no products found in our database.' });
      }

      const matchedProduct = products.find(product =>
        product.name.toLowerCase().includes(userQuery) ||
        product.description.toLowerCase().includes(userQuery)
      );

      let response = '';
      if (matchedProduct) {
        response = `We have a ${matchedProduct.name} available for ₱${matchedProduct.price}!`;
      } else {
        response = 'Sorry, I didn’t understand that. Could you specify a product?';
      }

      res.json({ response });
    }
  } catch (error) {
    console.error('Error handling chatbot query:', error);
    res.status(500).json({ response: 'Sorry, something went wrong. Please try again later.' });
  }
});


app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
