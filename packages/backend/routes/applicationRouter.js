// packages/backend/routes/applicationRouter.js

const express = require('express');
const router = express.Router();
const {
  createApplication,
  getMyApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const isLoggedIn = require('../middlewares/isLoggedIn');

// All routes for applications are protected.
router.use(isLoggedIn);

// Create a new application.
router.post('/', createApplication);

// Get all applications for the logged-in user.
router.get('/mine', getMyApplications);

// Update an application's status (approve/reject).
router.patch('/:applicationId', updateApplicationStatus);

module.exports = router;