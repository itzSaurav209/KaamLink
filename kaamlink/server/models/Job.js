// File: server/models/Job.js
// Purpose: Mongoose model for job posts linking employers and workers

const mongoose = require('mongoose');

const jobLocationSchema = new mongoose.Schema(
  {
    address: String,
    city: String,
    pincode: String,
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    workerProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkerProfile',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
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
    },
    location: jobLocationSchema,
    scheduledDate: {
      type: Date,
    },
    duration: {
      type: Number,
    },
    agreedRate: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['open', 'accepted', 'in_progress', 'completed', 'cancelled'],
      default: 'open',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);

