import { m as motion, useReducedMotion } from 'framer-motion';

type Props = { playing: boolean; onToggle: () => void };

/** Floating, always-reachable play/pause control for the background music. */
export function MusicPlayer({ playing, onToggle }: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-pressed={playing}
      aria-label={playing ? 'Pause background music' : 'Play background music'}
      title={playing ? 'Pause music' : 'Play music'}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.1, duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      whileHover={reduce ? undefined : { scale: 1.06 }}
      whileTap={reduce ? undefined : { scale: 0.94 }}
      className="glass-panel fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-accent)_38%,transparent)] text-primary shadow-[var(--shadow-soft)] sm:bottom-7 sm:right-7 sm:h-14 sm:w-14"
    >
      <span aria-hidden="true" className="flex h-4 items-end gap-[3px]">
        {[0, 1, 2, 3].map((bar) => (
          <motion.span
            key={bar}
            className="w-[2.5px] rounded-full bg-current"
            initial={false}
            animate={
              playing && !reduce
                ? { height: ['30%', '100%', '45%', '85%', '30%'] }
                : { height: playing ? '70%' : '35%' }
            }
            transition={
              playing && !reduce
                ? { duration: 1.1 + bar * 0.18, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.3 }
            }
            style={{ height: '35%' }}
          />
        ))}
      </span>
      {!playing ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-ivory)_55%,transparent)]"
        >
          <svg width="13" height="14" viewBox="0 0 13 14" fill="currentColor" aria-hidden="true">
            <path d="M1.5 1.2a.6.6 0 0 1 .92-.5l9 5.8a.6.6 0 0 1 0 1l-9 5.8a.6.6 0 0 1-.92-.5V1.2Z" />
          </svg>
        </span>
      ) : null}
    </motion.button>
  );
}

export default MusicPlayer;
