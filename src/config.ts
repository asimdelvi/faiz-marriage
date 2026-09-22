import type { SiteConfig } from './types';
import data from './config.json';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  The content lives in `config.json` — that is the file to edit.
 *  This module only gives it a type and hands it to the app.
 *
 *  Leave a field as "" or [] and the site degrades gracefully: missing images
 *  become generated artwork, and a section with no content hides itself along
 *  with its navigation link.
 *  ─────────────────────────────────────────────────────────────────────────────
 */
export const config = data as SiteConfig;

export default config;
