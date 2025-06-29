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


exports.getApplicationsForPet = async (req, res) => {
  try {
    const { petId } = req.params;
    const pet = await Pet.findById(petId);

    // ! Security Check: Ensure the person requesting is the one who listed the pet.
    if (!pet || pet.listed_by.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You are not the owner of this pet.' });
    }

    const applications = await Application.find({ pet: petId })
      // =-= Populate the applicant's details. Select only the necessary fields.
      .populate('applicant', 'name email contact picture')
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (_error) {
    console.error("Error fetching applications for pet:", _error);
    res.status(500).json({ message: 'Server error while fetching applications.' });
  }
};


exports.updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body; // Expecting 'approved' or 'rejected'

  // ? Validate the incoming status
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided.' });
  }

  try {
    const application = await Application.findById(applicationId).populate('pet');
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    // ! Security Check: Ensure the user updating the status is the pet owner
    if (application.pet.listed_by.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You are not authorized to update this application.' });
    }

    // =-= Update the application's status
    application.status = status;
    await application.save();

    // # Core Business Logic for Approval
    if (status === 'approved') {
      const petId = application.pet._id;

      // 1. Update the pet's status to 'adopted'
      await Pet.findByIdAndUpdate(petId, { status: 'adopted' });

      // 2. Reject all other pending applications for this pet
      await Application.updateMany(
        { pet: petId, status: 'pending' },
        { $set: { status: 'rejected' } }
      );
    }

    res.status(200).json({ message: `Application ${status} successfully.`, application });

  } catch (_error) {
    console.error("! Error updating application status:", _error);
    res.status(500).json({ message: 'Server error while updating application status.' });
  }
};
