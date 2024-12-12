import React, { useState, useEffect } from 'react';
import '../styles/CartPage.css';
import Feedback from './Feedback';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const email = localStorage.getItem('userEmail');
  
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!email) {
        console.error('User email is missing');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/api/cart-items/${email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch cart items.');
        }
        const data = await response.json();
        if (!data.cartItems || !Array.isArray(data.cartItems)) {
          throw new Error('Invalid response format: Expected an array of cart items.');
        }
        setCartItems(data.cartItems);
        setUserId(data.userId); 
        localStorage.setItem('userId', data.userId); // Set userId in localStorage

      } catch (error) {
        console.error('Error fetching cart items:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [email]);

  const removeFromCart = async (cartId, productId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/cart-items/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartId, productId }), // Ensure body is a JSON string
      });
  
      if (!response.ok) {
        throw new Error('Failed to remove item from cart.');
      }
  
      setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
    } catch (error) {
      console.error('Error removing item from cart:', error.message);
      setError(error.message);
    }
  };
  
  const handleRemoveFromCart = (productId) => {
    if (!userId || !productId) {
      console.error('Invalid cart ID or product ID.');
      return;
    }
    removeFromCart(userId, productId);
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0);

  const handleProceedToCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="cart-page">
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Please add items to your cart.</p>
        </div>
      ) : (
        <>
          <h2>My Cart</h2>
          {/* {userId && <div className="user-id">User ID: {userId}</div>} */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product_id} className="cart-item">
                <img
                  src={item.product_image || '/default-image.jpg'}
                  alt={item.productName}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <p>{item.productName}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>₱{item.productPrice}</p>
                </div>
                <button onClick={() => handleRemoveFromCart(userId, item.product_id)} className="remove-button">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-footer">
            <div className="total-price">Total: ₱{totalPrice.toFixed(2)}</div>
            <button className="checkout-button" onClick={handleProceedToCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {isCheckoutModalOpen && (
        <Feedback
          cartItems={cartItems}
          userId={userId}
          onClose={() => setIsCheckoutModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CartPage;
