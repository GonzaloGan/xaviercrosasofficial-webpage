# Contract — Content collections

**Feature:** 001-astro-rework
**Implemented by:** `src/content.config.ts`

The authoring interface for the site. Anything described here can be changed by editing a Markdown
file; nothing here requires touching a component.

---

## `releases`

**Location:** `src/content/releases/*.md`
**Loader:** `glob({ pattern: '**/*.md', base: './src/content/releases' })`
**Id:** the filename stem, used as the DOM anchor — keep it stable once published.

### Schema

```ts
({ image }) => z.object({
  title: z.string().min(1),
  cover: image(),
  coverAlt: z.object({
    en: z.string().min(1),
    es: z.string().min(1),
    ca: z.string().min(1),
    nl: z.string().min(1),
  }),
  releaseDate: z.coerce.date(),
  credits: z.string().min(1),
  type: z.enum(['single', 'album', 'ep']),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  links: z.object({
    spotify: z.string().url().optional(),
    youtube: z.string().url().optional(),
    apple: z.string().url().optional(),
  }).refine(
    (l) => Boolean(l.spotify || l.youtube || l.apple),
    { message: 'A release needs at least one streaming link.' },
  ),
})
```

`cover` uses the `image()` helper so the value is a resolved `ImageMetadata` that `<Image />` can
optimise — this is what fixes defect D-8/D-9.

### Example

```md
---
title: "The Archetype III: The Wanderer"
cover: "../../assets/images/xavi_wolf.jpg"
coverAlt:
  en: "Cover art for The Archetype III: The Wanderer — a wolf under a pale sky"
  es: "Portada de The Archetype III: The Wanderer — un lobo bajo un cielo pálido"
  ca: "Portada de The Archetype III: The Wanderer — un llop sota un cel pàl·lid"
  nl: "Hoes van The Archetype III: The Wanderer — een wolf onder een bleke lucht"
releaseDate: 2026-01-01
credits: "© 2026 XCB Studio"
type: "single"
featured: true
links:
  spotify: "https://open.spotify.com/track/53REbMHYYx6Krvu5ioXRIn"
---
```

The Markdown body is optional. When present it renders as release notes beneath the credits.

### Rules

- `title` is never translated — it is a proper noun.
- `coverAlt` requires all four locales. This is enforced by the schema so a release cannot ship with
  an unlabelled image (Principle V.2).
- Spotify URLs are stored without an `/intl-*/` segment; Spotify localises per visitor.
- Sort order applied by the site: `featured` first, then `releaseDate` descending, then `order`
  ascending.
- At most one release should set `featured: true`.

---

## `bio`

**Location:** `src/content/bio/{en,es,ca,nl}.md` — exactly four files.
**Loader:** `glob({ pattern: '*.md', base: './src/content/bio' })`
**Id:** the locale code.

### Schema

```ts
z.object({
  locale: z.enum(['en', 'es', 'ca', 'nl']),
  heading: z.string().min(1),
  role: z.string().min(1),
  location: z.string().min(1),
})
```

The body is the biography prose, rendered via `render()`.

### Example

```md
---
locale: "en"
heading: "About"
role: "Artist / Composer / Performer"
location: "Roermond - Remote"
---

My journey started in 2020, when invited by curiosity about the hero's journey, a book called
'The Hero Within' by Carol S. Pearson came into my hands. …
```

### Rules

- `locale` must equal the filename stem. A mismatch is a content error.
- All four files must exist; a missing locale means a page renders without a biography.
- Prose belongs in the body, not in frontmatter.

---

## Not a collection

| Data | Where | Why |
|---|---|---|
| UI strings | `src/i18n/ui.ts` | Needs compile-time key checking across locales — a `const satisfies` object gives that, frontmatter does not. |
| Site profile & social URLs | `src/data/site.ts` | Referenced by code (JSON-LD, footer links), changes almost never, benefits from a type rather than a schema. |
| YouTube channel id | `YOUTUBE_CHANNEL_ID` env var | Infrastructure configuration, not content. |
| Videos | fetched at request time | External, live, not authored. See [youtube-latest.md](./youtube-latest.md). |

---

## Adding a release

1. Drop the cover art in `src/assets/images/`.
2. Create `src/content/releases/<slug>.md` with the frontmatter above.
3. `npm run build`.

No `.astro` file is edited. This is acceptance criterion 7 in [spec.md](../spec.md).

## Failure behaviour

Invalid frontmatter fails the build with the offending file and field named. This is intentional —
a release with a broken link or a missing translation must not reach production.
