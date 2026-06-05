import { XMLParser } from "fast-xml-parser";

type FeedEntry = {
  title?: string;
  published?: string;
  link?: { href?: string; rel?: string } | { href?: string; rel?: string }[];
  "yt:videoId"?: string;
  videoId?: string;
};

export async function GET() {
  try {
    const rssUrl =
      "https://www.youtube.com/feeds/videos.xml?channel_id=UCPJbHYCqGDWiULG6dDE_Tzw";

    const response = await fetch(rssUrl, {
      // avoid stale cached responses while debugging
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch YouTube RSS feed");
    }

    const xml = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      removeNSPrefix: true,
    });

    const parsed = parser.parse(xml);

    const rawEntries = parsed?.feed?.entry ?? [];
    const entries: FeedEntry[] = Array.isArray(rawEntries)
      ? rawEntries
      : [rawEntries];

    const items = entries.slice(0, 5).map((entry: FeedEntry) => {
      const videoId = entry["yt:videoId"] || entry.videoId || "";

      const links = Array.isArray(entry.link)
        ? entry.link
        : entry.link
          ? [entry.link]
          : [];

      const url =
        links.find((l) => l.rel === "alternate")?.href ??
        links[0]?.href ??
        (videoId ? `https://www.youtube.com/watch?v=${videoId}` : "");

      return {
        id: videoId || crypto.randomUUID(),
        title: entry.title ?? "Untitled",
        publishedAt: entry.published,
        thumbnail: videoId
          ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
          : "",
        url,
      };
    });

    return new Response(JSON.stringify({ items, count: items.length }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ items: [], count: 0 }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }
}
