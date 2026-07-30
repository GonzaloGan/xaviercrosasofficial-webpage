# Contract — `GET /api/youtube-latest`

**Feature:** 001-astro-rework
**Status:** replaces the existing implementation in `src/pages/api/youtube-latest.ts`.

Returns the most recent uploads for the artist's YouTube channel, derived from the channel's
public Atom feed. This is the only server-rendered route on the site.

---

## Request

```
GET /api/youtube-latest
```

No parameters. No authentication. The channel is fixed per deployment.

A `channelId` query parameter is **deliberately not accepted** — it would turn the endpoint into an
open proxy that any third party could use to make requests from this origin.

---

## Configuration

| Variable | Required | Description |
|---|---|---|
| `YOUTUBE_CHANNEL_ID` | yes | Channel to read. Production value: `UCPJbHYCqGDWiULG6dDE_Tzw`. |

Read through Astro's environment access, not `process.env` directly — the Cloudflare Workers
runtime does not provide Node's `process`. Absence of the variable is a startup-time failure, not a
silent fallback to a hardcoded id.

Constants: `MAX_VIDEOS = 5`, `UPSTREAM_TIMEOUT_MS = 5000`.

---

## Response — 200

```jsonc
{
  "items": [
    {
      "id": "xDuBDXz9_2Q",
      "title": "When Did I Grow Up",
      "publishedAt": "2026-01-14T18:00:00+00:00",
      "thumbnail": "https://i.ytimg.com/vi/xDuBDXz9_2Q/hqdefault.jpg",
      "url": "https://www.youtube.com/watch?v=xDuBDXz9_2Q"
    }
  ],
  "count": 1
}
```

- `items` — at most `MAX_VIDEOS`, ordered newest first as supplied by the feed.
- `count` — `items.length`. Present for convenience; callers must not rely on it exceeding
  `items.length`.
- Every field is non-empty. Feed entries without a resolvable video id are **dropped**, not
  emitted with a generated id — a fabricated id produces a broken link, which is worse than an
  absent card.

### Headers

```
Content-Type: application/json; charset=utf-8
Cache-Control: public, max-age=0, s-maxage=1800, stale-while-revalidate=86400
```

- `max-age=0` — the browser always revalidates, so a visitor never sees a stale list from their own
  cache.
- `s-maxage=1800` — Cloudflare serves from the edge for 30 minutes. New uploads appear within half
  an hour; YouTube is contacted at most twice an hour per edge location instead of once per visitor.
- `stale-while-revalidate=86400` — if YouTube is down, the edge keeps serving the last good response
  for up to a day while retrying in the background.

This directly replaces the `Cache-Control: no-store` shipped today (defect D-5).

---

## Response — 502 Bad Gateway

Returned when the upstream feed cannot be fetched, times out, or cannot be parsed.

```jsonc
{
  "items": [],
  "count": 0,
  "error": "upstream_unavailable"
}
```

```
Cache-Control: no-store
```

The current implementation returns **200** with an empty list on failure, making an outage
indistinguishable from a channel with no videos. An honest status lets the edge avoid caching the
failure and lets the caller choose its fallback.

`error` is a stable machine-readable token. Upstream error details are logged server-side and never
returned to the client.

---

## Caller behaviour

The videos section calls this during server rendering. On a non-200 or a malformed payload it
renders the localised `videos.empty` message. A failure here never prevents the rest of the page
from rendering (spec US-4).

---

## Upstream

```
https://www.youtube.com/feeds/videos.xml?channel_id={YOUTUBE_CHANNEL_ID}
```

- Public Atom feed. No API key, no quota, therefore no secret to leak.
- Fetched with `signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)`.
- The outbound `cache: "no-store"` currently present is removed; the runtime may reuse a fresh
  response.
- Parsed with `fast-xml-parser` (`removeNSPrefix: true`), then mapped into the shape above. The
  parsed object is treated as untrusted input: each field is checked before use rather than being
  asserted with `any`.

---

## Security notes

- No user input reaches the upstream URL, so no request-forgery surface is introduced.
- `compatibility_flags: ["global_fetch_strictly_public"]` in `wrangler.jsonc` already prevents the
  Worker from reaching internal addresses.
- Titles from the feed are interpolated as text content, never as HTML.

---

## Verification

| Check | Expectation |
|---|---|
| `curl -i /api/youtube-latest` | 200, ≤ 5 items, every item has a non-empty `id` and `url`. |
| Two consecutive requests to the deployed URL | Second shows a Cloudflare cache hit. |
| Unset `YOUTUBE_CHANNEL_ID` | Build or startup fails loudly; no fallback to a literal id. |
| Simulated upstream failure | 502 with `error: "upstream_unavailable"` and `Cache-Control: no-store`. |
| Page render with the endpoint failing | Videos section shows the localised empty state; page otherwise intact. |
