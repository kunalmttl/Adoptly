// packages/backend/routes/usersRouter.js

const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  getMyProfile,
  updateUserProfile,
  switchUserProfileType,
  updateMyAvatar,
} = require('../controllers/userController');
const isLoggedIn = require('../middlewares/isLoggedIn');

// All routes in this file are protected.
router.use(isLoggedIn);

// --- Routes for the logged-in user ---
// These must be defined before the dynamic '/:id' route.

// Get the current user's profile.
router.get('/me', getMyProfile);

// Update the current user's profile.
router.put('/me', updateUserProfile);

// Update the current user's avatar.
router.put('/me/avatar', updateMyAvatar);

// Switch the current user's profile type.
router.put('/me/switch-profile', switchUserProfileType);

// --- General user routes ---

// Get all users (admin functionality).
router.get('/', getAllUsers);

// Get a specific user by their ID.
router.get('/:id', getUserById);

module.exports = router;