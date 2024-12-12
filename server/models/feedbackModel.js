// ratingModel.js
const pool = require('../config/dbConfig.js');


exports.addRating = async (productId, userId, rating, comment) => {
  try {
    if (productId === undefined || userId === undefined || rating === undefined) {
      throw new Error('productId, userId, and rating are required.');
    }

    if (comment === undefined) {
      comment = null;
    }

    const [existingRating] = await pool.execute(
      'SELECT * FROM feedback WHERE product_id = ? AND userId = ?',
      [productId, userId]
    );

    if (existingRating.length > 0) {
      await pool.execute(
        'UPDATE feedback SET rating = ?, comment = ? WHERE product_id = ? AND userId = ?',
        [rating, comment, productId, userId]
      );
      return { success: true, message: 'Rating updated successfully.' };
    } else {
      await pool.execute(
        'INSERT INTO feedback (product_id, userId, rating, comment) VALUES (?, ?, ?, ?)',
        [productId, userId, rating, comment]
      );
      return { success: true, message: 'Rating added successfully.' };
    }
  } catch (error) {
    console.error('Error adding/updating rating:', error.message);
    throw new Error(`Failed to add/update rating: ${error.message}`);
  }
};



// exports.addRating = async (productId, userId, rating, comment) => {
//   try {
//     // Check if any required values are missing or undefined
//     if (productId === undefined || userId === undefined || rating === undefined) {
//       throw new Error('productId, userId, and rating are required.');
//     }

//     // If the comment is missing, set it to null
//     if (comment === undefined) {
//       comment = null; // Use null instead of undefined for SQL queries
//     }

//     // Check for an existing rating for the given productId and userId
//     const [existingRating] = await pool.execute(
//       'SELECT * FROM feedback WHERE product_id = ? AND userId = ?',
//       [productId, userId]
//     );

//     if (existingRating.length > 0) {
//       // If a rating exists, update the existing rating and comment
//       await pool.execute(
//         'UPDATE feedback SET rating = ?, comment = ? WHERE product_id = ? AND userId = ?',
//         [rating, comment, productId, userId]
//       );
//       return { success: true, message: 'Rating updated successfully.' };
//     } else {
//       // If no rating exists, insert a new rating and comment
//       await pool.execute(
//         'INSERT INTO feedback (product_id, userId, rating, comment) VALUES (?, ?, ?, ?)',
//         [productId, userId, rating, comment]
//       );
//       return { success: true, message: 'Rating added successfully.' };
//     }
//   } catch (error) {
//     console.error('Error adding/updating rating:', error);
//     throw new Error(`Failed to add/update rating: ${error.message}`);
//   }
// };

exports.getRatingsForProduct = async (productId) => {
  try {
    // Fetch all feedback for the product based on product_id
    const [ratings] = await pool.execute(
      'SELECT * FROM feedback'
    );

    // If no feedback is found, return a message
    if (ratings.length === 0) {
      return { success: false, message: 'No ratings found for this product.' };
    }

    // Return the ratings data
    return { success: true, ratings };
  } catch (error) {
    console.error('Error fetching ratings:', error);
    throw new Error(`Failed to fetch ratings: ${error.message}`);
  }
};
