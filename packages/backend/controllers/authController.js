
// #####################################################################
// #                 Authentication Controller Module                  #
// #####################################################################


// * ------------------ Imports ------------------

const argon2 = require('argon2');        //  For secure password hashing
const jwt = require('jsonwebtoken');    //  For creating JSON Web Tokens
const { generateToken } = require('../utils/generateToken');    // Your custom token generation utility
const UserFromDB = require('../models/user_model');     // User database model


// #####################################################################
// #                     1. Register a New User                        #
// #####################################################################


module.exports.registerUser = async function (req, res) 
{
    try 
    {
        const { name, email, password, contact, city, state, country, profile_type } = req.body;

        //  --- Input Validation ---

        if (!profile_type || !["adopter", "seller"].includes(profile_type.toLowerCase())) 
        {
            return res.status(400).json({ message: "A valid 'profile_type' (adopter or seller) is required." });
        }

        const existingUser = await UserFromDB.findOne({ email });
        if (existingUser) 
        {
            // =-= Using 409 Conflict is more specific than 401 for an existing user.
            return res.status(409).json({ message: "A user with this email already exists. Please log in." });
        }

        //  --- User Creation ---

        const hashedPassword = await argon2.hash(password);

        const newUser = await UserFromDB.create({
            name,
            email,
            password: hashedPassword,
            contact,
            address: { city, state, country },
            profile_type: profile_type.toLowerCase(),
        });

        // --- Token Generation & Response ---

        const token = generateToken(newUser);
        
        // ! httpOnly: true is a crucial security measure to prevent XSS attacks.
        res.cookie('token', token, 
        { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', //  Send cookie over HTTPS only in production
            maxAge: 24 * 60 * 60 * 1000     //  24 hours
        });
        
        //  Send a structured JSON response instead of plain text.

        res.status(201).json({
            message: "User registered successfully.",
            user: 
            {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profile_type: newUser.profile_type
            }
        });

    } 
    catch (err) 
    {
        console.error("* ERROR in registerUser:", err);
        res.status(500).json({ message: 'Server error during user registration.' });
    }
};


// #####################################################################
// #                      2. Log In an Existing User                   #
// #####################################################################


module.exports.loginUser = async function (req, res) 
{
    try 
    {
        const { email, password } = req.body;

        // --- Find User and Validate ---

        const user = await UserFromDB.findOne({ email }).select('+password');
        // =-= .select('+password') is needed if your model schema has `select: false` on the password field.

        if (!user) 
        {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) 
        {
            // =-= Use the same generic message to prevent attackers from knowing if an email exists.
            return res.status(401).json({ message: "Invalid credentials." });
        }
        
        // --- Token Generation & Response ---

        const token = generateToken(user);
        
        res.cookie('token', token, 
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000     //  24 hours
        });

        res.status(200).json({
            message: "Logged in successfully.",
            token: token,
            user: 
            {
                id: user._id,
                name: user.name,
                email: user.email,
                profile_type: user.profile_type
            }
        });

    } 
    catch (err)
    {
        console.error("* ERROR in loginUser:", err);
        res.status(500).json({ message: 'Server error during login.' });
    }
}


// #####################################################################
// #                           3. Log Out User                         #
// #####################################################################


module.exports.logoutUser = async function (req, res) 
{
    // * Clear the token cookie to log the user out.
    res.clearCookie('token');
    res.status(200).json({ message: "User logged out successfully." });
}