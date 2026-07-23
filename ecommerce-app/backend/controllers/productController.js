const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc Get all products (search, filter, sort, paginate)
// @route GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  const filter = { isActive: true };

  if (req.query.keyword) {
    filter.$text = { $search: req.query.keyword };
  }
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }
  if (req.query.brand) {
    filter.brand = req.query.brand;
  }

  let sort = '-createdAt';
  if (req.query.sort === 'price_asc') sort = 'price';
  if (req.query.sort === 'price_desc') sort = '-price';
  if (req.query.sort === 'rating') sort = '-ratings';

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    count: products.length,
    total: count,
    page,
    pages: Math.ceil(count / pageSize),
    data: products,
  });
});

// @desc Get featured products
// @route GET /api/products/featured
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true, isActive: true })
    .populate('category', 'name slug')
    .limit(8);
  res.json({ success: true, count: products.length, data: products });
});

// @desc Get products by category
// @route GET /api/products/category/:categoryId
const getProductsByCategory = asyncHandler(async (req, res) => {
  const products = await Product.find({ category: req.params.categoryId, isActive: true }).populate(
    'category',
    'name slug'
  );
  res.json({ success: true, count: products.length, data: products });
});

// @desc Get single product
// @route GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, data: product });
});

// @desc Create product
// @route POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, discountPrice, category, brand, images, stock, sku, featured } = req.body;

  if (!name || !description || !price || !category) {
    res.status(400);
    throw new Error('Please provide name, description, price and category');
  }

  const product = await Product.create({
    name,
    description,
    price,
    discountPrice,
    category,
    brand,
    images: images || [],
    stock,
    sku,
    featured,
  });
  res.status(201).json({ success: true, data: product });
});

// @desc Update product
// @route PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const fields = ['name', 'description', 'price', 'discountPrice', 'category', 'brand', 'images', 'stock', 'sku', 'featured', 'isActive'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) product[f] = req.body[f];
  });
  const updated = await product.save();
  res.json({ success: true, data: updated });
});

// @desc Delete product
// @route DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ success: true, message: 'Product removed' });
});

// @desc Add images to a product
// @route POST /api/products/:id/images
const addProductImages = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const { images } = req.body; // array of image URLs
  if (!Array.isArray(images) || images.length === 0) {
    res.status(400);
    throw new Error('Please provide an array of image URLs');
  }
  product.images.push(...images);
  const updated = await product.save();
  res.json({ success: true, data: updated });
});

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImages,
};
