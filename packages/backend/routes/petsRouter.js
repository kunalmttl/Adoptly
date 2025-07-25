// packages/backend/routes/petsRouter.js

const express = require('express');
const router = express.Router();
const { 
  getAllPets, 
  getPetById, 
  createPet, 
  updatePet, 
  deletePet, 
  getMyListedPets 
} = require('../controllers/petController');
const isLoggedIn = require('../middlewares/isLoggedIn');
const { getApplicationsForPet } = require('../controllers/applicationController');


// #####################################################################
// #                            Public Routes                          #
// #####################################################################
// These can be accessed by anyone.
router.get('/', getAllPets);
router.get('/:id', getPetById); // Getting details for a single pet is public.


// #####################################################################
// #                           Protected Routes                        #
// #####################################################################
// The isLoggedIn middleware will apply to all routes defined AFTER this line.
router.use(isLoggedIn);

// Specific routes before dynamic ones
router.get('/me/my-listings', getMyListedPets); // Using a more RESTful path
router.get('/:petId/applications', getApplicationsForPet);


// Dynamic routes last
router.post('/', createPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

module.exports = router;