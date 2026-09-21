import { m as motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type Variant = 'solid' | 'outline' | 'ghost' | 'light' | 'onDark';

const base =
  'inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-[0.82rem] font-medium tracking-[0.16em] uppercase transition-colors duration-300 select-none';

const variants: Record<Variant, string> = {
  solid: 'bg-primary text-on-primary shadow-[var(--shadow-soft)] hover:bg-espresso',
  outline:
    'border border-[color-mix(in_srgb,var(--color-primary)_45%,transparent)] text-primary hover:bg-[color-mix(in_srgb,var(--color-secondary)_55%,transparent)]',
  ghost: 'text-primary hover:text-espresso',
  light:
    'bg-[color-mix(in_srgb,#fff_88%,transparent)] text-espresso shadow-[var(--shadow-soft)] hover:bg-white',
  /* For use over photography: ivory on a hairline border. */
  onDark: 'border border-ivory/45 text-ivory hover:border-ivory hover:bg-ivory/10',
};

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  ariaLabel?: string;
  /** External links open in a new tab with safe rel attributes. */
  external?: boolean;
  type?: 'button' | 'submit';
};

export function Button({
  children,
  href,
  onClick,
  variant = 'solid',
  className = '',
  ariaLabel,
  external = true,
  type = 'button',
}: Props) {
  const reduce = useReducedMotion();
  const motionProps = reduce
    ? {}
    : {
        whileHover: { scale: 1.03 },
        whileTap: { scale: 0.98 },
        transition: { type: 'spring' as const, stiffness: 340, damping: 22 },
      };
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    const isAnchor = href.startsWith('#');
    return (
      <motion.a
        href={href}
        aria-label={ariaLabel}
        className={classes}
        onClick={onClick}
        {...(external && !isAnchor ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} aria-label={ariaLabel} onClick={onClick} className={classes} {...motionProps}>
      {children}
    </motion.button>
  );
}

export default Button;
