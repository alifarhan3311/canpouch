import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backend =
  'https://canpouch-backend.vercel.app' || 'http://localhost:5001';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    proxy: {
      '/api': {
        target: backend,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});