
// #####################################################################
// #                           Pet Controller                          #
// #####################################################################


//  ------------------ Imports ------------------

const Pet = require('../models/pet_model');
const User = require('../models/user_model');


// * @desc    Get all pets with filtering/sorting
// * @route   GET /api/v1/pets
// * @access  Public

exports.getAllPets = async (req, res) => 
{
    try 
    {
        // ? TO-DO: Implement filtering (by species, city) and sorting from query params.
        // ? Example: /api/v1/pets?species=dog&city=NewYork
        const pets = await Pet.find({ status: 'available' }).populate('listed_by', 'name city');
        res.status(200).json(pets);
    } 
    catch (err) 
    {
        res.status(500).json({ message: 'Error fetching pets.' });
    }
};



// * @desc    Get a single pet by ID
// * @route   GET /api/v1/pets/:id
// * @access  Public
exports.getPetById = async (req, res) => 
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
exports.createPet = async (req, res) => 
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


// * @desc    Update a pet listing
// * @route   PUT /api/v1/pets/:id
// * @access  Private (Owner only)
exports.updatePet = async (req, res) => 
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
exports.deletePet = async (req, res) => 
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