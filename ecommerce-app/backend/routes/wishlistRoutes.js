const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getWishlist);                                // 25
router.post('/add', addToWishlist);                          // 26
router.delete('/remove/:productId', removeFromWishlist);     // 27
router.delete('/clear', clearWishlist);                       // 28

module.exports = router;
