import type { SiteConfig } from './types';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THE ONLY FILE YOU NEED TO EDIT.
 *  Every section of the site reads from this object. Nothing is hardcoded in
 *  the components. Leave a field empty and the site degrades gracefully:
 *  missing images become generated artwork, missing sections disappear.
 *
 *  Fill in the quotes, keep the commas, and push — the site redeploys itself.
 *  Blocks below that start with // are ready-made examples: delete the leading
 *  slashes on those lines and edit them.
 *
 *  Photos: put files in public/images/ and reference them as
 *  '/images/name.jpg'. Music goes in public/music/.
 *  ─────────────────────────────────────────────────────────────────────────────
 */
export const config: SiteConfig = {
  /* ── The couple ─────────────────────────────────────────────────────────── */
  brideName: '',
  groomName: '',

  /* ── When ───────────────────────────────────────────────────────────────── */
  weddingDate: '', // ISO date, e.g. '2026-02-14'
  weddingTime: '', // free text, e.g. '7:00 PM onwards'

  /* ── Where ──────────────────────────────────────────────────────────────── */
  venueName: '',
  venueAddress: '',
  googleMapsUrl: '', // share link or full embed URL — both work

  /* ── Brand ──────────────────────────────────────────────────────────────── */
  hashtag: '',
  logo: '', // optional image; falls back to an engraved monogram
  siteUrl: 'https://asimdelvi.github.io/faiz-marriage',
  locale: 'en_IN',

  /* ── Hero media (either is enough; video wins when both are set) ────────── */
  heroImage: '',
  heroVideo: '',
  heroEyebrow: 'Together with our families',
  heroSubtitle: 'request the pleasure of your company',
  invitationNote:
    'A celebration of love, family and new beginnings — we would be honoured to have you with us.',

  /* ── Music (never autoplays with sound) ─────────────────────────────────── */
  backgroundMusic: '',

  /* ── Palette ────────────────────────────────────────────────────────────── */
  colors: {
    primary: '#8D5B4C',
    secondary: '#E8D8C3',
    accent: '#C79B63',
  },

  /* ── Story ──────────────────────────────────────────────────────────────── */
  story: [
    {
      id: 'how-we-met',
      title: 'How we met',
      body: 'Two families, one introduction, and a conversation that simply never ended.',
      image: { prompt: 'PROMPT_STORY_MEET' },
    },
    {
      id: 'the-proposal',
      title: 'The promise',
      body: 'A quiet yes, said in front of the people who matter most to us.',
      image: { prompt: 'PROMPT_STORY_PROPOSAL' },
    },
  ],

  /* ── Ceremonies ─────────────────────────────────────────────────────────────
     Delete any you are not having, reorder freely, add your own. `date` is an
     ISO date ('2026-12-11'), `time` and `venue` are free text, and `image` can
     be { src: '/images/mehendi.jpg' } once you have photographs.
     ───────────────────────────────────────────────────────────────────────── */
  timeline: [
    {
      id: 'mehendi',
      title: 'Mehendi',
      date: '',
      time: '',
      venue: '',
      description:
        'Henna, music and the slow, happy hum of the house filling up with family.',
      image: { prompt: 'PROMPT_MEHENDI' },
    },
    {
      id: 'haldi',
      title: 'Haldi',
      date: '',
      time: '',
      venue: '',
      description: 'Marigolds, turmeric and blessings — the morning everything turns golden.',
      image: { prompt: 'PROMPT_HALDI' },
    },
    {
      id: 'sangeet',
      title: 'Sangeet',
      date: '',
      time: '',
      venue: '',
      description: 'An evening of rehearsed dances, unrehearsed laughter and far too many encores.',
      image: { prompt: 'PROMPT_SANGEET' },
    },
    {
      id: 'baraat',
      title: 'Baraat',
      date: '',
      time: '',
      venue: '',
      description: 'The procession arrives — dhol, flowers and a street that belongs to us.',
      image: { prompt: 'PROMPT_BARAAT' },
    },
    {
      id: 'wedding',
      title: 'The Wedding',
      date: '',
      time: '',
      venue: '',
      description: 'Vows exchanged before the sacred fire, witnessed by everyone we love.',
      image: { prompt: 'PROMPT_SAAT_PHERE' },
    },
    {
      id: 'reception',
      title: 'Reception',
      date: '',
      time: '',
      venue: '',
      description: 'Dinner, toasts and the first evening as husband and wife.',
      image: { prompt: 'PROMPT_DINNER' },
    },
  ],

  /* ── Family ─────────────────────────────────────────────────────────────────
     Empty array = the whole section and its nav link disappear.
     `side` is 'bride' | 'groom' | 'both'. Photos are optional.
     ───────────────────────────────────────────────────────────────────────── */
  family: [
    // {
    //   id: 'brides-parents',
    //   name: 'Mr. & Mrs. Sharma',
    //   relation: 'Parents of the Bride',
    //   side: 'bride',
    //   note: 'Who taught us that a full house is a happy one.',
    //   image: { src: '/images/family-brides-parents.jpg' },
    // },
    // {
    //   id: 'grooms-parents',
    //   name: 'Mr. & Mrs. Delvi',
    //   relation: 'Parents of the Groom',
    //   side: 'groom',
    // },
  ],

  /* ── Gallery ────────────────────────────────────────────────────────────────
     `orientation` ('portrait' | 'landscape' | 'square') shapes the masonry
     cell. Without `src` each item shows generated artwork instead.
     ───────────────────────────────────────────────────────────────────────── */
  gallery: [
    // { id: 'g1', src: '/images/gallery-1.jpg', caption: 'The first look', orientation: 'portrait' },
    // { id: 'g2', src: '/images/gallery-2.jpg', caption: 'Haldi mornings', orientation: 'landscape' },
    // { id: 'g3', src: '/images/gallery-3.jpg', orientation: 'square' },
  ],

  /* ── Venue extras ───────────────────────────────────────────────────────── */
  venueImage: { prompt: 'PROMPT_VENUE' },
  venueNote: 'Valet parking available. Please arrive a little before the muhurat.',

  /* ── RSVP ───────────────────────────────────────────────────────────────── */
  rsvp: {
    // 'whatsapp' opens a chat with your message pre-typed; 'form' / 'url' open
    // a link; 'none' hides the button (the section still shows contacts).
    type: 'none', // 'whatsapp' | 'form' | 'url' | 'none'
    value: '', // whatsapp: '919876543210' (country code, no +) · form/url: https://…
    label: 'RSVP',
    message: 'Hi! We would love to attend the wedding.',
    deadline: '', // ISO date, e.g. '2026-11-20'
    note: 'Kindly let us know by the date above so we can plan the seating.',
  },

  /* ── Social ─────────────────────────────────────────────────────────────── */
  socialLinks: {
    instagram: '', // handle or full URL, e.g. 'aaliyameetsfaiz'
  },

  /* Tap-to-call numbers shown under the RSVP button. */
  contacts: [
    // { name: 'Imran', phone: '+91 98765 43210', relation: 'Brother of the bride' },
  ],

  /* Leave blank and these are written for you from the names, date and venue. */
  seo: {
    title: '',
    description: '',
    ogImage: '', // image for WhatsApp/social previews, e.g. '/images/hero.jpg'
  },

  /**
   * Optional text-to-image endpoint for missing artwork, e.g.
   * 'https://image.example.com/p/{prompt}?seed={seed}&w=1200'.
   * Empty → built-in generated SVG artwork, zero external requests.
   */
  imageGenerator: '',
};

export default config;
