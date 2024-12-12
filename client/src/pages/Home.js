import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard'; 
import '../styles/Home.css'; 

const Home = () => {
  const [products, setProducts] = useState([]);  
  const [feedbacks, setFeedbacks] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);      
  const [username, setUsername] = useState('');  

  const handleAddToCart = async (product_id) => {
    const email = localStorage.getItem('userEmail');

    if (!email) {
      alert('You need to log in first!');
      return;
    }

    try {
      // Send the productId and user email to the backend to add the product to the cart
      const response = await fetch('http://localhost:3001/api/cart-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,       // Send email instead of userId
          product_id: product_id, // Send the product ID
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Product added to cart:', data); // Handle response as needed
        alert('Product added to cart!');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to add product to cart');
      }
    } catch (err) {
      console.error('Error adding product to cart:', err);
      alert('Error adding product to cart');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {

        // Fetch products
        const productsResponse = await fetch("http://localhost:3001/api/products");
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }
        const productsData = await productsResponse.json();
        
        // Fetch feedback
        const feedbackResponse = await fetch("http://localhost:3001/api/feedback/ratings/");
        if (!feedbackResponse.ok) {
          throw new Error("Failed to fetch feedback");
        }
        const feedbackData = await feedbackResponse.json();

        // Combine products with feedbacks
        const productsWithFeedback = productsData.map(product => {
          // Filter feedbacks where the product_id matches the product's product_id
          const productFeedback = feedbackData.filter(feedback => feedback.product_id === product.product_id);
          return { ...product, feedbacks: productFeedback };
        });

        setProducts(productsWithFeedback);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem('userEmail'); // or 'userName' if you store that
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Helper function to render stars based on rating
  const renderRatingStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.round(rating);  // Round to the nearest integer
    let stars = [];

    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <span
          key={i}
          className="star"
          style={{ color: i <= filledStars ? '#ffd700' : '#ddd' }}
        >
          &#9733;
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="home">
      {/* Display logged-in username */}
      {username ? (
        <h2>Welcome, {username}!</h2>  // Display the username if available
      ) : (
        <h2>Welcome, Guest!</h2>  // If no username is found, show Guest
      )}
      
      <h1>Products</h1>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.product_id} className="product-card-container">
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}  // Pass the function as a prop
            />
            <div className="product-feedback">
              <h3>Customer Feedback:</h3>
              {product.feedbacks && product.feedbacks.length > 0 ? (
                <ul>
                  {product.feedbacks.map((feedback, index) => (
                    <li key={feedback.feedback_id || index}>
                      <div>
                        <strong>User {feedback.userId}:</strong> {feedback.comment}
                      </div>
                      <div className="rating">
                        {renderRatingStars(feedback.rating)}
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
