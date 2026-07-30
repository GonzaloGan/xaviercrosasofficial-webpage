# Research — Codebase Audit & Technical Decisions

**Feature:** 001-astro-rework
**Date:** 2026-07-30
**Method:** full read of every source file in the repository at commit time of writing.

---

## 1. Inventory as-found

### Toolchain

| Item | Version | Notes |
|------|---------|-------|
| Astro | `^6.3.7` | Content Layer, `astro:assets`, built-in `i18n` and `fonts` all available |
| React | `^19.2.6` via `@astrojs/react@^5.0.5` | Used for exactly one component |
| Tailwind CSS | `^4.3.0` via `@tailwindcss/vite` | v4 — CSS-first config, no `tailwind.config.*` file exists |
| Adapter | `@astrojs/cloudflare@^13.6.0` | Worker with static-asset binding |
| Wrangler | `^4.95.0` | `main: @astrojs/cloudflare/entrypoints/server`, assets `./dist`, binding `ASSETS` |
| Node | `>=22.12.0` | declared in `engines` |
| TypeScript | `astro/tsconfigs/strict` | `jsx: react-jsx` |

Integrations registered: `mdx()`, `sitemap()`, `react()`, `mailObfuscation()`.
Installed but never imported: `@astrojs/rss`, `sharp` (sharp is used implicitly by `astro:assets`,
but `astro:assets` is itself never used).

### Source files

| File | Lines | Role |
|------|-------|------|
| `src/pages/index.astro` | 11 | Only page |
| `src/components/ArtistPortfolioStarter.tsx` | ~515 | The entire website |
| `src/pages/api/youtube-latest.ts` | ~70 | YouTube RSS proxy |
| `src/styles/global.css` | small | Tailwind entry |
| `src/assets/images/*` | 4 files | `xavi1.webp`, `xavi_album.png`, `break_the_illusions.jpg`, `xavi_wolf.jpg` |
| `src/assets/fonts/*` | 2 files | `Inter-Regular.woff2`, `Inter-Bold.woff2` |

---

## 2. Defects found

### D-1 — Page content is emitted outside the HTML document · Severity: critical

`src/pages/index.astro`:

```astro
<html lang="en">
  <body class="font-sans bg-[#0b0b0d] text-white antialiased">
    <slot />
  </body>
</html>

<ArtistPortfolioStarter client:visible />
```

The island is a sibling of `<html>`, not a child of `<body>`. Browsers recover from this, but the
served markup is invalid and the `<body>` classes apply to an empty body. Additionally, `<slot />`
is a component feature — in a page it renders nothing.

**Resolution:** a real `BaseLayout.astro` owning `<html>`/`<head>`/`<body>`, with pages passing
content through `<slot />` into the layout.

### D-2 — Nothing is server-rendered · Severity: critical

`client:visible` defers hydration until the component scrolls into view. Since the component *is*
the page, the initial HTML contains no hero, no biography, no release titles. Combined with the
Cloudflare adapter running in on-demand mode (no `prerender` export anywhere), every request pays
for server rendering of an empty shell.

**Resolution:** `.astro` components + `export const prerender = true`.

### D-3 — Three of four languages are unreachable · Severity: high

`lang` is React state (`useState<Lang>("en")`). There is one URL. Spanish, Catalan and Dutch copy
exists in the bundle but has no address, cannot be linked, shared, or indexed, and resets on reload.

**Resolution:** Astro's built-in `i18n` routing with a `[lang]` dynamic segment.

### D-4 — Placeholder production URL · Severity: high

`astro.config.mjs` line 17: `site: 'https://example.com'`. `@astrojs/sitemap` uses `site` to build
absolute URLs, so the emitted sitemap advertises `example.com`. Canonical tags would inherit the
same fault.

**Resolution:** set the real domain.

### D-5 — YouTube endpoint refuses to cache · Severity: high

`src/pages/api/youtube-latest.ts` sets `cache: "no-store"` on the upstream fetch *and*
`"Cache-Control": "no-store"` on its own response — the comment says "while debugging", which was
never undone. Every visitor triggers a fresh YouTube request from the Worker.

