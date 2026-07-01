// File: client/src/components/forms/RegisterEmployerForm.jsx
// Purpose: Employer registration form supporting individual and business flows

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { confirmPhoneOtp, resetPhoneRecaptcha, sendPhoneOtp } from '../../firebase';

const RegisterEmployerForm = ({ onSuccess }) => {
  const [type, setType] = useState('individual');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneVerificationPending, setPhoneVerificationPending] = useState(false);
  const [phoneConfirmation, setPhoneConfirmation] = useState(null);
  const [phoneOtpLoading, setPhoneOtpLoading] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
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

  const handleSendPhoneOtp = async () => {
    const phone = getValues('phone');
    if (!phone) {
      toast.error('Enter your phone number first');
      return;
    }

    try {
      setPhoneOtpLoading(true);
      const confirmation = await sendPhoneOtp(phone);
      setPhoneConfirmation(confirmation);
      setPhoneOtpSent(true);
      setPhoneVerificationPending(true);
      toast.success('Phone OTP sent');
    } catch (error) {
      const message = error?.message || 'Unable to send phone OTP';
      toast.error(message);
    } finally {
      setPhoneOtpLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    const phone = getValues('phone');
    const otp = getValues('phoneOtp');

    if (!phone || !otp) {
      toast.error('Enter your phone number and OTP');
      return;
    }

    try {
      setPhoneOtpLoading(true);
      const result = await confirmPhoneOtp(phoneConfirmation, otp);
      const res = await api.post('/auth/verify-phone', {
        phone,
        firebaseUid: result?.user?.uid,
      });

      const currentUser = JSON.parse(localStorage.getItem('kaamlink_user') || '{}');
      const updatedUser = { ...currentUser, ...(res.data?.user || {}) };
      localStorage.setItem('kaamlink_user', JSON.stringify(updatedUser));
      setPhoneVerified(true);
      setPhoneVerificationPending(false);
      setPhoneOtpSent(false);
      resetPhoneRecaptcha();
      setPhoneConfirmation(null);
      toast.success('Phone verified successfully');
      onSuccess?.(res.data);
    } catch (error) {
      const message = error?.message || 'Phone verification failed';
      toast.error(message);
    } finally {
      setPhoneOtpLoading(false);
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

      if (data.phone) {
        await handleSendPhoneOtp();
        toast.success('Account created. Complete phone verification to unlock login.');
        return;
      }

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
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            {...register('phone')}
          />
          <button
            type="button"
            onClick={handleSendPhoneOtp}
            disabled={phoneOtpLoading || phoneVerified}
            className="px-3 py-2 text-xs rounded-xl border border-primary text-primary disabled:opacity-60"
          >
            {phoneOtpLoading ? 'Sending...' : phoneOtpSent ? 'Resend' : 'Verify Phone'}
          </button>
        </div>
        <div id="recaptcha-container" className="hidden" />
        {phoneVerificationPending && (
          <div className="mt-2 space-y-2">
            <input
              className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter phone OTP"
              {...register('phoneOtp')}
            />
            <button
              type="button"
              onClick={handleVerifyPhone}
              disabled={phoneOtpLoading || phoneVerified}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {phoneOtpLoading ? 'Verifying...' : 'Confirm Phone OTP'}
            </button>
          </div>
        )}
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

