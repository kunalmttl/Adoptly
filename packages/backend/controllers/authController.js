
// #####################################################################
// #                 Authentication Controller Module                  #
// #####################################################################


// * ------------------ Imports ------------------

import argon2 from 'argon2';        //  For secure password hashing
import jwt from 'jsonwebtoken';    //  For creating JSON Web Tokens
import { generateToken } from '../utils/generateToken.js';    // Your custom token generation utility
import User from '../models/user_model.js';     // User database model
import { sendOtpEmail } from '../utils/mailer.js';


const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();


// #####################################################################
// #                     1. Register a New User                        #
// #####################################################################


export const registerUser = async function (req, res) 
{
    try {
        const { name, email, password, profile_type } = req.body;
        if (!profile_type || !["adopter", "seller"].includes(profile_type.toLowerCase())) {
            return res.status(400).json({ message: "A valid 'profile_type' is required." });
        }
        const existingUser = await UserFromDB.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "A user with this email already exists." });
        }

        const hashedPassword = await argon2.hash(password);
        const otp = generateOtp();
        const otp_expiry = new Date(Date.now() + 60000); // OTP expires in 1 minute

        const newUser = await UserFromDB.create({
            name,
            email,
            password: hashedPassword,
            profile_type: profile_type.toLowerCase(),
            otp,
            otp_expiry
        });

        await sendOtpEmail(newUser.email, otp);

        // ! Do NOT send a token yet.
        res.status(201).json({
            message: "Registration successful. Please check your email for an OTP.",
            email: newUser.email // =-= Send email back to frontend for the next step
        });

    } catch (_error) {
        console.error("* ERROR in registerUser:", _error);
        res.status(500).json({ message: 'Server error during user registration.' });
    }
};


// #####################################################################
// #                      2. Log In an Existing User                   #
// #####################################################################


export const loginUser = async function (req, res) {
    try {
        const { email, password } = req.body;
        const user = await UserFromDB.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        
        // =-= Generate the token immediately upon successful password verification.
        const token = generateToken(user);
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        // =-= Return the full login response with the token and user object.
        res.status(200).json({
            message: "Logged in successfully.",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profile_type: user.profile_type
            }
        });

    } catch (_error) {
        console.error("* ERROR in loginUser:", _error);
        res.status(500).json({ message: 'Server error during login.' });
    }
}


export const verifyOtp = async function (req, res) {
    try {
        const { email, otp } = req.body;
        const user = await UserFromDB.findOne({ email, otp });

        // ! Check if user exists, OTP is correct, and not expired
        if (!user || user.otp_expiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        // =-= Clear the OTP fields after successful verification
        user.otp = undefined;
        user.otp_expiry = undefined;
        await user.save();

        // # Now, generate and send the JWT token
        const token = generateToken(user);
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });
        
        res.status(200).json({
            message: "Authentication successful.",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profile_type: user.profile_type
            }
        });

    } catch (_error) {
        console.error("* ERROR in verifyOtp:", _error);
        res.status(500).json({ message: 'Server error during OTP verification.' });
    }
};


// #####################################################################
// #                           3. Log Out User                         #
// #####################################################################


export const logoutUser = async function (req, res) 
{
    // * Clear the token cookie to log the user out.
    res.clearCookie('token');
    res.status(200).json({ message: "User logged out successfully." });
}