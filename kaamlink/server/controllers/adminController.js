// File: server/controllers/adminController.js
// Purpose: Admin operations for worker approvals, users, jobs, and platform stats

const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const Job = require('../models/Job');
const Payment = require('../models/Payment');

// GET /api/admin/workers/pending
const getPendingWorkers = async (req, res) => {
  try {
    const workers = await WorkerProfile.find({ verificationStatus: 'pending' }).populate(
      'user',
      'name phone email'
    );
    res.json(workers);
  } catch (error) {
    console.error('Get pending workers error:', error);
    res.status(500).json({ message: 'Failed to load pending workers' });
  }
};

// PUT /api/admin/workers/:id/approve
const approveWorker = async (req, res) => {
  try {
    const profile = await WorkerProfile.findByIdAndUpdate(
      req.params.id,
      { isVerified: true, verificationStatus: 'approved' },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Approve worker error:', error);
    res.status(500).json({ message: 'Failed to approve worker' });
  }
};

// PUT /api/admin/workers/:id/reject
const rejectWorker = async (req, res) => {
  try {
    const { reason } = req.body;
    const profile = await WorkerProfile.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: 'rejected' },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }
    // For demo, just log reason
    if (reason) {
      console.log('Worker rejected reason:', reason);
    }
    res.json(profile);
  } catch (error) {
    console.error('Reject worker error:', error);
    res.status(500).json({ message: 'Failed to reject worker' });
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(),
    ]);
    res.json({
      data: users,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit) || 1),
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Failed to load users' });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await WorkerProfile.deleteOne({ user: userId });
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// GET /api/admin/jobs
const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [jobs, total] = await Promise.all([
      Job.find()
        .populate('employer', 'name')
        .populate('worker', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(),
    ]);
    res.json({
      data: jobs,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit) || 1),
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({ message: 'Failed to load jobs' });
  }
};

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [totalWorkers, totalEmployers, totalJobs, completedJobs, revenueAgg, pendingApprovals] =
      await Promise.all([
        User.countDocuments({ role: 'worker' }),
        User.countDocuments({ role: 'employer' }),
        Job.countDocuments(),
        Job.countDocuments({ status: 'completed' }),
        Payment.aggregate([
          { $match: { status: 'success' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        WorkerProfile.countDocuments({ verificationStatus: 'pending' }),
      ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      totalWorkers,
      totalEmployers,
      totalJobs,
      completedJobs,
      totalRevenue,
      pendingApprovals,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to load stats' });
  }
};

module.exports = {
  getPendingWorkers,
  approveWorker,
  rejectWorker,
  getAllUsers,
  deleteUser,
  getAllJobs,
  getStats,
};

