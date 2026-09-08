import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';

// Vercel serves this browser-only build. The default vite.config.ts remains
// the Vinext / Sites / Cloudflare Workers build, with the same shared app UI.
export default defineConfig({
  root: fileURLToPath(new URL('./vercel', import.meta.url)),
  publicDir: fileURLToPath(new URL('./public', import.meta.url)),
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('.', import.meta.url)) },
  },
  css: { postcss: { plugins: [tailwindcss()] } },
  build: {
    outDir: fileURLToPath(new URL('./dist/vercel', import.meta.url)),
    emptyOutDir: true,
  },
});
