import { config } from '../config';
import { promptText, type PromptKey } from './prompts';
import type { ImageRef } from '../types';

/**
 * Prefixes site-root paths with Vite's base URL, so '/images/hero.jpg' keeps
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

export type ResolvedImage = {
  /** Undefined when no real asset exists — render generated artwork instead. */
  src?: string;
  alt: string;
  prompt: string;
};

/** Stable 32-bit hash so generated artwork is deterministic per prompt. */
export function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * Turns a config image reference into something renderable.
 * Order of preference: supplied asset → configured AI generator → built-in art.
 */
export function resolveImage(
  image: ImageRef | string | undefined,
  fallbackKey: PromptKey,
  alt: string,
): ResolvedImage {
  const ref: ImageRef = typeof image === 'string' ? { src: image } : (image ?? {});
  const prompt = promptText(ref.prompt, fallbackKey);
  const resolvedAlt = ref.alt?.trim() || alt;

  if (ref.src?.trim()) return { src: asset(ref.src), alt: resolvedAlt, prompt };

  const generator = config.imageGenerator?.trim();
  if (generator) {
    const src = generator
      .replace('{prompt}', encodeURIComponent(prompt))
      .replace('{seed}', String(hashString(prompt) % 100000));
    return { src, alt: resolvedAlt, prompt };
  }

  return { alt: resolvedAlt, prompt };
}