Also in the same file:
- The channel ID `UCPJbHYCqGDWiULG6dDE_Tzw` is a string literal in the URL.
- No `AbortSignal`; a slow upstream blocks the Worker until its own limit.
- Failures return HTTP 200 with `{ items: [] }`, making a hard failure indistinguishable from an
  empty channel.
- `.slice(0, 5)` is an unexplained literal.

**Resolution:** environment-provided channel ID, request timeout, `s-maxage` + `stale-while-revalidate`,
named constant, honest status codes.

### D-6 — Untyped i18n blob · Severity: medium

`const copy: Record<Lang, any>` — the `any` disables every guarantee. A translator omitting
`heroSecondary` in Catalan produces `undefined` in the DOM, silently.

**Resolution:** derive the key type from the English dictionary so every other locale must satisfy it.

### D-7 — Duplicated markup and duplicated data · Severity: medium

- The nav anchor list `["home","music","videos","about","contact"]` is written inline **twice**
  (desktop nav and mobile menu) and is index-coupled to a separate label array — reordering one
  silently mislabels the other.
- The three releases are three near-identical ~20-line `<article>` blocks differing only in image,
  title, credit line and URL.

**Resolution:** one nav definition; one `ReleaseCard` iterated over a collection.

### D-8 — Images bypass optimisation · Severity: medium

Images are imported as Astro assets but consumed as `<img src={xaviHero.src}>`. That discards
resizing, format negotiation, and the intrinsic `width`/`height` that prevents layout shift.
`alt="Featured release"` is repeated on three different covers, which is useless to a screen reader.

**Resolution:** `<Image />` from `astro:assets`, per-release alt text from the collection.

### D-9 — No SEO surface · Severity: medium

No `<title>`, no description, no Open Graph, no Twitter card, no structured data, no canonical.
A shared link renders as a bare URL.

### D-10 — Accessibility gaps · Severity: medium

No skip link; mobile menu does not trap focus or close on `Escape`; external links lack
`rel="noopener noreferrer"`; the video loading state has no `aria-live`; heading order is driven by
visual styling rather than structure.

### D-11 — Design tokens as literals · Severity: low

`#0b0b0d` and the `white/5 · white/10 · white/45 · white/70` opacity ladder are repeated across the
page and the layout. Tailwind v4 supports `@theme` for exactly this.

### D-12 — Unused dependencies · Severity: low

`@astrojs/rss` and `@astrojs/mdx` are installed and, in MDX's case, registered — but no `.mdx` file
and no feed route exist. They are misleading context.

---

## 3. Decisions

### DEC-01 — Remove React entirely

**Chosen:** rewrite as `.astro`, delete `@astrojs/react`, `react`, `react-dom`, `react-icons`.
**Alternatives:** keep React for the interactive parts; keep the component and add `client:load`.
**Rationale:** the only genuinely interactive behaviours are a mobile menu toggle and a language
switch. The former is ~15 lines of vanilla script; the latter becomes links. `react-icons` was the
main remaining pull — nine glyphs, replaced by inlined SVG.

### DEC-02 — Content Layer collections over a CMS or inline data

**Chosen:** `glob()` loader over Markdown in `src/content/`, validated by Zod in `src/content.config.ts`.
**Alternatives:** a headless CMS; JSON modules; keep it inline.
**Rationale:** three releases and four bios do not justify a CMS or its runtime dependency. Zod
schemas turn a content mistake into a build failure, satisfying FR-05 and Principle II.

### DEC-03 — Astro native i18n with unprefixed default locale

**Chosen:** `i18n: { defaultLocale: 'en', locales: ['en','es','ca','nl'], routing: { prefixDefaultLocale: false } }`
plus `src/pages/[lang]/index.astro` and a root page for English.
**Alternatives:** an i18n library; prefix every locale including English.
**Rationale:** native support needs no dependency and integrates with `@astrojs/sitemap`'s `i18n`
option to emit `hreflang` automatically. Leaving English unprefixed preserves existing inbound
links to `/`.

### DEC-04 — Videos fetched at request time on the server, page still static

