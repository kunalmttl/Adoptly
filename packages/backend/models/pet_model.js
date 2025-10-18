// packages/backend/models/pet_model.js

const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pet name is required.'],
      trim: true,
    },
    species: {
      type: String,
      enum: {
        values: ['dog', 'cat', 'rabbit', 'bird', 'other'],
        message: '{VALUE} is not a supported species.',
      },
      required: true,
      lowercase: true,
    },
    breed: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: [0, 'Age cannot be negative.'],
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      lowercase: true,
    },
    size: {
      height: { type: Number, min: 0 }, // in cm or inches
      weight: { type: Number, min: 0 }, // in kg or lbs
    },
    description: {
      type: String,
      required: [true, 'A description is required.'],
      maxLength: [1000, 'Description is too long.'],
    },
    health_status: {
      vaccinated: { type: Boolean, default: false },
      special_needs: { type: Boolean, default: false },
    },
    adoption_fee: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Adoption fee cannot be negative.'],
    },
    location: {
      city: { type: String, required: true, trim: true },
      state: { type: String, trim: true },
      country: { type: String, required: true, trim: true },
    },
    images: [
      {
        type: String,
        required: [true, 'At least one image is required.'],
      },
    ],
    listed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'pending', 'adopted'],
      default: 'available',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('pet', petSchema);