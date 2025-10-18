// packages/backend/controllers/uploadController.js

const cloudinary = require('../config/cloudinary');



// @desc    Generate a signature for direct cloud uploads
// @route   POST /api/v1/upload/sign
// @access  Private
exports.signUpload = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Generate the signature using your API secret
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    // Send back the signature and timestamp to the frontend
    res.status(200).json({
      signature: signature,
      timestamp: timestamp,
    });

  } catch (error) {
    console.error("Error signing upload:", error);
    res.status(500).json({ message: "Server error while creating upload signature." });
  }
};