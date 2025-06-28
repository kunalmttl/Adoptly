
// #####################################################################
// #                           User Controller                         #
// #####################################################################


//  ------------------ Imports ------------------

const User = require('../models/user_model');


// * @desc    Get all users (for admin purposes)
// * @route   GET /api/v1/users
// * @access  Private/Admin
exports.getAllUsers = async (req, res) => 
{
    try 
    {
        // =-= In a real app, you'd want to add pagination here.
        const users = await User.find().select('name email profile_type');
        res.status(200).json(users);
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Error fetching users.' });
    }
};


// * @desc    Get a single user by ID
// * @route   GET /api/v1/users/:id
// * @access  Private
exports.getUserById = async (req, res) => 
{
    try 
    {
        const user = await User.findById(req.params.id).select('name email profile_type address bio listed_pets');
        if (!user) 
        {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Error fetching user.' });
    }
};


// * @desc    Get the currently logged-in user's profile
// * @route   GET /api/v1/users/me
// * @access  Private
exports.getMyProfile = async (req, res) => 
{
    // =-= The user object is attached to `req.user` by the `isLoggedIn` middleware.
    // =-= This is more secure than passing the user ID in the URL.
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
};



// * @desc    Update the logged-in user's profile
// * @route   PUT /api/v1/users/me
// * @access  Private
exports.updateUserProfile = async (req, res) => 
{
    try 
    {
        // =-= We only allow updating specific, non-critical fields.
        // =-= Never allow updating 'email' or 'password' through a generic update route.
        const { name, contact, bio, address } = req.body;
        
        const updatedFields = 
        {
            name,
            contact,
            bio,
            address
        };

        // * Find the user by the ID from the token and update their details.
        // * { new: true } ensures the updated user document is returned.
        // * { runValidators: true } ensures our model validations are checked.
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, 
            updatedFields, 
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) 
        {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        res.status(200).json(updatedUser);

    } 
    catch (err) 
    {
        if (err.name === 'ValidationError') 
        {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join('. ') });
        }
        res.status(500).json({ message: 'Error updating user profile.' });
    }
};

// * @desc    Switch the logged-in user's profile type
// * @route   PUT /api/v1/users/me/switch-profile
// * @access  Private
exports.switchUserProfileType = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        // Toggle the profile type
        const newProfileType = user.profile_type === 'adopter' ? 'seller' : 'adopter';
        user.profile_type = newProfileType;

        await user.save();

        res.status(200).json({ 
            message: `Profile successfully switched to ${newProfileType}.`,
            // FIX: Return the full user object to keep frontend state consistent
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profile_type: user.profile_type
            }
        });

    } catch (_error) {
        console.error("Error switching profile type:", _error);
        res.status(500).json({ message: 'Error switching profile type.' });
    }
};
