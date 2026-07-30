import type { APIRoute } from 'astro';
import { YOUTUBE_CHANNEL_ID } from 'astro:env/server';
import { fetchLatestVideos } from '../../lib/youtube';

// Live data: this is the one route that is not prerendered.
export const prerender = false;

/** 30 minutes at the edge, with a day of stale-while-revalidate insurance. */
const CACHE_CONTROL = 'public, max-age=0, s-maxage=1800, stale-while-revalidate=86400';

export const GET: APIRoute = async () => {
  try {
    const items = await fetchLatestVideos(YOUTUBE_CHANNEL_ID);

    return new Response(JSON.stringify({ items, count: items.length }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': CACHE_CONTROL,
      },
    });
  } catch (error) {
    // Logged server-side; the client gets a stable token, never upstream details.
    console.error('[youtube-latest] upstream failure:', error);

    return new Response(JSON.stringify({ items: [], count: 0, error: 'upstream_unavailable' }), {
      status: 502,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  }
};
