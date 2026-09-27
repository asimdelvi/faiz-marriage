/**
 * Prefixes site-root paths with Vite's base URL, so '/music/ambient.m4a' keeps
 * working when the site is served from a subdirectory (GitHub Pages).
 * Absolute URLs and data URIs pass through untouched.
 */
export function asset(path: string | undefined): string {
  const value = (path ?? '').trim();
  if (!value) return '';
  if (/^([a-z]+:)?\/\//i.test(value) || /^(data|blob):/i.test(value)) return value;
  if (!value.startsWith('/')) return value;
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return `${base}${value}`;
}
