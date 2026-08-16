import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite builds the React app into /dist.
// During local development, /api calls are proxied to the Express
// server running on port 3000 (start it with: npm start).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  build: {
    outDir: 'dist'
  }
});
