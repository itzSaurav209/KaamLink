// File: client/src/pages/WorkerDashboard.jsx
// Purpose: Worker dashboard with overview, jobs, profile editing, earnings, and SOS

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader.jsx';
import JobCard from '../components/employer/JobCard.jsx';
import SosButton from '../components/common/SosButton.jsx';
import Badge from '../components/common/Badge.jsx';

const WorkerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [profileRes, jobsRes] = await Promise.all([
        api.get('/workers/profile/me'),
        api.get('/jobs/available'),
      ]);
      setProfile(profileRes.data);
      setAvailableJobs(jobsRes.data);
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAcceptJob = async (jobId) => {
    try {
      await api.put(`/jobs/${jobId}/accept`);
      await loadData();
    } catch {
      // interceptor handles
    }
  };

  const handleJobStatus = async (jobId, action) => {
    try {
      await api.put(`/jobs/${jobId}/${action}`);
      await loadData();
    } catch {
      // errors handled globally
    }
  };

  const overviewContent = () => (
    <div className="space-y-4">
      <div className="card p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">Welcome back</p>
          <h1 className="text-xl font-semibold text-gray-900">{user?.name}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {profile?.isVerified ? (
              <Badge text="Verified" variant="approved" />
            ) : (
              <Badge text={profile?.verificationStatus || 'pending'} variant="pending" />
            )}
            <Badge
              text={user?.isPhoneVerified ? 'Phone verified' : 'Phone pending'}
              variant={user?.isPhoneVerified ? 'approved' : 'pending'}
            />
          </div>
        </div>
        <div className="text-right text-sm">
          <p className="text-gray-500">Jobs Completed</p>
          <p className="text-lg font-semibold text-gray-900">
            {profile?.totalJobsCompleted || 0}
          </p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">Average Rating</p>
          <p className="text-2xl font-semibold text-gray-900">
            {profile?.averageRating?.toFixed
              ? profile.averageRating.toFixed(1)
              : profile?.averageRating || 0}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">Total Reviews</p>
          <p className="text-2xl font-semibold text-gray-900">
            {profile?.totalReviews || 0}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">Earnings This Month (mock)</p>
          <p className="text-2xl font-semibold text-gray-900">₹{(profile?.totalJobsCompleted || 0) * (profile?.dailyRate || 0)}</p>
        </div>
      </div>
    </div>
  );

  const availableJobsContent = () => (
    <div className="space-y-3">
      {availableJobs.length === 0 && (
        <div className="text-sm text-gray-500">
          No open jobs in your city right now. Check again later.
        </div>
      )}
      {availableJobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          actions={[
            {
              label: 'Accept Job',
              variant: 'primary',
              onClick: () => handleAcceptJob(job._id),
            },
          ]}
        />
      ))}
    </div>
  );

  const profileContent = () => (
    <div className="card p-4 space-y-3 text-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Profile</h2>
      <p className="text-gray-700">
        <span className="font-medium">Category:</span> {profile?.category}
      </p>
      <p className="text-gray-700">
        <span className="font-medium">Skills:</span> {(profile?.skills || []).join(', ')}
      </p>
      <p className="text-gray-700">
        <span className="font-medium">Location:</span> {profile?.location?.city},{' '}
        {profile?.location?.state} {profile?.location?.pincode}
      </p>
      <p className="text-gray-700">
        <span className="font-medium">Daily Rate:</span> ₹{profile?.dailyRate}
      </p>
      <p className="text-gray-700 whitespace-pre-wrap">{profile?.bio}</p>
      <p className="text-xs text-gray-400">
        Editing full profile is simplified in this demo. Update details via verification flow.
      </p>
    </div>
  );

  const myJobsContent = () => (
    <div className="space-y-4 text-sm">
      <p className="text-xs text-gray-500">
        This demo focuses on accepting available jobs; worker job history view is simplified.
      </p>
      {/* Could be extended to fetch worker-assigned jobs if needed */}
    </div>
  );

  const earningsContent = () => (
    <div className="space-y-3 text-sm">
      <div className="card p-4">
        <p className="text-xs text-gray-500 mb-1">Earnings Summary (mock)</p>
        <p className="text-2xl font-semibold text-gray-900">
          ₹{(profile?.totalJobsCompleted || 0) * (profile?.dailyRate || 0)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Based on completed jobs and your current daily rate.
        </p>
      </div>
    </div>
  );

  if (loading) return <Loader fullScreen />;
  if (error)
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-red-500">{error}</div>
    );

  return (
    <div className="flex">
      <aside className="hidden md:block w-60 bg-gray-900 text-white min-h-[80vh] py-6">
        <div className="px-6 mb-6">
          <p className="text-xs text-gray-400 mb-1">Worker Dashboard</p>
          <p className="font-semibold">{user?.name}</p>
        </div>
        <nav className="space-y-1 px-3 text-sm">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'available', label: 'Available Jobs' },
            { id: 'my-jobs', label: 'My Jobs' },
            { id: 'profile', label: 'Profile' },
            { id: 'earnings', label: 'Earnings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-3 py-2 rounded-xl ${
                activeTab === item.id ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 px-4 py-6 md:ml-0 max-w-5xl mx-auto w-full">
        <div className="md:hidden mb-4 flex gap-2 overflow-x-auto text-xs">
          {['overview', 'available', 'my-jobs', 'profile', 'earnings'].map((id) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-3 py-1.5 rounded-full border ${
                activeTab === id
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'border-gray-200 text-gray-700'
              }`}
            >
              {id.replace('-', ' ')}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && overviewContent()}
        {activeTab === 'available' && availableJobsContent()}
        {activeTab === 'my-jobs' && myJobsContent()}
        {activeTab === 'profile' && profileContent()}
        {activeTab === 'earnings' && earningsContent()}
      </main>

      <SosButton />
    </div>
  );
};

export default WorkerDashboard;

