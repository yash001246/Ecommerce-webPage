const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getCart);                          // 20
router.post('/add', addToCart);                     // 21
router.put('/update/:itemId', updateCartItem);      // 22
router.delete('/remove/:itemId', removeCartItem);   // 23
router.delete('/clear', clearCart);                 // 24

module.exports = router;
