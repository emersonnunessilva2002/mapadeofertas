// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";


import sitemap from "@astrojs/sitemap";


// https://astro.build/config
export default defineConfig({
  site: 'https://mapadepromos.space',
  prefetch: {
    prefetchAll: false
  },

  vite: {
  plugins: [tailwindcss()],
},

  integrations: [sitemap({
    chunks: {
        posts: (item) => {
          if (item.url.includes('/posts/')) {
            return item;
          }
        },
      },
  })],
});