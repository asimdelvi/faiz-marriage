import { m as motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Index within a group — 100ms of stagger per step. */
  index?: number;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'article' | 'section';
  y?: number;
};

/** Fade-up on first view, with stagger. Collapses to a plain fade when the
 *  visitor asks for reduced motion. */
export function Reveal({ children, index = 0, delay = 0, className, as = 'div', y = 28 }: Props) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25, margin: '0px 0px -8% 0px' }}
      transition={{
        duration: reduce ? 0.3 : 0.75,
        delay: delay + index * 0.1,
        ease: [0.22, 0.61, 0.36, 1],
      }}
    >
      {children}
    </Component>
  );
}

export default Reveal;
