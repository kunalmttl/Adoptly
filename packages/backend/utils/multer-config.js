
// packages/backend/utils/multer-config.js

const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Configure disk storage for uploaded files.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save files to the 'public/images/pets' directory.
    cb(null, path.join(__dirname, '..', 'public', 'images', 'pets'));
  },
  filename: (req, file, cb) => {
    // Generate a unique filename to prevent overwrites.
    const randomHex = crypto.randomBytes(16).toString('hex');
    const extension = path.extname(file.originalname);
    cb(null, `${randomHex}${extension}`);
  },
});

// Create the Multer upload instance.
const upload = multer({ storage });

module.exports = upload;