const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Route to create a new account
router.post('/feedback', feedbackController.addFeedbackController);
router.get('/feedback/ratings/', feedbackController.getProductRatingsController);



module.exports = router;
