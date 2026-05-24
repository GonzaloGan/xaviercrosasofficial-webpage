// ASTRO IMPLEMENTATION NOTES
// --------------------------------------------------
// This component is intended to be used INSIDE an Astro project.
// Recommended stack:
// - Astro
// - Tailwind CSS
// - React integration (@astrojs/react)
// - Static deployment on Cloudflare Pages or GitHub Pages
//
// Suggested structure:
//
// /src
//   /components
//      ArtistPortfolioStarter.tsx
//   /pages
//      index.astro
//   /content
//      /releases
//      /posts
//      /shows
//   /i18n
//      en.json
//      es.json
//      ca.json
//      nl.json
//   /pages/api
//      youtube-latest.ts
//
// Install:
// npm create astro@latest
// npx astro add react tailwind
//
// index.astro example:
// ---
// import ArtistPortfolioStarter from '../components/ArtistPortfolioStarter';
// ---
//
// <html lang="en">
//   <body>
//     <ArtistPortfolioStarter client:load />
//   </body>
// </html>
//
// YouTube API route:
// Create a serverless endpoint that fetches the latest uploads
// from your channel using the YouTube Data API v3.
//
// Why Astro here:
// - static-first and cheap hosting
// - excellent multilingual routing
// - easy Markdown content collections
// - fast performance for media-heavy artist websites
// - React only where needed
// --------------------------------------------------

import React, { useEffect, useMemo, useState } from "react";

// Generic utility icons (from Feather Icons pack)
import { FiArrowUpRight, FiMail, FiPlay, FiMenu, FiMusic, FiDisc } from "react-icons/fi";

// Feather Icons pack does not have sparkles so Heroicons 2
import { HiOutlineSparkles } from "react-icons/hi2";

// Social media icons (from Font Awesome 6 pack)
import { FaInstagram, FaYoutube, FaXTwitter } from "react-icons/fa6";

import '../styles/global.css'

// Single-file starter for a music portfolio website.
// Replace the placeholders in `site` with your branding, images, links, and content.

type Lang = "en" | "es" | "ca" | "nl";

type Video = {
  id: string;
  title: string;
  publishedAt?: string;
  thumbnail?: string;
  url?: string;
};

const site = {
  name: "Xavier Crosas",
  role: "Artist / Composer / Performer",
  location: "Roermond · Remote",
  email: "hello@yourdomain.com",
  instagram: "https://instagram.com/xaviercrosasofficial",
  youtube: "https://youtube.com/@XavierCrosasOFFICIAL",
  spotify: "https://open.spotify.com/artist/6PaPHlXXxfowSsJdvdxyke",
  heroImage:
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1800&q=80",
  secondaryImage:
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1600&q=80",
  channelId: "UCxxxxxxxxxxxxxxxxxxxxxx",
  // Add the API route in your Astro / Next / serverless setup:
  // GET /api/youtube-latest?channelId=...
};

