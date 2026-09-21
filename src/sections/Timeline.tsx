import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import SmartImage from '../components/ui/SmartImage';
import { formatShortDate } from '../lib/format';
import type { PromptKey } from '../lib/prompts';
import type { TimelineEvent } from '../types';

type Props = { events: TimelineEvent[]; fallbackMapsUrl?: string };

/** Picks a context-aware fallback prompt from the ceremony's name. */
function promptKeyFor(event: TimelineEvent): PromptKey {
  const key = `${event.id} ${event.title}`.toLowerCase();
  if (key.includes('mehendi') || key.includes('mehndi') || key.includes('henna')) return 'PROMPT_MEHENDI';
  if (key.includes('haldi')) return 'PROMPT_HALDI';
  if (key.includes('sangeet') || key.includes('dance')) return 'PROMPT_SANGEET';
  if (key.includes('baraat') || key.includes('barat')) return 'PROMPT_BARAAT';
  if (key.includes('reception')) return 'PROMPT_RECEPTION';
  if (key.includes('dinner') || key.includes('lunch') || key.includes('feast')) return 'PROMPT_DINNER';
  if (key.includes('phere') || key.includes('wedding') || key.includes('nikah') || key.includes('vivah'))
    return 'PROMPT_SAAT_PHERE';
  return 'PROMPT_HERO_COUPLE';
}

export function Timeline({ events, fallbackMapsUrl }: Props) {
  if (!events.length) return null;

  return (
    <Section
      id="events"
      tone="cream"
      eyebrow="The celebrations"
      title="Days of joy"
      description="Every ritual, in the order the days will unfold. We would love to see you at each one."
    >
      <div className="relative">
        {/* The gold thread running through the ceremonies (desktop only). */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--color-accent)_60%,transparent)_12%,color-mix(in_srgb,var(--color-accent)_60%,transparent)_88%,transparent)] lg:block"
        />

        <ol className="space-y-8 lg:space-y-16">
          {events.map((event, index) => {
            const left = index % 2 === 0;
            const date = event.date ? formatShortDate(event.date) || event.date : '';
            const mapsUrl = event.mapsUrl || fallbackMapsUrl;

            return (
              <Reveal
                as="li"
                key={event.id}
                index={index % 3}
                className="relative lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-10"
              >
                <div className={left ? 'lg:col-start-1' : 'lg:col-start-3 lg:row-start-1'}>
                  <article className="card group overflow-hidden">
                    <div className="overflow-hidden">
                      <SmartImage
                        image={event.image}
                        fallbackKey={promptKeyFor(event)}
                        alt={event.title}
                        label={event.title}
                        ratio="16 / 10"
                        sizes="(max-width: 1024px) 92vw, 42vw"
                        imgClassName="group-hover:scale-[1.06]"
                      />
                    </div>
                    <div className="px-6 py-7 sm:px-8 sm:py-8">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="font-display text-2xl text-espresso sm:text-3xl">
                          {event.title}
                        </h3>
                        {date || event.time ? (
                          <p className="text-[0.72rem] uppercase tracking-[0.18em] text-primary">
                            {[date, event.time].filter(Boolean).join(' · ')}
                          </p>
                        ) : null}
                      </div>
                      {event.description ? (
                        <p className="mt-4 text-balance leading-relaxed text-mocha">
                          {event.description}
                        </p>
                      ) : null}
                      {event.venue ? (
                        <p className="mt-5 flex items-start gap-2 text-sm text-mocha/90">
                          <svg
                            aria-hidden="true"
                            width="15"
                            height="15"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="mt-0.5 shrink-0 text-accent"
                          >
                            <path
                              d="M8 1.5c2.5 0 4.5 2 4.5 4.5 0 3.2-4.5 8.5-4.5 8.5S3.5 9.2 3.5 6A4.5 4.5 0 0 1 8 1.5Z"
                              stroke="currentColor"
                              strokeWidth="1.2"
                            />
                            <circle cx="8" cy="6" r="1.6" fill="currentColor" />
                          </svg>
                          <span>{event.venue}</span>
                        </p>
                      ) : null}
                      {mapsUrl ? (
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 inline-flex items-center gap-1.5 text-[0.72rem] uppercase tracking-[0.18em] text-primary underline-offset-4 hover:underline"
                        >
                          Directions
                          <span aria-hidden="true">→</span>
                        </a>
                      ) : null}
                    </div>
                  </article>
                </div>

                {/* Centre marker */}
                <div className="hidden lg:col-start-2 lg:flex lg:items-center lg:justify-center">
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span className="absolute inline-flex h-9 w-9 rounded-full bg-[color-mix(in_srgb,var(--color-accent)_22%,transparent)]" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
                  </span>
                </div>

                <div className={`hidden lg:block ${left ? 'lg:col-start-3' : 'lg:col-start-1 lg:row-start-1'}`}>
                  <p className="font-display text-center text-5xl text-[color-mix(in_srgb,var(--color-accent)_55%,transparent)]">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

export default Timeline;
