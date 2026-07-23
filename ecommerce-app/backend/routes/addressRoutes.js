const express = require('express');
const router = express.Router();
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require('../controllers/addressController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getAddresses);                    // 41
router.post('/', addAddress);                      // 42
router.put('/:id', updateAddress);                 // 43
router.delete('/:id', deleteAddress);              // 44
router.put('/:id/default', setDefaultAddress);     // 45

module.exports = router;
