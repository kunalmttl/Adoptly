// packages/backend/routes/contactRouter.js

const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/contactController');
const isLoggedIn = require('../middlewares/isLoggedIn');

// Send a contact email to another user (protected route).
router.post('/', isLoggedIn, sendEmail);

module.exports = router;