import type { ReactNode } from 'react';
import Ornament from './Ornament';
import Reveal from './Reveal';

type Props = {
  id: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  /** Alternating tones keep the long scroll from flattening out. */
  tone?: 'ivory' | 'cream' | 'paper';
  align?: 'center' | 'left';
};

const tones: Record<NonNullable<Props['tone']>, string> = {
  ivory: 'bg-ivory',
  cream: 'bg-cream',
  paper: 'paper',
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className = '',
  tone = 'ivory',
  align = 'center',
}: Props) {
  const headed = Boolean(eyebrow || title || description);

  return (
    <section
      id={id}
      aria-labelledby={title ? `${id}-title` : undefined}
      className={`scroll-mt-20 px-5 py-14 sm:px-8 sm:py-16 lg:py-20 ${tones[tone]} ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">
        {headed ? (
          <Reveal className={`mb-9 sm:mb-12 ${align === 'center' ? 'text-center' : ''}`}>
            {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
            {title ? (
              <h2
                id={`${id}-title`}
                className="font-display text-balance text-[1.9rem] leading-[1.15] text-espresso sm:text-4xl"
              >
                {title}
              </h2>
            ) : null}
            <Ornament className={`mt-5 ${align === 'center' ? 'mx-auto' : ''}`} width={150} />
            {description ? (
              <p
                className={`mt-4 max-w-2xl text-balance text-[0.95rem] leading-relaxed text-mocha sm:text-base ${
                  align === 'center' ? 'mx-auto' : ''
                }`}
              >
                {description}
              </p>
            ) : null}
          </Reveal>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export default Section;
