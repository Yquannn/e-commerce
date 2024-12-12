// feedbackController.js
const ratingModel = require('../models/feedbackModel');  // Assuming the correct path


exports.addFeedbackController = async (req, res) => {
  const { feedback } = req.body;

  // Log the incoming request body for debugging
  console.log('Incoming feedback request:', req.body);

  if (!Array.isArray(feedback) || feedback.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid feedback data' });
  }

  try {
    const results = [];

    for (const item of feedback) {
      const { productId, userId, rating, comment } = item;

      // Validate required fields
      if (!productId || !userId || !rating) {
        console.error('Missing required fields:', item);
        return res.status(400).json({ success: false, message: 'Missing required fields in feedback data' });
      }

      const result = await ratingModel.addRating(productId, userId, rating, comment);
      results.push(result);
    }

    res.status(200).json({ message: 'Feedback submitted successfully', results });
  } catch (error) {
    console.error('Error adding feedback:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};




exports.getProductRatingsController = async (req, res) => {
  const { productId } = req.params; // Get productId from route parameter

  try {
    const result = await ratingModel.getRatingsForProduct(productId);

    if (result.success) {
      // Return ratings if found
      res.status(200).json(result.ratings);
    } else {
      // Handle the case where no ratings are found
      res.status(404).json({ success: false, message: result.message });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
