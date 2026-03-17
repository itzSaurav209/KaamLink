// File: server/controllers/jobController.js
// Purpose: Handlers for job lifecycle: create, view, accept, progress, complete, cancel

const Job = require('../models/Job');
const WorkerProfile = require('../models/WorkerProfile');

// POST /api/jobs
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      address,
      city,
      pincode,
      scheduledDate,
      duration,
      agreedRate,
      workerProfileId,
    } = req.body;

    const job = await Job.create({
      employer: req.user.id,
      workerProfile: workerProfileId || undefined,
      title,
      description,
      category,
      location: { address, city, pincode },
      scheduledDate,
      duration,
      agreedRate,
    });

    res.status(201).json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Failed to create job' });
  }
};

// GET /api/jobs/my-jobs (employer)
const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id })
      .populate('worker', 'name')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Get employer jobs error:', error);
    res.status(500).json({ message: 'Failed to load jobs' });
  }
};

// GET /api/jobs/available (worker)
const getAvailableJobs = async (req, res) => {
  try {
    const profile = await WorkerProfile.findOne({ user: req.user.id });
    if (!profile || !profile.location?.city) {
      return res
        .status(400)
        .json({ message: 'Worker profile with city is required to view jobs' });
    }

    const jobs = await Job.find({
      status: 'open',
      'location.city': profile.location.city,
    })
      .populate('employer', 'name')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('Get available jobs error:', error);
    res.status(500).json({ message: 'Failed to load jobs' });
  }
};

// GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name')
      .populate('worker', 'name');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Get job by id error:', error);
    res.status(500).json({ message: 'Failed to load job' });
  }
};

// PUT /api/jobs/:id/accept
const acceptJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.status !== 'open') {
      return res.status(400).json({ message: 'Job is not open for acceptance' });
    }
    job.worker = req.user.id;
    job.status = 'accepted';
    await job.save();
    res.json(job);
  } catch (error) {
    console.error('Accept job error:', error);
    res.status(500).json({ message: 'Failed to accept job' });
  }
};

// PUT /api/jobs/:id/start
const startJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || String(job.worker) !== String(req.user.id)) {
      return res.status(403).json({ message: 'You are not assigned to this job' });
    }
    if (job.status !== 'accepted') {
      return res.status(400).json({ message: 'Job cannot be started in current status' });
    }
    job.status = 'in_progress';
    await job.save();
    res.json(job);
  } catch (error) {
    console.error('Start job error:', error);
    res.status(500).json({ message: 'Failed to start job' });
  }
};

// PUT /api/jobs/:id/complete
const completeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || String(job.worker) !== String(req.user.id)) {
      return res.status(403).json({ message: 'You are not assigned to this job' });
    }
    if (!['accepted', 'in_progress'].includes(job.status)) {
      return res.status(400).json({ message: 'Job cannot be completed in current status' });
    }
    job.status = 'completed';
    await job.save();
    res.json(job);
  } catch (error) {
    console.error('Complete job error:', error);
    res.status(500).json({ message: 'Failed to complete job' });
  }
};

// PUT /api/jobs/:id/cancel
const cancelJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const isEmployer = String(job.employer) === String(req.user.id);
    const isWorker = job.worker && String(job.worker) === String(req.user.id);
    if (!isEmployer && !isWorker) {
      return res.status(403).json({ message: 'Not authorized to cancel this job' });
    }
    if (job.status === 'completed') {
      return res.status(400).json({ message: 'Completed jobs cannot be cancelled' });
    }
    job.status = 'cancelled';
    await job.save();
    res.json(job);
  } catch (error) {
    console.error('Cancel job error:', error);
    res.status(500).json({ message: 'Failed to cancel job' });
  }
};

module.exports = {
  createJob,
  getEmployerJobs,
  getAvailableJobs,
  getJobById,
  acceptJob,
  startJob,
  completeJob,
  cancelJob,
};

