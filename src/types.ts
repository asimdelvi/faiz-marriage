/**
 * Content model for the invitation.
 * Every string is optional-by-convention: a missing value must never break a
 * section — it either hides gracefully or falls back to a generated asset.
 */

export type ImageRef = {
  /** Real asset URL. When absent, an AI prompt / generated placeholder is used. */
  src?: string;
  alt?: string;
  /** Prompt used to generate this image when `src` is missing. */
  prompt?: string;
};

export type TimelineEvent = {
  id: string;
  /** Mehendi, Sangeet, Haldi, Baraat, Wedding, Reception … */
  title: string;
  date?: string;
  time?: string;
  venue?: string;
  description?: string;
  image?: ImageRef;
  /** Optional per-event map link; falls back to the main venue. */
  mapsUrl?: string;
};

export type FamilyMember = {
  id: string;
  name: string;
  relation?: string;
  side?: 'bride' | 'groom' | 'both';
  note?: string;
  image?: ImageRef;
};

export type GalleryItem = ImageRef & {
  id: string;
  caption?: string;
  /** Tall images get a taller cell in the masonry grid. */
  orientation?: 'portrait' | 'landscape' | 'square';
};

export type StoryChapter = {
  id: string;
  title: string;
  body: string;
  date?: string;
  image?: ImageRef;
};

export type RsvpConfig = {
  /** whatsapp → value is a phone number in international format, digits only. */
  type: 'whatsapp' | 'form' | 'url' | 'none';
  value: string;
  label?: string;
  message?: string;
  deadline?: string;
  note?: string;
};

export type SiteConfig = {
  brideName: string;
  groomName: string;
  /** ISO 8601, e.g. "2026-02-14". Drives the countdown + Schema.org Event. */
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  googleMapsUrl: string;
  hashtag: string;
  logo: string;
  heroImage: string;
  heroVideo: string;
  backgroundMusic: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  gallery: GalleryItem[];
  family: FamilyMember[];
  timeline: TimelineEvent[];
  socialLinks: {
    instagram: string;
    facebook?: string;
    youtube?: string;
  };

  /* ---- optional refinements (safe to leave empty) ---- */
  siteUrl?: string;
  locale?: string;
  /** Small line above the names in the hero, e.g. "Together with our families". */
  heroEyebrow?: string;
  /** Line under the names, e.g. "are getting married". */
  heroSubtitle?: string;
  invitationNote?: string;
  story?: StoryChapter[];
  rsvp?: RsvpConfig;
  venueImage?: ImageRef;
  venueNote?: string;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
  contacts?: { name: string; phone: string; relation?: string }[];
  /**
   * Optional text-to-image endpoint used to materialise missing artwork.
   * `{prompt}` and `{seed}` are substituted. Leave empty to use the built-in
   * hand-drawn SVG placeholders instead (no network calls).
   */
  imageGenerator?: string;
};
