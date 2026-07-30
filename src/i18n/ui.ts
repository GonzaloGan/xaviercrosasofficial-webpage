import type { Locale } from './utils';

/**
 * The English dictionary defines the key set. Every other locale must satisfy it,
 * so a missing or misspelled translation is a compile-time error, not `undefined`
 * in the DOM. Constitution, Principle IV.4.
 */
const en = {
  'meta.title': 'Xavier Crosas — Singer. Songwriter.',
  'meta.description':
    'Official site of Xavier Crosas, singer and songwriter. Listen to the latest releases, watch the newest videos, and get in touch for bookings and collaborations.',

  'nav.home': 'Home',
  'nav.music': 'Music',
  'nav.videos': 'Videos',
  'nav.about': 'About',
  'nav.contact': 'Contact',

  'hero.kicker': 'Artist portfolio',
  'hero.title': "Singer. Songwriter. Your new favorite artist you just haven't found yet",
  'hero.body':
    'If I must to describe myself in a single word, these days I feel that word for me is seeker.',
  'hero.primary': 'Listen',
  'hero.secondary': 'View videos',

  'promo.kicker': 'New release',
  'promo.body': "A new album is now available on all platforms. Listen and share if it resonates with you.",
  'promo.cta': 'Listen on Spotify',
  'promo.secondaryCta': 'Check other platforms',

  'music.heading': 'Music',
  'music.featured': 'Featured release',
  'music.streaming': 'Streaming',
  'music.video': 'Video',

  'videos.heading': 'Latest videos',
  'videos.channel': 'Channel',
  'videos.empty': 'Your latest five YouTube videos will appear here.',

  'contact.heading': 'Contact',
  'contact.body': 'Bookings, press, collaborations, and commissions.',
  'contact.cta': 'Open for bookings and collaborations',
  'contact.email': 'Email',

  'footer.tagline': 'Built for artists who want a strong brand without heavy maintenance.',

  'a11y.skipToContent': 'Skip to content',
  'a11y.openMenu': 'Open menu',
  'a11y.closeMenu': 'Close menu',
  'a11y.language': 'Language',
  'a11y.opensInNewTab': 'opens in a new tab',
} as const;

export type UIKey = keyof typeof en;

const es = {
  'meta.title': 'Xavier Crosas — Cantante y compositor',
  'meta.description':
    'Sitio oficial de Xavier Crosas, cantante y compositor. Escucha los últimos lanzamientos, mira los vídeos más recientes y contacta para bookings y colaboraciones.',

  'nav.home': 'Inicio',
  'nav.music': 'Música',
  'nav.videos': 'Vídeos',
  'nav.about': 'Bio',
  'nav.contact': 'Contacto',

  'hero.kicker': 'Portfolio artístico',
  'hero.title': 'Cantante. Compositor. Tu nuevo artista favorito, al que aún no has descubierto',
  'hero.body':
    'Si tuviera que describirme con una sola palabra, últimamente creo que esa palabra para mí es buscador.',
  'hero.primary': 'Escuchar',
  'hero.secondary': 'Ver vídeos',

  'promo.kicker': 'Nuevo lanzamiento',
  'promo.body': 'Hay un nuevo álbum disponible en todas las plataformas. Escúchalo y compártelo si conecta contigo.',
  'promo.cta': 'Escuchar en Spotify',
  'promo.secondaryCta': 'Ver otras plataformas',

  'music.heading': 'Música',
  'music.featured': 'Lanzamiento destacado',
  'music.streaming': 'Streaming',
  'music.video': 'Vídeo',

  'videos.heading': 'Últimos vídeos',
  'videos.channel': 'Canal',
  'videos.empty': 'Aquí aparecerán tus cinco últimos vídeos de YouTube.',

  'contact.heading': 'Contacto',
  'contact.body': 'Bookings, prensa, colaboraciones y encargos.',
  'contact.cta': 'Disponible para bookings y colaboraciones',
  'contact.email': 'Correo',

  'footer.tagline': 'Pensado para artistas que quieren una marca fuerte con poco mantenimiento.',

  'a11y.skipToContent': 'Saltar al contenido',
  'a11y.openMenu': 'Abrir menú',
  'a11y.closeMenu': 'Cerrar menú',
  'a11y.language': 'Idioma',
  'a11y.opensInNewTab': 'se abre en una pestaña nueva',
} as const;

