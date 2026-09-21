import { useRef } from 'react';
import { m as motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import SmartImage from '../components/ui/SmartImage';
import Ornament from '../components/ui/Ornament';
import Button from '../components/ui/Button';
import { formatLongDate } from '../lib/format';
import type { SiteConfig } from '../types';

type Props = {
  config: SiteConfig;
  bride: string;
  groom: string;
  rsvpHref: string;
  rsvpLabel: string;
};

const Petal = ({ className, delay }: { className: string; delay: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 60 60"
    className={className}
    style={{ animationDelay: delay }}
  >
    <path
      d="M30 4c14 14 14 38 0 52C16 42 16 18 30 4Z"
      fill="var(--color-accent)"
      fillOpacity="0.32"
    />
  </svg>
);

export function Hero({ config, bride, groom, rsvpHref, rsvpLabel }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '16%']);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '28%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, reduce ? 1 : 0]);

  const longDate = formatLongDate(config.weddingDate);
  const hasVideo = Boolean(config.heroVideo?.trim()) && !reduce;

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-espresso"
    >
      <motion.div style={{ y: mediaY, scale: mediaScale }} className="absolute inset-0 will-change-transform">
        {hasVideo ? (
          <video
            className="h-full w-full object-cover"
            src={config.heroVideo}
            poster={config.heroImage || undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
          />
        ) : (
          <SmartImage
            image={config.heroImage}
            fallbackKey="PROMPT_HERO"
            alt={`${bride} and ${groom}`}
            ratio="auto"
            priority
            artVariant="hero"
            className="h-full w-full"
            sizes="100vw"
          />
        )}
      </motion.div>

      <div aria-hidden="true" className="hero-scrim absolute inset-0" />

      {!reduce ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <Petal className="float-slow absolute left-[8%] top-[18%] h-10 w-10" delay="0s" />
          <Petal className="float-slower absolute right-[12%] top-[28%] h-14 w-14" delay="1.2s" />
          <Petal className="float-slow absolute bottom-[22%] left-[18%] h-8 w-8" delay="2.4s" />
          <Petal className="float-slower absolute bottom-[14%] right-[20%] h-12 w-12" delay="0.6s" />
        </div>
      ) : null}

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 w-full max-w-4xl px-6 pb-24 pt-28 text-center sm:pb-28"
      >
        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 0.61, 0.36, 1] }}
          className="text-[0.7rem] uppercase tracking-[0.42em] text-ivory/80 sm:text-xs"
        >
          {config.heroEyebrow || 'Together with our families'}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: reduce ? 1 : 0.94, y: reduce ? 0 : 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
          className="font-display mt-6 text-balance text-[3.1rem] leading-[1.02] text-ivory drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)] sm:text-7xl lg:text-8xl"
        >
          {bride}
          <span className="mx-3 inline-block align-middle text-[0.55em] text-[color-mix(in_srgb,var(--color-accent)_85%,#fff)] sm:mx-5">
            &amp;
          </span>
          {groom}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.7 }}
          className="mt-8 flex flex-col items-center gap-5"
        >
          <Ornament className="opacity-90" width={200} />
          <p className="text-sm uppercase tracking-[0.3em] text-ivory/90 sm:text-base">
            {[longDate, config.weddingTime].filter(Boolean).join('  ·  ')}
          </p>
          {config.venueName ? (
            <p className="max-w-xl text-balance text-sm text-ivory/75 sm:text-base">
              {config.venueName}
            </p>
          ) : null}
          {config.heroSubtitle ? (
            <p className="font-display max-w-xl text-balance text-lg italic text-ivory/85 sm:text-xl">
              {config.heroSubtitle}
            </p>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.95, ease: [0.22, 0.61, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {rsvpHref ? (
            <Button href={rsvpHref} variant="light">
              {rsvpLabel}
            </Button>
          ) : null}
          <Button href="#events" variant="onDark">
            View the celebrations
          </Button>
        </motion.div>
      </motion.div>

      <motion.a
        href="#story"
        aria-label="Scroll to the story"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-ivory/75 transition-colors hover:text-ivory"
      >
        <motion.span
          animate={reduce ? {} : { y: [0, 9, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[0.62rem] uppercase tracking-[0.3em]">Scroll</span>
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden="true">
            <rect x="0.5" y="0.5" width="13" height="21" rx="6.5" stroke="currentColor" />
            <circle cx="7" cy="7" r="2" fill="currentColor" />
          </svg>
        </motion.span>
      </motion.a>
    </section>
  );
}

export default Hero;
