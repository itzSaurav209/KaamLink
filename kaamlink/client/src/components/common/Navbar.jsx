// File: client/src/components/common/Navbar.jsx
// Purpose: Top navigation bar with logo, links, and auth-aware actions

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const dashboardPath =
    user?.role === 'worker'
      ? '/worker/dashboard'
      : user?.role === 'employer'
      ? '/employer/dashboard'
      : user?.role === 'admin'
      ? '/admin/dashboard'
      : '/login';

  return (
    <header
      className={`sticky top-0 z-40 transition backdrop-blur ${
        scrolled ? 'bg-white/80 shadow-sm' : 'bg-white/60'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold">
            K
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-gray-900 tracking-tight text-lg">KaamLink</span>
            <span className="text-xs text-gray-500 hidden sm:block">
              Your trusted local workforce
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/search" className="text-sm font-medium text-gray-700 hover:text-primary">
            Find Workers
          </Link>
          <Link
            to="/employer/dashboard"
            className="text-sm font-medium text-gray-700 hover:text-primary"
          >
            Post a Job
          </Link>
          {!user && (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary">
                Login
              </Link>
              <Link
                to="/register/worker"
                className="btn-primary text-sm px-3 py-1.5"
              >
                Register
              </Link>
            </>
          )}
          {user && (
            <div className="flex items-center gap-3">
              <Link
                to={dashboardPath}
                className="text-sm font-medium text-gray-700 hover:text-primary"
              >
                My Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-sm font-medium text-gray-500 hover:text-danger"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center rounded-xl border border-gray-200 p-2 text-gray-700"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t bg-white/95">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3">
            <Link to="/search" className="text-sm font-medium text-gray-700">
              Find Workers
            </Link>
            <Link to="/employer/dashboard" className="text-sm font-medium text-gray-700">
              Post a Job
            </Link>
            {!user && (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-700">
                  Login
                </Link>
                <Link
                  to="/register/worker"
                  className="btn-primary text-sm justify-center"
                >
                  Register
                </Link>
              </>
            )}
            {user && (
              <>
                <Link to={dashboardPath} className="text-sm font-medium text-gray-700">
                  My Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-danger text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

