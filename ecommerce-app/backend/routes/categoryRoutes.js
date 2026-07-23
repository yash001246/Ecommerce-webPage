const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getCategories);                            // 7
router.get('/:id', getCategoryById);                       // 8
router.post('/', protect, admin, createCategory);          // 9
router.put('/:id', protect, admin, updateCategory);        // 10
router.delete('/:id', protect, admin, deleteCategory);     // 11

module.exports = router;
