// # Multer Configuration Utility

const multer = require('multer');
const path   = require('path');
const crypto = require('crypto');


// * Configure how files are stored
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // =-= Files will be saved in the 'public/images/pets' directory
    cb(null, path.join(__dirname, '..', 'public', 'images', 'pets'));
  },
  filename: function (req, file, cb) {
    // * Generate a unique filename to prevent overwrites
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const extension = path.extname(file.originalname);
    cb(null, `${randomBytes}${extension}`);
  }
});

// * Create the Multer upload instance
const upload = multer({ storage: storage });

module.exports = upload;
