// File: client/src/components/common/SosButton.jsx
// Purpose: Floating SOS button for worker safety demo, triggers alert toast

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const SosButton = () => {
  const handleClick = () => {
    toast('SOS alert sent to emergency contact and KaamLink support (demo).', {
      icon: '🚨',
    });
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700"
    >
      <AlertTriangle size={16} />
      <span className="text-xs font-semibold">SOS</span>
    </button>
  );
};

export default SosButton;

