import { useEffect, useMemo, useState } from 'react';
import Reveal from './ui/Reveal';
import { countdownTo, parseWeddingDate } from '../lib/format';

type Props = { date: string; time?: string; className?: string };

const UNITS: { key: 'days' | 'hours' | 'minutes' | 'seconds'; label: string }[] = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
];

/** Live countdown to the muhurat. Renders nothing without a valid date. */
export function Countdown({ date, time, className = '' }: Props) {
  const target = useMemo(() => parseWeddingDate(date, time), [date, time]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!target) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const countdown = countdownTo(target, now);
  if (!countdown) return null;

  if (countdown.done) {
    return (
      <p className={`font-display text-center text-2xl text-primary ${className}`}>
        The celebrations have begun.
      </p>
    );
  }

  return (
    <div
      className={`grid grid-cols-4 gap-2 sm:gap-4 ${className}`}
      role="timer"
      aria-live="off"
      aria-label={`${countdown.days} days until the wedding`}
    >
      {UNITS.map((unit, index) => (
        <Reveal key={unit.key} index={index} className="card px-2 py-5 text-center sm:px-4 sm:py-7">
          <span className="font-display block text-3xl tabular-nums text-espresso sm:text-5xl">
            {String(countdown[unit.key]).padStart(2, '0')}
          </span>
          <span className="mt-2 block text-[0.6rem] uppercase tracking-[0.22em] text-mocha sm:text-xs">
            {unit.label}
          </span>
        </Reveal>
      ))}
    </div>
  );
}

export default Countdown;
