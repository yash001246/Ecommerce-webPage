const asyncHandler = require('express-async-handler');
const Address = require('../models/Address');

// @desc Get user's addresses
// @route GET /api/addresses
const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort('-isDefault');
  res.json({ success: true, count: addresses.length, data: addresses });
});

// @desc Add a new address
// @route POST /api/addresses
const addAddress = asyncHandler(async (req, res) => {
  if (req.body.isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }
  const address = await Address.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, data: address });
});

// @desc Update an address
// @route PUT /api/addresses/:id
const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }
  if (req.body.isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }
  Object.assign(address, req.body);
  const updated = await address.save();
  res.json({ success: true, data: updated });
});

// @desc Delete an address
// @route DELETE /api/addresses/:id
const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }
  await address.deleteOne();
  res.json({ success: true, message: 'Address removed' });
});

// @desc Set an address as default
// @route PUT /api/addresses/:id/default
const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }
  await Address.updateMany({ user: req.user._id }, { isDefault: false });
  address.isDefault = true;
  await address.save();
  res.json({ success: true, data: address });
});

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress };
