// # Application Controller

const Application = require('../models/application_model');
const Pet = require('../models/pet_model'); 

// * Create an adoption application
exports.createApplication = async (req, res) => {
  try {
    const { petId, adoption_intent, pet_location_plan } = req.body;
    // # Expect user to be authenticated (user id in req.user._id)
    
    const applicant = req.user._id;

    const application = new Application({
      applicant,
      pet: petId,
      adoption_intent,
      pet_location_plan,
    });

    await application.save();

    await Pet.findByIdAndUpdate(petId, { status: 'pending' });

    res.status(201).json({ message: 'Application submitted', application });
  } catch (error) {
    // ! Proper error handling
    res.status(500).json({ message: 'Failed to create application', error: error.message });
  }
};

// * Fetch all applications by user (adopter)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'pet', // =-= First, populate the 'pet' field on the Application schema.
        populate: {
          path: 'listed_by', // =-= Then, within the populated pet, populate its 'listed_by' field.
          select: 'name' // ? We only need the owner's name for now.
        }
      })
      .sort({ createdAt: -1 }); // * Sort by newest first.

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
};
