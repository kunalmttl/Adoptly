// # Application Router

import express from 'express';
const router = express.Router();
import * as applicationController from '../controllers/applicationController.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';

// * Handles POST requests to /api/v1/applications
// ! FIX: Use the correct 'isLoggedIn' middleware variable instead of the undefined 'authenticateUser'
router.post('/', isLoggedIn, applicationController.createApplication);

// * Handles GET requests to /api/v1/applications/mine
// ! FIX: Use the correct 'isLoggedIn' middleware variable
router.get('/mine', isLoggedIn, applicationController.getMyApplications);

router.patch('/:applicationId', isLoggedIn, applicationController.updateApplicationStatus);


export default router;