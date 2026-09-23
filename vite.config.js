import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: { port: 5173, host: true },
  preview: { port: 4173, strictPort: true },
  build: {
    target: 'es2020', sourcemap: false, chunkSizeWarningLimit: 800,
    rollupOptions: { output: { manualChunks(id) {
      if (!id.includes('node_modules')) return;
      if (id.includes('react-router')) return 'vendor-router';
      if (id.includes('lucide-react')) return 'vendor-icons';
      if (id.includes('/react/') || id.includes('react-dom') || id.includes('scheduler')) return 'vendor-react';
      return 'vendor';
    }}},
  },
});
