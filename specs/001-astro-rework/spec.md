# Feature Specification — Idiomatic Astro Rework

**Feature branch:** `001-astro-rework`
**Created:** 2026-07-30
**Status:** Implemented
**Input:** "This project is a blog created with astro.build, using vibe code, it ended as shit …
we need to rework it to use astro.build properly."

---

## 1. Problem statement

The site currently renders as a single React component (`ArtistPortfolioStarter.tsx`, ~515 lines)
mounted into an Astro page. The consequences, all verified in the codebase:

- The component is mounted **outside the `</html>` tag**, so the document structure is invalid.
- Nothing renders without JavaScript. Search engines and social scrapers see an empty shell.
- Only one URL exists. Spanish, Catalan and Dutch content is unreachable and unindexable.
- All copy, all release metadata and all links are hardcoded inside the component.
- `site` in the Astro config is still `https://example.com`, so the sitemap is wrong.
- The YouTube endpoint refuses to cache, calling YouTube once per visitor.

The site's job — be found when someone searches the artist's name, and let them hear the music in
one tap — is not currently being done.

---

## 2. Scope

### In scope

- Rebuilding the page as prerendered Astro components.
- Moving all content into Content Layer collections and typed i18n dictionaries.
- Real localised routes for the four existing languages.
- Hardening and caching the YouTube endpoint.
- SEO metadata, structured data, sitemap, accessibility.
- Removing React and the unused dependency surface.

### Out of scope

- New content, new copy or new artwork. Existing content is migrated verbatim.
- Visual redesign. The current dark aesthetic is preserved.
- A blog, a CMS, tour dates, a merch store, or a contact form. Contact stays `mailto:`.
- Automated tests and CI. Verification is manual, per §7.

---

## 3. User scenarios

### US-1 — Discovery via search (priority: highest)

A listener searches "Xavier Crosas" and finds the site.

- **Given** a crawler requests any page **When** the response is received **Then** the artist name,
  hero statement, biography and all release titles are present in the HTML body without executing
  JavaScript.
- **Given** a crawler requests `/es/` **Then** it receives Spanish content at a Spanish URL, with
  `hreflang` alternates pointing at the other three locales.
- **Given** any page **Then** `sitemap-index.xml` lists it under the real production domain.

### US-2 — Listening in one tap (priority: highest)

A visitor arrives from an Instagram link on a phone and wants to hear a song.

- **Given** the homepage **Then** a primary "Listen" action links to the artist's Spotify profile
  and is visible without scrolling on a 390 px viewport.
- **Given** the music section **Then** every release shows its cover, title, credits and a
  streaming link.
- **Given** any external link **Then** it opens in a new tab with `rel="noopener noreferrer"`.

### US-3 — Reading in one's own language (priority: high)

A Dutch-speaking visitor in Roermond wants the site in Dutch.

- **Given** any page **Then** a language switcher offers EN, ES, CA, NL as links, marking the
  current one.
- **Given** the visitor picks NL **Then** the URL becomes `/nl/…`, is shareable, and reloads to the
  same language.
- **Given** a locale is selected **Then** every string on the page is in that locale — navigation,
  headings, body copy, and date formatting.

### US-4 — Seeing the newest video (priority: medium)

A returning fan wants the latest YouTube upload.

- **Given** the videos section **Then** up to five most recent videos appear with thumbnail, title
  and publication date, present in the initial HTML.
- **Given** the YouTube feed is unavailable **Then** the section shows a localised empty state and
  the rest of the page is unaffected.
- **Given** repeated visits within the cache window **Then** the site does not re-fetch YouTube per
  visitor.

### US-5 — Publishing a release (priority: medium)

The artist releases a new single.

- **Given** a new Markdown file in `src/content/releases/` **When** the site is rebuilt **Then**
  the release appears in the music section in all four locales with no code change.
- **Given** a release file with a missing or malformed field **Then** the build fails with a message
  naming the file and the field.

### US-6 — Keyboard and screen-reader use (priority: medium)

