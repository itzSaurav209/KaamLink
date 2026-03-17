// File: client/src/components/common/Badge.jsx
// Purpose: Small pill-shaped badge for categories and statuses

import React from 'react';

const colorMap = {
  maid: 'bg-pink-100 text-pink-700',
  plumber: 'bg-blue-100 text-blue-700',
  electrician: 'bg-yellow-100 text-yellow-700',
  driver: 'bg-green-100 text-green-700',
  cook: 'bg-orange-100 text-orange-700',
  carpenter: 'bg-amber-100 text-amber-700',
  house_help: 'bg-teal-100 text-teal-700',
  other: 'bg-gray-100 text-gray-700',
  open: 'bg-blue-100 text-blue-700',
  accepted: 'bg-indigo-100 text-indigo-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  pending: 'bg-orange-100 text-orange-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

const Badge = ({ text, variant }) => {
  const cls = colorMap[variant] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {text}
    </span>
  );
};

export default Badge;

