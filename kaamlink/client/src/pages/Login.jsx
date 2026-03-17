// File: client/src/pages/Login.jsx
// Purpose: Login page with role tabs and redirect to appropriate dashboard

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoginForm from '../components/forms/LoginForm.jsx';
import api from '../services/api';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const [activeTab, setActiveTab] = useState('worker');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', values);
      const { token, user } = res.data;
      // For admin tab, ensure role is admin; worker/employer tabs are advisory
      if (activeTab === 'admin' && user.role !== 'admin') {
        toast.error('Not an admin account');
        return;
      }
      login(token, user);

      if (user.role === 'worker') navigate('/worker/dashboard', { replace: true });
      else if (user.role === 'employer') navigate('/employer/dashboard', { replace: true });
      else if (user.role === 'admin') navigate('/admin/dashboard', { replace: true });
      else navigate('/', { replace: true });
    } catch (error) {
      // axios interceptor toasts; nothing additional
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
      <p className="text-sm text-gray-600 mb-6">
        Login to manage your jobs, workers, and profile.
      </p>

      <div className="flex rounded-xl border border-gray-200 bg-gray-50 mb-6 text-sm">
        {['worker', 'employer', 'admin'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-3 py-2 rounded-xl capitalize ${
              activeTab === tab ? 'bg-white font-semibold text-primary shadow-sm' : 'text-gray-600'
            }`}
          >
            {tab === 'admin' ? 'Admin' : `Login as ${tab}`}
          </button>
        ))}
      </div>

      <LoginForm onSubmit={handleSubmit} loading={loading} />

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>Forgot password? (Coming soon)</span>
        <div className="space-x-2">
          <a href="/register/worker" className="underline">
            Register Worker
          </a>
          <a href="/register/employer" className="underline">
            Register Employer
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

