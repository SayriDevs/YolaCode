import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

// Build de LIBRERÍA: produce dist/app.js — un bundle ESM AUTOCONTENIDO
// que el App Store de YOLA importa como entry. solid-js vive en
// devDependencies para que Vite lo BUNDLEE dentro (jsDelivr sirve un
// solo archivo: el bundle no puede depender de imports externos).
export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    lib: {
      entry: 'src/index.js',
      formats: ['es'],
      fileName: () => 'app.js',
    },
    outDir: 'dist',
    target: 'es2020',
    cssCodeSplit: false,
    rollupOptions: {
      // NADA se externaliza: el bundle debe ser 100% autocontenido
      external: [],
    },
  },
  server: {
    port: 5199, // dev aislado (el OS corre en otros puertos)
  },
})