**Chosen:** keep `/api/youtube-latest` as the single server route with a shared-cache header; the
videos section renders from it server-side.
**Alternatives:** fetch at build time (stale until redeploy); keep the client-side `useEffect`.
**Rationale:** build-time data goes stale between releases; the client fetch violates Principle I
and produces a skeleton flash. A cached endpoint gives fresh-enough data at near-zero cost.

### DEC-05 — Tailwind v4 `@theme` tokens

**Chosen:** declare colour tokens in `src/styles/global.css` under `@theme`.
**Alternatives:** re-introduce a `tailwind.config.ts`; keep arbitrary values.
**Rationale:** v4 is CSS-first; adding a JS config fights the tool. Tokens remove D-11 without new files.

### DEC-06 — Manual verification, no test suite

**Chosen:** the acceptance checklist in `spec.md` §7 and `quickstart.md`.
**Rationale:** a four-page brochure site with no branching logic. Introducing a runner and CI is
out of scope per `spec.md` §2 and would violate Principle VII.

---

## 4. Content extracted for migration

Verbatim from `ArtistPortfolioStarter.tsx`, to be re-homed without editorial change.

**Profile** — name `Xavier Crosas`; email `xaviercrosasofficial@gmail.com`;
Instagram `https://instagram.com/xaviercrosasofficial`;
YouTube `https://youtube.com/@XavierCrosasOFFICIAL`;
Spotify `https://open.spotify.com/artist/6PaPHlXXxfowSsJdvdxyke`;
channel ID `UCPJbHYCqGDWiULG6dDE_Tzw`.

**Releases**

| Title | Cover | Credit | Streaming | Video |
|-------|-------|--------|-----------|-------|
| The Archetype III: The Wanderer | `xavi_wolf.jpg` | © 2026 XCB Studio | `open.spotify.com/track/53REbMHYYx6Krvu5ioXRIn` | — |
| Break The Illusions | `break_the_illusions.jpg` | © 2026 XCB Studio | `open.spotify.com/track/3acimGFmocle0Dv5tBNLtm` | — |
| When Did I Grow Up | `xavi_album.png` | Recording, Mixing & Mastering: Icy Donuts Music Studio | `open.spotify.com/album/0IteIu5XQh9KhlctLH0heT` | `youtube.com/watch?v=xDuBDXz9_2Q` |

Note: the original links embed the `/intl-es/` locale segment. These are normalised to
locale-neutral Spotify URLs, which redirect correctly for every visitor.

**UI dictionary keys** (18, × 4 locales): `nav`, `heroKicker`, `heroTitle`, `heroBody`,
`heroPrimary`, `heroSecondary`, `location`, `featured`, `latestVideos`, `aboutTitle`, `aboutBody`,
`aboutRole`, `languages`, `contactTitle`, `contactBody`, `footer`, `videoEmpty`, `cta`.

`aboutBody` is long-form prose and moves to a Markdown body rather than a dictionary string.

**Hero image** — `xavi1.webp`.

---

## 5. Astro 6 APIs relied upon

| API | Use |
|-----|-----|
| Content Layer `defineCollection` + `glob()` | releases, bios |
| `image()` helper in a collection schema | cover art as an optimisable asset |
| `astro:assets` `<Image />` | responsive, dimensioned output |
| `i18n` config + `astro:i18n` helpers | locale routing and URL building |
| `getStaticPaths()` + `export const prerender = true` | four static locale pages |
| `experimental.fonts` (already configured) | self-hosted Inter, unchanged |
| `@astrojs/sitemap` `i18n` option | `hreflang` alternates in the sitemap |
| `astro-mail-obfuscation` | retained; the contact `mailto:` keeps `data-obfuscation="1"` |

---

## 6. Open items

| ID | Item | Blocks |
|----|------|--------|
| O-1 | Confirm the production domain used for `site` and the sitemap. Assumed `https://www.xaviercrosasofficial.com`. | Deployment |
| O-2 | `FaXTwitter` is imported in the old component but no X/Twitter URL is ever defined. Confirm whether the artist has a handle. | Contact section |
| O-3 | No dedicated 1200×630 Open Graph share image exists. The hero portrait is used until one is supplied. | Social sharing quality |
