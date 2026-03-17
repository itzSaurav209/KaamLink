// File: server/controllers/paymentController.js
// Purpose: Mock payment initiation, confirmation, and retrieval for jobs

const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/Payment');
const Job = require('../models/Job');

// POST /api/payments/initiate
const initiatePayment = async (req, res) => {
  try {
    const { jobId, amount, method } = req.body;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.status !== 'completed') {
      return res.status(400).json({ message: 'Payment only allowed for completed jobs' });
    }
    if (job.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Job already paid' });
    }

    const payment = await Payment.create({
      job: jobId,
      employer: job.employer,
      worker: job.worker,
      amount: amount || job.agreedRate,
      method: method || 'upi',
      status: 'initiated',
      transactionId: uuidv4(),
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Initiate payment error:', error);
    res.status(500).json({ message: 'Failed to initiate payment' });
  }
};

// POST /api/payments/confirm
const confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = 'success';
    payment.paidAt = new Date();
    await payment.save();

    const job = await Job.findById(payment.job);
    if (job) {
      job.paymentStatus = 'paid';
      await job.save();
    }

    res.json(payment);
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Failed to confirm payment' });
  }
};

// GET /api/payments/job/:jobId
const getPaymentByJob = async (req, res) => {
  try {
    const payment = await Payment.findOne({ job: req.params.jobId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found for this job' });
    }
    res.json(payment);
  } catch (error) {
    console.error('Get payment by job error:', error);
    res.status(500).json({ message: 'Failed to load payment' });
  }
};

module.exports = {
  initiatePayment,
  confirmPayment,
  getPaymentByJob,
};

