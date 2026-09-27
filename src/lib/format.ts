/** Date/time helpers. Everything tolerates an empty or malformed config value. */

/**
 * Parses the wedding date plus the first clock time found in the free-text
 * time field ("Nikah 4:00 PM · Walima 7:30 PM" → 16:00). With a timezone
 * offset such as "+05:30" the result is the exact instant at the venue, so the
 * countdown and calendar link are right for guests in any country.
 */
export function parseWeddingDate(date: string, time?: string, timezone?: string): Date | null {
  const raw = (date ?? '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const loose = raw ? new Date(raw) : null;
    return loose && !Number.isNaN(loose.getTime()) ? loose : null;
  }
  let hours = 0;
  let minutes = 0;
  const match = (time ?? '').match(/(\d{1,2})[:.](\d{2})\s*(am|pm)?/i);
  if (match) {
    hours = Number(match[1]);
    minutes = Number(match[2]);
    const meridiem = match[3]?.toLowerCase();
    if (meridiem === 'pm' && hours < 12) hours += 12;
    if (meridiem === 'am' && hours === 12) hours = 0;
  }
  const tz = (timezone ?? '').trim();
  const offset = /^[+-]\d{2}:\d{2}$/.test(tz) ? tz : '';
  const stamp = `${raw}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00${offset}`;
  const parsed = new Date(stamp);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatLongDate(date: string, locale = 'en-IN'): string {
  const parsed = parseWeddingDate(date);
  if (!parsed) return '';
  return parsed.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShortDate(date: string, locale = 'en-IN'): string {
  const parsed = parseWeddingDate(date);
  if (!parsed) return '';
  return parsed.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Splits the date into display parts for the hero stamp: 14 · 02 · 2026 */
export function dateParts(date: string): { day: string; month: string; year: string } | null {
  const parsed = parseWeddingDate(date);
  if (!parsed) return null;
  return {
    day: String(parsed.getDate()).padStart(2, '0'),
    month: String(parsed.getMonth() + 1).padStart(2, '0'),
    year: String(parsed.getFullYear()),
  };
}

export type Countdown = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

export function countdownTo(target: Date | null, now: number = Date.now()): Countdown | null {
  if (!target) return null;
  const diff = target.getTime() - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const seconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    done: false,
  };
}

/** UTC stamp for Schema.org / calendar links. */
export function toIsoStamp(date: Date | null): string {
  return date ? date.toISOString() : '';
}
