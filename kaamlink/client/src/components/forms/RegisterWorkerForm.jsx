// File: client/src/components/forms/RegisterWorkerForm.jsx
// Purpose: Multi-step worker registration form with OTP and verification docs

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import toast from 'react-hot-toast';

const steps = ['Personal Info', 'Work Details', 'Verification'];

const RegisterWorkerForm = ({ onSuccess }) => {
  const [step, setStep] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [phoneValue, setPhoneValue] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm();

  const currentStepLabel = steps[step];

  const sendOtp = async () => {
    try {
      const phone = getValues('phone');
      if (!phone) {
        toast.error('Enter phone number first');
        return;
      }
      setPhoneValue(phone);
      await api.post('/auth/send-otp', { phone });
      setOtpSent(true);
      toast.success('OTP sent (mock, check server logs)');
    } catch {
      // interceptor handles toast
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (step === 0) {
        if (data.password !== data.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        const res = await api.post('/auth/register', {
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          role: 'worker',
        });
        setUserId(res.data.user.id);
        toast.success('Basic account created, verify OTP to continue');
        setStep(1);
      } else if (step === 1) {
        // verify OTP if entered
        if (otpSent && data.otp) {
          await api.post('/auth/verify-otp', { phone: phoneValue || data.phone, otp: data.otp });
          toast.success('Phone verified');
        }
        await api.post(
          '/workers/profile',
          {
            category: data.category,
            skills: (data.skills || '')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
            dailyRate: Number(data.dailyRate),
            bio: data.bio,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
          }
        );
        setStep(2);
      } else if (step === 2) {
        const formData = new FormData();
        if (data.aadhaar) {
          formData.append('documents', data.aadhaar[0], 'aadhaar');
        }
        if (data.photoId) {
          formData.append('documents', data.photoId[0], 'photoId');
        }
        await api.post('/workers/documents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Registration submitted for verification');
        onSuccess?.();
      }
    } catch {
      // errors handled globally
    } finally {
      setLoading(false);
    }
  };

  const nextDisabled = loading;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Register as Worker</h2>
        <p className="text-xs text-gray-500">
          Step {step + 1} of {steps.length}: {currentStepLabel}
        </p>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
        <div
          className="h-2 bg-primary rounded-full transition-all"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm">
        {step === 0 && (
          <>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Name</label>
              <input
                className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Phone</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register('phone', { required: 'Phone is required' })}
                />
                <button
                  type="button"
                  onClick={sendOtp}
                  className="px-3 py-2 text-xs rounded-xl border border-primary text-primary"
                >
                  Send OTP
                </button>
              </div>
            </div>
            {otpSent && (
              <div>
                <label className="block mb-1 font-medium text-gray-700">OTP</label>
                <input
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register('otp')}
                />
              </div>
            )}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('email')}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register('password', { required: 'Password is required' })}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register('confirmPassword', { required: 'Confirm password' })}
                />
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Category</label>
              <select
                className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('category', { required: 'Category is required' })}
              >
                <option value="">Select category</option>
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
              <label className="block mb-1 font-medium text-gray-700">
                Skills (comma separated)
              </label>
              <input
                className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('skills')}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Daily Rate (₹)</label>
              <input
                type="number"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('dailyRate', { required: 'Daily rate is required' })}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Bio</label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('bio')}
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
                <label className="block mb-1 font-medium text-gray-700">State</label>
                <input
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register('state')}
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Pincode</label>
              <input
                className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('pincode')}
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Upload Aadhaar</label>
              <input
                type="file"
                className="w-full text-xs"
                {...register('aadhaar')}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Upload Photo ID</label>
              <input
                type="file"
                className="w-full text-xs"
                {...register('photoId')}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('agree', { required: 'You must agree to background verification' })}
              />
              <span className="text-xs text-gray-600">
                I agree to background verification.
              </span>
            </div>
            {errors.agree && (
              <p className="text-xs text-red-500 mt-1">{errors.agree.message}</p>
            )}
            <p className="text-xs text-gray-500">
              After submitting, your profile will be reviewed within 1–2 business days.
            </p>
          </>
        )}

        <div className="flex justify-between pt-2">
          <button
            type="button"
            disabled={step === 0 || loading}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 text-gray-600 disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={nextDisabled}
            className="btn-primary text-xs px-4 py-2 disabled:opacity-60"
          >
            {step < steps.length - 1
              ? loading
                ? 'Saving...'
                : 'Next'
              : loading
              ? 'Submitting...'
              : 'Register & Submit for Verification'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterWorkerForm;

