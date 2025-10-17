// packages/backend/middlewares/isLoggedIn.js

const jwt = require('jsonwebtoken');
const User = require('../models/user_model');

// Middleware to verify JWT and attach user to the request.
module.exports = async (req, res, next) => {
  let token;

  // Extract token from Authorization header or cookies.
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized. No token provided.' });
  }

  try {
    // Verify the token.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID from the token payload and attach to request.
    // Exclude the password from the user object.
    req.user = await User.findById(decoded.id).select('-password');

    // Handle case where user associated with token no longer exists.
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized. User not found.' });
    }

    next(); // Proceed to the next middleware or route handler.
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ message: 'Not authorized. Token is invalid or expired.' });
  }
};