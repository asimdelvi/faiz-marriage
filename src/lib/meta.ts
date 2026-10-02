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

export function coupleNames(cfg: Pick<SiteConfig, 'brideName' | 'groomName' | 'shortNames'>): {
  bride: string;
  groom: string;
  pair: string;
  shortBride: string;
  shortGroom: string;
  shortPair: string;
} {
  const bride = (cfg.brideName ?? '').trim() || 'The Bride';
  const groom = (cfg.groomName ?? '').trim() || 'The Groom';
  const shortBride = cfg.shortNames?.bride?.trim() || bride;
  const shortGroom = cfg.shortNames?.groom?.trim() || groom;
  return { bride, groom, pair: `${bride} & ${groom}`, shortBride, shortGroom, shortPair: `${shortBride} & ${shortGroom}` };
}

/** Single source of truth for SEO — used at build time and at runtime. */
export function buildMeta(cfg: SiteConfig): Meta {
  const { pair, shortPair } = coupleNames(cfg);
  const events = (cfg.timeline ?? []).map((e) => e.title).filter(Boolean).join(' & ') || 'wedding';
  const longDate = formatLongDate(cfg.weddingDate, 'en-IN');
  const start = parseWeddingDate(cfg.weddingDate, cfg.weddingTime, cfg.timezone);

  const title =
    cfg.seo?.title?.trim() ||
    [shortPair, longDate ? `· ${longDate}` : '', `· ${events} Invitation`]
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ');

  const description =
    cfg.seo?.description?.trim() ||
    [
      `${pair} invite you to their ${events}`,
      longDate ? ` on ${longDate}` : '',
      cfg.venueName ? ` at ${cfg.venueName}` : '',
      cfg.venueAddress ? `, ${cfg.venueAddress}` : '',
      '.',
    ].join('');

  const canonical = (cfg.siteUrl ?? '').trim().replace(/\/+$/, '');
  const rawOgImage = (cfg.seo?.ogImage || '').trim();
  // Crawlers need a fully-qualified image URL, not a site-root path.
  const ogImage =
    rawOgImage.startsWith('/') && canonical ? `${canonical}${rawOgImage}` : rawOgImage;

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${shortPair} — ${events}`,
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
