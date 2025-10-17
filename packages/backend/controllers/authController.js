// packages/backend/controllers/authController.js

const argon2 = require('argon2');
const User = require('../models/user_model');
const { generateToken } = require('../utils/generateToken');
const { sendOtpEmail } = require('../utils/mailer');

// Generates a 6-digit OTP.
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Helper to set the JWT cookie.
const setTokenCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

// Register a new user.
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, profile_type } = req.body;

    if (!profile_type || !['adopter', 'seller'].includes(profile_type.toLowerCase())) {
      return res.status(400).json({ message: "A valid 'profile_type' (adopter/seller) is required." });
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const hashedPassword = await argon2.hash(password);
    const otp = generateOtp();
    const otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profile_type: profile_type.toLowerCase(),
      otp,
      otp_expiry,
    });

    await sendOtpEmail(newUser.email, otp);

    res.status(201).json({
      message: 'Registration successful. Please check your email for an OTP.',
      email: newUser.email,
    });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Server error during user registration.' });
  }
};

// Verify OTP and log the user in.
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp });

    if (!user || user.otp_expiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // Clear OTP fields after verification.
    user.otp = undefined;
    user.otp_expiry = undefined;
    await user.save();

    const token = generateToken(user);
    setTokenCookie(res, token);

    res.status(200).json({
      message: 'Authentication successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile_type: user.profile_type,
      },
    });
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    res.status(500).json({ message: 'Server error during OTP verification.' });
  }
};

// Log in an existing user.
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await argon2.verify(user.password, password))) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user);
    setTokenCookie(res, token);

    res.status(200).json({
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile_type: user.profile_type,
      },
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// Log out the user.
exports.logoutUser = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'User logged out successfully.' });
};