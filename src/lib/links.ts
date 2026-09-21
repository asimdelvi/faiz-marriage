import type { RsvpConfig, SiteConfig } from '../types';

const isUrl = (value: string) => /^https?:\/\//i.test(value.trim());

/** A keyless embed URL — works for a share link, a place name or a raw address. */
export function mapsEmbedUrl(cfg: Pick<SiteConfig, 'googleMapsUrl' | 'venueName' | 'venueAddress'>): string {
  const url = (cfg.googleMapsUrl ?? '').trim();
  if (url.includes('/maps/embed')) return url;
  const query = [cfg.venueName, cfg.venueAddress].filter(Boolean).join(', ').trim() || url;
  if (!query) return '';
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
}

/** "Open directions" target. Prefers the couple's own share link. */
export function directionsUrl(cfg: Pick<SiteConfig, 'googleMapsUrl' | 'venueName' | 'venueAddress'>): string {
  const url = (cfg.googleMapsUrl ?? '').trim();
  if (isUrl(url) && !url.includes('/maps/embed')) return url;
  const query = [cfg.venueName, cfg.venueAddress].filter(Boolean).join(', ').trim();
  if (!query) return '';
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

/** Resolves the RSVP CTA to a single href. Empty string → hide the CTA. */
export function rsvpHref(rsvp: RsvpConfig | undefined): string {
  if (!rsvp || rsvp.type === 'none') return '';
  const value = (rsvp.value ?? '').trim();
  if (!value) return '';
  if (rsvp.type === 'whatsapp') {
    const phone = value.replace(/[^\d]/g, '');
    if (!phone) return '';
    const text = encodeURIComponent(rsvp.message ?? '');
    return `https://wa.me/${phone}${text ? `?text=${text}` : ''}`;
  }
  return isUrl(value) ? value : `https://${value}`;
}

export function instagramUrl(handle: string): string {
  const value = (handle ?? '').trim();
  if (!value) return '';
  if (isUrl(value)) return value;
  return `https://instagram.com/${value.replace(/^@/, '')}`;
}

/** Google Calendar "add event" link, built from the config. */
export function calendarUrl(params: {
  title: string;
  details?: string;
  location?: string;
  start: Date | null;
}): string {
  if (!params.start) return '';
  const stamp = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
  const end = new Date(params.start.getTime() + 4 * 60 * 60 * 1000);
  const search = new URLSearchParams({
    action: 'TEMPLATE',
    text: params.title,
    dates: `${stamp(params.start)}/${stamp(end)}`,
  });
  if (params.details) search.set('details', params.details);
  if (params.location) search.set('location', params.location);
  return `https://calendar.google.com/calendar/render?${search.toString()}`;
}
