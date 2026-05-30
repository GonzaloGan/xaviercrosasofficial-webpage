import { XMLParser } from "fast-xml-parser";

export async function GET() {
  try {
    const rssUrl =
      "https://www.youtube.com/feeds/videos.xml?channel_id=UCPJbHYCqGDWiULG6dDE_Tzw";

    const response = await fetch(rssUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch YouTube RSS feed");
    }

    const xml = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
    });

    const parsed = parser.parse(xml);

    const entries = parsed?.feed?.entry ?? [];

    const items = (Array.isArray(entries) ? entries : [entries])
      .slice(0, 5)
      .map((entry: any) => ({
        id: entry["yt:videoId"],
        title: entry.title,
        publishedAt: entry.published,
        thumbnail: `https://i.ytimg.com/vi/${entry["yt:videoId"]}/hqdefault.jpg`,
        url: entry.link?.href,
      }));

    return new Response(JSON.stringify({ items }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=1800",
      },
    });
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        items: [],
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
