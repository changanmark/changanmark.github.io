import {defineConfig} from 'vite';

export default defineConfig({
  base: '/examples/hello-webgl2/',
  build: {
    outDir: '../../examples/hello-webgl2',
    emptyOutDir: true,
  },
});
