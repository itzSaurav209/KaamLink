// File: client/src/components/employer/JobCard.jsx
// Purpose: Card displaying job details with optional action buttons

import React from 'react';
import { CalendarDays, MapPin } from 'lucide-react';
import Badge from '../common/Badge.jsx';

const JobCard = ({ job, actions = [] }) => {
  if (!job) return null;
  const { title, status, location, scheduledDate, agreedRate, worker, employer } = job;

  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {employer?.name && <span>Employer: {employer.name}</span>}
            {worker?.name && <span className="ml-2">Worker: {worker.name}</span>}
          </p>
        </div>
        <Badge text={status.replace('_', ' ')} variant={status} />
      </div>
      <div className="flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <CalendarDays size={14} />
          <span>{scheduledDate ? new Date(scheduledDate).toLocaleDateString() : 'Flexible'}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          <span>{location?.city}</span>
        </div>
        <div>
          <span className="font-semibold">₹{agreedRate}</span>
        </div>
      </div>
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={a.onClick}
              className={`px-3 py-1 text-xs rounded-xl border ${
                a.variant === 'primary'
                  ? 'border-primary text-primary'
                  : 'border-gray-200 text-gray-700'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobCard;

