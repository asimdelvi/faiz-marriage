import type { CSSProperties, ReactNode } from 'react';
import qrcode from 'qrcode-generator';

/** Delay helper for staggered reveals: <div style={d(0.4)}>. */
export const d = (seconds: number): CSSProperties => ({ ['--d' as string]: `${seconds}s` });

export function Divider({ delay = 0 }: { delay?: number }) {
  return (
    <div className="divider r r-line" style={d(delay)} aria-hidden="true">
      <i />
      <b />
      <i />
    </div>
  );
}

/** Arabic text, marked up so screen readers and fonts treat it correctly. */
export function Arabic({ children, className = '', delay = 0, variant = 'r-rise' }: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: string;
}) {
  return (
    <p lang="ar" dir="rtl" className={`arabic r ${variant} ${className}`} style={d(delay)}>
      {children}
    </p>
  );
}

/**
 * Each letter flips up on its own, a beat after the one before. Letters are
 * grouped per word so a long name wraps between words, never mid-word.
 */
export function Letters({ text, start, step = 0.07 }: { text: string; start: number; step?: number }) {
  let i = 0;
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <span className="letters" aria-label={text}>
      {words.map((word, w) => (
        <span key={w} className="word" aria-hidden="true">
          {[...word].map((ch) => {
            const delay = start + i++ * step;
            return (
              <span key={delay} className="r r-letter" style={d(delay)}>
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

export function Monogram({ a, b, className = '', delay = 0 }: { a: string; b: string; className?: string; delay?: number }) {
  return (
    <div className={`monogram r r-coin ${className}`} style={d(delay)} aria-hidden="true">
      <span>
        {a.charAt(0)}
        <em>&amp;</em>
        {b.charAt(0)}
      </span>
    </div>
  );
}

/** A crisp SVG QR code. Only shown on large screens, where guests scan it with a phone. */
export function Qr({ value, size = 120 }: { value: string; size?: number }) {
  const qr = qrcode(0, 'M');
  qr.addData(value);
  qr.make();
  const n = qr.getModuleCount();
  const quiet = 2;
  const total = n + quiet * 2;
  let path = '';
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (qr.isDark(y, x)) path += `M${x + quiet} ${y + quiet}h1v1h-1z`;
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${total} ${total}`} shapeRendering="crispEdges" role="img" aria-label="QR code">
      <rect width={total} height={total} fill="#FFFDF8" />
      <path d={path} fill="#2E2018" />
    </svg>
  );
}

export const Icon = {
  crescent: (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.5 3.5a8.5 8.5 0 1 0 5 15.4A7 7 0 1 1 15.5 3.5Z" fill="currentColor" />
      <path d="M19 6l.7 1.6 1.7.2-1.3 1.1.4 1.7-1.5-.9-1.5.9.4-1.7-1.3-1.1 1.7-.2Z" fill="currentColor" />
    </svg>
  ),
  feast: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M3 16h18M5 16a7 7 0 0 1 14 0M12 7V5.5M10.5 5.5h3M4 19h16" />
    </svg>
  ),
  pin: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  ),
  chat: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5l1.3-3.8A8 8 0 1 1 8.4 18.6Z" />
      <path d="M9 10.5h6M9 13.5h4" />
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  ),
  phone: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  ),
  sound: (on: boolean) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      {on ? <path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" /> : <path d="M16 9.5l5 5M21 9.5l-5 5" />}
    </svg>
  ),
  chevron: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
};
