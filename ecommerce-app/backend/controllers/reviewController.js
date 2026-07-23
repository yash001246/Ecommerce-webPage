const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');

const recalcProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } },
  ]);
  await Product.findByIdAndUpdate(productId, {
    ratings: stats[0]?.avgRating || 0,
    numReviews: stats[0]?.numReviews || 0,
  });
};

// @desc Get reviews for a product
// @route GET /api/reviews/product/:productId
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name avatar')
    .sort('-createdAt');
  res.json({ success: true, count: reviews.length, data: reviews });
});

// @desc Create a review
// @route POST /api/reviews
const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const existing = await Review.findOne({ user: req.user._id, product: productId });
  if (existing) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    comment,
  });

  await recalcProductRating(productId);
  res.status(201).json({ success: true, data: review });
});

// @desc Update a review
// @route PUT /api/reviews/:id
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this review');
  }
  review.rating = req.body.rating ?? review.rating;
  review.comment = req.body.comment ?? review.comment;
  const updated = await review.save();
  await recalcProductRating(review.product);
  res.json({ success: true, data: updated });
});

// @desc Delete a review
// @route DELETE /api/reviews/:id
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }
  const productId = review.product;
  await review.deleteOne();
  await recalcProductRating(productId);
  res.json({ success: true, message: 'Review removed' });
});

module.exports = { getProductReviews, createReview, updateReview, deleteReview };
