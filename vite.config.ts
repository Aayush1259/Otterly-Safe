import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Static build: no backend. `base: './'` keeps assets relative so the build
// also works when opened from a sub-path or a local file server, offline.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 900,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
