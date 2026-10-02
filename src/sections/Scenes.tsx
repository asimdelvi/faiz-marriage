/**
 * The seven scenes of the invitation — one per arch of the corridor — plus the
 * closing finale that flies out to the mosque. Classes starting with `r`
 * are reveal animations (see index.css); `--d` staggers them.
 */
import { forwardRef, type ReactNode } from 'react';
import type { SiteConfig } from '../types';
import { Arabic, d, Divider, Icon, Letters, Monogram, Qr } from '../components/ui';
import Countdown from '../components/Countdown';

type SceneProps = { id: string; label: string; children: ReactNode; className?: string };

export const Scene = forwardRef<HTMLElement, SceneProps>(({ id, label, children, className = '' }, ref) => (
  <section ref={ref} id={id} className={`scene ${className}`} aria-label={label}>
    <div className="panel">{children}</div>
  </section>
));
Scene.displayName = 'Scene';

export function Opening({ cfg }: { cfg: SiteConfig }) {
  return (
    <>
      <div className="crescent-space" aria-hidden="true" />
      {cfg.bismillah ? <Arabic className="bismillah" delay={0.5}>{cfg.bismillah}</Arabic> : null}
      <Divider delay={0.8} />
      {cfg.bismillahMeaning ? <p className="kicker measure r r-rise" style={d(0.95)}>{cfg.bismillahMeaning}</p> : null}
      <p className="scroll-hint r r-rise" style={d(1.6)}>
        <span>Scroll to enter</span>
        {Icon.chevron}
      </p>
    </>
  );
}

export function Blessing({ cfg }: { cfg: SiteConfig }) {
  const b = cfg.blessing;
  if (!b) return null;
  return (
    <>
      <div className="quote script r r-scale" style={d(0.1)} aria-hidden="true">“</div>
      {b.arabic ? <Arabic className="ayah" variant="r-flip" delay={0.25}>{b.arabic}</Arabic> : null}
      <p className="italic ayah-text r r-rise" style={d(0.7)}>{b.text}</p>
      <Divider delay={1} />
      {b.reference ? <p className="kicker r r-rise" style={d(1.15)}>{b.reference}</p> : null}
    </>
  );
}

export function Couple({ cfg, bride, groom }: { cfg: SiteConfig; bride: string; groom: string }) {
  // Long names spell out faster so the whole reveal stays under about 3 seconds.
  const step = Math.min(0.07, 1.4 / Math.max(bride.length, groom.length, 1));
  const amp = 0.55 + bride.length * step;
  const second = amp + 0.45;
  const end = second + groom.length * step;
  return (
    <>
      {cfg.heroEyebrow ? <p className="kicker r r-rise" style={d(0.1)}>{cfg.heroEyebrow}</p> : null}
      <h1 className={`names emboss${Math.max(bride.length, groom.length) > 12 ? ' long' : ''}`}>
        <Letters text={bride} start={0.35} step={step} />
        {cfg.brideParent ? <span className="parent r r-rise" style={d(amp - 0.1)}>{cfg.brideParent}</span> : null}
        <span className="amp r r-coin" style={d(amp)} aria-hidden="true">&amp;</span>
        <span className="sr-only"> and </span>
        {cfg.groomTitle ? <span className="honorific r r-rise" style={d(second - 0.15)}>{cfg.groomTitle} </span> : null}
        <Letters text={groom} start={second} step={step} />
        {cfg.groomParent ? <span className="parent r r-rise" style={d(end)}>{cfg.groomParent}</span> : null}
      </h1>
      <Divider delay={end + 0.3} />
      {cfg.heroSubtitle ? <p className="italic lead r r-rise" style={d(end + 0.4)}>{cfg.heroSubtitle}</p> : null}
      {cfg.invitationNote ? <p className="body-text measure r r-rise" style={d(end + 0.6)}>{cfg.invitationNote}</p> : null}
    </>
  );
}

