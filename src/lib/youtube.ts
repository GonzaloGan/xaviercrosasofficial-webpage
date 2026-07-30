import { XMLParser } from 'fast-xml-parser';

export type Video = {
  readonly id: string;
  readonly title: string;
  readonly publishedAt: string;
  readonly thumbnail: string;
  readonly url: string;
};

export const MAX_VIDEOS = 5;
export const UPSTREAM_TIMEOUT_MS = 5000;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  removeNSPrefix: true,
});

function asString(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim() !== '') return value.trim();
  if (typeof value === 'number') return String(value);
  return undefined;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function toArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  return value === undefined || value === null ? [] : [value];
}

/**
 * The feed is untrusted external input, so every field is checked rather than asserted.
 * Entries without a resolvable video id are dropped: a fabricated id renders a broken
 * link, which is worse than an absent card.
 */
function toVideo(raw: unknown): Video | undefined {
  const entry = asRecord(raw);
  if (!entry) return undefined;

  const id = asString(entry.videoId);
  const title = asString(entry.title);
  const publishedAt = asString(entry.published);
  if (!id || !title || !publishedAt) return undefined;

  return {
    id,
    title,
    publishedAt,
    thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    url: `https://www.youtube.com/watch?v=${id}`,
  };
}

/**
 * Reads the channel's public Atom feed. No API key is involved, so there is no secret
 * to leak; the channel id is configuration so the endpoint stays reusable.
 *
 * Throws on network failure, timeout, non-2xx, or unparseable XML. Callers decide the
 * fallback — see specs/001-astro-rework/contracts/youtube-latest.md.
 */
export async function fetchLatestVideos(channelId: string): Promise<Video[]> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;

  const response = await fetch(feedUrl, {
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`YouTube feed responded with ${response.status}`);
  }

  const parsed: unknown = parser.parse(await response.text());
  const feed = asRecord(asRecord(parsed)?.feed);

  return toArray(feed?.entry)
    .map(toVideo)
    .filter((video): video is Video => video !== undefined)
    .slice(0, MAX_VIDEOS);
}
