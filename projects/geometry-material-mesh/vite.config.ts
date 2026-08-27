import { defineConfig } from 'vite';

export default defineConfig({
  base: '/examples/geometry-material-mesh/',
  build: {
    outDir: '../../examples/geometry-material-mesh',
    emptyOutDir: true,
  },
});
