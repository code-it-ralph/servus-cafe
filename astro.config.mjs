// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  site: 'https://code-it-ralph.github.io',
  base: '/servus-cafe',
  vite: {
    plugins: [tailwindcss()],
  },
});
