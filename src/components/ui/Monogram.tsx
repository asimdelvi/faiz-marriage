import { asset } from '../../lib/media';

type Props = {
  bride: string;
  groom: string;
  logo?: string;
  className?: string;
  /** Tailwind text size class for the initials. */
  size?: string;
  /** 'light' is for use over the hero, before the navigation frosts over. */
  tone?: 'brand' | 'light';
};

const initial = (name: string) => (name.trim()[0] ?? '').toUpperCase();

/** The couple's mark: their logo when supplied, an engraved monogram otherwise. */
export function Monogram({ bride, groom, logo, className = '', size = 'text-base', tone = 'brand' }: Props) {
  if (logo?.trim()) {
    return (
      <img
        src={asset(logo)}
        alt={`${bride} and ${groom} monogram`}
        className={`h-full w-auto object-contain ${className}`}
        loading="eager"
        decoding="async"
      />
    );
  }

  return (
    <span
      className={`font-display inline-flex items-center gap-1 leading-none transition-colors duration-300 ${
        tone === 'light' ? 'text-ivory' : 'text-primary'
      } ${size} ${className}`}
      aria-label={`${bride} and ${groom}`}
    >
      <span>{initial(bride) || 'B'}</span>
      <span className={tone === 'light' ? 'text-[#e7c79a]' : 'text-accent'} aria-hidden="true">
        &
      </span>
      <span>{initial(groom) || 'G'}</span>
    </span>
  );
}

export default Monogram;
