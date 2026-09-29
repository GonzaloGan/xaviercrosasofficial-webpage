// @ts-check

import sitemap from '@astrojs/sitemap';
import { defineConfig, envField, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mailObfuscation from 'astro-mail-obfuscation';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.xaviercrosasofficial.com',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'ca', 'nl'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  // No sessions on this site: skips the KV binding and drops the session runtime from the Worker.
  session: false,

  env: {
    schema: {
      // Optional at build: Videos.astro degrades to the API-hydrated empty state without it.
      YOUTUBE_CHANNEL_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', es: 'es', ca: 'ca', nl: 'nl' },
      },
    }),
    mailObfuscation(),
  ],

  fonts: [
      {
          provider: fontProviders.local(),
          name: 'Inter',
          cssVariable: '--font-inter',
          fallbacks: ['sans-serif'],
          options: {
              variants: [
                  {
                      src: ['./src/assets/fonts/Inter-Regular.woff2'],
                      weight: 400,
                      style: 'normal',
                      display: 'swap',
                  },
                  {
                      src: ['./src/assets/fonts/Inter-Bold.woff2'],
                      weight: 700,
                      style: 'normal',
                      display: 'swap',
                  },
              ],
          },
      },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  // All images live on prerendered pages; transform at build time instead of the
  // default 'cloudflare-binding', which provisions a runtime Images binding on deploy.
  adapter: cloudflare({
    imageService: 'compile',
  }),
});
