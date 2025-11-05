import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(process.env.PORT || env.PORT || 3002);

  return {
    server: {
      host: true,
      port,
      strictPort: false,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      host: true,
      port,
      strictPort: false,
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
  };
});
