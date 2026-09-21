/** Date/time helpers. Everything tolerates an empty or malformed config value. */

export function parseWeddingDate(date: string, time?: string): Date | null {
  const raw = (date ?? '').trim();
  if (!raw) return null;
  const isoish = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T00:00:00` : raw;
  const parsed = new Date(isoish);
  if (Number.isNaN(parsed.getTime())) return null;

  // Best-effort: lift a "7:00 PM"-style time out of the free-text time field.
  const match = (time ?? '').match(/(\d{1,2})[:.](\d{2})\s*(am|pm)?/i);
  if (match) {
    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const meridiem = match[3]?.toLowerCase();
    if (meridiem === 'pm' && hours < 12) hours += 12;
    if (meridiem === 'am' && hours === 12) hours = 0;
    parsed.setHours(hours, minutes, 0, 0);
  }
  return parsed;
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
