import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',              // entry folder for index.html
  publicDir: 'static',      // static assets folder inside project
  base: './',               // relative paths for deployment
  build: {
    outDir: 'dist',         // build output inside project root
    emptyOutDir: true,
    sourcemap: true
  },
  server: {
    host: true
  }
});
