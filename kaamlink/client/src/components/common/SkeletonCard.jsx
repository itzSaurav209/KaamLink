// File: client/src/components/common/SkeletonCard.jsx
// Purpose: Placeholder skeleton card for loading states in lists

import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="card p-4 animate-pulse space-y-3">
      <div className="h-4 w-1/2 bg-gray-200 rounded" />
      <div className="h-3 w-1/3 bg-gray-200 rounded" />
      <div className="h-3 w-2/3 bg-gray-200 rounded" />
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-gray-200 rounded-xl" />
        <div className="h-8 w-20 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
};

export default SkeletonCard;

