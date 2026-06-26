// File: client/src/components/forms/RegisterEmployerForm.jsx
// Purpose: Employer registration form supporting individual and business flows

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import toast from 'react-hot-toast';

const RegisterEmployerForm = ({ onSuccess }) => {
  const [type, setType] = useState('individual');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const sendOtp = async () => {
    const email = getValues('email');
    if (!email) {
      toast.error('Enter your email address first');
      return;
    }

    try {
      await api.post('/auth/send-otp', { email });
      setOtpSent(true);
      setVerifiedEmail(email);
      toast.success('OTP sent to your email');
    } catch {
      // errors via interceptor
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (!otpSent) {
        toast.error('Please verify your email with OTP before registering');
        return;
      }

      if (!data.otp) {
        toast.error('Enter the OTP sent to your email');
        return;
      }

      await api.post('/auth/verify-otp', {
        email: verifiedEmail || data.email,
        otp: data.otp,
      });

      const res = await api.post('/auth/register', {
        name: data.name,
        email: verifiedEmail || data.email,
        phone: data.phone,
        password: data.password,
        role: 'employer',
      });

      localStorage.setItem('kaamlink_token', res.data.token);
      localStorage.setItem('kaamlink_user', JSON.stringify(res.data.user));
      toast.success('Employer account created');
      onSuccess?.(res.data);
    } catch {
      // errors toasts via interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-5 space-y-4 text-sm">
      <h2 className="text-lg font-semibold text-gray-900">Register as Employer</h2>

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
        <input
          className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          {...register('phone')}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Email</label>
        <div className="flex gap-2">
          <input
            type="email"
            className="flex-1 rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            {...register('email', { required: 'Email is required' })}
          />
          <button type="button" onClick={sendOtp} className="px-3 py-2 text-xs rounded-xl border border-primary text-primary">
            Send OTP
          </button>
        </div>
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      {otpSent && (
        <div>
          <label className="block mb-1 font-medium text-gray-700">OTP</label>
          <input
            className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            {...register('otp', { required: 'OTP is required' })}
          />
        </div>
      )}

      <div>
        <label className="block mb-1 font-medium text-gray-700">Password</label>
        <input
          type="password"
          className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <p className="block mb-1 font-medium text-gray-700">I represent a</p>
        <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 text-xs overflow-hidden">
          {['individual', 'business'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`px-3 py-1.5 ${
                type === t ? 'bg-white text-primary font-semibold shadow-sm' : 'text-gray-600'
              }`}
            >
              {t === 'individual' ? 'Individual' : 'Business'}
            </button>
          ))}
        </div>
      </div>

      {type === 'business' && (
        <>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Company Name</label>
            <input
              className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('companyName')}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">GST Number (optional)</label>
            <input
              className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('gstNumber')}
            />
          </div>
        </>
      )}

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

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center disabled:opacity-60"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterEmployerForm;

