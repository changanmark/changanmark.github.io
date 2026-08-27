import { defineConfig } from 'vite';

export default defineConfig({
  base: '/examples/material/',
  build: {
    outDir: '../../examples/material',
    emptyOutDir: true,
  },
});
