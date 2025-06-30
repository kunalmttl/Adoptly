// # Contact Router

import express from 'express';
const router = express.Router();
import * as contactController from '../controllers/contactController.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';

// * @route   POST /api/v1/contact
// * @desc    Send an email to another user
// * @access  Private
router.post('/', isLoggedIn, contactController.sendEmail);

export default router;