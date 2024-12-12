import React, { useState, useEffect } from 'react';
import '../styles/CartPage.css';
import Feedback from './Feedback';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [cartId, setCartId] = useState(null); // Store cartId
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
        console.log('Fetched cart items:', data); 
        setCartItems(data.cartItems);
        setUserId(data.userId);
        setCartId(data.cartId); // Set cartId
        console.log(data.cartId);
        localStorage.setItem('userId', data.userId); 
      } catch (error) {
        console.error('Error fetching cart items:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [email]);

  // Function to remove item from cart and update UI
  const removeFromCart = async (cartId, productId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/cart-items/${cartId}/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove product from cart');
      }

      const data = await response.json();
      console.log('Product removed from cart:', data);

      // Optimistically update the UI by removing the item from the state
      setCartItems(prevItems => prevItems.filter(item => item.product_id !== productId));
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // Handle remove action triggered by the user
  const handleRemoveFromCart = (productId) => {
    if (!cartId) {
      console.error('Cart ID is not available.');
      return;
    }

    if (!productId) {
      console.error('Invalid product ID.');
      return;
    }

    removeFromCart(cartId, productId);
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0);

  const handleProceedToCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

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
                <button
                  onClick={() => handleRemoveFromCart(item.product_id)}
                  className="remove-button"
                >
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
