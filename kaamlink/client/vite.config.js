// File: client/vite.config.js
// Purpose: Vite configuration for React-based KaamLink frontend

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});

