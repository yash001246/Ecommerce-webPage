const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc Create new order (checkout)
// @route POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  // Validate stock and compute prices server-side
  let itemsPrice = 0;
  const orderItems = [];
  for (const it of items) {
    const product = await Product.findById(it.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${it.product}`);
    }
    if (product.stock < it.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    const price = product.discountPrice || product.price;
    itemsPrice += price * it.quantity;
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0] || '',
      price,
      quantity: it.quantity,
    });
    product.stock -= it.quantity;
    await product.save();
  }

  const taxPrice = Number((itemsPrice * 0.18).toFixed(2)); // GST @ 18%
  const shippingPrice = 0; // Free shipping always
  const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'COD',
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  // Clear the user's cart after successful order
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  res.status(201).json({ success: true, data: order });
});

// @desc Get logged-in user's orders
// @route GET /api/orders/myorders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json({ success: true, count: orders.length, data: orders });
});

// @desc Get single order by id
// @route GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }
  res.json({ success: true, data: order });
});

// @desc Mark order as paid
// @route PUT /api/orders/:id/pay
const markOrderPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  const updated = await order.save();
  res.json({ success: true, data: updated });
});

// @desc Cancel an order
// @route PUT /api/orders/:id/cancel
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to cancel this order');
  }
  if (['shipped', 'delivered'].includes(order.status)) {
    res.status(400);
    throw new Error('Cannot cancel an order that has already shipped or been delivered');
  }

  // restock items
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
  }

  order.status = 'cancelled';
  const updated = await order.save();
  res.json({ success: true, data: updated });
});

// @desc Get all orders (admin)
// @route GET /api/orders/admin/all
const getAllOrders = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 1;
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const count = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .sort('-createdAt')
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ success: true, count: orders.length, total: count, page, pages: Math.ceil(count / pageSize), data: orders });
});

// @desc Update order status (admin)
// @route PUT /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.status = status;
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  const updated = await order.save();
  res.json({ success: true, data: updated });
});

// @desc Get order stats (admin dashboard)
// @route GET /api/orders/admin/stats
const getOrderStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalRevenueAgg = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const statusCounts = await Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

  res.json({
    success: true,
    data: {
      totalOrders,
      totalRevenue: totalRevenueAgg[0]?.total || 0,
      statusCounts,
    },
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  markOrderPaid,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
};
