// File: client/src/components/common/Loader.jsx
// Purpose: Reusable loading spinner component for async states

import React from 'react';

const Loader = ({ fullScreen = false }) => {
  const content = (
    <div className="flex items-center justify-center py-6">
      <span className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;

