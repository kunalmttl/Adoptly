// # Upload Router

const express = require('express');
const router  = express.Router();
const upload  = require('../utils/multer-config');


const { signUpload } = require('../controllers/uploadController');
const isLoggedIn = require('../middlewares/isLoggedIn');



// * @route   POST /api/v1/upload
// * @desc    Upload one or more pet images
// * @access  Private (requires user to be logged in)
// =-= 'petImages' is the field name the frontend will use. .array() allows multiple files.

router.post('/', upload.array('petImages', 5), (req, res) => 
{
  try 
  {
    // ! If no files are uploaded, send an error.
    if (!req.files || req.files.length === 0) 
    {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }

    // * Map over the array of uploaded files to get their public URLs
    const imageUrls = req.files.map(file => 
    {
      // =-= We don't include 'public' in the URL because it's our static folder.
      return `/images/pets/${file.filename}`;
    });

    res.status(201).json(
    {
      message: 'Files uploaded successfully.',
      urls: imageUrls
    });

  } 
  catch (_error) 
  {
    console.error("! Error during file upload:", _error);
    res.status(500).json({ message: 'Server error during file upload.' });
  }
});


router.post('/sign', isLoggedIn, signUpload);


module.exports = router;
