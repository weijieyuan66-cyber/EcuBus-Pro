import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => {
  const isDev = command === 'serve'

  return {
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
        // These are provided by the host at runtime via an importmap injected
        // by wujie — externalize them only in production builds.
        external: [
          'vue',
          'element-plus',
          '@element-plus/icons-vue',
          '@ecubus-pro/renderer-plugin-sdk'
        ],
        output: {
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
        '@': resolve(__dirname, 'src/renderer'),
        // In dev (serve) mode, replace the host-dependent SDK with a safe
        // local stub so the UI renders without a running EcuBus-Pro host.
        ...(isDev
          ? {
              '@ecubus-pro/renderer-plugin-sdk': resolve(
                __dirname,
                'src/renderer/sdk-shim.ts'
              )
            }
          : {})
      }
    }
  }
})
