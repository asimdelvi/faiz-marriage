import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import Ornament from '../components/ui/Ornament';
import { formatLongDate } from '../lib/format';
import type { SiteConfig } from '../types';

type Props = { config: SiteConfig; href: string; label: string; pair: string };

export function Rsvp({ config, href, label, pair }: Props) {
  const rsvp = config.rsvp;
  const deadline = rsvp?.deadline ? formatLongDate(rsvp.deadline) || rsvp.deadline : '';
  const contacts = config.contacts ?? [];

  if (!href && !contacts.length) return null;

  return (
    <Section id="rsvp" tone="ivory">
      <Reveal className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-16 text-center text-on-primary sm:px-12 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(70%_60%_at_50%_0%,var(--color-accent),transparent_70%)]"
        />
        <div className="relative">
          <p className="text-[0.7rem] uppercase tracking-[0.36em] opacity-80">Will you join us?</p>
          <h2 className="font-display mt-5 text-balance text-4xl leading-tight sm:text-5xl">
            {pair} would love to celebrate with you
          </h2>
          <Ornament className="mx-auto mt-6 opacity-80" width={160} />

          {deadline ? (
            <p className="mt-6 text-sm opacity-85">Kindly respond by {deadline}</p>
          ) : null}
          {rsvp?.note ? (
            <p className="mx-auto mt-4 max-w-xl text-balance text-sm leading-relaxed opacity-80">
              {rsvp.note}
            </p>
          ) : null}

          {href ? (
            <div className="mt-10 flex justify-center">
              <Button href={href} variant="light">
                {label}
              </Button>
            </div>
          ) : null}

          {contacts.length ? (
            <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
              {contacts.map((contact) => (
                <li key={`${contact.name}-${contact.phone}`} className="text-sm">
                  <a
                    href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
                    className="underline-offset-4 hover:underline"
                  >
                    <span className="block opacity-70">
                      {contact.relation ? `${contact.relation} · ` : ''}
                      {contact.name}
                    </span>
                    <span className="font-display text-lg">{contact.phone}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Reveal>
    </Section>
  );
}

export default Rsvp;
