import {defineConfig} from 'vite';

export default defineConfig({
  base: '/examples/how-webgl2-works/',
  build: {
    outDir: '../../examples/how-webgl2-works',
    emptyOutDir: true,
  },
});
