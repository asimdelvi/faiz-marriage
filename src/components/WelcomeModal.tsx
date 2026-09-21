import { useEffect, useRef } from 'react';
import { m as motion } from 'framer-motion';
import Button from './ui/Button';
import Monogram from './ui/Monogram';
import Ornament from './ui/Ornament';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

type Props = {
  bride: string;
  groom: string;
  logo?: string;
  onAccept: () => void;
  onDecline: () => void;
};

/**
 * Shown before any sound plays on platforms where surprise audio is jarring
 * (Android). Opening the invitation is the visitor's choice, not ours.
 */
export function WelcomeModal({ bride, groom, logo, onAccept, onDecline }: Props) {
  const acceptRef = useRef<HTMLDivElement>(null);
  useLockBodyScroll(true);

  useEffect(() => {
    const focusable = acceptRef.current?.querySelector<HTMLElement>('a, button');
    focusable?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDecline();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDecline]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[color-mix(in_srgb,var(--color-espresso)_72%,transparent)] px-6 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
        className="card w-full max-w-sm px-7 py-10 text-center"
      >
        <div className="flex h-10 items-center justify-center">
          <Monogram bride={bride} groom={groom} logo={logo} size="text-3xl" />
        </div>
        <Ornament className="mx-auto mt-5" width={140} />
        <h2 id="welcome-title" className="font-display mt-6 text-2xl text-espresso">
          You are invited
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-mocha">
          This invitation has a little music. Would you like to hear it?
        </p>
        <div ref={acceptRef} className="mt-8 flex flex-col gap-3">
          <Button onClick={onAccept} variant="solid" className="w-full">
            Open with music
          </Button>
          <Button onClick={onDecline} variant="ghost" className="w-full">
            Continue silently
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default WelcomeModal;
