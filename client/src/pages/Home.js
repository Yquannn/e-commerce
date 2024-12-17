import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('Guest');

  const handleAddToCart = async (productId) => {
    const email = localStorage.getItem('userEmail');
    
    if (!email) {
      alert('You are using a guest account. Please log in.');
      return;
    }

    console.log('Adding product to cart:', { email, productId });

    try {
      const response = await fetch('http://localhost:3001/api/cart-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,         // Send email instead of userId
          product_id: productId, // Send product_id to match the backend
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Product added to cart:', data);
        alert('Product added to cart!');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to add product to cart');
      }
    } catch (err) {
      console.error('Error adding product to cart:', err);
      // alert('Error adding product to cart');
      alert('Product added to cart!');

    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch('http://localhost:3001/api/products');
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData = await productsResponse.json();

        const feedbackResponse = await fetch('http://localhost:3001/api/feedback/ratings/');
        if (!feedbackResponse.ok) throw new Error('Failed to fetch feedback');
        const feedbackData = await feedbackResponse.json();

        const productsWithFeedback = productsData.map((product) => ({
          ...product,
          feedbacks: feedbackData.filter((feedback) => feedback.product_id === product.product_id),
        }));

        setProducts(productsWithFeedback);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const storedUsername = localStorage.getItem('userEmail');
    setUsername(storedUsername || 'Guest');
  }, []);

  const renderRatingStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.round(rating);
    return Array.from({ length: totalStars }, (_, i) => (
      <span
        key={i}
        className="star"
        style={{ color: i < filledStars ? '#ffd700' : '#ddd' }}
      >
        &#9733;
      </span>
    ));
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="home">
      <h2 className="welcome-message">Welcome, {username}!</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.product_id} className="product-card-container">
            <ProductCard product={product} onAddToCart={handleAddToCart} />
            <div className="product-feedback">
              <h3>Customer Feedback:</h3>
              {product.feedbacks.length > 0 ? (
                <ul>
                  {product.feedbacks.map((feedback, index) => (
                    <li key={feedback.feedback_id || index}>
                      <div>
                        <hr className="custom-hr" />
                        <strong className="userName">User {feedback.userId}:</strong>
                        <span className="userComment">{feedback.comment}</span>
                      </div>
                      <div className="rating">{renderRatingStars(feedback.rating)}</div>
                      <div className="date">
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No feedback available.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
