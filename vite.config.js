import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',               // entry folder for index.html
  publicDir: 'static',       // your static assets folder
  base: './',                // relative paths for CSS/JS
  build: {
    outDir: '../dist',       // output build in project root
    emptyOutDir: true,
    sourcemap: true
  },
  server: {
    host: true
  }
});
