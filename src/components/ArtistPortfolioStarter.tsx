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

// Imgs
import xaviHero from '../assets/images/xavi1.webp';
import xaviAlbum from '../assets/images/xavi_album.png';
import BreakTheIllusions from '../assets/images/break_the_illusions.jpg';
import Wanderer from '../assets/images/xavi_wolf.jpg'

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
  email: "xaviercrosasofficial@gmail.com",
  instagram: "https://instagram.com/xaviercrosasofficial",
  youtube: "https://youtube.com/@XavierCrosasOFFICIAL",
  spotify: "https://open.spotify.com/artist/6PaPHlXXxfowSsJdvdxyke",
  channelId: "UCPJbHYCqGDWiULG6dDE_Tzw",
  // Add the API route in your Astro / Next / serverless setup:
  // GET /api/youtube-latest?channelId=...
};

const copy: Record<Lang, any> = {
  en: {
    nav: ["Home", "Music", "Videos", "About", "Contact"],
    heroKicker: "Artist portfolio",
    heroTitle: "Singer. Songwriter. Your new favorite artist you just haven't found yet",
    heroBody:
      "If I must to describe myself in a single word, these days I feel that word for me is seeker.",
    heroPrimary: "Listen",
    heroSecondary: "View videos",
    location: "Roermond - Remote",
    featured: "Featured release",
    latestVideos: "Latest videos",
    aboutTitle: "About",
    aboutBody:
      "My journey started in 2020, when invited by curiosity about the hero's journey, a book called 'The Hero Within' by Carol S. Pearson came into my hands. Through this reading, my inspiration to compose about it was born. Sometime later, I had the chance to start a new life in a foreign country. Before leaving, one of my mentors gave me a book of his authorship called 'Crisis: ¿Estás preparado para crecer?'",
    aboutRole: "Artist / Composer / Performer",
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
    heroTitle: "Cantante. Compositor. Tu nuevo artista favorito, al que aún no has descubierto",
    heroBody:
      "Si tuviera que describirme con una sola palabra, últimamente creo que esa palabra para mí es buscador.",
    heroPrimary: "Escuchar",
    heroSecondary: "Ver vídeos",
    location: "Roermond - Remoto",
    featured: "Lanzamiento destacado",
    latestVideos: "Últimos vídeos",
    aboutTitle: "Bio",
    aboutBody:
      "Mi viaje comenzó en 2020, cuando, impulsada por la curiosidad que me despertaba el viaje del héroe, cayó en mis manos un libro titulado 'The Hero Within', de Carol S. Pearson. De esta lectura surgió mi inspiración para escribir sobre el tema. Poco después, tuve la oportunidad de empezar una nueva vida en un país extranjero. Antes de marcharme, uno de mis mentores me regaló un libro de su autoría titulado 'Crisis: ¿Estás preparado para crecer?'",
    aboutRole: "Artista / Compositor / Intérprete",
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
    heroTitle: "Cantant. Compositor. El teu nou artista preferit que encara no has descobert",
    heroBody:
      "Si he de descriure'm amb una sola paraula, aquests dies sento que aquesta paraula per a mi és cercador.",
    heroPrimary: "Escoltar",
    heroSecondary: "Veure vídeos",
    location: "Roermond - Remot",
    featured: "Publicació destacada",
    latestVideos: "Últims vídeos",
    aboutTitle: "Bio",
    aboutBody:
      "El meu viatge va començar el 2020, quan, atret per la curiositat sobre el viatge de l'heroi, vaig tenir a les mans un llibre titulat 'The Hero Within', de Carol S. Pearson. A través d'aquesta lectura va néixer la meva inspiració per composar sobre el tema. Més tard, vaig tenir l'oportunitat de començar una nova vida en un país estranger. Abans de marxar, un dels meus mentors em va regalar un llibre seu titulat 'Crisis: ¿Estás preparado para crecer?'",
    aboutRole: "Artista / Compositor / Intèrpret",
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
    heroTitle: "Zanger. Songwriter. Je nieuwe favoriete artiest, die je alleen nog niet ontdekt hebt",
    heroBody:
      "Als ik mezelf in één woord zou moeten omschrijven, dan is het woord dat tegenwoordig het beste bij mij past zoeker.",
    heroPrimary: "Luisteren",
    heroSecondary: "Video’s bekijken",
    location: "Roermond - Op afstand",
    featured: "Uitgelichte release",
    latestVideos: "Laatste video’s",
    aboutTitle: "Bio",
    aboutBody:
      "Mijn reis begon in 2020, toen ik uit nieuwsgierigheid naar de heldenreis het boek 'The Hero Within' van Carol S. Pearson in handen kreeg. Door dit boek ontstond bij mij de inspiratie om erover te schrijven. Enige tijd later kreeg ik de kans om een nieuw leven te beginnen in het buitenland. Voordat ik vertrok, gaf een van mijn mentoren me een boek van zijn hand, getiteld 'Crisis: ¿Estás preparado para crecer?'",
    aboutRole: "Artiest / Componist / Uitvoerder",
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
  let mounted = true;

  async function fetchVideos() {
    try {
      const res = await fetch("/api/youtube-latest");

      const data = await res.json();

      if (!mounted) return;

      setVideos(data.items ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      if (mounted) {
        setLoadingVideos(false);
      }
    }
  }

  fetchVideos();

  return () => {
    mounted = false;
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
                { label: "Format", value: "EP - Live - Visual" },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-white/45">{item.label}</div>
                  <div className="mt-3 text-lg text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
            <img src={xaviHero.src} alt="Artist portrait" className="h-full w-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-black/10" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="max-w-sm rounded-3xl border border-white/10 bg-black/60 p-5 backdrop-blur-xl">
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">Xavier Crosas</h2>
                <p className="mt-2 text-sm leading-6 text-justify hyphens-auto text-white/70">
                  {t.heroBody}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="music" className="mx-auto max-w-7xl px-5 py-6 lg:px-8 lg:py-10">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
              <img src={Wanderer.src} alt="Featured release" className="h-72 w-full object-cover" />
              <div className="p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">{t.featured}</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">The Archetype III: The Wanderer</h3>
                <p className="mt-3 max-w-xl text-white/70">
                  © 2026 XCB Studio
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href="https://open.spotify.com/intl-es/track/53REbMHYYx6Krvu5ioXRIn" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-medium text-black">
                    <FiMusic className="h-4 w-4" /> Streaming
                  </a>
                </div>
              </div>
            </article>
            <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
              <img src={BreakTheIllusions.src} alt="Featured release" className="h-72 w-full object-cover" />
              <div className="p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">{t.featured}</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Break The Illusions</h3>
                <p className="mt-3 max-w-xl text-white/70">
                  © 2026 XCB Studio
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href="https://open.spotify.com/intl-es/track/3acimGFmocle0Dv5tBNLtm" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-medium text-black">
                    <FiMusic className="h-4 w-4" /> Streaming
                  </a>
                </div>
              </div>
            </article>
            <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
              <img src={xaviAlbum.src} alt="Featured release" className="h-72 w-full object-cover" />
              <div className="p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">© 2026 XCB Studio</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">When Did I Grow Up</h3>
                <p className="mt-3 max-w-xl text-white/70">
                  Recording, Mixing & Mastering: Icy Donuts Music Studio
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href="https://open.spotify.com/intl-es/album/0IteIu5XQh9KhlctLH0heT" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-medium text-black">
                    <FiMusic className="h-4 w-4" /> Streaming
                  </a>
                  <a href="https://www.youtube.com/watch?v=xDuBDXz9_2Q" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white">
                    <FiArrowUpRight className="h-4 w-4" /> Video
                  </a>
                </div>
              </div>
            </article>

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
                        src={video.thumbnail ?? xaviAlbum.src}
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
              <p className="mt-3 text-white/65">{t.aboutRole}</p>
              <p className="mt-3 text-sm uppercase tracking-[0.2em] text-white/45">{t.location}</p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8">
              <p className="max-w-3xl text-lg leading-8 text-white/80 text-justify hyphens-auto">{t.aboutBody}</p>
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
                <a href={`mailto:${site.email}`} data-obfuscation="1" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black">
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
          <p>Xavier Crosas &copy; 2026</p>
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
