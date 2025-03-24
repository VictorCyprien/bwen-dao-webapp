import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5000,
    strictPort: false, // Si 5010 est occupé, il prend le suivant disponible
    watch: {
      usePolling: true, // Améliore la détection des changements
    },
    hmr: {
      overlay: false, // Évite l'écran blanc en cas d'erreur HMR
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        ws: true,
      }
    }
  },
  cacheDir: '.vite_cache', // Utiliser un cache dédié pour éviter les corruptions
});