- **Given** a keyboard-only visitor **Then** a skip link is the first focusable element and every
  control has a visible focus indicator.
- **Given** the mobile menu is open **Then** focus is trapped inside it and `Escape` closes it,
  returning focus to the toggle.

---

## 4. Functional requirements

| ID | Requirement |
|----|-------------|
| FR-01 | Every page is prerendered to static HTML at build time. |
| FR-02 | The document has exactly one valid `<html>` root; no content is emitted outside it. |
| FR-03 | Locales `en`, `es`, `ca`, `nl` are served at `/`, `/es/`, `/ca/`, `/nl/`. |
| FR-04 | Every page emits canonical, `hreflang` (4 locales + `x-default`), Open Graph and Twitter tags. |
| FR-05 | Release data is a validated content collection; the music section iterates it. |
| FR-06 | Biography text is a per-locale content entry rendered from Markdown. |
| FR-07 | UI strings are a typed dictionary; a missing key is a compile-time error. |
| FR-08 | Images render through `astro:assets` with explicit dimensions and meaningful `alt`. |
| FR-09 | `GET /api/youtube-latest` returns at most 5 videos and sets a shared-cache header. |
| FR-10 | The YouTube channel ID is read from an environment variable. |
| FR-11 | The videos section renders server-side; no client fetch, no loading skeleton. |
| FR-12 | A `MusicGroup` JSON-LD block describes the artist and links its official profiles. |
| FR-13 | The mobile menu and language switcher work without a UI framework. |
| FR-14 | `react`, `react-dom`, `@astrojs/react` and `react-icons` are removed from the manifest. |
| FR-15 | Colour and spacing values are design tokens, not literals repeated across files. |

---

## 5. Non-functional requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | First-party JavaScript ≤ 10 KB uncompressed per page. |
| NFR-02 | Lighthouse: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100 (mobile). |
| NFR-03 | The site remains fully readable with JavaScript disabled. |
| NFR-04 | The build produces no TypeScript errors under `astro/tsconfigs/strict`. |
| NFR-05 | Deployment target and command are unchanged: `npm run deploy` to Cloudflare. |

---

## 6. Key entities

Detailed in [data-model.md](./data-model.md).

- **Release** — a published song or album: title, cover, year, credits, streaming links.
- **BioEntry** — the artist biography for one locale, authored as Markdown.
- **SiteProfile** — name, email, location, role, social profile URLs, YouTube channel ID.
- **UIDictionary** — the set of interface strings for one locale.
- **Video** — a YouTube upload derived at request time from the channel's public RSS feed.

---

## 7. Acceptance criteria

The feature is accepted when all of the following are demonstrated:

1. `npm run build` succeeds; `dist/` contains `index.html`, `es/index.html`, `ca/index.html`,
   `nl/index.html`.
2. `curl` on the deployed root returns HTML containing the hero title, the biography and all three
   release titles.
3. The page is fully readable and navigable with JavaScript disabled in the browser.
4. DevTools shows no React chunk; total script transfer is within NFR-01.
5. Two consecutive requests to `/api/youtube-latest` show the second served from cache.
6. `sitemap-index.xml` contains all four locales and no `example.com`.
7. Adding a Markdown file to `src/content/releases/` and rebuilding shows a fourth release,
   with no `.astro` file modified.
8. Keyboard-only traversal reaches every link and control; the mobile menu traps focus and closes
   on `Escape`.
9. `ArtistPortfolioStarter.tsx` no longer exists and no React package remains in `package.json`.

---

## 8. Assumptions

- The production domain is `https://www.xaviercrosasofficial.com`. If it differs, `site` in
  `astro.config.mjs` and this spec are updated together.
- English is the default locale and is served without a path prefix.
- The YouTube channel RSS feed remains publicly accessible and requires no API key.
- Existing artwork in `src/assets/images/` is the licensed, final artwork.

---

## 9. Implementation record

- Implemented on 2026-07-30.
- Acceptance checklist in §7 completed.
- Task checklist is fully complete in [tasks.md](./tasks.md).
