import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { fetchLatestVideos } from '../../lib/youtube';

// Live data: this is the one route that is not prerendered.
export const prerender = false;

/** 30 minutes at the edge, with a day of stale-while-revalidate insurance. */
const CACHE_CONTROL = 'public, max-age=0, s-maxage=1800, stale-while-revalidate=86400';

const YOUTUBE_CHANNEL_ID_KEY = 'YOUTUBE_CHANNEL_ID';

type SecretsKvBinding = {
  get(key: string): Promise<string | null>;
};

type WorkerRuntimeEnv = {
  YOUTUBE_CHANNEL_ID?: string;
  SECRETS_KV?: SecretsKvBinding;
};

async function resolveChannelId(): Promise<string | undefined> {
  const runtimeEnv = env as WorkerRuntimeEnv;
  const secret = runtimeEnv.YOUTUBE_CHANNEL_ID?.trim();
  if (secret) return secret;

  const kvValue = await runtimeEnv.SECRETS_KV?.get(YOUTUBE_CHANNEL_ID_KEY);
  const channelId = kvValue?.trim();
  return channelId || undefined;
}

export const GET: APIRoute = async () => {
  const channelId = await resolveChannelId();

  if (!channelId) {
    return new Response(JSON.stringify({ items: [], count: 0, error: 'missing_channel_id' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  }

  try {
    const items = await fetchLatestVideos(channelId);

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
