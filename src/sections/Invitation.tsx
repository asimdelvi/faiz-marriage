import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import Countdown from '../components/Countdown';
import { formatLongDate, parseWeddingDate } from '../lib/format';
import { calendarUrl } from '../lib/links';
import type { SiteConfig } from '../types';

type Props = { config: SiteConfig; pair: string };

/** The formal invitation line, the essential details, and the countdown. */
export function Invitation({ config, pair }: Props) {
  const longDate = formatLongDate(config.weddingDate);
  const start = parseWeddingDate(config.weddingDate, config.weddingTime);
  const addToCalendar = calendarUrl({
    title: `${pair} — Wedding`,
    details: config.invitationNote,
    location: [config.venueName, config.venueAddress].filter(Boolean).join(', '),
    start,
  });

  const details = [
    { label: 'The date', value: longDate },
    { label: 'The hour', value: config.weddingTime },
    { label: 'The place', value: config.venueName },
  ].filter((detail) => Boolean(detail.value));

  return (
    <Section id="invitation" tone="paper" eyebrow="The invitation" title="Save the date">
      {config.invitationNote ? (
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-display text-balance text-xl leading-relaxed text-espresso sm:text-2xl">
            {config.invitationNote}
          </p>
        </Reveal>
      ) : null}

      {details.length ? (
        <div className="mt-14 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {details.map((detail, index) => (
            <Reveal key={detail.label} index={index} className="card px-6 py-8 text-center">
              <p className="eyebrow mb-3">{detail.label}</p>
              <p className="font-display text-balance text-xl text-espresso sm:text-2xl">
                {detail.value}
              </p>
            </Reveal>
          ))}
        </div>
      ) : null}

      <Countdown date={config.weddingDate} time={config.weddingTime} className="mt-14" />

      {addToCalendar ? (
        <Reveal className="mt-12 flex justify-center">
          <Button href={addToCalendar} variant="outline">
            Add to calendar
          </Button>
        </Reveal>
      ) : null}
    </Section>
  );
}

export default Invitation;
