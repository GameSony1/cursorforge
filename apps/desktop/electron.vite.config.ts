import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';

// The shared workspace package ships TypeScript source directly (no build step),
// so it must be bundled (not externalized) into the main/preload CJS output.
const externalize = externalizeDepsPlugin({ exclude: ['@cursor-customizer/shared'] });

export default defineConfig({
  main: {
    plugins: [externalize],
    // `to-ico` (a transitive dep of the shared package) does a dynamic
    // require() for its image-type modules that Rollup can't statically
    // bundle, so it must stay external and be resolved by Node at runtime.
    build: { rollupOptions: { external: ['to-ico'] } }
  },
  preload: {
    plugins: [externalize]
  },
  renderer: {
    // Force IPv4 so the packaged Electron window (which resolves
    // "localhost" to ::1 in this environment) can reach the dev server.
    server: { host: '127.0.0.1' },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  }
});
