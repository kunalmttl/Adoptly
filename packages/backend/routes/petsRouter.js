// packages/backend/routes/petsRouter.js

const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const applicationController = require('../controllers/applicationController');
const isLoggedIn = require('../middlewares/isLoggedIn');

// --- Public Routes ---

// Get all pets with filtering and pagination.
router.get('/', petController.getAllPets);

// --- Protected Routes (Specific before Dynamic) ---

// Get all pets listed by the logged-in user.
router.get('/me/my-listings', isLoggedIn, petController.getMyListedPets);

// --- Public Route (Dynamic) ---
// This must be after specific routes to avoid conflicts.
router.get('/:id', petController.getPetById);

// --- Other Protected Routes ---

// Get all applications for a specific pet (for the owner).
router.get('/:petId/applications', isLoggedIn, applicationController.getApplicationsForPet);

// Create a new pet listing.
router.post('/', isLoggedIn, petController.createPet);

// Update an existing pet listing.
router.put('/:id', isLoggedIn, petController.updatePet);

// Delete a pet listing.
router.delete('/:id', isLoggedIn, petController.deletePet);

module.exports = router;