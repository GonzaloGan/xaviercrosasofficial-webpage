/**
 * Stable identity data referenced by code (JSON-LD, footer links, contact section).
 * Authored content belongs in `src/content/`; infrastructure configuration such as the
 * YouTube channel id belongs in the environment.
 */
export type SiteProfile = {
  readonly name: string;
  readonly email: string;
  readonly social: {
    readonly instagram: string;
    readonly youtube: string;
    readonly spotify: string;
  };
  readonly promoBanner: {
    readonly enabled: boolean;
    readonly albumTitle: string;
    readonly spotifyUrl: string;
  };
};

export const site: SiteProfile = {
  name: 'Xavier Crosas',
  email: 'xaviercrosasofficial@gmail.com',
  social: {
    instagram: 'https://instagram.com/xaviercrosasofficial',
    youtube: 'https://youtube.com/@XavierCrosas',
    spotify: 'https://open.spotify.com/artist/6PaPHlXXxfowSsJdvdxyke',
  },
  // Temporary campaign switch for homepage album promotion.
  promoBanner: {
    enabled: true,
    albumTitle: "The Hero's Crisis",
    spotifyUrl: 'https://open.spotify.com/intl-es/album/2hPoMb20zaguy3sA6RqtCP',
  },
};

/** Every public profile, for the `sameAs` property of the MusicGroup JSON-LD. */
export const socialProfiles: readonly string[] = Object.values(site.social);
