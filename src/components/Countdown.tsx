import { useEffect, useState } from 'react';
import { countdownTo } from '../lib/format';
import { d } from './ui';

const UNITS = [
  ['days', 'Days'],
  ['hours', 'Hours'],
  ['minutes', 'Mins'],
  ['seconds', 'Secs'],
] as const;

/** Live countdown to the first ceremony. Renders nothing without a valid date. */
export default function Countdown({ target, delay }: { target: Date | null; delay: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!target) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const c = countdownTo(target, now);
  if (!c) return null;
  if (c.done) return <p className="italic countdown-done r r-rise" style={d(delay)}>Alhamdulillah — the celebrations have begun.</p>;

  return (
    <div className="countdown" role="timer" aria-label={`${c.days} days to go`}>
      {UNITS.map(([key, label], i) => (
        <div key={key} className="tile glass r r-coin" style={d(delay + i * 0.08)}>
          <b>{String(c[key]).padStart(2, '0')}</b>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
