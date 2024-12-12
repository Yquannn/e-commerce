import React, { useState } from 'react';
import '../styles/Feedback.css';

const Feedback = ({ cartItems, onClose }) => {
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId');

  const handleRatingChange = (productId, value) => {
    setRatings((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleCommentChange = (productId, value) => {
    setComments((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleCheckoutSubmit = async () => {
    for (let item of cartItems) {
      if (!ratings[item.product_id]) {
        setError(`Rating for ${item.productName} is required.`);
        return;
      }
    }
  
    if (!userId) {
      setError("User ID is required.");
      return;
    }
  
    setLoading(true);
    const feedbackData = cartItems.map((item) => ({
      productId: item.product_id,
      userId: userId,
      comment: comments[item.product_id] || '',
      rating: ratings[item.product_id]
    }));
  
    console.log('Submitting feedback data:', feedbackData);
    console.log(userId);
    console.log(feedbackData);
  
    try {
      const response = await fetch('http://localhost:3001/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback: feedbackData }), // Ensure body is a JSON string
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
  
      const data = await response.json();
      console.log('Feedback submitted successfully:', data);
      onClose();
    } catch (err) {
      setError('Error submitting feedback: ' + err.message);
      console.error('Error submitting feedback:', err);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  
  return (
    <div className="checkout-modal">
      <h2>Rate and Comment on Products</h2>
      {userId && <div className="user-id">User ID: {userId}</div>}
      {error && <div className="error-message">{error}</div>}
      {cartItems.map((item) => (
        <div key={item.product_id} className="checkout-item">
          <p>{item.productName}</p>
          <label>
            Rating:
            <input
              type="number"
              min="1"
              max="5"
              value={ratings[item.product_id] || ''}
              onChange={(e) => handleRatingChange(item.product_id, e.target.value)}
            />
          </label>
          <label>
            Comment:
            <textarea
              value={comments[item.product_id] || ''}
              onChange={(e) => handleCommentChange(item.product_id, e.target.value)}
            />
          </label>
        </div>
      ))}
      <button className="submit-button" onClick={handleCheckoutSubmit} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
      <button className="close-button" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default Feedback;
