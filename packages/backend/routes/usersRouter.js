const express = require('express');
const router = express.Router();
const UserFromDB = require('../models/user_model');
const {generateToken} = require('../utils/generateToken');
const {
        registerUser, 
        loginUser,
        logoutUser } = require('../controllers/authController');


router.get('/api/', async (req, res) => {
    try {
        const users = await UserFromDB.find({}, 'name email _id profile_type');
        res.status(200).json({
            success: true,
            users: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error fetching users'
        });
    }
});


router.get('/api/:id', async (req, res) => {
    try {
        const user = await UserFromDB.findById(req.params.id, 'name email _id');
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            user: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error fetching user'
        });
    }
});

router.post('/switch-profile/', async (req, res) => {
    try {
        const user = await UserFromDB.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        user.profile_type = req.body.profileType;
        await user.save();
        res.status(200).json({
            success: true,
            message: `Profile type updated to ${user.profile_type} successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error updating profile type'
        });
    }
});



// @access  Public
router.post('/register', registerUser);


router.post('/login', loginUser);

// Route to logout user
// @route   POST /logout
// @desc    Logout user by clearing token cookie
// @access  Private
router.post('/logout', logoutUser);

module.exports = router;

