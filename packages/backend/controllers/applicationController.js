// packages/backend/controllers/applicationController.js

const Application = require('../models/application_model');
const Pet = require('../models/pet_model');
const { sendStatusUpdateEmail } = require('../utils/mailer');

// Create a new adoption application.
exports.createApplication = async (req, res) => {
  try {
    const { petId, adoption_intent, pet_location_plan } = req.body;
    const applicantId = req.user._id;

    const existingApplication = await Application.findOne({ pet: petId, applicant: applicantId });
    if (existingApplication) {
      return res.status(409).json({ message: 'You have already applied for this pet.' });
    }

    const application = new Application({
      applicant: applicantId,
      pet: petId,
      adoption_intent,
      pet_location_plan,
    });
    await application.save();

    // Mark the pet as 'pending' to prevent other applications.
    await Pet.findByIdAndUpdate(petId, { status: 'pending' });

    res.status(201).json({ message: 'Application submitted successfully.', application });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ message: 'Server error while creating application.', error: error.message });
  }
};

// Fetch all applications submitted by the logged-in user.
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'pet',
        populate: {
          path: 'listed_by',
          select: 'name', // Select only the owner's name.
        },
      })
      .sort({ createdAt: -1 }); // Sort by newest first.

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ message: 'Server error while fetching applications.', error: error.message });
  }
};

// Fetch all applications for a specific pet (for the pet owner).
exports.getApplicationsForPet = async (req, res) => {
  try {
    const { petId } = req.params;
    const pet = await Pet.findById(petId);

    // Security check: Ensure the requester is the pet owner.
    if (!pet || pet.listed_by.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You are not the owner of this pet.' });
    }

    const applications = await Application.find({ pet: petId })
      .populate('applicant', 'name email contact picture') // Populate applicant details.
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications for pet:', error);
    res.status(500).json({ message: 'Server error while fetching applications.' });
  }
};

// Update the status of an application (approve or reject).
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body; // Expecting 'approved' or 'rejected'.

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const application = await Application.findById(applicationId).populate('pet').populate('applicant', 'email');
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    // Security check: Ensure the updater is the pet owner.
    if (application.pet.listed_by.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You are not authorized to update this application.' });
    }

    application.status = status;
    await application.save();

    // Notify the applicant via email.
    await sendStatusUpdateEmail(application.applicant.email, application.pet.name, status);

    // If approved, update the pet's status and reject other applications.
    if (status === 'approved') {
      const petId = application.pet._id;
      await Pet.findByIdAndUpdate(petId, { status: 'adopted' });
      await Application.updateMany({ pet: petId, status: 'pending' }, { $set: { status: 'rejected' } });
    }

    res.status(200).json({ message: `Application ${status} successfully.`, application });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Server error while updating application status.' });
  }
};