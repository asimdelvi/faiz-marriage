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

/**
 * Hand-drawn stand-in artwork for any image the couple hasn't supplied yet.
 * Deterministic per prompt, uses the configured palette, weighs ~2 KB and
 * makes zero network requests — so a half-filled config still looks intentional.
 */
export function GeneratedArt({ prompt, label, variant = 'panel', seed: seedKey, className }: Props) {
  const uid = useId().replace(/:/g, '');
  const signature = seedKey ? `${prompt}|${seedKey}` : prompt;
  const seed = hashString(signature);
  const petals = 7 + (seed % 6);
  const rotation = seed % 45;
  const ringDash = 3 + (seed % 6);
  const innerRing = 108 + (seed % 18);
  const title = label ? `Artwork placeholder: ${label}` : 'Decorative artwork placeholder';

  if (variant === 'hero') {
    const motes = Array.from({ length: 10 }, (_, i) => {
      const x = hashString(`${signature}-x-${i}`) % 1600;
      const y = 90 + (hashString(`${signature}-y-${i}`) % 720);
      const r = 3 + (hashString(`${signature}-r-${i}`) % 6);
      return { x, y, r };
    });

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
            <stop offset="0%" stopColor="#5b3b31" />
            <stop offset="45%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="#2c211c" />
          </linearGradient>
          <radialGradient id={`sun-${uid}`} cx="52%" cy="58%" r="52%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.85" />
            <stop offset="55%" stopColor="var(--color-accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1600" height="900" fill={`url(#sky-${uid})`} />
        <rect width="1600" height="900" fill={`url(#sun-${uid})`} />

        {/* A suggestion of a mandap arch, drawn in gold thread */}
        <g fill="none" stroke="var(--color-accent)" strokeOpacity="0.3" strokeWidth="2">
          <path d="M420 900V520c0-210 170-380 380-380s380 170 380 380v380" />
          <path d="M520 900V540c0-155 125-280 280-280s280 125 280 280v360" strokeOpacity="0.18" />
          <circle cx="800" cy="196" r="34" strokeOpacity="0.4" />
          <path d="M800 150c22 22 22 46 0 68-22-22-22-46 0-68Z" strokeOpacity="0.5" />
        </g>

        {/* Soft bokeh, the way warm evening light behaves on camera */}
        <g fill="var(--color-accent)">
          {motes.map((mote, i) => (
            <circle
              key={i}
              cx={mote.x}
              cy={mote.y}
              r={mote.r * 3}
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
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.32" />
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
        {Array.from({ length: petals }, (_, i) => (
          <path
            key={i}
            d="M0 0 C 26 -34, 26 -78, 0 -104 C -26 -78, -26 -34, 0 0 Z"
            transform={`rotate(${(360 / petals) * i})`}
          />
        ))}
        <circle r={innerRing} strokeDasharray={`${ringDash} ${ringDash * 2}`} strokeOpacity="0.4" />
        <circle r={innerRing + 24} strokeOpacity="0.24" />
        <circle r="9" fill="var(--color-accent)" fillOpacity="0.45" stroke="none" />
      </g>
    </svg>
  );
}

export default GeneratedArt;
