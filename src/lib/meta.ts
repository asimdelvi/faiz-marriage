import type { SiteConfig } from '../types';
import { formatLongDate, parseWeddingDate, toIsoStamp } from './format';

export type Meta = {
  title: string;
  description: string;
  ogImage: string;
  canonical: string;
  locale: string;
  jsonLd: Record<string, unknown>;
};

export function coupleNames(cfg: Pick<SiteConfig, 'brideName' | 'groomName'>): {
  bride: string;
  groom: string;
  pair: string;
} {
  const bride = (cfg.brideName ?? '').trim() || 'The Bride';
  const groom = (cfg.groomName ?? '').trim() || 'The Groom';
  return { bride, groom, pair: `${bride} & ${groom}` };
}

/** Single source of truth for SEO — used at build time and at runtime. */
export function buildMeta(cfg: SiteConfig): Meta {
  const { pair } = coupleNames(cfg);
  const longDate = formatLongDate(cfg.weddingDate, 'en-IN');
  const start = parseWeddingDate(cfg.weddingDate, cfg.weddingTime);

  const title =
    cfg.seo?.title?.trim() ||
    [pair, longDate ? `· ${longDate}` : '', '· Wedding Invitation']
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ');

  const description =
    cfg.seo?.description?.trim() ||
    [
      `${pair} invite you to celebrate their wedding`,
      longDate ? ` on ${longDate}` : '',
      cfg.venueName ? ` at ${cfg.venueName}` : '',
      cfg.venueAddress ? `, ${cfg.venueAddress}` : '',
      '.',
    ].join('');

  const canonical = (cfg.siteUrl ?? '').trim().replace(/\/+$/, '');
  const ogImage = (cfg.seo?.ogImage || cfg.heroImage || '').trim();

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${pair} — Wedding`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    description,
  };
  if (start) jsonLd.startDate = toIsoStamp(start);
  if (ogImage) jsonLd.image = [ogImage];
  if (canonical) jsonLd.url = canonical;
  if (cfg.venueName || cfg.venueAddress) {
    jsonLd.location = {
      '@type': 'Place',
      name: cfg.venueName || cfg.venueAddress,
      ...(cfg.venueAddress
        ? { address: { '@type': 'PostalAddress', streetAddress: cfg.venueAddress } }
        : {}),
    };
  }
  jsonLd.organizer = { '@type': 'Person', name: pair };

  return {
    title,
    description: description.replace(/\s+/g, ' ').trim(),
    ogImage,
    canonical,
    locale: cfg.locale || 'en_IN',
    jsonLd,
  };
}
