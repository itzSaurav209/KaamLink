// File: server/models/WorkerProfile.js
// Purpose: Mongoose model for worker-specific profile details and verification

const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    type: String,
    url: String,
  },
  { _id: false }
);

const workerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      enum: [
        'maid',
        'plumber',
        'electrician',
        'driver',
        'cook',
        'carpenter',
        'house_help',
        'other',
      ],
      required: true,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    location: locationSchema,
    dailyRate: {
      type: Number,
    },
    availability: {
      type: String,
      enum: ['available', 'busy', 'inactive'],
      default: 'available',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    documents: [documentSchema],
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    totalJobsCompleted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);

