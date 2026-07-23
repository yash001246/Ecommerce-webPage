const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    const err = new Error('Razorpay keys are not configured on the server');
    err.statusCode = 500;
    throw err;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// @desc Create a Razorpay order for an existing DB order
// @route POST /api/payment/razorpay/create-order
// @body { orderId }
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized for this order');
  }
  if (order.isPaid) {
    res.status(400);
    throw new Error('Order is already paid');
  }

  const instance = getRazorpayInstance();

  // Razorpay expects the amount in the smallest currency unit (paise for INR)
  const amountInPaise = Math.round(order.totalPrice * 100);

  const razorpayOrder = await instance.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: order._id.toString(),
    notes: { orderId: order._id.toString(), userId: req.user._id.toString() },
  });

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  res.status(201).json({
    success: true,
    data: {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order._id,
    },
  });
});

// @desc Verify Razorpay payment signature after checkout success
// @route POST /api/payment/razorpay/verify
// @body { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error('Missing payment verification details');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized for this order');
  }
  if (order.razorpayOrderId !== razorpay_order_id) {
    res.status(400);
    throw new Error('Order/payment mismatch');
  }

  // Verify signature: HMAC SHA256 of "razorpay_order_id|razorpay_payment_id" using key secret
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification failed: invalid signature');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;
  if (order.status === 'pending') order.status = 'processing';
  const updated = await order.save();

  res.json({ success: true, message: 'Payment verified successfully', data: updated });
});

module.exports = { createRazorpayOrder, verifyRazorpayPayment };