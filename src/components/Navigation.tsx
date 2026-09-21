import { useEffect, useState } from 'react';
import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion';
import Monogram from './ui/Monogram';
import Button from './ui/Button';
import { useScrolled } from '../hooks/useScrolled';
import { useActiveSection } from '../hooks/useActiveSection';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

export type NavItem = { id: string; label: string };

type Props = {
  items: NavItem[];
  bride: string;
  groom: string;
  logo?: string;
  rsvpHref?: string;
  rsvpLabel?: string;
};

export function Navigation({ items, bride, groom, logo, rsvpHref, rsvpLabel = 'RSVP' }: Props) {
  const scrolled = useScrolled(60);
  const active = useActiveSection(items.map((item) => item.id));
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  useLockBodyScroll(open);
  /* Over the hero the bar is transparent, so its contents go ivory. */
  const light = !scrolled && !open;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:text-on-primary"
      >
        Skip to content
      </a>

      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled ? 'rgb(251 247 241 / 0.72)' : 'rgb(251 247 241 / 0)',
          backdropFilter: scrolled ? 'blur(18px) saturate(140%)' : 'blur(0px)',
          borderColor: scrolled ? 'rgb(199 155 99 / 0.28)' : 'rgb(199 155 99 / 0)',
          boxShadow: scrolled ? '0 10px 40px -28px rgb(58 44 38 / 0.6)' : '0 0 0 rgb(0 0 0 / 0)',
        }}
        transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 0.61, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 border-b"
        style={{ WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(140%)' : undefined }}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8"
        >
          <a
            href="#hero"
            className="flex h-8 items-center"
            aria-label={`${bride} and ${groom} — back to top`}
          >
            <Monogram
              bride={bride}
              groom={groom}
              logo={logo}
              size="text-lg sm:text-xl"
              tone={light ? 'light' : 'brand'}
            />
          </a>

          <ul className="hidden items-center gap-7 lg:flex">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? 'true' : undefined}
                  className={`relative text-[0.78rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                    light
                      ? active === item.id
                        ? 'text-ivory'
                        : 'text-ivory/75 hover:text-ivory'
                      : active === item.id
                        ? 'text-primary'
                        : 'text-mocha hover:text-primary'
                  }`}
                >
                  {item.label}
                  {active === item.id ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-2 left-0 h-px w-full bg-accent"
                      transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 0.61, 0.36, 1] }}
                    />
                  ) : null}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {rsvpHref ? (
              <span className="hidden lg:block">
                <Button href={rsvpHref} variant={light ? 'light' : 'solid'} className="px-5 py-2.5">
                  {rsvpLabel}
                </Button>
              </span>
            ) : null}

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className={`relative z-[60] flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 lg:hidden ${
                light
                  ? 'border-ivory/40 text-ivory'
                  : 'border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] text-primary'
              }`}
            >
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
              <span aria-hidden="true" className="relative block h-3.5 w-5">
                <motion.span
                  animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: reduce ? 0 : 0.3 }}
                  className="absolute left-0 top-0 h-px w-5 bg-current"
                />
                <motion.span
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: reduce ? 0 : 0.2 }}
                  className="absolute left-0 top-1.5 h-px w-5 bg-current"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: reduce ? 0 : 0.3 }}
                  className="absolute left-0 top-3 h-px w-5 bg-current"
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, y: reduce ? 0 : -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -12 }}
            transition={{ duration: reduce ? 0.15 : 0.35, ease: [0.22, 0.61, 0.36, 1] }}
            className="menu-sheet paper fixed inset-0 z-[45] flex flex-col justify-center px-8 pt-20 lg:hidden"
          >
            <ul className="space-y-1">
              {items.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.06 * index + 0.08, duration: 0.4 }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="font-display block border-b border-[color-mix(in_srgb,var(--color-accent)_18%,transparent)] py-4 text-3xl text-espresso"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            {rsvpHref ? (
              <Button
                href={rsvpHref}
                variant="solid"
                className="mt-10 w-full"
                onClick={() => setOpen(false)}
              >
                {rsvpLabel}
              </Button>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Navigation;
