const pool = require('../config/dbConfig.js');


exports.getCartByUserId = async (userId) => {
  try {
    const [cart] = await pool.query('SELECT * FROM carts WHERE userId = ?', [userId]); 
    return cart;
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    throw error;
  }
};




exports.createCart = async (userId) => {
  try {

    const [user] = await pool.query('SELECT * FROM users WHERE userId = ?', [userId]);
    if (user.length === 0) {
      throw new Error('User does not exist');
    }

    const [result] = await pool.query('INSERT INTO carts (userId) VALUES (?)', [userId]);
    return result.insertId;
  } catch (error) {
    console.error('Error creating cart:', error.message);
    throw error;
  }
};

exports.addProductToCart = async (cartId, productId) => {
  if (!cartId) {
    throw new Error('cartId cannot be null');
  }

  try {

    const [existingProduct] = await pool.query(
      'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );

    if (existingProduct.length > 0) {

      await pool.query(
        'UPDATE cart_items SET quantity = quantity + 1 WHERE cart_id = ? AND product_id = ?',
        [cartId, productId]
      );
    } else {
   
      await pool.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, productId, 1]
      );
    }
  } catch (error) {
    console.error('Error adding product to cart:', error.message);
    throw error;
  }
};



exports.removeProductFromCart = async (cartId, productId) => {
  try {
    const query = `
      DELETE FROM cart_items
      WHERE cart_id = ? AND product_id = ?
    `;
    const [result] = await pool.query(query, [cartId, productId]);

    // Check if the product was successfully removed
    if (result.affectedRows === 0) {
      return { error: 'Product not found in cart' };
    }

    return result;
  } catch (error) {
    console.error('Error removing product from cart:', error.message);
    throw new Error('Failed to remove product from cart');
  }
};



exports.getCartItems = async (cartId) => {
  try {
    // Assuming cart_items table links cart to products, and cart_id is linked to the cart
    const query = `
      SELECT ci.cart_id, ci.product_id, ci.quantity, p.name AS productName, p.price AS productPrice
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.product_id
      WHERE ci.cart_id = ?
    `;
    const [cartItems] = await pool.query(query, [cartId]);

    if (cartItems.length === 0) {
      throw new Error('No items found in the cart');
    }

    return cartItems;
  } catch (error) {
    console.error('Error fetching cart items:', error.message);
    throw error;
  }
};



exports.getCartByEmail = async (email) => {
  try {

    const [user] = await pool.query('SELECT userId FROM users WHERE email = ?', [email]);
    console.log(user);  
    
    if (user.length === 0) {
      throw new Error('User not found');
    }

    const userId = user[0].userId; 
    
   
    const [cart] = await pool.query('SELECT * FROM carts WHERE userId = ?', [userId]);
    if (cart.length === 0) {
      return []; 
    }
    return cart;
  } catch (error) {
    console.error('Error fetching cart by email:', error.message);
    throw error;
  }
};


