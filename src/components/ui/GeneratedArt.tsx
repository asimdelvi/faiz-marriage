import { useId } from 'react';
import { hashString } from '../../lib/media';

type Props = {
  /** The AI prompt this artwork stands in for — exposed for the asset pipeline. */
  prompt: string;
  /** Accessible description of what the missing photograph would show. */
  label?: string;
  /** 'panel' suits cards; 'hero' paints a wide, cinematic backdrop. */
  variant?: 'panel' | 'hero';
  /**
   * Distinguishes artwork that shares a prompt — without it every family card
   * (all drawn from the same prompt) would come out identical.
   */
  seed?: string;
  className?: string;
};

/** Points of an n-pointed star, alternating outer and inner radius. */
function starPoints(points: number, outer: number, inner: number, offset = 0): string {
  const coords: string[] = [];
  for (let i = 0; i < points * 2; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI / points) * i + offset;
    coords.push(`${(radius * Math.sin(angle)).toFixed(2)},${(-radius * Math.cos(angle)).toFixed(2)}`);
  }
  return coords.join(' ');
}

/**
 * Hand-drawn stand-in artwork for any image the couple hasn't supplied yet:
 * khatam (eight-pointed star) geometry and a mihrab arch, in the configured
 * palette. Deterministic per image, ~2 KB, and no network requests — so a
 * half-filled config still looks intentional.
 */
export function GeneratedArt({ prompt, label, variant = 'panel', seed: seedKey, className }: Props) {
  const uid = useId().replace(/:/g, '');
  const signature = seedKey ? `${prompt}|${seedKey}` : prompt;
  const seed = hashString(signature);
  const rotation = seed % 45;
  const ringDash = 3 + (seed % 6);
  const innerRing = 108 + (seed % 18);
  const satellites = 8 + (seed % 5);
  const title = label ? `Artwork placeholder: ${label}` : 'Decorative artwork placeholder';

  if (variant === 'hero') {
    const lanterns = Array.from({ length: 9 }, (_, i) => ({
      x: hashString(`${signature}-x-${i}`) % 1600,
      y: 90 + (hashString(`${signature}-y-${i}`) % 700),
      r: 10 + (hashString(`${signature}-r-${i}`) % 16),
    }));

    return (
      <svg
        role="img"
        aria-label={title}
        data-ai-prompt={prompt}
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className={className}
      >
        <defs>
          <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#123b33" />
            <stop offset="45%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="#0d2621" />
          </linearGradient>
          <radialGradient id={`sun-${uid}`} cx="52%" cy="58%" r="52%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.72" />
            <stop offset="55%" stopColor="var(--color-accent)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1600" height="900" fill={`url(#sky-${uid})`} />
        <rect width="1600" height="900" fill={`url(#sun-${uid})`} />

        {/* A mihrab arch, drawn in gold thread */}
        <g fill="none" stroke="var(--color-accent)" strokeOpacity="0.32" strokeWidth="2">
          <path d="M440 900V470c0-140 80-250 180-300 100 50 180 160 180 300v430" transform="translate(180 0)" />
          <path
            d="M540 900V500c0-108 62-196 140-238 78 42 140 130 140 238v400"
            transform="translate(180 0)"
            strokeOpacity="0.2"
          />
          <g transform="translate(800 210)" strokeOpacity="0.45">
            <rect x="-26" y="-26" width="52" height="52" />
            <rect x="-26" y="-26" width="52" height="52" transform="rotate(45)" />
          </g>
        </g>

        {/* Lantern light, the way warm evening bokeh behaves on camera */}
        <g fill="var(--color-accent)">
          {lanterns.map((lantern, i) => (
            <circle
              key={i}
              cx={lantern.x}
              cy={lantern.y}
              r={lantern.r}
              fillOpacity={0.05 + (i % 3) * 0.03}
            />
          ))}
        </g>
      </svg>
    );
  }

  return (
    <svg
      role="img"
      aria-label={title}
      data-ai-prompt={prompt}
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity="0.95" />
          <stop offset="55%" stopColor="var(--color-cream)" />
          <stop offset="100%" stopColor="var(--color-sand)" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="45%" r="58%">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="400" fill={`url(#bg-${uid})`} />
      <rect width="400" height="400" fill={`url(#glow-${uid})`} />

      <g
        transform={`translate(200 200) rotate(${rotation})`}
        fill="none"
        stroke="var(--color-accent)"
        strokeOpacity="0.5"
        strokeWidth="1.2"
      >
        {/* Khatam: two squares at 45°, the classic eight-pointed star */}
        <rect x="-66" y="-66" width="132" height="132" />
        <rect x="-66" y="-66" width="132" height="132" transform="rotate(45)" strokeOpacity="0.38" />
        <rect x="-34" y="-34" width="68" height="68" strokeOpacity="0.32" />
        <rect x="-34" y="-34" width="68" height="68" transform="rotate(45)" strokeOpacity="0.26" />

        <circle r={innerRing} strokeDasharray={`${ringDash} ${ringDash * 2}`} strokeOpacity="0.38" />
        <circle r={innerRing + 26} strokeOpacity="0.22" />

        {/* Satellite stars around the ring */}
        {Array.from({ length: satellites }, (_, i) => (
          <polygon
            key={i}
            points={starPoints(8, 7, 3)}
            transform={`rotate(${(360 / satellites) * i}) translate(0 ${-(innerRing + 13)})`}
            strokeOpacity="0.45"
          />
        ))}
      </g>
    </svg>
  );
}

export default GeneratedArt;
