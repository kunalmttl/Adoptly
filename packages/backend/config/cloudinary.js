// packages/backend/config/cloudinary.js

const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure the Cloudinary SDK with your credentials from the .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS
});

module.exports = cloudinary;