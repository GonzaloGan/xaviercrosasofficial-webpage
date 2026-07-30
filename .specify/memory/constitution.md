# Project Constitution — xaviercrosasofficial-webpage

**Version:** 1.0.0
**Ratified:** 2026-07-30
**Applies to:** every change made to this repository, by a human or by an AI agent.

This document is the highest-authority context in the repo. When a spec, a plan, a task or a
prompt conflicts with this constitution, **the constitution wins** and the conflicting document
must be amended.

---

## Context

This is the official website of **Xavier Crosas**, a singer-songwriter. It is a small,
content-driven marketing site in four languages (EN / ES / CA / NL) built with **Astro 6** and
deployed to **Cloudflare Workers**.

It is not an application. It has no users, no accounts, no database, no mutable state. Any
proposal that introduces those things must justify itself against Principle I.

---

## Principle I — Zero JavaScript by default

Astro's entire value proposition is that it ships HTML, not a runtime. This project previously
shipped a full React runtime to render static text, which is the failure mode this principle
exists to prevent.

**Rules**

1. A component is written as `.astro` unless it demonstrably requires client-side interactivity.
2. Client-side interactivity is implemented with a plain `<script>` tag in an `.astro` file
   before a UI framework is considered.
3. A UI framework island (`client:*`) requires a written justification in the feature's `plan.md`
   naming the specific interaction that cannot be done otherwise.
4. The homepage must render its full text content — hero, bio, releases, navigation — in the
   initial HTML response. "View source" is the acceptance test.
5. Total first-party JavaScript on any page has a hard budget of **10 KB** uncompressed.

**Rationale:** the audience arrives from Instagram and YouTube links on mobile networks. Text that
requires hydration to appear is text that search engines and slow connections do not get.

---

## Principle II — Content lives in content, not in code

**Rules**

1. Artist copy, biography text, release metadata and social links live in
   `src/content/**` (Content Layer collections) or `src/i18n/**` (UI strings) — never inline in a
   component.
2. Every collection has a Zod schema in `src/content.config.ts`. Content that does not validate
   fails the build.
3. Adding a new release must require **zero** changes to `.astro` files.
4. Repeated markup is a loop over a collection, not a copy-paste. Three near-identical
   `<article>` blocks is a defect, not a style choice.

**Rationale:** the artist should be able to publish a single, without a developer and without a
merge conflict in a 500-line component.

---

## Principle III — Static by default, dynamic by exception

**Rules**

1. `export const prerender = true` on every page. The Cloudflare adapter renders on-demand
   otherwise, which is a runtime cost for content that changes a few times a year.
2. Server-rendered routes are limited to endpoints that must read live third-party data.
3. Any server route must set an explicit `Cache-Control` header. `no-store` is only acceptable
   for responses that are genuinely per-request; on this site none are.
4. Any outbound `fetch` from the server has a timeout (`AbortSignal.timeout`) and a defined
   failure response. A hung upstream must not hang the Worker.

---

## Principle IV — Localisation is routing, not state

**Rules**

1. Each language is a real, crawlable URL: `/`, `/es/`, `/ca/`, `/nl/`.
2. Language selection is a set of `<a>` links, not a React state variable.
3. Every page emits `<html lang>`, `rel="alternate" hreflang` for all four locales plus
   `x-default`, and a canonical URL.
4. UI strings are typed. `Record<Lang, any>` is forbidden — the English dictionary is the source
   of truth for the key type, so a missing translation is a compile error.
5. All four locales are equal citizens. A feature is not done when it works in English only.

**Rationale:** the previous client-side toggle meant Google only ever saw English, and no
Spanish, Catalan or Dutch URL could ever be shared or ranked.

---

## Principle V — Accessible, indexable, honest HTML

**Rules**

1. Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`) with an `h1` per page and no
   skipped heading levels.
2. Every image has meaningful `alt`. Decorative images use `alt=""`. "Featured release" repeated
   on three different covers is not meaningful.
3. Every `target="_blank"` link carries `rel="noopener noreferrer"`.
4. Interactive elements are reachable and operable by keyboard, with a visible focus ring. Any
   overlay traps focus and closes on `Escape`.
5. Every page has `<title>`, `<meta name="description">`, Open Graph and Twitter card tags.
6. Images are served through `astro:assets` with explicit dimensions. No raw `<img src={asset.src}>`.

---

## Principle VI — Types are load-bearing

**Rules**

1. `astro/tsconfigs/strict` stays. It is not relaxed to make an error go away.
2. `any` is banned in first-party code. External payloads are parsed into a validated shape at
   the boundary.
3. Magic values — colours, limits, IDs, URLs — become named tokens, config, or environment
   variables. `#0b0b0d` appearing in nine files is a defect.
4. Secrets and deployment-specific values come from environment variables, never from a literal
   in a source file.

---

## Principle VII — Dependencies earn their place

**Rules**

1. A dependency that is installed but unused is removed. Unused code is misleading context for
   the next agent.
2. Adding a dependency requires naming what it does that the platform cannot.
3. Icons are inlined SVG. A 5 MB icon library to render nine glyphs is not a trade worth making.

---

## Definition of Done

A change is complete only when all of the following hold:

- `npm run build` completes with no errors and no new warnings.
- The rendered HTML in `dist/` contains the feature's text content without executing JavaScript.
- The feature works in all four locales.
- No new `any`, no new hardcoded colour, no new inline content string.
- Keyboard-only operation verified for anything interactive.
- JS budget (Principle I.5) still met.

---

## Amendment procedure

1. Open a change describing the principle, the reason, and the migration for existing code.
2. Bump the version: MAJOR for removing or reversing a principle, MINOR for adding one, PATCH for
   clarification.
3. Update every affected document under `specs/` in the same change.
