import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * GitHub Pages serves this project from https://<user>.github.io/<repo>/, so the
 * build needs a base path. Override it with BASE_PATH for a custom domain ('/')
 * or a different repository name.
 */
const base = process.env.BASE_PATH || '/faiz-marriage/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    // Inline anything under 8 KB (ornaments, favicons) to save round trips.
    assetsInlineLimit: 8192,
    rollupOptions: {
      output: {
        // Keep the React runtime in one long-lived chunk; let Rollup split the
        // animation features out on its own (LazyMotion loads them after paint).
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
          return undefined;
        },
      },
    },
  },
});
