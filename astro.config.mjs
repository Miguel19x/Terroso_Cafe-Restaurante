import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://cafeterroso.com.ve',
  vite: {
    plugins: [tailwindcss()],
  },
});
