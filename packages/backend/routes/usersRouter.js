
// #####################################################################
// #                             User Router                           #
// #####################################################################


//  ------------------ Imports ------------------

import express from 'express';
const router = express.Router();
import { getAllUsers,
        getUserById,
        getMyProfile,
        updateUserProfile,
        switchUserProfileType } from '../controllers/userController.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';



// #####################################################################
// #                            Route Definitions                      #
// #####################################################################


// ! All routes in this file are protected by default.
router.use(isLoggedIn);


// * @route   GET /api/v1/users/me
// * @desc    Get the profile of the currently logged-in user
// * @access  Private
router.get('/me', getMyProfile);
router.put('/me', updateUserProfile);
router.put('/me/switch-profile', switchUserProfileType);

// * @route   GET /api/v1/users
// * @desc    Get all users
// * @access  Private (should be restricted to Admins in a real app)
router.get('/', getAllUsers);


// * @route   GET /api/v1/users/:id
// * @desc    Get a specific user by their ID
// * @access  Private
router.get('/:id', getUserById);


// ? TO-DO: Add routes for updating and deleting a user profile.
// ? router.put('/me', updateUserProfile);
// ? router.delete('/me', deleteUserProfile);

export default router;