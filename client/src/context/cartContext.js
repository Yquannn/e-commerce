import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart items when the component mounts
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/cart');
        setCartItems(response.data || []); // Ensure response data is always an array
      } catch (error) {
        console.error('Error fetching cart items:', error.message);
      }
    };

    fetchCartItems();
  }, []);

  const addToCart = async (productId, quantity) => {
    try {
      const response = await axios.post('http://localhost:3001/api/cart', { productId, quantity });
      const newItem = response.data; // Assuming the API returns the added item
      setCartItems(prevItems => [...prevItems, newItem]);
    } catch (error) {
      console.error('Error adding to cart:', error.message);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:3001/api/cart/${productId}`); // RESTful API endpoint
      setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
    } catch (error) {
      console.error('Error removing from cart:', error.message);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('http://localhost:3001/api/cart');
      setCartItems([]); // Clear all items locally after successful deletion
    } catch (error) {
      console.error('Error clearing cart:', error.message);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
