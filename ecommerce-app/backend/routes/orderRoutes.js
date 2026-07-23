const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  markOrderPaid,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', createOrder);                                      // 29
router.get('/myorders', getMyOrders);                                // 30
router.get('/admin/all', admin, getAllOrders);                       // 34
router.get('/admin/stats', admin, getOrderStats);                    // 36
router.get('/:id', getOrderById);                                    // 31
router.put('/:id/pay', markOrderPaid);                                // 32
router.put('/:id/cancel', cancelOrder);                               // 33
router.put('/:id/status', admin, updateOrderStatus);                 // 35

module.exports = router;
