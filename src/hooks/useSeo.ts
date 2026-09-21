import { useEffect } from 'react';
import { buildMeta } from '../lib/meta';
import type { SiteConfig } from '../types';

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let node = document.head.querySelector<HTMLMetaElement>(selector);
  if (!node) {
    node = document.createElement('meta');
    document.head.appendChild(node);
  }
  Object.entries(attrs).forEach(([key, value]) => node!.setAttribute(key, value));
}

/**
 * Keeps the document head in sync with the config at runtime.
 * The same values are also written into index.html at build time
 * (scripts/generate-static.mjs) so crawlers and link previews see them
 * without executing JavaScript.
 */
export function useSeo(config: SiteConfig): void {
  useEffect(() => {
    const meta = buildMeta(config);

    document.title = meta.title;
    document.documentElement.lang = (meta.locale.split('_')[0] || 'en').toLowerCase();

    upsertMeta('meta[name="description"]', { name: 'description', content: meta.description });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: meta.title });
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: meta.description,
    });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: meta.locale });
    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: meta.ogImage ? 'summary_large_image' : 'summary',
    });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: meta.title });
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: meta.description,
    });
    if (meta.ogImage) {
      upsertMeta('meta[property="og:image"]', { property: 'og:image', content: meta.ogImage });
      upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: meta.ogImage });
    }
    if (meta.canonical) {
      upsertMeta('meta[property="og:url"]', { property: 'og:url', content: meta.canonical });
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = meta.canonical;
    }

    const id = 'schema-event';
    document.getElementById(id)?.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(meta.jsonLd);
    document.head.appendChild(script);
  }, [config]);
}
