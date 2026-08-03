import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node', // los tests del repo son lógica pura (highlight)
    include: ['src/**/*.test.js'],
  },
})
