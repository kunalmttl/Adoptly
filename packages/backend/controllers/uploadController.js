// packages/backend/controllers/uploadController.js

const cloudinary = require('../config/cloudinary');

// Generate a signature for direct Cloudinary uploads.
exports.signUpload = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({ signature, timestamp });
  } catch (error) {
    console.error('Error signing upload:', error);
    res.status(500).json({ message: 'Server error while creating upload signature.' });
  }
};