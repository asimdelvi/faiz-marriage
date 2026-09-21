import type { SiteConfig } from '../types';

const FALLBACK = { primary: '#8D5B4C', secondary: '#E8D8C3', accent: '#C79B63' };

function normaliseHex(value: string | undefined, fallback: string): string {
  const hex = (value ?? '').trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) {
    return hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex;
  }
  return fallback;
}

export function hexToRgb(hex: string): [number, number, number] {
  const clean = normaliseHex(hex, '#000000').slice(1);
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

/** Relative luminance (WCAG) — used to keep text legible on any palette. */
export function luminance(hex: string): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Returns ivory or deep espresso — whichever reads better on `hex`. */
export function readableOn(hex: string): string {
  return luminance(hex) > 0.45 ? '#3A2C26' : '#FBF7F1';
}

/**
 * Pushes the configured palette into CSS custom properties so Tailwind
 * utilities, gradients and shadows all follow the config.
 */
export function applyTheme(colors: SiteConfig['colors'], root: HTMLElement = document.documentElement) {
  const primary = normaliseHex(colors?.primary, FALLBACK.primary);
  const secondary = normaliseHex(colors?.secondary, FALLBACK.secondary);
  const accent = normaliseHex(colors?.accent, FALLBACK.accent);

  const set = (name: string, value: string) => root.style.setProperty(name, value);
  set('--brand-primary', primary);
  set('--brand-secondary', secondary);
  set('--brand-accent', accent);
  set('--brand-primary-rgb', hexToRgb(primary).join(' '));
  set('--brand-secondary-rgb', hexToRgb(secondary).join(' '));
  set('--brand-accent-rgb', hexToRgb(accent).join(' '));
  set('--brand-on-primary', readableOn(primary));
  set('--brand-on-accent', readableOn(accent));
}
