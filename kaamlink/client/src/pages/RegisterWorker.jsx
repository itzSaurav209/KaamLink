// File: client/src/pages/RegisterWorker.jsx
// Purpose: Page wrapper for multi-step worker registration flow

import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterWorkerForm from '../components/forms/RegisterWorkerForm.jsx';

const RegisterWorker = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <RegisterWorkerForm onSuccess={() => navigate('/login')} />
    </div>
  );
};

export default RegisterWorker;

