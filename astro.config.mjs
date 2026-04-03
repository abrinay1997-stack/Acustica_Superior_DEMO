// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const base = isGitHubPages ? '/Acustica_Superior_DEMO' : '';
const site = isGitHubPages
  ? 'https://abrinay1997-stack.github.io/Acustica_Superior_DEMO'
  : 'https://acusticasuperior.netlify.app';

export default defineConfig({
  output: 'static',
  base,
  site,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
