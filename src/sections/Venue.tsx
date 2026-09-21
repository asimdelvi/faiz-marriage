import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import SmartImage from '../components/ui/SmartImage';
import Button from '../components/ui/Button';
import { directionsUrl, mapsEmbedUrl } from '../lib/links';
import type { SiteConfig } from '../types';

type Props = { config: SiteConfig };

export function Venue({ config }: Props) {
  const hasVenue = Boolean(
    config.venueName?.trim() || config.venueAddress?.trim() || config.googleMapsUrl?.trim(),
  );
  if (!hasVenue) return null;

  const embed = mapsEmbedUrl(config);
  const directions = directionsUrl(config);

  return (
    <Section id="venue" tone="paper" eyebrow="The venue" title="Where to find us">
      <Reveal className="card overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="group overflow-hidden">
            <SmartImage
              image={config.venueImage}
              fallbackKey="PROMPT_VENUE"
              alt={config.venueName || 'Wedding venue'}
              label={config.venueName}
              ratio="4 / 3"
              sizes="(max-width: 1024px) 92vw, 46vw"
              className="h-full"
              imgClassName="group-hover:scale-[1.05]"
            />
          </div>

          <div className="flex flex-col justify-center px-7 py-10 sm:px-10 sm:py-12">
            {config.venueName ? (
              <h3 className="font-display text-3xl text-espresso sm:text-4xl">{config.venueName}</h3>
            ) : null}
            {config.venueAddress ? (
              <p className="mt-4 text-balance leading-relaxed text-mocha">{config.venueAddress}</p>
            ) : null}
            {config.venueNote ? (
              <p className="mt-5 border-l-2 border-accent/50 pl-4 text-sm italic leading-relaxed text-mocha/90">
                {config.venueNote}
              </p>
            ) : null}
            {directions ? (
              <div className="mt-8">
                <Button href={directions} variant="solid">
                  Open directions
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {embed ? (
          <div className="border-t border-[color-mix(in_srgb,var(--color-accent)_22%,transparent)]">
            <iframe
              title={`Map to ${config.venueName || 'the wedding venue'}`}
              src={embed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block h-[320px] w-full border-0 sm:h-[420px]"
            />
          </div>
        ) : null}
      </Reveal>
    </Section>
  );
}

export default Venue;
