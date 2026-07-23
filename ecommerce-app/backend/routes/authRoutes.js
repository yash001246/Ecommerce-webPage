const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);       // 1
router.post('/login', loginUser);              // 2
router.post('/logout', logoutUser);            // 3
router.get('/me', protect, getMe);             // 4
router.put('/profile', protect, updateProfile);        // 5
router.put('/change-password', protect, changePassword); // 6

module.exports = router;
