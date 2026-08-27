import { defineConfig } from 'vite';

export default defineConfig({
  base: '/examples/scene-tree/',
  build: {
    outDir: '../../examples/scene-tree',
    emptyOutDir: true,
  },
});
