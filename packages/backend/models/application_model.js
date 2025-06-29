// # Application (Adoption Application) Mongoose Model

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  // ! FIX: The ref must match the model name exactly. It should be 'pet' (lowercase), not 'Pet'.
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'pet', required: true },
  adoption_intent: { type: String, required: true },
  pet_location_plan: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);