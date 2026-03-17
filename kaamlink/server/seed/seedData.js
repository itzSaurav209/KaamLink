// File: server/seed/seedData.js
// Purpose: Seed script to populate MongoDB with demo users, workers, jobs, and reviews

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const Job = require('../models/Job');
const Review = require('../models/Review');
const Payment = require('../models/Payment');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kaamlink';

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB, clearing existing data...');

    await Promise.all([
      User.deleteMany({}),
      WorkerProfile.deleteMany({}),
      Job.deleteMany({}),
      Review.deleteMany({}),
      Payment.deleteMany({}),
    ]);

    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin KaamLink',
      email: 'admin@kaamlink.com',
      phone: '9000000000',
      passwordHash: adminPassword,
      role: 'admin',
      isPhoneVerified: true,
    });

    const employerData = [
      { name: 'Rohit Sharma', email: 'rohit@kaamlink.com', phone: '9000000001', city: 'Mumbai' },
      { name: 'Anita Rao', email: 'anita@kaamlink.com', phone: '9000000002', city: 'Delhi' },
      { name: 'Karthik Menon', email: 'karthik@kaamlink.com', phone: '9000000003', city: 'Bangalore' },
    ];

    const employerPassword = await bcrypt.hash('employer123', 10);
    const employers = await Promise.all(
      employerData.map((e) =>
        User.create({
          name: e.name,
          email: e.email,
          phone: e.phone,
          passwordHash: employerPassword,
          role: 'employer',
          isPhoneVerified: true,
        })
      )
    );

    const workerPassword = await bcrypt.hash('worker123', 10);
    const workerProfilesData = [
      {
        name: 'Sunita Devi',
        email: 'sunita@kaamlink.com',
        phone: '9100000001',
        category: 'maid',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        skills: ['cleaning', 'mopping', 'dusting'],
        dailyRate: 800,
      },
      {
        name: 'Ramesh Kumar',
        email: 'ramesh@kaamlink.com',
        phone: '9100000002',
        category: 'plumber',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400002',
        skills: ['pipes', 'bathroom fittings'],
        dailyRate: 1200,
      },
      {
        name: 'Farida Ali',
        email: 'farida@kaamlink.com',
        phone: '9100000003',
        category: 'electrician',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        skills: ['wiring', 'fans', 'lights'],
        dailyRate: 1100,
      },
      {
        name: 'Sanjay Gupta',
        email: 'sanjay@kaamlink.com',
        phone: '9100000004',
        category: 'driver',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110002',
        skills: ['car driving', 'local routes'],
        dailyRate: 1500,
      },
      {
        name: 'Lakshmi Iyer',
        email: 'lakshmi@kaamlink.com',
        phone: '9100000005',
        category: 'cook',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        skills: ['south indian', 'north indian'],
        dailyRate: 1000,
      },
      {
        name: 'Mahesh Patel',
        email: 'mahesh@kaamlink.com',
        phone: '9100000006',
        category: 'carpenter',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560002',
        skills: ['furniture', 'repairs'],
        dailyRate: 1300,
      },
      {
        name: 'Nazia Khan',
        email: 'nazia@kaamlink.com',
        phone: '9100000007',
        category: 'house_help',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500001',
        skills: ['house help', 'kitchen help'],
        dailyRate: 850,
      },
      {
        name: 'Imran Shaikh',
        email: 'imran@kaamlink.com',
        phone: '9100000008',
        category: 'other',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500002',
        skills: ['odd jobs', 'repairs'],
        dailyRate: 900,
      },
    ];

    const workers = await Promise.all(
      workerProfilesData.map(async (w) => {
        const user = await User.create({
          name: w.name,
          email: w.email,
          phone: w.phone,
          passwordHash: workerPassword,
          role: 'worker',
          isPhoneVerified: true,
        });
        const profile = await WorkerProfile.create({
          user: user._id,
          skills: w.skills,
          category: w.category,
          bio: `Experienced ${w.category} available in ${w.city}.`,
          location: {
            city: w.city,
            state: w.state,
            pincode: w.pincode,
          },
          dailyRate: w.dailyRate,
          availability: 'available',
          isVerified: true,
          verificationStatus: 'approved',
          averageRating: 4.5,
          totalReviews: 3,
          totalJobsCompleted: 10,
        });
        return { user, profile };
      })
    );

    const jobs = await Job.create([
      {
        employer: employers[0]._id,
        worker: workers[0].user._id,
        workerProfile: workers[0].profile._id,
        title: 'Daily cleaning for 2BHK',
        description: 'Need morning cleaning for 2BHK flat.',
        category: 'maid',
        location: { address: 'Andheri East', city: 'Mumbai', pincode: '400001' },
        scheduledDate: new Date(),
        duration: 3,
        agreedRate: 800,
        status: 'completed',
        paymentStatus: 'paid',
      },
      {
        employer: employers[1]._id,
        worker: workers[2].user._id,
        workerProfile: workers[2].profile._id,
        title: 'Fan and light fitting',
        description: 'Install 3 fans and 4 lights.',
        category: 'electrician',
        location: { address: 'Connaught Place', city: 'Delhi', pincode: '110001' },
        scheduledDate: new Date(),
        duration: 4,
        agreedRate: 1500,
        status: 'completed',
        paymentStatus: 'pending',
      },
      {
        employer: employers[2]._id,
        title: 'Office driver for day',
        description: 'Corporate meetings across city.',
        category: 'driver',
        location: { address: 'MG Road', city: 'Bangalore', pincode: '560001' },
        scheduledDate: new Date(),
        duration: 8,
        agreedRate: 2000,
        status: 'open',
        paymentStatus: 'pending',
      },
      {
        employer: employers[0]._id,
        title: 'Carpenter for wardrobe repair',
        description: 'Fix sliding wardrobe door.',
        category: 'carpenter',
        location: { address: 'Bandra West', city: 'Mumbai', pincode: '400050' },
        scheduledDate: new Date(),
        duration: 2,
        agreedRate: 900,
        status: 'accepted',
        worker: workers[5].user._id,
        workerProfile: workers[5].profile._id,
        paymentStatus: 'pending',
      },
      {
        employer: employers[1]._id,
        title: 'Cooking for family of 4',
        description: 'Morning and evening meals.',
        category: 'cook',
        location: { address: 'South Delhi', city: 'Delhi', pincode: '110003' },
        scheduledDate: new Date(),
        duration: 5,
        agreedRate: 1300,
        status: 'cancelled',
        paymentStatus: 'pending',
      },
    ]);

    await Review.create([
      {
        job: jobs[0]._id,
        reviewer: employers[0]._id,
        reviewee: workers[0].user._id,
        rating: 5,
        comment: 'Very punctual and thorough cleaning.',
      },
      {
        job: jobs[0]._id,
        reviewer: employers[0]._id,
        reviewee: workers[1].user._id,
        rating: 4,
        comment: 'Good help for extra chores.',
      },
      {
        job: jobs[1]._id,
        reviewer: employers[1]._id,
        reviewee: workers[2].user._id,
        rating: 5,
        comment: 'Professional electrician, quick work.',
      },
      {
        job: jobs[1]._id,
        reviewer: workers[2].user._id,
        reviewee: employers[1]._id,
        rating: 5,
        comment: 'Employer was polite and clear about work.',
      },
      {
        job: jobs[3]._id,
        reviewer: employers[0]._id,
        reviewee: workers[5].user._id,
        rating: 4,
        comment: 'Fixed the wardrobe nicely.',
      },
      {
        job: jobs[4]._id,
        reviewer: employers[1]._id,
        reviewee: workers[4].user._id,
        rating: 5,
        comment: 'Amazing home-cooked meals.',
      },
    ]);

    console.log('✅ Seed complete');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

run();

