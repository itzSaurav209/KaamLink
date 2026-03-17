// File: server/controllers/workerController.js
// Purpose: Handlers for worker profile CRUD, search, and document upload

const WorkerProfile = require('../models/WorkerProfile');
const Review = require('../models/Review');

// POST /api/workers/profile
const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      skills = [],
      category,
      bio,
      city,
      state,
      pincode,
      dailyRate,
      availability,
    } = req.body;

    const location = { city, state, pincode };

    const existing = await WorkerProfile.findOne({ user: userId });
    let profile;
    if (existing) {
      existing.skills = skills;
      existing.category = category || existing.category;
      existing.bio = bio;
      existing.location = { ...existing.location, ...location };
      existing.dailyRate = dailyRate;
      existing.availability = availability || existing.availability;
      profile = await existing.save();
    } else {
      profile = await WorkerProfile.create({
        user: userId,
        skills,
        category,
        bio,
        location,
        dailyRate,
        availability,
      });
    }

    res.status(201).json(profile);
  } catch (error) {
    console.error('Create worker profile error:', error);
    res.status(500).json({ message: 'Failed to save worker profile' });
  }
};

// GET /api/workers/profile/me
const getMyProfile = async (req, res) => {
  try {
    const profile = await WorkerProfile.findOne({ user: req.user.id }).populate(
      'user',
      'name phone email profilePic role'
    );
    if (!profile) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({ message: 'Failed to load worker profile' });
  }
};

// PUT /api/workers/profile
const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const profile = await WorkerProfile.findOneAndUpdate(
      { user: req.user.id },
      updates,
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Update worker profile error:', error);
    res.status(500).json({ message: 'Failed to update worker profile' });
  }
};

// GET /api/workers
const searchWorkers = async (req, res) => {
  try {
    const {
      category,
      city,
      pincode,
      minRate,
      maxRate,
      available,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      isVerified: true,
      verificationStatus: 'approved',
    };

    if (category) query.category = category;
    if (city) query['location.city'] = city;
    if (pincode) query['location.pincode'] = pincode;
    if (available === 'true') query.availability = 'available';
    if (minRate || maxRate) {
      query.dailyRate = {};
      if (minRate) query.dailyRate.$gte = Number(minRate);
      if (maxRate) query.dailyRate.$lte = Number(maxRate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    let sort = {};
    if (sortBy === 'rating') sort = { averageRating: -1 };
    if (sortBy === 'price_asc') sort = { dailyRate: 1 };
    if (sortBy === 'price_desc') sort = { dailyRate: -1 };

    const [items, total] = await Promise.all([
      WorkerProfile.find(query)
        .populate('user', 'name city profilePic')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      WorkerProfile.countDocuments(query),
    ]);

    res.json({
      data: items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit) || 1),
    });
  } catch (error) {
    console.error('Search workers error:', error);
    res.status(500).json({ message: 'Failed to search workers' });
  }
};

// GET /api/workers/:id
const getWorkerById = async (req, res) => {
  try {
    const profile = await WorkerProfile.findById(req.params.id).populate(
      'user',
      'name phone email profilePic role'
    );
    if (!profile) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }

    const reviews = await Review.find({ reviewee: profile.user }).select('rating');
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    res.json({ ...profile.toObject(), averageRating, totalReviews });
  } catch (error) {
    console.error('Get worker by id error:', error);
    res.status(500).json({ message: 'Failed to load worker profile' });
  }
};

// POST /api/workers/documents
const uploadDocuments = async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ message: 'No documents uploaded' });
    }

    const docs = files.map((file) => ({
      type: file.fieldname,
      url: `/uploads/${file.filename}`,
    }));

    const profile = await WorkerProfile.findOneAndUpdate(
      { user: req.user.id },
      { $push: { documents: { $each: docs } }, verificationStatus: 'pending' },
      { new: true }
    );

    res.json(profile);
  } catch (error) {
    console.error('Upload documents error:', error);
    res.status(500).json({ message: 'Failed to upload documents' });
  }
};

module.exports = {
  createProfile,
  getMyProfile,
  updateProfile,
  searchWorkers,
  getWorkerById,
  uploadDocuments,
};