const copy: Record<Lang, any> = {
  en: {
    nav: ["Home", "Music", "Videos", "About", "Contact"],
    heroKicker: "Artist portfolio",
    heroTitle: "Music that feels visual, intimate, and built to last.",
    heroBody:
      "A clean, editorial portfolio for an artist brand — minimal, striking, multilingual, and easy to update.",
    heroPrimary: "Listen",
    heroSecondary: "View videos",
    featured: "Featured release",
    latestVideos: "Latest videos",
    aboutTitle: "About",
    aboutBody:
      "Use this section for a short bio, your sound, your live setup, and the story behind your project. Keep it concise and personal.",
    languages: "Languages",
    contactTitle: "Contact",
    contactBody: "Bookings, press, collaborations, and commissions.",
    footer: "Built for artists who want a strong brand without heavy maintenance.",
    videoEmpty: "Your latest five YouTube videos will appear here.",
    cta: "Open for bookings and collaborations",
  },
  es: {
    nav: ["Inicio", "Música", "Vídeos", "Bio", "Contacto"],
    heroKicker: "Portfolio artístico",
    heroTitle: "Música con presencia visual, cercana y pensada para durar.",
    heroBody:
      "Un portfolio editorial para una marca artística: minimalista, potente, multilingüe y fácil de actualizar.",
    heroPrimary: "Escuchar",
    heroSecondary: "Ver vídeos",
    featured: "Lanzamiento destacado",
    latestVideos: "Últimos vídeos",
    aboutTitle: "Bio",
    aboutBody:
      "Usa esta sección para una biografía breve, tu sonido, tu directo y la historia del proyecto. Mejor corto y personal.",
    languages: "Idiomas",
    contactTitle: "Contacto",
    contactBody: "Bookings, prensa, colaboraciones y encargos.",
    footer: "Pensado para artistas que quieren una marca fuerte con poco mantenimiento.",
    videoEmpty: "Aquí aparecerán tus cinco últimos vídeos de YouTube.",
    cta: "Disponible para bookings y colaboraciones",
  },
  ca: {
    nav: ["Inici", "Música", "Vídeos", "Bio", "Contacte"],
    heroKicker: "Portfoli d’artista",
    heroTitle: "Música amb presència visual, propera i pensada per durar.",
    heroBody:
      "Un portfoli editorial per a una marca artística: minimalista, potent, multilingüe i fàcil d’actualitzar.",
    heroPrimary: "Escoltar",
    heroSecondary: "Veure vídeos",
    featured: "Publicació destacada",
    latestVideos: "Últims vídeos",
    aboutTitle: "Bio",
    aboutBody:
      "Fes servir aquest espai per a una biografia breu, el teu so, el directe i la història del projecte. Millor curt i personal.",
    languages: "Idiomes",
    contactTitle: "Contacte",
    contactBody: "Bookings, premsa, col·laboracions i encàrrecs.",
    footer: "Pensat per a artistes que volen una marca forta amb poc manteniment.",
    videoEmpty: "Aquí apareixeran els teus cinc últims vídeos de YouTube.",
    cta: "Disponible per a bookings i col·laboracions",
  },
  nl: {
    nav: ["Home", "Muziek", "Video’s", "Bio", "Contact"],
    heroKicker: "Artiestenportfolio",
    heroTitle: "Muziek met visuele kracht, dichtbij en ontworpen om lang mee te gaan.",
    heroBody:
      "Een editorial portfolio voor een artiestenmerk: minimalistisch, sterk, meertalig en eenvoudig te beheren.",
    heroPrimary: "Luisteren",
    heroSecondary: "Video’s bekijken",
    featured: "Uitgelichte release",
    latestVideos: "Laatste video’s",
    aboutTitle: "Bio",
    aboutBody:
      "Gebruik dit deel voor een korte bio, je sound, je live setup en het verhaal achter je project. Kort en persoonlijk werkt het best.",
    languages: "Talen",
    contactTitle: "Contact",
    contactBody: "Boekingen, pers, samenwerkingen en commissions.",
    footer: "Gemaakt voor artiesten die een sterk merk willen zonder veel onderhoud.",
    videoEmpty: "Hier verschijnen je laatste vijf YouTube-video’s.",
    cta: "Beschikbaar voor boekingen en samenwerkingen",
  },
};

const languageLabels: Record<Lang, string> = {
  en: "EN",
  es: "ES",
  ca: "CA",
  nl: "NL",
};

function formatDate(date?: string, lang: Lang = "en") {
  if (!date) return "";
  const d = new Date(date);
  return new Intl.DateTimeFormat(lang, { year: "numeric", month: "short", day: "numeric" }).format(d);
}

