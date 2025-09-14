const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env;

import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',               // your index.html entry point
  publicDir: 'static',       // move your static folder inside project root
  base: './',                // use relative paths for deployment
  server: {
    host: true,
    open: !isCodeSandbox
  },
  build: {
    outDir: 'dist',          // build output inside project folder
    emptyOutDir: true,
    sourcemap: true
  }
});
