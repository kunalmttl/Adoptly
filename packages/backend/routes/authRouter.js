
// #####################################################################
// #                        Authentication Router                      #
// #####################################################################


//  ------------------ Imports ------------------

import express from 'express';
const router = express.Router();

import { registerUser, loginUser, logoutUser, verifyOtp } from '../controllers/authController.js';



// #####################################################################
// #                            Route Definitions                      #
// #####################################################################


// * @route   POST /api/v1/auth/register
// * @desc    Register a new user
// * @access  Public
router.post('/register', registerUser);


// * @route   POST /api/v1/auth/login
// * @desc    Authenticate user & get token
// * @access  Public
router.post('/login', loginUser);


// * NEW: @route   POST /api/v1/auth/verify-otp
router.post('/verify-otp', verifyOtp);


// * @route   POST /api/v1/auth/logout
// * @desc    Log the user out
// * @access  Private (Requires a valid token to know who to log out)
router.post('/logout', logoutUser);

// #####################################################################

export default router;