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
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// API Routes
app.use('/api', productRoutes);
app.use('/api', accountRoutes);
app.use('/api', cartRoutes);
app.use('/api', feedbackRoutes);


// Chatbot route to handle user queries
app.post('/api/chat', async (req, res) => {
  const userQuery = req.body.message.toLowerCase();

try {
  // Check if the user's query starts with "do you have"
  if (userQuery.startsWith("do you have")) {
    const searchTerm = userQuery.replace("do you have", "").trim(); // Extract the product name

    // Fetch all products from the database
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
