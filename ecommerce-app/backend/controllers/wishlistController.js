const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate('products');
  if (!wishlist) wishlist = await Wishlist.create({ user: userId, products: [] });
  return wishlist;
};

// @desc Get wishlist
// @route GET /api/wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  res.json({ success: true, data: wishlist });
});

// @desc Add product to wishlist
// @route POST /api/wishlist/add
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });

  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
    await wishlist.save();
  }
  const populated = await wishlist.populate('products');
  res.status(201).json({ success: true, data: populated });
});

// @desc Remove product from wishlist
// @route DELETE /api/wishlist/remove/:productId
const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }
  wishlist.products = wishlist.products.filter((p) => p.toString() !== req.params.productId);
  await wishlist.save();
  res.json({ success: true, data: wishlist });
});

// @desc Clear wishlist
// @route DELETE /api/wishlist/clear
const clearWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  wishlist.products = [];
  await wishlist.save();
  res.json({ success: true, data: wishlist });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist, clearWishlist };
