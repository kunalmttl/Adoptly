// packages/backend/routes/applicationRouter.js
const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
// FIX: Import the default export correctly
const isLoggedIn = require('../middlewares/isLoggedIn'); 

// FIX: Use the correct middleware variable name 'isLoggedIn'
router.post('/', isLoggedIn, applicationController.createApplication);
router.get('/mine', isLoggedIn, applicationController.getMyApplications);

module.exports = router;