import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'], // Apenas o index principal será empacotado
  outDir: 'dist',
  format: ['esm'],
  dts: true, // Gera os arquivos de tipos
  splitting: false, // Mantém um único arquivo index.js
  clean: true, // Limpa a pasta dist antes do build
  minify: false, // Pode testar minify depois de validar
  external: ['src/lib/average/charts/*'], // NÃO inclui os arquivos da pasta charts no bundle
  outExtension({ format }) {
    return { js: `.js` } // Garante que a extensão final seja .js
  }
})