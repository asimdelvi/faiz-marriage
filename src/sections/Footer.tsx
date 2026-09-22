import Monogram from '../components/ui/Monogram';
import Ornament from '../components/ui/Ornament';
import Reveal from '../components/ui/Reveal';
import { formatLongDate } from '../lib/format';
import { instagramUrl } from '../lib/links';
import type { SiteConfig } from '../types';

type Props = { config: SiteConfig; bride: string; groom: string; pair: string };

export function Footer({ config, bride, groom, pair }: Props) {
  const instagram = instagramUrl(config.socialLinks?.instagram ?? '');
  const hashtag = config.hashtag?.trim()
    ? config.hashtag.trim().startsWith('#')
      ? config.hashtag.trim()
      : `#${config.hashtag.trim()}`
    : '';
  const longDate = formatLongDate(config.weddingDate);

  return (
    <footer className="paper border-t border-[color-mix(in_srgb,var(--color-accent)_25%,transparent)] px-6 py-12 text-center sm:py-14">
      <Reveal className="mx-auto max-w-xl">
        <div className="flex h-10 items-center justify-center">
          <Monogram bride={bride} groom={groom} logo={config.logo} size="text-3xl" />
        </div>
        <Ornament className="mx-auto mt-6" width={150} />

        {hashtag ? (
          <p className="font-display mt-8 text-2xl text-primary sm:text-3xl">{hashtag}</p>
        ) : null}

        <p className="mt-6 text-sm leading-relaxed text-mocha">
          {pair}
          {longDate ? ` · ${longDate}` : ''}
          {config.venueName ? <span className="block mt-1">{config.venueName}</span> : null}
        </p>

        {instagram ? (
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on Instagram"
            className="mt-8 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-accent)_40%,transparent)] text-primary transition-colors hover:bg-[color-mix(in_srgb,var(--color-secondary)_60%,transparent)]"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
            </svg>
          </a>
        ) : null}

        {config.footerNote ? (
          <p className="mx-auto mt-8 max-w-md text-balance text-sm leading-relaxed text-mocha">
            {config.footerNote}
          </p>
        ) : null}

        <p className="mt-8 text-[0.68rem] uppercase tracking-[0.24em] text-mocha/70">
          Made with love
        </p>
      </Reveal>
    </footer>
  );
}

export default Footer;