const ca = {
  'meta.title': 'Xavier Crosas — Cantant i compositor',
  'meta.description':
    'Lloc oficial de Xavier Crosas, cantant i compositor. Escolta els últims llançaments, mira els vídeos més recents i contacta per a bookings i col·laboracions.',

  'nav.home': 'Inici',
  'nav.music': 'Música',
  'nav.videos': 'Vídeos',
  'nav.about': 'Bio',
  'nav.contact': 'Contacte',

  'hero.kicker': "Portfoli d'artista",
  'hero.title': 'Cantant. Compositor. El teu nou artista preferit que encara no has descobert',
  'hero.body':
    "Si he de descriure'm amb una sola paraula, aquests dies sento que aquesta paraula per a mi és cercador.",
  'hero.primary': 'Escoltar',
  'hero.secondary': 'Veure vídeos',

  'promo.kicker': 'Nou llançament',
  'promo.body': 'Hi ha un nou àlbum disponible a totes les plataformes. Escolta\'l i comparteix-lo si et ressona.',
  'promo.cta': 'Escoltar a Spotify',
  'promo.secondaryCta': 'Veure altres plataformes',

  'music.heading': 'Música',
  'music.featured': 'Publicació destacada',
  'music.streaming': 'Streaming',
  'music.video': 'Vídeo',

  'videos.heading': 'Últims vídeos',
  'videos.channel': 'Canal',
  'videos.empty': 'Aquí apareixeran els teus cinc últims vídeos de YouTube.',

  'contact.heading': 'Contacte',
  'contact.body': 'Bookings, premsa, col·laboracions i encàrrecs.',
  'contact.cta': 'Disponible per a bookings i col·laboracions',
  'contact.email': 'Correu',

  'footer.tagline': 'Pensat per a artistes que volen una marca forta amb poc manteniment.',

  'a11y.skipToContent': 'Salta al contingut',
  'a11y.openMenu': 'Obrir menú',
  'a11y.closeMenu': 'Tancar menú',
  'a11y.language': 'Idioma',
  'a11y.opensInNewTab': "s'obre en una pestanya nova",
} as const;

const nl = {
  'meta.title': 'Xavier Crosas — Zanger en songwriter',
  'meta.description':
    "Officiële site van Xavier Crosas, zanger en songwriter. Luister naar de nieuwste releases, bekijk de recentste video's en neem contact op voor boekingen en samenwerkingen.",

  'nav.home': 'Home',
  'nav.music': 'Muziek',
  'nav.videos': "Video's",
  'nav.about': 'Bio',
  'nav.contact': 'Contact',

  'hero.kicker': 'Artiestenportfolio',
  'hero.title': 'Zanger. Songwriter. Je nieuwe favoriete artiest, die je alleen nog niet ontdekt hebt',
  'hero.body':
    'Als ik mezelf in één woord zou moeten omschrijven, dan is het woord dat tegenwoordig het beste bij mij past zoeker.',
  'hero.primary': 'Luisteren',
  'hero.secondary': "Video's bekijken",

  'promo.kicker': 'Nieuwe release',
  'promo.body': 'Er staat nu een nieuw album op alle platforms. Luister en deel het als het bij je binnenkomt.',
  'promo.cta': 'Luisteren op Spotify',
  'promo.secondaryCta': 'Bekijk andere platforms',

  'music.heading': 'Muziek',
  'music.featured': 'Uitgelichte release',
  'music.streaming': 'Streaming',
  'music.video': 'Video',

  'videos.heading': "Laatste video's",
  'videos.channel': 'Kanaal',
  'videos.empty': "Hier verschijnen je laatste vijf YouTube-video's.",

  'contact.heading': 'Contact',
  'contact.body': 'Boekingen, pers, samenwerkingen en commissions.',
  'contact.cta': 'Beschikbaar voor boekingen en samenwerkingen',
  'contact.email': 'E-mail',

  'footer.tagline': 'Gemaakt voor artiesten die een sterk merk willen zonder veel onderhoud.',

  'a11y.skipToContent': 'Naar inhoud springen',
  'a11y.openMenu': 'Menu openen',
  'a11y.closeMenu': 'Menu sluiten',
  'a11y.language': 'Taal',
  'a11y.opensInNewTab': 'opent in een nieuw tabblad',
} as const;

export const ui = { en, es, ca, nl } as const satisfies Record<Locale, Record<UIKey, string>>;

export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key];
  };
}
