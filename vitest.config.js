import { defineConfig } from 'vitest/config'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solidPlugin()], // transform de JSX + resolución client de solid-js
  test: {
    environment: 'jsdom', // tests de UI (App) y lógica pura (highlight)
    include: ['src/**/*.test.{js,jsx}'],
  },
})
