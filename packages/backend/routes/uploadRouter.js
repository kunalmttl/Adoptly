// packages/backend/routes/uploadRouter.js

const express = require('express');
const router = express.Router();
const upload = require('../utils/multer-config');
const { signUpload } = require('../controllers/uploadController');
const isLoggedIn = require('../middlewares/isLoggedIn');

// Generate a signature for direct client-side uploads to Cloudinary.
router.post('/sign', isLoggedIn, signUpload);

// Handle direct file uploads to the server's local storage.
// 'petImages' is the field name from the form-data.
router.post('/', upload.array('petImages', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }

    // Map uploaded files to their server URLs.
    const imageUrls = req.files.map((file) => `/images/pets/${file.filename}`);

    res.status(201).json({
      message: 'Files uploaded successfully.',
      urls: imageUrls,
    });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).json({ message: 'Server error during file upload.' });
  }
});

module.exports = router;