// File: client/src/App.jsx
// Purpose: Main application shell defining routes, layout, and global UI

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import RegisterWorker from './pages/RegisterWorker.jsx';
import RegisterEmployer from './pages/RegisterEmployer.jsx';
import WorkerDashboard from './pages/WorkerDashboard.jsx';
import EmployerDashboard from './pages/EmployerDashboard.jsx';
import SearchWorkers from './pages/SearchWorkers.jsx';
import WorkerProfile from './pages/WorkerProfile.jsx';
import JobRequest from './pages/JobRequest.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/worker" element={<RegisterWorker />} />
          <Route path="/register/employer" element={<RegisterEmployer />} />
          <Route path="/search" element={<SearchWorkers />} />
          <Route path="/worker/:id" element={<WorkerProfile />} />

          <Route element={<ProtectedRoute allowRoles={['worker']} />}>
            <Route path="/worker/dashboard" element={<WorkerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowRoles={['employer']} />}>
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            <Route path="/job/request" element={<JobRequest />} />
          </Route>

          <Route element={<ProtectedRoute allowRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          <Route
            path="*"
            element={
              <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
                <p className="text-gray-600 mb-4">
                  The page you are looking for doesn&apos;t exist or has been moved.
                </p>
                <a
                  href="/"
                  className="btn-primary"
                >
                  Go Back Home
                </a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
};

export default App;

