// File: client/src/components/worker/WorkerCard.jsx
// Purpose: Card displaying key worker profile info for search results

import React from 'react';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge.jsx';
import StarRating from '../common/StarRating.jsx';

const WorkerCard = ({ worker }) => {
  if (!worker) return null;
  const { _id, user, category, location, dailyRate, averageRating, totalReviews } = worker;

  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-primary">
          {user?.name?.charAt(0) || 'W'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <Badge text={category} variant={category} />
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <MapPin size={12} />
            <span>{location?.city}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-700">
          <span className="font-semibold">₹{dailyRate}</span>
          <span className="text-gray-500 text-xs ml-1">/ day</span>
        </div>
        <StarRating rating={averageRating || 0} />
        <span className="text-xs text-gray-400">{totalReviews || 0} reviews</span>
      </div>
      <Link
        to={`/worker/${_id}`}
        className="btn-primary text-xs justify-center mt-1"
      >
        View Profile
      </Link>
    </div>
  );
};

export default WorkerCard;

