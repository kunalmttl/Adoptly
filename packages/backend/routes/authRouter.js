// packages/backend/routes/authRouter.js

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  verifyOtp,
} = require('../controllers/authController');

// Register a new user.
router.post('/register', registerUser);

// Verify OTP after registration.
router.post('/verify-otp', verifyOtp);

// Log in an existing user.
router.post('/login', loginUser);

// Log out the current user.
router.post('/logout', logoutUser);

module.exports = router;