export default function ArtistPortfolioStarter() {
  const [lang, setLang] = useState<Lang>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const t = copy[lang];

  useEffect(() => {
    let alive = true;

    async function loadVideos() {
      try {
        setLoadingVideos(true);
        // Replace this endpoint with your own backend route.
        // On a static site, use a serverless function to call the YouTube Data API.
        const res = await fetch(`/api/youtube-latest?channelId=${encodeURIComponent(site.channelId)}`);
        if (!res.ok) throw new Error("Failed to load videos");
        const data = await res.json();
        if (!alive) return;
        const normalized: Video[] = (data.items ?? []).slice(0, 5).map((item: any) => ({
          id: item.id,
          title: item.title,
          publishedAt: item.publishedAt,
          thumbnail: item.thumbnail,
          url: item.url,
        }));
        setVideos(normalized);
      } catch {
        // Fallback demo content so the page still looks complete during development.
        if (!alive) return;
        setVideos([
          {
            id: "demo-1",
            title: "Live Session — Track One",
            publishedAt: new Date().toISOString(),
            thumbnail: site.secondaryImage,
            url: site.youtube,
          },
          {
            id: "demo-2",
            title: "Studio Performance — Track Two",
            publishedAt: new Date().toISOString(),
            thumbnail: site.secondaryImage,
            url: site.youtube,
          },
          {
            id: "demo-3",
            title: "Behind the Song",
            publishedAt: new Date().toISOString(),
            thumbnail: site.secondaryImage,
            url: site.youtube,
          },
          {
            id: "demo-4",
            title: "Official Clip",
            publishedAt: new Date().toISOString(),
            thumbnail: site.secondaryImage,
            url: site.youtube,
          },
          {
            id: "demo-5",
            title: "Acoustic Version",
            publishedAt: new Date().toISOString(),
            thumbnail: site.secondaryImage,
            url: site.youtube,
          },
        ]);
      } finally {
        if (alive) setLoadingVideos(false);
      }
    }

    loadVideos();
    return () => {
      alive = false;
    };
  }, []);

  const navItems = useMemo(() => t.nav, [t]);

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white selection:bg-white selection:text-black">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#home" className="flex items-center gap-3 text-sm tracking-[0.3em] uppercase text-white/80">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5">
              <HiOutlineSparkles className="h-4 w-4" />
            </span>
            <span className="hidden sm:inline">{site.name}</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item: string, idx: number) => (
              <a key={item} href={`#${["home", "music", "videos", "about", "contact"][idx]}`} className="text-sm text-white/70 transition hover:text-white">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-full border border-white/10 bg-white/5 p-1 md:flex">
              {(["en", "es", "ca", "nl"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-full px-3 py-1.5 text-xs tracking-[0.2em] transition ${lang === l ? "bg-white text-black" : "text-white/65 hover:text-white"}`}
                  aria-label={`Switch to ${languageLabels[l]}`}
                >
                  {languageLabels[l]}
                </button>
              ))}
            </div>
            <button
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FaXTwitter className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-black md:hidden">
            <div className="mx-auto grid max-w-7xl gap-3 px-5 py-4 text-sm text-white/80">
              {navItems.map((item: string, idx: number) => (
                <a key={item} href={`#${["home", "music", "videos", "about", "contact"][idx]}`} onClick={() => setMenuOpen(false)}>
                  {item}
                </a>
              ))}
              <div className="mt-3 flex gap-2">
                {(["en", "es", "ca", "nl"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`rounded-full border px-3 py-1.5 text-xs tracking-[0.2em] ${lang === l ? "border-white bg-white text-black" : "border-white/15 text-white/70"}`}
                  >
                    {languageLabels[l]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <main id="home">
        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-between gap-10">
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">{t.heroKicker}</p>
              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
                {t.heroTitle}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/72 sm:text-lg">{t.heroBody}</p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a href={site.spotify} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:scale-[1.02]">
                  <FiMusic className="h-4 w-4" />
                  {t.heroPrimary}
                </a>
                <a href="#videos" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10">
                  <FiPlay className="h-4 w-4" />
                  {t.heroSecondary}
                </a>
              </div>
            </div>

            <div className="grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
              {[
                { label: t.featured, value: "2026" },
                { label: t.languages, value: "ES / CA / EN / NL" },
                { label: "Format", value: "EP · Live · Visual" },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-white/45">{item.label}</div>
                  <div className="mt-3 text-lg text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
            <img src={site.heroImage} alt="Artist portrait" className="h-full w-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-black/10" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="max-w-sm rounded-3xl border border-white/10 bg-black/60 p-5 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">{t.featured}</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">New release / live visual identity</h2>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  A hero area that can swap between cover art, performance imagery, and campaign visuals without changing the structure.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="music" className="mx-auto max-w-7xl px-5 py-6 lg:px-8 lg:py-10">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
              <img src={site.secondaryImage} alt="Featured release" className="h-72 w-full object-cover" />
              <div className="p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">{t.featured}</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Title of your latest release</h3>
                <p className="mt-3 max-w-xl text-white/70">
                  Use this block for a headline, one short paragraph, and a few links to streaming, press, or lyrics.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href={site.spotify} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-medium text-black">
                    <FiMusic className="h-4 w-4" /> Streaming
                  </a>
                  <a href={site.youtube} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white">
                    <FiArrowUpRight className="h-4 w-4" /> Video
                  </a>
                </div>
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Press kit",
                  body: "Short bio, portraits, logos, technical rider, and contact details.",
                },
                {
                  title: "Live",
                  body: "Upcoming shows, selected venues, and embedded tour links.",
                },
                {
                  title: "Music",
                  body: "Singles, EPs, albums, and playlists in a simple card layout.",
                },
                {
                  title: "Visuals",
                  body: "Video stills, photography, covers, and campaign imagery.",
                },
              ].map((card) => (
                <div key={card.title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium">{card.title}</h4>
                    <FiDisc className="h-4 w-4 text-white/45" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/68">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="videos" className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">YouTube</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{t.latestVideos}</h2>
            </div>
            <a href={site.youtube} className="hidden items-center gap-2 text-sm text-white/70 hover:text-white sm:inline-flex">
              <FaYoutube className="h-4 w-4" /> Channel
              <FiArrowUpRight className="h-4 w-4" />
            </a>
          </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {loadingVideos && videos.length === 0
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <div
                    key={idx}
                    className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/5"
                    >
                    <div className="aspect-[16/10] animate-pulse bg-white/10" />
                    <div className="p-4">
                        <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
                        <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-white/10" />
                    </div>
                    </div>
                ))
                : videos.map((video, idx) => (
                    <a
                    key={video.id ?? idx}
                    href={video?.url ?? site.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:bg-white/10"
                    >
                    <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
                        <img
                        src={video.thumbnail ?? site.secondaryImage}
                        alt={video.title ?? "YouTube video"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    </div>

                    <div className="p-4">
                        <div className="line-clamp-2 min-h-[3rem] text-sm font-medium leading-6">
                        {video.title ?? t.videoEmpty}
                        </div>
                        <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/45">
                        {formatDate(video.publishedAt, lang)}
                        </div>
                    </div>
                    </a>
                ))}
            </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">{t.aboutTitle}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{site.name}</h2>
              <p className="mt-3 text-white/65">{site.role}</p>
              <p className="mt-3 text-sm uppercase tracking-[0.2em] text-white/45">{site.location}</p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8">
              <p className="max-w-3xl text-lg leading-8 text-white/80">{t.aboutBody}</p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/70">
                <span className="rounded-full border border-white/10 px-4 py-2">Brand identity</span>
                <span className="rounded-full border border-white/10 px-4 py-2">Multilingual content</span>
                <span className="rounded-full border border-white/10 px-4 py-2">Static-friendly</span>
                <span className="rounded-full border border-white/10 px-4 py-2">Easy editing</span>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-5 pb-16 pt-8 lg:px-8 lg:pb-20">
          <div className="rounded-[2.25rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">{t.contactTitle}</p>
                <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{t.cta}</h2>
                <p className="mt-3 max-w-2xl text-white/70">{t.contactBody}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black">
                  <FiMail className="h-4 w-4" /> Email
                </a>
                <a href={site.instagram} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white">
                  <FaInstagram className="h-4 w-4" /> Instagram
                </a>
                <a href={site.youtube} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white">
                  <FaYoutube className="h-4 w-4" /> YouTube
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-5 py-6 text-sm text-white/45 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer}</p>
          <div className="flex items-center gap-4">
            <a href={site.spotify} className="hover:text-white">
              Spotify
            </a>
            <a href={site.youtube} className="hover:text-white">
              YouTube
            </a>
            <a href={site.instagram} className="hover:text-white">
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
