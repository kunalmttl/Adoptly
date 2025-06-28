// # Application Controller

const Application = require('../models/application_model');

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
    res.status(201).json({ message: 'Application submitted', application });
  } catch (error) {
    // ! Proper error handling
    res.status(500).json({ message: 'Failed to create application', error: error.message });
  }
};

// * Fetch all applications by user (adopter)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id }).populate('pet');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
};