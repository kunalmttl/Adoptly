// packages/backend/controllers/userController.js

const User = require('../models/user_model');

// Get all users (for admin purposes).
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email profile_type');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
};

// Get a single user by their ID.
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email profile_type address bio listed_pets');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error while fetching user.' });
  }
};

// Get the profile of the currently logged-in user.
exports.getMyProfile = async (req, res) => {
  try {
    // req.user.id is attached by the authentication middleware.
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile.' });
  }
};

// Update the profile of the logged-in user.
exports.updateUserProfile = async (req, res) => {
  try {
    // Only allow updating specific, non-critical fields.
    const { name, contact, bio, address } = req.body;
    const updatedFields = { name, contact, bio, address };

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedFields, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error while updating user profile.' });
  }
};

// Switch the profile type of the logged-in user.
exports.switchUserProfileType = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Toggle the profile type.
    user.profile_type = user.profile_type === 'adopter' ? 'seller' : 'adopter';
    await user.save();

    res.status(200).json({
      message: `Profile successfully switched to ${user.profile_type}.`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile_type: user.profile_type,
      },
    });
  } catch (error) {
    console.error('Error switching profile type:', error);
    res.status(500).json({ message: 'Server error while switching profile type.' });
  }
};

// Update the avatar of the logged-in user.
exports.updateMyAvatar = async (req, res) => {
  try {
    const { picture } = req.body;
    if (!picture) {
      return res.status(400).json({ message: 'No image URL provided.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { picture },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({ message: 'Server error while updating user avatar.' });
  }
};