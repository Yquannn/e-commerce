const productController = require('./controllers/productController');

// Handle chatbot queries
const handleChatbotQuery = async (query) => {
  try {
    // Fetch all products from the database
    const products = await productController.getAllProductForChatBoT();

    if (!products || products.length === 0) {
      return 'Sorry, no products found in our database.';
    }

    console.log(products); // Debug: Logs all products fetched from the database

    // Convert the user query to lowercase
    const userQuery = query.toLowerCase();

    let response = '';

    console.log('You:', userQuery); // Log the user's query for debugging

    // Check if the user query matches any product name or description (case insensitive)
    const matchedProduct = products.find(product =>
      product.name.toLowerCase().includes(userQuery) || 
      product.description.toLowerCase().includes(userQuery)
    );

    if (matchedProduct) {
      response = `We have a ${matchedProduct.name} available for $${matchedProduct.price}! Description: ${matchedProduct.description}`;
    } else {
      response = 'Sorry, I didn’t understand that. Could you specify a product?';
    }

    console.log('Bot response:', response); // Log the bot's response for debugging
    return response;
  } catch (error) {
    console.error('Error handling chatbot query:', error);
    return 'Sorry, something went wrong. Please try again later.';
  }
};

// Test with a query
const query = 'riri'; 
handleChatbotQuery(query).then(response => {
});
