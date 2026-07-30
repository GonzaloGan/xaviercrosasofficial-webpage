// @ts-check

import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders, sessionDrivers } from 'astro/config';

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

  // Keep sessions off Cloudflare KV to avoid requiring a SESSION binding.
  session: {
    driver: sessionDrivers.memory(),
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
