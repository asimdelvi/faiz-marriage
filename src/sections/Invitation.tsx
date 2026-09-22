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
      {config.blessing?.text ? (
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="font-display text-balance text-lg italic leading-relaxed text-primary sm:text-xl">
            “{config.blessing.text}”
          </p>
          {config.blessing.reference ? (
            <p className="mt-3 text-[0.68rem] uppercase tracking-[0.22em] text-mocha">
              {config.blessing.reference}
            </p>
          ) : null}
        </Reveal>
      ) : null}

      {config.invitationNote ? (
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-balance leading-relaxed text-mocha sm:text-lg">
            {config.invitationNote}
          </p>
        </Reveal>
      ) : null}

      {details.length ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {details.map((detail, index) => (
            <Reveal key={detail.label} index={index} className="card px-5 py-6 text-center">
              <p className="eyebrow mb-3">{detail.label}</p>
              <p className="font-display text-balance text-lg text-espresso sm:text-xl">
                {detail.value}
              </p>
            </Reveal>
          ))}
        </div>
      ) : null}

      <Countdown date={config.weddingDate} time={config.weddingTime} className="mt-10" />

      {addToCalendar ? (
        <Reveal className="mt-9 flex justify-center">
          <Button href={addToCalendar} variant="outline">
            Add to calendar
          </Button>
        </Reveal>
      ) : null}
    </Section>
  );
}

export default Invitation;
