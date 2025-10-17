// packages/backend/models/user_model.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      select: false, // Password will not be returned in queries by default.
    },
    contact: {
      type: String,
      trim: true,
    },
    picture: {
      type: String,
      default: 'default-user-avatar.png',
    },
    profile_type: {
      type: String,
      enum: {
        values: ['adopter', 'seller'],
        message: '{VALUE} is not a supported profile type.',
      },
      required: true,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pet',
      },
    ],
    address: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
    bio: {
      type: String,
      maxLength: [500, 'Bio cannot be more than 500 characters.'],
    },
    listed_pets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pet',
      },
    ],
    // OTP and password reset fields
    otp: String,
    otp_expiry: Date,
    resetToken: String,
    resetTokenExpiration: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('user', userSchema);