# AGENTS.md

Context for any AI agent or new contributor working in this repository.

## What this is

The official website of **Xavier Crosas**, a singer-songwriter. A four-language (EN / ES / CA / NL)
content site built with **Astro 6**, styled with **Tailwind CSS v4**, deployed to **Cloudflare
Workers** via Wrangler.

It is a brochure site, not an application. No accounts, no database, no mutable state.

## Read these first

| File | Why |
|---|---|
| `.specify/memory/constitution.md` | Non-negotiable rules. Highest authority in the repo. |
| `specs/001-astro-rework/spec.md` | What the site must do, and the acceptance criteria. |
| `specs/001-astro-rework/research.md` | Why the previous implementation was replaced. Do not reintroduce those patterns. |
| `specs/001-astro-rework/quickstart.md` | Commands, environment, common tasks. |
| `specs/001-astro-rework/contracts/` | Content frontmatter and the API contract. |

## The short version of the rules

1. **No JavaScript unless the interaction requires it.** `.astro` first, `<script>` second, a UI
   framework only with written justification. Budget: 10 KB of first-party JS per page.
2. **Content goes in `src/content/` or `src/i18n/`, never inline in a component.** Adding a release
   must not require editing an `.astro` file.
3. **Every page exports `prerender = true`.** The only server route is `/api/youtube-latest`.
4. **Languages are URLs** (`/`, `/es/`, `/ca/`, `/nl/`), not React state. A feature that only works
   in English is not finished.
5. **No `any`, no hardcoded hex colours, no secrets in source.** Colours are `@theme` tokens in
   `src/styles/global.css`.
6. **Images go through `astro:assets` `<Image />`** with real alt text.
7. **Unused dependencies get removed.**

## Layout

```
src/
  content.config.ts     Zod schemas for content collections
  content/              releases/*.md, bio/{en,es,ca,nl}.md
  data/site.ts          artist name, email, social URLs
  i18n/                 ui.ts (typed dictionaries), utils.ts (helpers)
  layouts/              BaseLayout.astro — document shell, SEO, hreflang
  components/           Header, Footer, LanguageSwitcher, icons/, sections/
  pages/                index.astro (en), [lang]/index.astro, api/youtube-latest.ts
  styles/global.css     Tailwind entry + @theme tokens
```

## Commands

```
npm run dev       # localhost:4321
npm run build     # dist/ — content schema errors surface here
npm run preview   # build + wrangler dev, use this to test the API and cache headers
npm run deploy    # build + wrangler deploy
```

Requires Node ≥ 22.12.0 and `YOUTUBE_CHANNEL_ID` in `.env`.

## Before you say you are done

- `npm run build` is clean.
- The feature's text is visible in `dist/*.html` without running JavaScript.
- It works in all four locales.
- Anything interactive is keyboard-operable with a visible focus ring.

## History worth knowing

The site was originally one 515-line React component mounted outside the `<html>` element with
`client:visible`, so nothing rendered without JavaScript and three of the four languages had no
URL. That was replaced by `specs/001-astro-rework`. If a change starts trending back toward "put it
all in one component and hydrate it", it is going the wrong way.
