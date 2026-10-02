import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@limin/ui': path.resolve(import.meta.dirname, '../../packages/ui/src/index.ts'),
      '@limin/ui-demo-module': path.resolve(import.meta.dirname, '../../packages/ui-demo-module/src/index.ts'),
      '@limin/contracts': path.resolve(import.meta.dirname, '../../packages/contracts/src/index.ts')
    }
  },
  test: {
    name: 'dom',
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts', '../../packages/ui/tests/**/*.test.ts'],
    passWithNoTests: true,
    coverage: { enabled: false }
  }
})
