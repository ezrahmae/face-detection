const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env;

export default {
  root: 'src/',              // entry point folder for index.html
  publicDir: '../static/',   // where your css/js/images live
  base: './',                // use relative paths for deployment
  server: {
    host: true,
    open: !isCodeSandbox     // auto-open in dev
  },
  build: {
    outDir: '../dist',       // single build section (no duplicates)
    emptyOutDir: true,
    sourcemap: true
  }
};
