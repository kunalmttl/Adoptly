// # Application Router

const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
// * FIX: Correctly import the default export from isLoggedIn.js
const isLoggedIn = require('../middlewares/isLoggedIn');

// * Handles POST requests to /api/v1/applications
// ! FIX: Use the correct 'isLoggedIn' middleware variable instead of the undefined 'authenticateUser'
router.post('/', isLoggedIn, applicationController.createApplication);

// * Handles GET requests to /api/v1/applications/mine
// ! FIX: Use the correct 'isLoggedIn' middleware variable
router.get('/mine', isLoggedIn, applicationController.getMyApplications);

module.exports = router;