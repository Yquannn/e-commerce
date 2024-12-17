import React, { useState, useEffect } from 'react';
import '../styles/CartPage.css';
import Feedback from './Feedback';
import Navbar from '../components/Navbar'; // Import Navbar

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [cartId, setCartId] = useState(null); // Store cartId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0); // State for cart count
  const email = localStorage.getItem('userEmail');



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

      setCartItems(prevItems => prevItems.filter(item => item.product_id !== productId));
      setCartItemCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

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
    window.location.reload(); 

  };

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
        setCartItemCount(data.cartItems.length); 
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

  const totalPrice = cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0);

  const handleProceedToCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  return (
    <>
      {/* <Navbar cartItemCount={cartItemCount} /> Pass cart count to Navbar */}
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
    </>
  );
};

export default CartPage;
