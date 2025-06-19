
// #####################################################################
// #                              Pet Router                           #
// #####################################################################


// ------------------ Imports ------------------

const express = require('express');
const router = express.Router();
const { getAllPets, getPetById, createPet, updatePet, deletePet } = require('../controllers/petController');
const isLoggedIn = require('../middlewares/isLoggedIn');


// #####################################################################
// #                            Route Definitions                      #
// #####################################################################


// --- Public Routes ---
router.get('/', getAllPets);
router.get('/:id', getPetById);


// --- Protected Routes ---
// ! isLoggedIn middleware will run for all routes below this line.
router.use(isLoggedIn);

router.post('/', createPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

module.exports = router;