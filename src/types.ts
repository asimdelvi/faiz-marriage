/**
 * Content model for the invitation. Every optional field can be left out or
 * set to "" — the section or line that uses it simply does not render.
 */

export type TimelineEvent = {
  id: string;
  title: string;
  /** Optional calligraphy shown on the card, e.g. "نِكَاح". */
  arabic?: string;
  /** Defaults to the wedding date. */
  date?: string;
  time?: string;
  venue?: string;
  description?: string;
  /** Optional per-event map link; falls back to the main venue. */
  mapsUrl?: string;
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
  /** Editing notes carried in config.json. Ignored by the site. */
  _readme?: string[];

  brideName: string;
  groomName: string;
  /** ISO 8601, e.g. "2026-12-12". */
  weddingDate: string;
  weddingTime: string;
  /** Venue UTC offset, e.g. "+05:30". Keeps countdown and calendar correct everywhere. */
  timezone?: string;
  venueName: string;
  venueAddress: string;
  googleMapsUrl: string;
  venueNote?: string;
  hashtag?: string;
  siteUrl?: string;
  locale?: string;

  bismillah?: string;
  bismillahMeaning?: string;
  blessing?: { arabic?: string; text: string; reference?: string };
  heroEyebrow?: string;
  heroSubtitle?: string;
  invitationNote?: string;
  dateEyebrow?: string;
  timeline: TimelineEvent[];
  closingDua?: { arabic?: string; text?: string };

  rsvp?: RsvpConfig;
  contacts?: { name: string; phone: string; relation?: string }[];
  socialLinks?: { instagram?: string };
  backgroundMusic?: string;
  colors: { primary: string; secondary: string; accent: string };
  seo?: { title?: string; description?: string; ogImage?: string };
  footerNote?: string;
};
