import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * GitHub Pages serves this project from https://<user>.github.io/<repo>/, so the
 * build needs a base path. Override it with BASE_PATH for a custom domain ('/')
 * or a different repository name.
 */
const base = process.env.BASE_PATH || '/faiz-marriage/';

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    assetsInlineLimit: 8192,
    // three.js is ~130 KB gzipped and loads after first paint.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // React in one long-lived chunk; Three.js in its own chunk, loaded
        // after the cover has painted.
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
          if (/node_modules\/three\//.test(id)) return 'three';
          return undefined;
        },
      },
    },
  },
});
