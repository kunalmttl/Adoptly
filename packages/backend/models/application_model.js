// # Application (Adoption Application) Mongoose Model

import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'pet', required: true },
  adoption_intent: { type: String, required: true },
  pet_location_plan: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);