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
};

export const site: SiteProfile = {
  name: 'Xavier Crosas',
  email: 'xaviercrosasofficial@gmail.com',
  social: {
    instagram: 'https://instagram.com/xaviercrosasofficial',
    youtube: 'https://youtube.com/@XavierCrosas',
    spotify: 'https://open.spotify.com/artist/6PaPHlXXxfowSsJdvdxyke',
  },
};

/** Every public profile, for the `sameAs` property of the MusicGroup JSON-LD. */
export const socialProfiles: readonly string[] = Object.values(site.social);
