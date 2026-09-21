type Props = { className?: string; width?: number };

/** Gold filigree divider used between sections and under headings. */
export function Ornament({ className = '', width = 180 }: Props) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={width}
      viewBox="0 0 180 24"
      fill="none"
      className={className}
    >
      <path d="M2 12h58" stroke="var(--color-accent)" strokeOpacity="0.55" strokeWidth="1" />
      <path d="M120 12h58" stroke="var(--color-accent)" strokeOpacity="0.55" strokeWidth="1" />
      <path
        d="M90 3c7 6 7 12 0 18-7-6-7-12 0-18Z"
        stroke="var(--color-accent)"
        strokeWidth="1"
        fill="color-mix(in srgb, var(--color-accent) 18%, transparent)"
      />
      <path d="M72 12c6-5 11-5 14 0-3 5-8 5-14 0Z" stroke="var(--color-accent)" strokeWidth="1" />
      <path d="M108 12c-6-5-11-5-14 0 3 5 8 5 14 0Z" stroke="var(--color-accent)" strokeWidth="1" />
      <circle cx="64" cy="12" r="2" fill="var(--color-accent)" fillOpacity="0.7" />
      <circle cx="116" cy="12" r="2" fill="var(--color-accent)" fillOpacity="0.7" />
    </svg>
  );
}

export default Ornament;
