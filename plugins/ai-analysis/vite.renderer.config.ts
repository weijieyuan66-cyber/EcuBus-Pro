import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // Set root to where index.html lives so Vite can locate the entry point
  root: resolve(__dirname, 'src/renderer'),
  // Use relative asset paths so the built HTML works when served from
  // file:///pluginDir/dist/renderer/index.html
  base: './',
  build: {
    outDir: resolve(__dirname, 'dist/renderer'),
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      // These are provided by the host via an importmap injected by wujie
      external: [
        'vue',
        'element-plus',
        '@element-plus/icons-vue',
        '@ecubus-pro/renderer-plugin-sdk'
      ],
      output: {
        // Prevent Rollup from trying to inline externals
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus'
        }
      }
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/renderer')
    }
  }
})
