// File: client/src/pages/EmployerDashboard.jsx
// Purpose: Employer dashboard for overview, posting jobs, managing jobs, and payments

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader.jsx';
import JobCard from '../components/employer/JobCard.jsx';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/jobs/my-jobs');
      setJobs(res.data);
    } catch {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const onCreateJob = async (data) => {
    try {
      await api.post('/jobs', {
        title: data.title,
        category: data.category,
        description: data.description,
        address: data.address,
        city: data.city,
        pincode: data.pincode,
        scheduledDate: data.date,
        duration: Number(data.duration),
        agreedRate: Number(data.budget),
      });
      reset();
      await loadJobs();
    } catch {
      // interceptors handle
    }
  };

  const handlePayNow = async (jobId, amount) => {
    try {
      const payment = await api.post('/payments/initiate', {
        jobId,
        amount,
      });
      await api.post('/payments/confirm', { paymentId: payment.data._id });
      await loadJobs();
    } catch {
      // handled globally
    }
  };

  const overviewContent = () => {
    const activeCount = jobs.filter((j) => ['open', 'accepted', 'in_progress'].includes(j.status))
      .length;
    const completedCount = jobs.filter((j) => j.status === 'completed').length;
    const totalSpent = jobs
      .filter((j) => j.paymentStatus === 'paid')
      .reduce((sum, j) => sum + (j.agreedRate || 0), 0);

    return (
      <div className="space-y-4">
        <div className="card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Welcome</p>
            <h1 className="text-xl font-semibold text-gray-900">{user?.name}</h1>
            <div className="mt-2">
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${user?.isPhoneVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {user?.isPhoneVerified ? 'Phone verified' : 'Phone verification pending'}
              </span>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card p-4">
            <p className="text-xs text-gray-500 mb-1">Active Jobs</p>
            <p className="text-2xl font-semibold text-gray-900">{activeCount}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-gray-500 mb-1">Completed Jobs</p>
            <p className="text-2xl font-semibold text-gray-900">{completedCount}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-gray-500 mb-1">Total Spent (mock)</p>
            <p className="text-2xl font-semibold text-gray-900">₹{totalSpent}</p>
          </div>
        </div>
      </div>
    );
  };

  const postJobContent = () => (
    <form onSubmit={handleSubmit(onCreateJob)} className="card p-5 space-y-3 text-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Post a Job</h2>
      <div>
        <label className="block mb-1 font-medium text-gray-700">Job Title</label>
        <input
          className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-700">Category</label>
        <select
          className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          {...register('category')}
        >
          <option value="">Select</option>
          <option value="maid">Maid</option>
          <option value="plumber">Plumber</option>
          <option value="electrician">Electrician</option>
          <option value="driver">Driver</option>
          <option value="cook">Cook</option>
          <option value="carpenter">Carpenter</option>
          <option value="house_help">House Help</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-700">Description</label>
        <textarea
          rows={3}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          {...register('description')}
        />
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Date</label>
          <input
            type="date"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            {...register('date')}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Duration (hours)</label>
          <input
            type="number"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            {...register('duration')}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Budget (₹)</label>
          <input
            type="number"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            {...register('budget')}
          />
        </div>
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-700">Address</label>
        <input
          className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          {...register('address')}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-medium text-gray-700">City</label>
          <input
            className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            {...register('city')}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Pincode</label>
          <input
            className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            {...register('pincode')}
          />
        </div>
      </div>
      <button type="submit" className="btn-primary w-full justify-center">
        Post Job
      </button>
    </form>
  );

  const myJobsContent = () => (
    <div className="space-y-3 text-sm">
      {jobs.length === 0 && (
        <div className="text-gray-500">You have not posted any jobs yet.</div>
      )}
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          actions={
            job.status === 'completed' && job.paymentStatus !== 'paid'
              ? [
                  {
                    label: 'Pay Now',
                    variant: 'primary',
                    onClick: () => handlePayNow(job._id, job.agreedRate),
                  },
                ]
              : []
          }
        />
      ))}
    </div>
  );

  const paymentsContent = () => (
    <div className="text-sm text-gray-500">
      Payment history can be expanded; for this demo, use the &quot;Pay Now&quot; buttons in
      &quot;My Jobs&quot; to simulate payments.
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
          <p className="text-xs text-gray-400 mb-1">Employer Dashboard</p>
          <p className="font-semibold">{user?.name}</p>
        </div>
        <nav className="space-y-1 px-3 text-sm">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'post', label: 'Post a Job' },
            { id: 'my-jobs', label: 'My Jobs' },
            { id: 'payments', label: 'Payments' },
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
          {['overview', 'post', 'my-jobs', 'payments'].map((id) => (
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
        {activeTab === 'post' && postJobContent()}
        {activeTab === 'my-jobs' && myJobsContent()}
        {activeTab === 'payments' && paymentsContent()}
      </main>
    </div>
  );
};

export default EmployerDashboard;

