---
applyTo: '**'
---

# Copilot instructions — xaviercrosasofficial-webpage

Astro 6 + Tailwind v4 artist site, four locales (en/es/ca/nl), deployed to Cloudflare Workers.

**Authoritative context:** `.specify/memory/constitution.md`, then `specs/001-astro-rework/`.
Read `AGENTS.md` for the orientation summary. When guidance conflicts, the constitution wins.

## Rules

- Write `.astro` components. Do not add React or any UI framework — it was deliberately removed.
  Interactivity is a plain `<script>` tag. First-party JS budget is 10 KB per page.
- Every page exports `const prerender = true`. `/api/youtube-latest` is the only server route.
- Never hardcode copy, release data, or social URLs in a component. They belong in
  `src/content/**`, `src/i18n/ui.ts`, or `src/data/site.ts`.
- Never hardcode colours. Use the `@theme` tokens in `src/styles/global.css`.
- Never use `any`. Validate external data at the boundary; content is validated by Zod in
  `src/content.config.ts`.
- Locales are routes (`/`, `/es/`, `/ca/`, `/nl/`), not state. Any user-visible string change must
  be made in all four dictionaries — the types enforce this.
- Images use `<Image />` from `astro:assets` with meaningful, per-locale alt text.
- External links carry `target="_blank" rel="noopener noreferrer"`.
- Configuration and secrets come from environment variables, not literals.

## Definition of done

`npm run build` is clean, the content renders in `dist/` HTML without JavaScript, all four locales
work, and anything interactive is keyboard-operable.
