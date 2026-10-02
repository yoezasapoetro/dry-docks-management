import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'
import appConfig from './src/app.config'

export default defineConfig({
  plugins: [
    vue(),
    ui({ ui: appConfig.ui })
  ],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
      '@limin/ui': new URL('../../packages/ui/src/index.ts', import.meta.url).pathname,
      '@limin/ui-demo-module': new URL('../../packages/ui-demo-module/src/index.ts', import.meta.url).pathname,
      '@limin/contracts': new URL('../../packages/contracts/src/index.ts', import.meta.url).pathname
    }
  },
  server: {
    port: 5173
  }
})
