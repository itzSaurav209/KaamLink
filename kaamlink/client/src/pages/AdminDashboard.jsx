// File: client/src/pages/AdminDashboard.jsx
// Purpose: Admin dashboard for stats, pending worker verifications, users, and jobs

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/common/Loader.jsx';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsRes, pendingRes, usersRes, jobsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/workers/pending'),
        api.get('/admin/users'),
        api.get('/admin/jobs'),
      ]);
      setStats(statsRes.data);
      setPendingWorkers(pendingRes.data);
      setUsers(usersRes.data.data || usersRes.data);
      setJobs(jobsRes.data.data || jobsRes.data);
    } catch {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleWorkerAction = async (id, action) => {
    try {
      if (action === 'approve') {
        await api.put(`/admin/workers/${id}/approve`);
      } else {
        const reason = window.prompt('Reason for rejection (optional)');
        await api.put(`/admin/workers/${id}/reject`, { reason });
      }
      await loadData();
    } catch {
      // handled globally
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      await loadData();
    } catch {
      // handled globally
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-red-500">{error}</div>
    );

  const overview = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="card p-3 text-xs">
          <p className="text-gray-500 mb-1">Workers</p>
          <p className="text-lg font-semibold text-gray-900">{stats?.totalWorkers}</p>
        </div>
        <div className="card p-3 text-xs">
          <p className="text-gray-500 mb-1">Employers</p>
          <p className="text-lg font-semibold text-gray-900">{stats?.totalEmployers}</p>
        </div>
        <div className="card p-3 text-xs">
          <p className="text-gray-500 mb-1">Total Jobs</p>
          <p className="text-lg font-semibold text-gray-900">{stats?.totalJobs}</p>
        </div>
        <div className="card p-3 text-xs">
          <p className="text-gray-500 mb-1">Completed</p>
          <p className="text-lg font-semibold text-gray-900">{stats?.completedJobs}</p>
        </div>
        <div className="card p-3 text-xs">
          <p className="text-gray-500 mb-1">Revenue (mock)</p>
          <p className="text-lg font-semibold text-gray-900">₹{stats?.totalRevenue}</p>
        </div>
        <div className="card p-3 text-xs">
          <p className="text-orange-500 mb-1">Pending Approvals</p>
          <p className="text-lg font-semibold text-gray-900">{stats?.pendingApprovals}</p>
        </div>
      </div>
    </div>
  );

  const pendingTab = () => (
    <div className="space-y-3 text-sm">
      {pendingWorkers.length === 0 && (
        <div className="text-gray-500 text-sm">No pending worker verifications.</div>
      )}
      {pendingWorkers.map((w) => (
        <div key={w._id} className="card p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="font-semibold text-gray-900">{w.user?.name}</p>
            <p className="text-xs text-gray-500">
              {w.category} · {w.location?.city}
            </p>
            <p className="text-xs text-gray-500">
              Phone: {w.user?.phone} · Email: {w.user?.email}
            </p>
          </div>
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => handleWorkerAction(w._id, 'approve')}
              className="px-3 py-1 rounded-xl bg-emerald-500 text-white"
            >
              Approve
            </button>
            <button
              onClick={() => handleWorkerAction(w._id, 'reject')}
              className="px-3 py-1 rounded-xl bg-red-500 text-white"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const usersTab = () => (
    <div className="card p-4 overflow-x-auto text-xs">
      <table className="min-w-full text-left">
        <thead className="border-b">
          <tr className="text-gray-500">
            <th className="py-2 pr-3">Name</th>
            <th className="py-2 pr-3">Phone</th>
            <th className="py-2 pr-3">Email</th>
            <th className="py-2 pr-3">Role</th>
            <th className="py-2 pr-3">Verified</th>
            <th className="py-2 pr-3">Joined</th>
            <th className="py-2 pr-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b last:border-none text-gray-800">
              <td className="py-2 pr-3">{u.name}</td>
              <td className="py-2 pr-3">{u.phone}</td>
              <td className="py-2 pr-3">{u.email}</td>
              <td className="py-2 pr-3 capitalize">{u.role}</td>
              <td className="py-2 pr-3">{u.isPhoneVerified ? 'Yes' : 'No'}</td>
              <td className="py-2 pr-3">
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}
              </td>
              <td className="py-2 pr-3">
                <button
                  onClick={() => handleDeleteUser(u._id)}
                  className="px-2 py-1 rounded-lg border border-red-200 text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const jobsTab = () => (
    <div className="card p-4 overflow-x-auto text-xs">
      <table className="min-w-full text-left">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="py-2 pr-3">Title</th>
            <th className="py-2 pr-3">Employer</th>
            <th className="py-2 pr-3">Worker</th>
            <th className="py-2 pr-3">Status</th>
            <th className="py-2 pr-3">Date</th>
            <th className="py-2 pr-3">Rate</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j._id} className="border-b last:border-none text-gray-800">
              <td className="py-2 pr-3">{j.title}</td>
              <td className="py-2 pr-3">{j.employer?.name}</td>
              <td className="py-2 pr-3">{j.worker?.name || '-'}</td>
              <td className="py-2 pr-3 capitalize">{j.status?.replace('_', ' ')}</td>
              <td className="py-2 pr-3">
                {j.scheduledDate ? new Date(j.scheduledDate).toLocaleDateString() : ''}
              </td>
              <td className="py-2 pr-3">₹{j.agreedRate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex">
      <aside className="hidden md:block w-60 bg-gray-900 text-white min-h-[80vh] py-6">
        <div className="px-6 mb-6">
          <p className="text-xs text-gray-400 mb-1">Admin Dashboard</p>
          <p className="font-semibold">KaamLink Admin</p>
        </div>
        <nav className="space-y-1 px-3 text-sm">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'pending', label: 'Pending Verifications' },
            { id: 'users', label: 'All Users' },
            { id: 'jobs', label: 'All Jobs' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-3 py-2 rounded-xl ${
                activeTab === item.id ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 px-4 py-6 md:ml-0 max-w-6xl mx-auto w-full">
        <div className="md:hidden mb-4 flex gap-2 overflow-x-auto text-xs">
          {['overview', 'pending', 'users', 'jobs'].map((id) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-3 py-1.5 rounded-full border ${
                activeTab === id
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'border-gray-200 text-gray-700'
              }`}
            >
              {id.replace('-', ' ')}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && overview()}
        {activeTab === 'pending' && pendingTab()}
        {activeTab === 'users' && usersTab()}
        {activeTab === 'jobs' && jobsTab()}
      </main>
    </div>
  );
};

export default AdminDashboard;

