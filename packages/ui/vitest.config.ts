import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// Scaffold component tests. This package owns `vue` and the plugin, so the root
// workspace does not also declare them - two copies of Vue in one test run is a
// defect that surfaces as baffling component-test failures.
const src = path.resolve(import.meta.dirname, '../src')

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': src,
      '@limin/ui': path.resolve(import.meta.dirname, '../src/index.ts'),
      '@limin/contracts': path.resolve(import.meta.dirname, '../../contracts/src/index.ts')
    }
  },
  test: {
    name: 'ui',
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
    passWithNoTests: true
  }
})