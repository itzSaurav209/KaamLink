// File: server/models/Payment.js
// Purpose: Mongoose model for mock payment records for jobs

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    amount: {
      type: Number,
    },
    method: {
      type: String,
      enum: ['upi', 'card', 'cash'],
      default: 'upi',
    },
    status: {
      type: String,
      enum: ['initiated', 'success', 'failed'],
      default: 'initiated',
    },
    transactionId: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model('Payment', paymentSchema);

