// packages/backend/controllers/petController.js

const Pet = require('../models/pet_model');
const User = require('../models/user_model');

// Get all pets with filtering, sorting, and pagination.
exports.getAllPets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;

    // Build query object from request query parameters.
    const queryObj = {};
    const { species, breed, gender, status, details, search_by, search_query } = req.query;

    if (species && species !== 'all') queryObj.species = species;
    if (breed) queryObj.breed = { $regex: breed, $options: 'i' };
    if (gender) queryObj.gender = gender;
    if (status && status !== 'all') queryObj.status = status;
    if (details) queryObj.details = details;
    if (search_by && search_query) {
      queryObj[search_by] = { $regex: search_query, $options: 'i' };
    }

    const totalPets = await Pet.countDocuments(queryObj);
    const totalPages = Math.ceil(totalPets / limit);

    const pets = await Pet.find(queryObj)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('listed_by', 'name city');

    res.status(200).json({
      data: pets,
      pagination: { currentPage: page, totalPages, totalPets },
    });
  } catch (error) {
    console.error('Error in getAllPets:', error);
    res.status(500).json({ message: 'Server error while fetching pets.' });
  }
};

// Get a single pet by its ID.
exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('listed_by', '_id name email contact');
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found.' });
    }
    res.status(200).json(pet);
  } catch (error) {
    console.error('Error in getPetById:', error);
    res.status(500).json({ message: 'Server error while fetching pet details.' });
  }
};

// Create a new pet listing.
exports.createPet = async (req, res) => {
  try {
    if (req.user.profile_type !== 'seller') {
      return res.status(403).json({ message: 'Forbidden: Only sellers can list pets.' });
    }

    const petData = { ...req.body, listed_by: req.user.id };
    const newPet = await Pet.create(petData);

    // Add this pet to the user's list of pets.
    await User.findByIdAndUpdate(req.user.id, { $push: { listed_pets: newPet._id } });

    res.status(201).json(newPet);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    console.error('Error in createPet:', error);
    res.status(500).json({ message: 'Server error while creating pet listing.' });
  }
};

// Get all pets listed by the currently logged-in user.
exports.getMyListedPets = async (req, res) => {
  try {
    const pets = await Pet.find({ listed_by: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(pets);
  } catch (error) {
    console.error('Error in getMyListedPets:', error);
    res.status(500).json({ message: 'Server error while fetching your pet listings.' });
  }
};

// Update a pet listing.
exports.updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found.' });
    }

    // Security check: Ensure the updater is the owner.
    if (pet.listed_by.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own listings.' });
    }

    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedPet);
  } catch (error) {
    console.error('Error in updatePet:', error);
    res.status(500).json({ message: 'Server error while updating pet listing.' });
  }
};

// Delete a pet listing.
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found.' });
    }

    // Security check: Ensure the deleter is the owner.
    if (pet.listed_by.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own listings.' });
    }

    await pet.deleteOne();

    // Remove the pet from the user's list of pets.
    await User.findByIdAndUpdate(req.user.id, { $pull: { listed_pets: pet._id } });

    res.status(200).json({ message: 'Pet listing deleted successfully.' });
  } catch (error) {
    console.error('Error in deletePet:', error);
    res.status(500).json({ message: 'Server error while deleting pet listing.' });
  }
};