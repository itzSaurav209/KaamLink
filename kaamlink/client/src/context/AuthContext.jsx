// File: client/src/context/AuthContext.jsx
// Purpose: Global authentication context managing user session and JWT token

import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('kaamlink_token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (error) {
        console.error('Auth init error', error);
        localStorage.removeItem('kaamlink_token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [token]);

  const login = (jwt, userData) => {
    localStorage.setItem('kaamlink_token', jwt);
    setToken(jwt);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network/logout errors for client-side clearing
    }
    localStorage.removeItem('kaamlink_token');
    setToken(null);
    setUser(null);
    toast.success('Logged out');
    navigate('/login');
  };

  const value = { user, token, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

