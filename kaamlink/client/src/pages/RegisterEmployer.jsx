// File: client/src/pages/RegisterEmployer.jsx
// Purpose: Page wrapper for employer registration

import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterEmployerForm from '../components/forms/RegisterEmployerForm.jsx';

const RegisterEmployer = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <RegisterEmployerForm onSuccess={() => navigate('/login')} />
    </div>
  );
};

export default RegisterEmployer;

