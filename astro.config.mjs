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

  env: {
    schema: {
      // The channel is public information, but keeping it in configuration means the
      // feed reader stays reusable and a missing value fails loudly instead of
      // silently falling back to a literal.
      YOUTUBE_CHANNEL_ID: envField.string({ context: 'server', access: 'public' }),
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

  adapter: cloudflare(),
});
