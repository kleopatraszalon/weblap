import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Állítsd be az output könyvtárat, ha nem akarod, hogy legyen js mappa
        dir: 'dist', // Alapértelmezett, de itt testreszabhatod
        entryFileNames: '[name].js', // Ne legyen külön js mappa
      }
    }
  },
  server: {
    port: 3002,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
