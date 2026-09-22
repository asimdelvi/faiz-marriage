type Props = { className?: string; width?: number };

/** Gold filigree divider: an eight-pointed khatam star between tapering rules. */
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
      <path d="M4 12h56" stroke="var(--color-accent)" strokeOpacity="0.5" strokeWidth="1" />
      <path d="M120 12h56" stroke="var(--color-accent)" strokeOpacity="0.5" strokeWidth="1" />
      <g transform="translate(90 12)" stroke="var(--color-accent)" strokeWidth="1">
        <rect x="-7.5" y="-7.5" width="15" height="15" />
        <rect x="-7.5" y="-7.5" width="15" height="15" transform="rotate(45)" />
      </g>
      <circle cx="66" cy="12" r="1.8" fill="var(--color-accent)" fillOpacity="0.7" />
      <circle cx="114" cy="12" r="1.8" fill="var(--color-accent)" fillOpacity="0.7" />
      <path d="M72 12h6M102 12h6" stroke="var(--color-accent)" strokeOpacity="0.6" strokeWidth="1" />
    </svg>
  );
}

export default Ornament;
