import { defineConfig } from 'vitest/config'
import path from 'node:path'

const root = import.meta.dirname

const measured = [
  'packages/*/src/domain/**/*.ts',
  'packages/*/src/application/**/*.ts',
]

const coverage = {
  provider: 'v8' as const,
  reportsDirectory: path.join(root, 'coverage'),
  coverageFilesDirectory: path.join(root, 'packages'),
  include: measured,
  all: true,
  thresholds: { lines: 90, branches: 90 }
}

export default defineConfig({
  test: {
    coverage,
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: ['apps/backend/tests/unit/**/*.test.ts', 'packages/*/tests/unit/**/*.test.ts'],
          passWithNoTests: true,
          coverage
        }
      },
      {
        test: {
          name: 'integration',
          environment: 'node',
          include: ['apps/backend/tests/integration/**/*.test.ts'],
          globalSetup: ['apps/backend/tests/integration/global-setup.ts'],
          fileParallelism: false,
          passWithNoTests: true,
          testTimeout: 30000,
          hookTimeout: 30000,
          coverage
        }
      },
      {
        extends: './apps/frontend/vitest.config.ts',
        test: { name: 'dom', coverage: { enabled: false } }
      }
    ]
  }
})
