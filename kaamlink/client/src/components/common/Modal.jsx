// File: client/src/components/common/Modal.jsx
// Purpose: Generic modal wrapper with backdrop and close button

import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ open, title, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="card max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
        {title && (
          <h2 className="text-lg font-semibold text-gray-900 mb-3 pr-8 px-4 pt-4">
            {title}
          </h2>
        )}
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

