// File: client/src/hooks/useAuth.js
// Purpose: Convenience hook for consuming the AuthContext safely

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export default useAuth;

