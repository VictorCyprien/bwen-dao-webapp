import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    define: {
      // Expose process.env variables to the client 
      'process.env': {
        REPLICATE_API_TOKEN: JSON.stringify(env.REPLICATE_API_TOKEN)
      }
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
        },
        '/sound': {
          target: 'http://localhost:8500',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/sound/, ''),
          secure: false,
          ws: true,
        }
      }
    },
    cacheDir: '.vite_cache', // Utiliser un cache dédié pour éviter les corruptions
  };
});
