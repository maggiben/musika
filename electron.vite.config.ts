import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), tsconfigPaths()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.ts'),
          child: resolve(__dirname, 'src/main/child.ts'),
        },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin(), tsconfigPaths()],
  },
  renderer: {
    // resolve: {
    //   alias: {
    //     '@renderer': resolve('src/renderer/src'),
    //     "@assets": resolve('src/renderer/src/assets'),
    //     "@utils": resolve('src/renderer/src/utils'),
    //   }
    // },
    plugins: [react(), tsconfigPaths()],
  },
});
