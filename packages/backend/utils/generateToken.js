// packages/backend/utils/generateToken.js

const jwt = require('jsonwebtoken');

/**
 * Generates a JSON Web Token for a given user.
 * @param {object} user - The user object, which must contain an _id.
 * @returns {string} The generated JWT.
 */
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;

  // This check is critical. The server should not run without a JWT secret.
  if (!secret) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in the .env file.');
    throw new Error('Server configuration error: JWT secret is missing.');
  }

  // The payload contains the claims encoded in the token.
  const payload = {
    id: user._id,
    profile_type: user.profile_type,
  };

  // Sign the token with a 1-day expiration.
  return jwt.sign(payload, secret, {
    expiresIn: '1d',
  });
};

module.exports = { generateToken };