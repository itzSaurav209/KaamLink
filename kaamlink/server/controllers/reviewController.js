// File: server/controllers/reviewController.js
// Purpose: Handlers for submitting and fetching reviews for workers and employers

const Review = require('../models/Review');
const Job = require('../models/Job');
const WorkerProfile = require('../models/WorkerProfile');

// POST /api/reviews
const submitReview = async (req, res) => {
  try {
    const { jobId, revieweeId, rating, comment } = req.body;
    const reviewerId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job || job.status !== 'completed') {
      return res.status(400).json({ message: 'Review allowed only after job completion' });
    }

    const existing = await Review.findOne({ job: jobId, reviewer: reviewerId });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this job' });
    }

    const review = await Review.create({
      job: jobId,
      reviewer: reviewerId,
      reviewee: revieweeId,
      rating,
      comment,
    });

    // Recalculate worker profile rating if reviewee is worker
    const workerProfile = await WorkerProfile.findOne({ user: revieweeId });
    if (workerProfile) {
      const workerReviews = await Review.find({ reviewee: revieweeId });
      const totalReviews = workerReviews.length;
      const averageRating =
        totalReviews > 0
          ? workerReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0;
      workerProfile.averageRating = averageRating;
      workerProfile.totalReviews = totalReviews;
      await workerProfile.save();
    }

    res.status(201).json(review);
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ message: 'Failed to submit review' });
  }
};

// GET /api/reviews/worker/:workerId
const getWorkerReviews = async (req, res) => {
  try {
    const { workerId } = req.params;
    const reviews = await Review.find({ reviewee: workerId })
      .populate('reviewer', 'name profilePic')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Get worker reviews error:', error);
    res.status(500).json({ message: 'Failed to load reviews' });
  }
};

// GET /api/reviews/employer/:empId
const getEmployerReviews = async (req, res) => {
  try {
    const { empId } = req.params;
    const reviews = await Review.find({ reviewee: empId })
      .populate('reviewer', 'name profilePic')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Get employer reviews error:', error);
    res.status(500).json({ message: 'Failed to load reviews' });
  }
};

module.exports = {
  submitReview,
  getWorkerReviews,
  getEmployerReviews,
};

