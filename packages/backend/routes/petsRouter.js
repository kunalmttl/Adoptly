const express = require('express');
const router = express.Router();
const PetsFromDB = require('../models/pet_model');


router.post('/list-pet', async (req, res) => 
{
        // Check if user is logged in and has seller profile
        if (!req.user || req.user.profile_type !== 'seller') {
                return res.status(401).json('Unauthorized. Only sellers can add pets.');
        }
        
        const name = req.body.name;
        const age = req.body.age;
        
        const allowedSpecies = PetsFromDB.schema.path('species').enumValues;
        const species = req.body.species;
        // Validate species is in allowed list
        if (!allowedSpecies.includes(species)) 
        {
                return res.status(400).json('Invalid species. Allowed values are: ' + allowedSpecies.join(', '));
        }
        const allowedGenders = PetsFromDB.schema.path('gender').enumValues;
        const gender = req.body.gender;
        
        // Get location details from request
        const city = req.body.city;
        const state = req.body.state; 
        const country = req.body.country;
        const location = 
        {
                city: city,
                state: state,
                country: country
        };
        
        // Get email from authenticated user session
        const listed_by = req.user._id; // Assumes auth middleware sets req.user
        
        const breed = req.body.breed;
        const description = req.body.description;
        // Check if user has already listed a pet with same name and species
        try {
                const existingPet = await PetsFromDB.findOne({
                name: name,
                species: species,
                listed_by: listed_by
                });

                if (existingPet) {
                return res.status(400).json('You have already listed a pet with this name and species');
                }
        } catch (err) {
                return res.status(500).json('Error checking for duplicate pet: ' + err);
        }
        const image = req.body.image;
        const newPet = new PetsFromDB({ name, age, species, gender, breed, description, image, location, listed_by });
        
        newPet.save()
                .then(() => res.json(newPet))
                .catch((err) => res.status(400).json('Pet cannot be added because ' + err));
});


router.get('/api/', (req, res) => 
{
        PetsFromDB.find()
                .select('name species _id listed_by')
                .then((pets) => res.json(pets))
                .catch((err) => res.status(400).json('No Pets found!' + err));
        
});

router.get('/api/:id', (req, res) => {
    // Get pet details by ID from database
    PetsFromDB.findById(req.params.id)
        .then(pet => {
            if (!pet) {
                return res.status(404).json('Pet not found');
            }
            res.json(pet);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});


router.put('/api/:id', async (req, res) => {
        PetsFromDB.findById(req.params.id)
                .then(pet => {
                        if (!pet) {
                                return res.status(404).json('Pet not found');
                        }

                        // Update pet details
                        pet.name = req.body.name;
                        pet.age = req.body.age;
                        pet.species = req.body.species;
                        pet.gender = req.body.gender;
                        pet.breed = req.body.breed;
                        pet.size.height = req.body.height;
                        pet.size.weight = req.body.weight;
                        pet.health_status = 
                        {
                                vaccinated: req.body.vaccinated || false,
                                special_needs: req.body.special_needs || false
                        };
                        pet.description = req.body.description;
                        pet.images = req.body.images;
                        pet.location = 
                        {
                                city: req.body.city,
                                state: req.body.state,
                                country: req.body.country
                        };
                        pet.listed_by = req.body.listed_by;
                        pet.status = req.body.status;
                        pet.adoption_fee = req.body.adoption_fee;
                        pet.save()
                                .then(() => res.json('Pet updated!'))
                                .catch(err => res.status(400).json('Error: ' + err));
                })
                .catch(err => res.status(400).json('Error: ' + err));
});

router.delete('/api/:id', async (req, res) => 
{
    // Check if user is logged in and has seller profile
    if (!req.user || req.user.profile_type !== 'seller') {
        return res.status(401).json('Unauthorized. Only sellers can delete pets.');
    }

    try {
        // Find pet and check if it exists
        const pet = await PetsFromDB.findById(req.params.id);
        if (!pet) {
            return res.status(404).json('Pet not found');
        }

        // Verify the logged in user is the one who listed the pet
        if (pet.listed_by.toString() !== req.user._id.toString()) {
            return res.status(403).json('Unauthorized. You can only delete pets that you listed.');
        }

        // Delete the pet
        await PetsFromDB.findByIdAndDelete(req.params.id);
        res.json('Pet deleted successfully');

    } catch (err) {
        res.status(400).json('Error deleting pet: ' + err);
    }
});


module.exports = router;

