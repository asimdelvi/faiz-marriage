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
  if (key.includes('mangni') || key.includes('engagement') || key.includes('nisbat'))
    return 'PROMPT_MANGNI';
  if (key.includes('mehendi') || key.includes('mehndi') || key.includes('henna')) return 'PROMPT_MEHENDI';
  if (key.includes('haldi') || key.includes('manjha') || key.includes('ubtan')) return 'PROMPT_HALDI';
  if (key.includes('sangeet') || key.includes('dholki') || key.includes('dance')) return 'PROMPT_SANGEET';
  if (key.includes('baraat') || key.includes('barat')) return 'PROMPT_BARAAT';
  if (key.includes('walima') || key.includes('reception')) return 'PROMPT_WALIMA';
  if (key.includes('dinner') || key.includes('lunch') || key.includes('dawat')) return 'PROMPT_DINNER';
  if (key.includes('nikah') || key.includes('nikkah') || key.includes('wedding'))
    return 'PROMPT_NIKAH';
  return 'PROMPT_HERO_COUPLE';
}

export function Timeline({ events, fallbackMapsUrl }: Props) {
  if (!events.length) return null;

  /* When every gathering falls on one date, say so rather than "days". */
  const dates = new Set(events.map((event) => event.date).filter(Boolean));
  const oneDay = dates.size <= 1;

  /* One card fills the row, two sit side by side, more wrap into three. */
  const columns =
    events.length === 1
      ? 'max-w-xl mx-auto'
      : events.length === 2
        ? 'sm:grid-cols-2 max-w-4xl mx-auto'
        : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <Section
      id="events"
      tone="cream"
      eyebrow="The celebrations"
      title={oneDay ? 'The day itself' : 'Days of joy'}
      description={
        oneDay
          ? 'How the day will unfold. We would love to see you through all of it.'
          : 'Every gathering, in the order the days will unfold.'
      }
    >
      <ol className={`grid gap-5 sm:gap-6 ${columns}`}>
        {events.map((event, index) => {
          const date = event.date ? formatShortDate(event.date) || event.date : '';
          const mapsUrl = event.mapsUrl || fallbackMapsUrl;

          return (
            <Reveal as="li" key={event.id} index={index % 3} className="h-full">
              <article className="card group flex h-full flex-col overflow-hidden">
                <div className="relative overflow-hidden">
                  <SmartImage
                    image={event.image}
                    fallbackKey={promptKeyFor(event)}
                    alt={event.title}
                    label={event.title}
                    ratio="16 / 9"
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                    imgClassName="group-hover:scale-[1.06]"
                  />
                  <span className="font-display absolute right-3 top-3 rounded-full bg-[color-mix(in_srgb,var(--color-ivory)_88%,transparent)] px-3 py-1 text-xs tracking-[0.12em] text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-5 py-5">
                  <h3 className="font-display text-xl text-espresso sm:text-2xl">{event.title}</h3>
                  {date || event.time ? (
                    <p className="mt-1.5 text-[0.68rem] uppercase tracking-[0.16em] text-primary">
                      {[date, event.time].filter(Boolean).join(' · ')}
                    </p>
                  ) : null}
                  {event.venue ? (
                    <p className="mt-2.5 flex items-start gap-1.5 text-sm leading-snug text-mocha/90">
                      <svg
                        aria-hidden="true"
                        width="13"
                        height="13"
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
                  {event.description ? (
                    <p className="mt-3 text-sm leading-relaxed text-mocha">{event.description}</p>
                  ) : null}
                  {mapsUrl ? (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.68rem] uppercase tracking-[0.16em] text-primary underline-offset-4 hover:underline"
                    >
                      Directions
                      <span aria-hidden="true">→</span>
                    </a>
                  ) : null}
                </div>
              </article>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}

export default Timeline;
