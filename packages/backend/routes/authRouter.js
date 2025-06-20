
// #####################################################################
// #                        Authentication Router                      #
// #####################################################################


//  ------------------ Imports ------------------

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');



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


// * @route   POST /api/v1/auth/logout
// * @desc    Log the user out
// * @access  Private (Requires a valid token to know who to log out)
router.post('/logout', logoutUser);

// #####################################################################

module.exports = router;