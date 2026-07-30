# Implementation Plan — Idiomatic Astro Rework

**Feature:** 001-astro-rework
**Spec:** [spec.md](./spec.md)
**Date:** 2026-07-30
**Status:** Completed

---

## Summary

Replace a single 515-line React component with prerendered Astro pages, Content Layer collections
and real localised routes. The visual design is preserved; the delivery mechanism is replaced.

---

## Constitution check

| Principle | How this plan satisfies it |
|---|---|
| I — Zero JS by default | React is removed entirely. The only script is a ~30-line mobile-menu module. |
| II — Content in content | Releases and bios become collections; UI strings become a typed dictionary. |
| III — Static by default | `prerender = true` on all four pages; one cached endpoint remains dynamic. |
| IV — i18n is routing | `/`, `/es/`, `/ca/`, `/nl/` with `hreflang` and no client-side state. |
| V — Accessible HTML | Layout owns landmarks and meta; skip link, focus trap, per-release alt text. |
| VI — Types load-bearing | Zod schemas, `const satisfies` dictionary, tokens replace magic values. |
| VII — Dependencies earn their place | React, react-icons, `@astrojs/rss`, `@astrojs/mdx` removed. |

No deviations requested.

---

## Target structure

```
src/
├── content.config.ts              # Zod schemas for releases + bio
├── content/
│   ├── releases/*.md              # 3 seed releases
│   └── bio/{en,es,ca,nl}.md
├── data/site.ts                   # name, email, social URLs
├── i18n/
│   ├── ui.ts                      # typed dictionaries, 4 locales
│   └── utils.ts                   # getLocale, useTranslations, localisePath
├── layouts/BaseLayout.astro       # html/head/body, SEO, hreflang, JSON-LD
├── components/
│   ├── Header.astro  Footer.astro  LanguageSwitcher.astro
│   ├── icons/*.astro              # 9 inline SVGs replacing react-icons
│   └── sections/
│       ├── Hero.astro  Music.astro  ReleaseCard.astro
│       ├── Videos.astro  About.astro  Contact.astro
├── pages/
│   ├── index.astro                # English, unprefixed
│   ├── [lang]/index.astro         # es · ca · nl
│   └── api/youtube-latest.ts      # the one dynamic route
└── styles/global.css              # @theme design tokens
```

Removed: `src/components/ArtistPortfolioStarter.tsx`.

---

## Phases

### Phase 1 — Foundation

Set the real `site` URL and add the `i18n` block to `astro.config.mjs`. Configure
`@astrojs/sitemap` with its `i18n` option so alternates are emitted. Declare colour tokens in
`@theme`. Build `BaseLayout.astro` with the document shell, per-locale meta, canonical, `hreflang`
alternates and a skip link.

*Fixes D-1, D-4, D-11. Unblocks everything else.*

### Phase 2 — Content

Write `src/content.config.ts` per the [collections contract](./contracts/content-collections.md).
Migrate the three releases and four biographies out of the component. Build `src/i18n/ui.ts` with
the `const satisfies` pattern and `src/i18n/utils.ts` helpers. Create `src/data/site.ts`.

*Fixes D-6, D-7. Independent of Phase 1 — can run in parallel.*

### Phase 3 — Routing

Add `src/pages/[lang]/index.astro` with `getStaticPaths()` for `es`, `ca`, `nl`, and rewrite
`src/pages/index.astro` as the English page. Both export `prerender = true`. Language switching
becomes links.

*Fixes D-3, D-5. Depends on Phases 1 and 2.*

### Phase 4 — Sections

Port each section to `.astro`: `Hero`, `Music` (iterating the releases collection through
`ReleaseCard`), `Videos`, `About` (rendering the bio Markdown), `Contact`, plus `Header`, `Nav`,
`LanguageSwitcher`, `Footer`. Replace `react-icons` imports with inline SVG components. Convert
images to `<Image />`. Define the nav items once.

*Fixes D-7, D-8. Depends on Phase 3.*

### Phase 5 — Endpoint

Rewrite `youtube-latest.ts` per its [contract](./contracts/youtube-latest.md): env-var channel id,
`AbortSignal.timeout`, `s-maxage` caching, 502 on failure, named constants, validated parsing.
`Videos.astro` consumes it during server rendering.

*Fixes D-5 (caching). Parallel with Phase 4.*

### Phase 6 — SEO & accessibility

Open Graph and Twitter tags, `MusicGroup` JSON-LD with `sameAs` profiles, focus trap and `Escape`
handling on the mobile menu, `rel="noopener noreferrer"` on outbound links, visible focus rings.

*Fixes D-9, D-10. Depends on Phase 4.*

### Phase 7 — Removal and verification

Delete `ArtistPortfolioStarter.tsx`. Uninstall `@astrojs/react`, `react`, `react-dom`,
`react-icons`, `@astrojs/rss`, `@astrojs/mdx`. Drop `jsx` settings from `tsconfig.json`. Run the
acceptance checklist in [spec.md](./spec.md) §7.

*Depends on all previous phases — nothing may be deleted until its replacement renders.*

---

## Risks

| Risk | Mitigation |
|---|---|
| Deleting React before the Astro sections are complete leaves the site unbuildable. | Phase 7 is last; the old component stays on disk, unreferenced, until then. |
| The production domain is unconfirmed (research O-1). | Assumed value is recorded in the spec; a single constant to change. |
| The Cloudflare adapter must still be able to serve one dynamic route alongside prerendered pages. | Standard hybrid behaviour: `prerender = true` on pages, absent on the endpoint. `wrangler.jsonc` is unchanged. |
| Tailwind v4 `@theme` tokens behave differently from arbitrary values. | Tokens are introduced in Phase 1 and verified visually before sections are ported. |

---

## Out of scope

Redesign, new copy, blog, CMS, contact form, tour dates, automated tests, CI. See spec §2.
