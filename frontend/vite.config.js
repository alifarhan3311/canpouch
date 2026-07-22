import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const backend =
    mode === 'production'
      ? 'https://canpouch-backend.vercel.app'
      : 'http://localhost:5001';

  return {
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
  };
});