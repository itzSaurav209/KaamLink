// File: client/src/components/common/Footer.jsx
// Purpose: Application footer with branding, links, and social placeholders

import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t bg-white mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-4 text-sm">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-8 w-8 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold">
              K
            </span>
            <span className="font-semibold text-gray-900">KaamLink</span>
          </div>
          <p className="text-gray-500">
            Your trusted local workforce, one click away. Hire verified workers and pay safely.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Company</h4>
          <ul className="space-y-1 text-gray-500">
            <li>About</li>
            <li>Terms</li>
            <li>Privacy</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Connect</h4>
          <div className="flex gap-3 text-gray-500">
            <Facebook size={18} />
            <Twitter size={18} />
            <Instagram size={18} />
          </div>
        </div>
      </div>
      <div className="border-t py-3 text-xs text-center text-gray-400">
        © {year} KaamLink. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

