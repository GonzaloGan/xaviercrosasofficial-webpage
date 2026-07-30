import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const localisedText = z.object({
  en: z.string().min(1),
  es: z.string().min(1),
  ca: z.string().min(1),
  nl: z.string().min(1),
});

const releases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/releases' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      cover: image(),
      coverAlt: localisedText,
      releaseDate: z.coerce.date(),
      credits: z.string().min(1),
      type: z.enum(['single', 'album', 'ep']),
      featured: z.boolean().default(false),
      order: z.number().int().default(0),
      links: z
        .object({
          spotify: z.string().url().optional(),
          youtube: z.string().url().optional(),
          apple: z.string().url().optional(),
        })
        .refine((links) => Boolean(links.spotify ?? links.youtube ?? links.apple), {
          message: 'A release needs at least one streaming link.',
        }),
    }),
});

const bio = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/bio' }),
  schema: z.object({
    locale: z.enum(['en', 'es', 'ca', 'nl']),
    heading: z.string().min(1),
    role: z.string().min(1),
    location: z.string().min(1),
  }),
});

export const collections = { releases, bio };
