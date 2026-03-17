// File: client/src/pages/JobRequest.jsx
// Purpose: Employer job request form targeted at a specific worker

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import Loader from '../components/common/Loader.jsx';

const JobRequest = () => {
  const locationHook = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(locationHook.search);
  const workerId = searchParams.get('workerId');

  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/workers/${workerId}`);
        setWorker(res.data);
        setValue('category', res.data.category);
        setValue('agreedRate', res.data.dailyRate);
      } catch {
        setError('Failed to load worker');
      } finally {
        setLoading(false);
      }
    };
    if (workerId) load();
  }, [workerId, setValue]);

  const onSubmit = async (data) => {
    try {
      await api.post('/jobs', {
        title: data.title,
        description: data.description,
        category: data.category,
        address: data.address,
        city: data.city,
        pincode: data.pincode,
        scheduledDate: data.date,
        duration: Number(data.duration),
        agreedRate: Number(data.agreedRate),
        workerProfileId: worker._id,
      });
      navigate('/employer/dashboard');
    } catch {
      // errors handled globally
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-sm text-red-500">{error}</div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <div className="card p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-primary">
          {worker.user?.name?.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{worker.user?.name}</p>
          <p className="text-xs text-gray-500">
            {worker.category} · {worker.location?.city}
          </p>
          <p className="text-xs text-gray-500">
            Rate: ₹{worker.dailyRate} / day · Availability: {worker.availability}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-5 space-y-3 text-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Job Request</h2>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Job Title</label>
          <input
            className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Description</label>
          <textarea
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            {...register('description')}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Category</label>
          <input
            readOnly
            className="w-full rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-gray-700"
            {...register('category')}
          />
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Scheduled Date</label>
            <input
              type="date"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('date', { required: 'Date is required' })}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Duration (hours)</label>
            <select
              className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('duration', { required: 'Duration is required' })}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Agreed Rate (₹)</label>
            <input
              type="number"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('agreedRate', { required: 'Rate is required' })}
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
          Send Job Request
        </button>
      </form>
    </div>
  );
};

export default JobRequest;

