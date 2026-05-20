import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // CRITICAL: This ensures paths in index.html start with ./ instead of /
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