export function Events({ cfg, longDate }: { cfg: SiteConfig; longDate: string }) {
  const titles = cfg.timeline.map((e) => e.title).filter(Boolean);
  const custom = cfg.eventsHeading?.trim();
  return (
    <>
      <p className="kicker r r-rise" style={d(0.1)}>You are invited to the</p>
      <h2 className="heading emboss r r-flip" style={d(0.25)}>
        {custom ? (
          custom
        ) : titles.length === 2 ? (
          <>
            {titles[0]} <span className="script">&amp;</span> {titles[1]}
          </>
        ) : (
          titles[0] || 'The Celebrations'
        )}
      </h2>
      {longDate ? <p className="italic sub r r-rise" style={d(0.45)}>{longDate}</p> : null}
      <div className="events">
        {cfg.timeline.map((ev, i) => (
          <article key={ev.id} className={`card event r ${i % 2 ? 'r-cardR' : 'r-cardL'}`} style={d(0.65 + i * 0.35)}>
            <div className="tilt">
              <div className="event-top">
                <div className="ico">{i % 2 ? Icon.feast : Icon.crescent}</div>
                <div className="event-title">
                  <h3>{ev.title}</h3>
                  {ev.time ? <p className="time">{ev.time}</p> : null}
                </div>
                {ev.arabic ? <span lang="ar" dir="rtl" className="event-ar">{ev.arabic}</span> : null}
              </div>
              {ev.venue ? <p className="event-venue">{ev.venue}</p> : null}
              {ev.description ? <p className="event-desc">{ev.description}</p> : null}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export function DateScene({ cfg, date, start, calendarHref }: {
  cfg: SiteConfig;
  date: Date | null;
  start: Date | null;
  calendarHref: string;
}) {
  if (!date) return null;
  const weekday = date.toLocaleDateString('en-IN', { weekday: 'long' });
  const month = date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  return (
    <>
      {cfg.dateEyebrow ? <p className="kicker r r-rise" style={d(0.1)}>{cfg.dateEyebrow}</p> : null}
      <div className="weekday r r-line" style={d(0.3)}>
        <i />
        <span>{weekday}</span>
        <i />
      </div>
      <div className="bigday gold-text r r-flipday" style={d(0.4)}>{date.getDate()}</div>
      <p className="italic month r r-rise" style={d(0.75)}>{month}</p>
      {cfg.weddingTime ? <p className="pill glass r r-cardX" style={d(0.95)}>{cfg.weddingTime}</p> : null}
      <Countdown target={start} delay={1.15} />
      {calendarHref ? (
        <a className="btn btn-ghost r r-rise" style={d(1.5)} href={calendarHref} target="_blank" rel="noopener noreferrer">
          {Icon.calendar}
          Add to calendar
        </a>
      ) : null}
    </>
  );
}

export function Venue({ cfg, directions }: { cfg: SiteConfig; directions: string }) {
  return (
    <>
      <p className="kicker r r-rise" style={d(0.1)}>Where</p>
      <div className="card venue r r-cardX" style={d(0.3)}>
        <div className="tilt">
          <div className="coin r r-coin" style={d(0.7)}>{Icon.pin}</div>
          <h2 className="venue-name">{cfg.venueName}</h2>
          {cfg.venueAddress ? <p className="addr">{cfg.venueAddress}</p> : null}
          {cfg.venueNote ? <p className="venue-note">{cfg.venueNote}</p> : null}
          {directions ? (
            <div className="venue-actions">
              <a className="btn btn-gold" href={directions} target="_blank" rel="noopener noreferrer">
                {Icon.pin}
                Get directions
              </a>
              <div className="qr-block desktop-only">
                <div className="qr"><Qr value={directions} size={104} /></div>
                <p>
                  <b>Scan for directions</b>
                  <span>Opens on your phone</span>
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export function Rsvp({ cfg, bride, groom, rsvpHref, deadline, signOff }: {
  cfg: SiteConfig;
  bride: string;
  groom: string;
  rsvpHref: string;
  deadline: string;
  /** Shown when there is no RSVP, e.g. "Fida & Talha · 28 January 2027". */
  signOff: string;
}) {
  const label = cfg.rsvp?.label?.trim() || 'RSVP';
  const closingOnly = !rsvpHref && !cfg.contacts?.length;
  return (
    <>
      <Monogram a={bride} b={groom} delay={0.1} />
      {cfg.closingDua?.arabic ? <Arabic className="dua" variant="r-flip" delay={0.35}>{cfg.closingDua.arabic}</Arabic> : null}
      {cfg.closingDua?.text ? <p className="italic sub measure r r-rise" style={d(0.6)}>{cfg.closingDua.text}</p> : null}
      <Divider delay={0.8} />
      {closingOnly && signOff ? <p className="kicker r r-rise" style={d(0.95)}>{signOff}</p> : null}
      {deadline ? <p className="kicker r r-rise" style={d(0.9)}>Kindly reply by {deadline}</p> : null}
      {cfg.rsvp?.note ? <p className="body-text measure r r-rise" style={d(1)}>{cfg.rsvp.note}</p> : null}
      {rsvpHref ? (
        <div className="rsvp-actions r r-cardX" style={d(1.15)}>
          <a className="btn btn-gold btn-lg" href={rsvpHref} target="_blank" rel="noopener noreferrer">
            {Icon.chat}
            {label}
          </a>
          <div className="qr-block desktop-only">
            <div className="qr"><Qr value={rsvpHref} size={96} /></div>
            <p>
              <b>Scan to RSVP</b>
              <span>From your phone</span>
            </p>
          </div>
        </div>
      ) : null}
      {cfg.contacts?.length ? (
        <ul className="contacts r r-rise" style={d(1.35)} aria-label="Contacts">
          {cfg.contacts.map((c) => (
            <li key={c.phone}>
              <a className="chip glass" href={`tel:${c.phone.replace(/[^\d+]/g, '')}`}>
                {Icon.phone}
                <span>
                  <b>{c.name}</b>
                  {c.relation ? <small>{c.relation}</small> : null}
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export const Finale = forwardRef<HTMLElement, { cfg: SiteConfig; instagram: string }>(({ cfg, instagram }, ref) => (
  <footer ref={ref} className="finale">
    <div className="finale-inner">
      {cfg.footerNote ? <p className="italic finale-note">{cfg.footerNote}</p> : null}
      {cfg.hashtag ? <p className="hashtag gold-text">{cfg.hashtag}</p> : null}
      {instagram ? (
        <a className="kicker insta" href={instagram} target="_blank" rel="noopener noreferrer">
          Share your moments on Instagram
        </a>
      ) : null}
    </div>
  </footer>
));
Finale.displayName = 'Finale';
