import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main/index.ts'),
      formats: ['cjs'],
      fileName: 'index'
    },
    rollupOptions: {
      // Node built-ins that must NOT be bundled
      external: [
        'worker_threads',
        'fs',
        'path',
        'fs/promises',
        'node:fs',
        'node:path',
        'node:fs/promises',
        'node:worker_threads'
      ]
    },
    outDir: resolve(__dirname, 'dist/main'),
    emptyOutDir: true,
    target: 'node20',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
