const express = require('express');
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImages,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getProducts);                                  // 12
router.get('/featured', getFeaturedProducts);                  // 13
router.get('/category/:categoryId', getProductsByCategory);    // 14
router.get('/:id', getProductById);                            // 15
router.post('/', protect, admin, createProduct);               // 16
router.put('/:id', protect, admin, updateProduct);             // 17
router.delete('/:id', protect, admin, deleteProduct);          // 18
router.post('/:id/images', protect, admin, addProductImages);  // 19

module.exports = router;
