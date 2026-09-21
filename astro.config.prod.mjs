import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Production configuration for https://terroso.com
export default defineConfig({
  site: 'https://terroso.com',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: 'esbuild',
      cssMinify: 'lightningcss',
    },
  },
});
