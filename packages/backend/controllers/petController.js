
// #####################################################################
// #                           Pet Controller                          #
// #####################################################################


//  ------------------ Imports ------------------

import Pet from '../models/pet_model.js'; 
import User from '../models/user_model.js';


// * @desc    Get all pets with filtering/sorting
// * @route   GET /api/v1/pets
// * @access  Public

export const getAllPets = async (req, res) => 
{
    try 
    {
        // 1. Start with a base query object
        const queryObj = {};

        // 2. Dynamically add filters from the request query parameters
        if (req.query.species && req.query.species !== 'all') {
            queryObj.species = req.query.species;
        }
        if (req.query.breed) {
            // Use a case-insensitive regex for partial matches
            queryObj.breed = { $regex: req.query.breed, $options: 'i' };
        }
        if (req.query.gender) {
            queryObj.gender = req.query.gender;
        }   
        if (req.query.status && req.query.status !== 'all') {
              queryObj.status = req.query.status;


        }
        if (req.query.details) {
            queryObj.details = req.query.details;
        }

        const { search_by, search_query } = req.query;
        if (search_by && search_query) {
        // =-= Use a case-insensitive regex for partial matches
        queryObj[search_by] = { $regex: search_query, $options: 'i' };
        }

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9; // Default to 9 pets per page
        const skip = (page - 1) * limit;

        // Get total count of pets matching the filters
        const totalPets = await Pet.countDocuments(queryObj);

        // Execute the query with filters, pagination, and populate
        const pets = await Pet.find(queryObj)
            .populate('listed_by', 'name city')
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            pets,
            totalPets,
            page,
            pages: Math.ceil(totalPets / limit)
        });

    } 

    catch (err) {
        console.error("Error in getAllPets:", err); // Improved logging
        res.status(500).json({ message: 'Error fetching pets.' });
    }
};



// * @desc    Get a single pet by ID
// * @route   GET /api/v1/pets/:id
// * @access  Public
export const getPetById = async (req, res) => 
{
    try 
    {
        const pet = await Pet.findById(req.params.id).populate('listed_by', 'name email contact');
        if (!pet) 
        {
            return res.status(404).json({ message: 'Pet not found.' });
        }
        res.status(200).json(pet);
    } 
    catch (err) 
    {
        res.status(500).json({ message: 'Error fetching pet details.' });
    }
};


// * @desc    Create a new pet listing
// * @route   POST /api/v1/pets
// * @access  Private (Sellers only)
export const createPet = async (req, res) => 
{
    // =-= Middleware should have already confirmed user is logged in.
    if (req.user.profile_type !== 'seller') 
    {
        return res.status(403).json({ message: 'Forbidden. Only users with a "seller" profile can list pets.' });
    }
    try 
    {
        const petData = { ...req.body, listed_by: req.user.id };
        const newPet = await Pet.create(petData);
        
        //  Also add this pet to the user's listed_pets array
        await User.findByIdAndUpdate(req.user.id, { $push: { listed_pets: newPet._id } });

        res.status(201).json(newPet);
    } 
    catch (err) 
    {
        //  Handle Mongoose validation errors
        if (err.name === 'ValidationError') 
        {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join('. ') });
        }
        res.status(500).json({ message: 'Error creating pet listing.' });
    }
};

// * @desc    Get all pets listed by the logged-in user
// * @route   GET /api/v1/pets/my-listings
// * @access  Private
export const getMyListedPets = async (req, res) => {
    try {
        // req.user.id is attached by our `isLoggedIn` middleware
        const pets = await Pet.find({ listed_by: req.user.id }).sort({ createdAt: -1 });
        
        res.status(200).json(pets);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching your pet listings.' });
    }
};


// * @desc    Update a pet listing
// * @route   PUT /api/v1/pets/:id
// * @access  Private (Owner only)
export const updatePet = async (req, res) => 
{
    try 
    {
        const pet = await Pet.findById(req.params.id);
        if (!pet) 
        {
            return res.status(404).json({ message: 'Pet not found.' });
        }

        // ! Security Check: Ensure the person updating is the person who listed it.
        if (pet.listed_by.toString() !== req.user.id) 
        {
            return res.status(403).json({ message: 'Forbidden. You can only update your own listings.' });
        }

        const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, 
        {
            new: true, // * Return the updated document
            runValidators: true // * Run Mongoose validators on update
        });

        res.status(200).json(updatedPet);
    } 
    catch (err) 
    {
        res.status(500).json({ message: 'Error updating pet listing.' });
    }
};


// * @desc    Delete a pet listing
// * @route   DELETE /api/v1/pets/:id
// * @access  Private (Owner only)
export const deletePet = async (req, res) => 
{
    try 
    {
        const pet = await Pet.findById(req.params.id);
        if (!pet) 
                {
            return res.status(404).json({ message: 'Pet not found.' });
        }
        
        if (pet.listed_by.toString() !== req.user.id) 
        {
            return res.status(403).json({ message: 'Forbidden. You can only delete your own listings.' });
        }
        
        await pet.deleteOne(); // Use .deleteOne() to trigger Mongoose middleware if any
        
        //  Also remove pet from user's listed_pets array
        await User.findByIdAndUpdate(req.user.id, { $pull: { listed_pets: pet._id } });

        res.status(200).json({ message: 'Pet listing deleted successfully.' });
    } 
    catch (err) 
    {
        res.status(500).json({ message: 'Error deleting pet listing.' });
    }
};