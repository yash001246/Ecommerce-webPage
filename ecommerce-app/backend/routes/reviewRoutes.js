const express = require('express');
const router = express.Router();
const { getProductReviews, createReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/product/:productId', getProductReviews);   // 37
router.post('/', protect, createReview);                 // 38
router.put('/:id', protect, updateReview);                // 39
router.delete('/:id', protect, deleteReview);             // 40

module.exports = router;
