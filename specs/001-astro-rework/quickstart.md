# Quickstart

**Feature:** 001-astro-rework

**Implementation status:** Completed on 2026-07-30 (see [tasks.md](./tasks.md)).

Everything needed to run, change and ship this site.

---

## Prerequisites

- Node ≥ 22.12.0 (enforced by `engines` in `package.json`)
- npm
- A Cloudflare account with Wrangler authenticated, for deployment only

---

## Commands

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies. |
| `npm run dev` | Dev server on http://localhost:4321 with HMR. |
| `npm run build` | Production build into `dist/`. Content schema violations fail here. |
| `npm run preview` | Builds, then serves through `wrangler dev` — the closest match to production, including the Worker route. |
| `npm run deploy` | Builds and deploys to Cloudflare. |
| `npm run generate-types` | Regenerate Cloudflare binding types after changing `wrangler.jsonc`. |

Use `npm run preview` rather than `npm run dev` when testing `/api/youtube-latest` caching —
cache headers only behave correctly in the Workers runtime.

---

## Environment

Create `.env` in the project root for local development:

```
YOUTUBE_CHANNEL_ID=UC_REPLACE_WITH_XAVIERCROSASOFFICIAL_CHANNEL_ID
```

For production API requests, set it as a Worker secret:

```
npx wrangler secret put YOUTUBE_CHANNEL_ID
```

Optional fallback: bind a KV namespace as `SECRETS_KV` in `wrangler.jsonc` and store the key
`YOUTUBE_CHANNEL_ID` there. The endpoint checks Worker secret first, then KV.

KV fallback setup (optional):

```
npx wrangler kv namespace create SECRETS_KV
npx wrangler kv namespace create SECRETS_KV --preview
```

Copy the returned namespace ids into `wrangler.jsonc`:

- `kv_namespaces[0].id`
- `kv_namespaces[0].preview_id`

Then write the value:

```
npx wrangler kv key put --binding=SECRETS_KV YOUTUBE_CHANNEL_ID "UC..."
```

Note: the homepage videos section is prerendered at build time, so your build environment must also
provide `YOUTUBE_CHANNEL_ID` (for example via `.env`) when generating `dist/`.

The channel id is public information, but keeping it in configuration means the endpoint is
reusable and the value is changeable without a code edit. `.env` must remain untracked.

---

## Routes

| URL | Rendering | Content |
|---|---|---|
| `/` | prerendered | English |
| `/es/` | prerendered | Spanish |
| `/ca/` | prerendered | Catalan |
| `/nl/` | prerendered | Dutch |
| `/api/youtube-latest` | server, edge-cached 30 min | latest 5 uploads |
| `/sitemap-index.xml` | build-time | all locales with `hreflang` |

---

## Common tasks

### Add a release

1. Put the cover art in `src/assets/images/`.
2. Add `src/content/releases/<slug>.md` — frontmatter shape is in
   [contracts/content-collections.md](./contracts/content-collections.md).
3. `npm run build`.

No component is edited. If the build fails it will name the file and the field.

### Change interface wording

Edit `src/i18n/ui.ts`. Add a key to `en` first — TypeScript will then require it in `es`, `ca` and
`nl`.

### Change the biography

Edit `src/content/bio/<locale>.md`. Prose goes in the body, not in frontmatter.

### Add a language

1. Add the code to `locales` in `astro.config.mjs` and to the `Locale` union in `src/i18n/utils.ts`.
2. Add its dictionary to `src/i18n/ui.ts` — the compiler lists what is missing.
3. Add `src/content/bio/<locale>.md`.
4. Add the locale to every release's `coverAlt`.

Steps 2–4 are enforced by the type system and the content schemas; skipping one fails the build.

### Change the palette

Edit the `@theme` block in `src/styles/global.css`. Do not reintroduce hex literals in components.

### Enable or disable the temporary album banner

Edit `src/data/site.ts` and update `site.promoBanner.enabled`.

- `true` keeps the banner visible on the homepage.
- `false` hides it without component edits.

You can also change campaign metadata in the same object:

- `site.promoBanner.albumTitle`
- `site.promoBanner.spotifyUrl`

---

## Verification checklist

Run before every deploy. Full criteria in [spec.md](./spec.md) §7.

1. `npm run build` — no errors, no new warnings.
2. `dist/` contains `index.html`, `es/index.html`, `ca/index.html`, `nl/index.html`.
3. Open `dist/index.html` in an editor — the hero title, biography and all release titles are
   present as text.
4. Disable JavaScript in the browser and load the site: fully readable and navigable.
5. DevTools → Network: no React chunk; first-party JS ≤ 10 KB.
6. `curl -i http://localhost:8787/api/youtube-latest` twice under `npm run preview` — the second
   response is served from cache.
7. Tab through the page: skip link first, visible focus everywhere, mobile menu traps focus and
   closes on `Escape`.
8. `dist/sitemap-index.xml` contains all four locales and no `example.com`.

---

## Where things live

| Looking for | File |
|---|---|
| Rules every change must follow | `.specify/memory/constitution.md` |
| What the site must do | `specs/001-astro-rework/spec.md` |
| Why the old code was replaced | `specs/001-astro-rework/research.md` |
| Entity shapes | `specs/001-astro-rework/data-model.md` |
| Frontmatter reference | `specs/001-astro-rework/contracts/content-collections.md` |
| Endpoint behaviour | `specs/001-astro-rework/contracts/youtube-latest.md` |
| Remaining work | `specs/001-astro-rework/tasks.md` |

---

## Troubleshooting

**Build fails naming a content file** — frontmatter does not match the schema. Compare against the
contract; the message names the field.

**A locale renders `undefined`** — a key is missing from `src/i18n/ui.ts`. It should have been a
compile error; check that the dictionary still uses `as const satisfies`.

**Videos section is empty** — the endpoint returned non-200. Check `YOUTUBE_CHANNEL_ID` is set. An
empty section is the designed fallback, not a crash.

**Cache headers look wrong in `npm run dev`** — expected. Verify with `npm run preview`.
