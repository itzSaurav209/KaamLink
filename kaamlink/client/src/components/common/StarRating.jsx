// File: client/src/components/common/StarRating.jsx
// Purpose: Star rating display and optional interactive selection

import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, interactive = false, onChange }) => {
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (value) => {
    if (!interactive || !onChange) return;
    onChange(value);
  };

  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => (
        <button
          key={s}
          type={interactive ? 'button' : 'button'}
          onClick={() => handleClick(s)}
          className={interactive ? 'hover:scale-105 transition' : ''}
        >
          <Star
            size={16}
            className={
              s <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300'
            }
          />
        </button>
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating?.toFixed ? rating.toFixed(1) : rating}</span>
    </div>
  );
};

export default StarRating;

