import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { config } from './config';
import { coupleNames } from './lib/meta';
import { calendarUrl, directionsUrl, instagramUrl, rsvpHref } from './lib/links';
import { formatLongDate, parseWeddingDate } from './lib/format';
import { useSeo } from './hooks/useSeo';
import { useMusic } from './hooks/useMusic';
import { startDirector } from './three/director';
import Cover from './components/Cover';
import Nav, { type NavItem } from './components/Nav';
import { Icon } from './components/ui';
import { Blessing, Couple, DateScene, Events, Finale, Opening, Rsvp, Scene, Venue } from './sections/Scenes';

const INTRO_SECONDS = 2.4;
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function App() {
  const cfg = config;
  const { bride, groom, pair } = coupleNames(cfg);
  useSeo(cfg);

  // Display date: local calendar day, so it reads '12' for guests in any timezone.
  const date = useMemo(() => parseWeddingDate(cfg.weddingDate), [cfg]);
  const start = useMemo(() => parseWeddingDate(cfg.weddingDate, cfg.weddingTime, cfg.timezone), [cfg]);
  const longDate = formatLongDate(cfg.weddingDate, 'en-IN');
  const directions = directionsUrl(cfg);
  const rsvp = rsvpHref(cfg.rsvp);
  const deadlineDate = cfg.rsvp?.deadline ? parseWeddingDate(cfg.rsvp.deadline) : null;
  const deadline = deadlineDate ? deadlineDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' }) : '';
  const calendarHref = calendarUrl({
    title: `${pair} — ${cfg.timeline.map((e) => e.title).join(' & ') || 'Wedding'}`,
    details: [cfg.weddingTime, cfg.invitationNote].filter(Boolean).join('\n'),
    location: [cfg.venueName, cfg.venueAddress].filter(Boolean).join(', '),
    start,
  });

  const scenes = useMemo(
    () => [
      { id: 'bismillah', label: 'Bismillah', nav: '' },
      { id: 'blessing', label: 'Blessing', nav: '' },
      { id: 'couple', label: 'The couple', nav: 'Couple' },
      { id: 'events', label: 'Ceremonies', nav: 'Events' },
      { id: 'date', label: 'Date', nav: 'Date' },
      { id: 'venue', label: 'Venue', nav: 'Venue' },
      { id: 'rsvp', label: 'RSVP', nav: 'RSVP' },
    ],
    [],
  );
  const navItems: NavItem[] = scenes.map((s, index) => ({ index, label: s.nav })).filter((s) => s.label);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const finaleRef = useRef<HTMLElement>(null);
  const openedAt = useRef<number | null>(null);
  const [opened, setOpened] = useState(false);
  const [coverGone, setCoverGone] = useState(false);
  const [active, setActive] = useState(0);
  const [noWebGL, setNoWebGL] = useState(false);
  const music = useMusic(cfg.backgroundMusic);

  // Scroll is locked behind the cover; always start at the top.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('locked', !opened);
  }, [opened]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return startDirector({
      canvas,
      sections: sectionRefs.current.filter((s): s is HTMLElement => Boolean(s)),
      finale: finaleRef.current,
      gold: cfg.colors.accent,
      reducedMotion: reducedMotion(),
      opened: () => (openedAt.current === null ? 0 : Math.min(1, (performance.now() - openedAt.current) / 1000 / INTRO_SECONDS)),
      onActive: setActive,
      onNoWebGL: () => setNoWebGL(true),
    });
  }, [cfg]);

  const open = useCallback(() => {
    openedAt.current = performance.now();
    setOpened(true);
    music.startIfWanted();
    window.setTimeout(() => setCoverGone(true), 1300);
  }, [music]);

  const go = useCallback((index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' });
  }, []);

  const dateLine = date
    ? date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <>
      <div className={`backdrop${noWebGL ? ' flat' : ''}`} aria-hidden="true">
        <canvas ref={canvasRef} className="gl" />
      </div>
      <div className="scrim" aria-hidden="true" />

      <header className={`top${opened ? ' show' : ''}`}>
        <div className="brand">{pair}</div>
        {music.available ? (
          <button type="button" className="sound glass" onClick={music.toggle} aria-pressed={music.playing} aria-label={music.playing ? 'Mute background sound' : 'Play background sound'}>
            {Icon.sound(music.playing)}
          </button>
        ) : null}
      </header>

      <main id="main" aria-hidden={!opened}>
        {scenes.map((s, i) => (
          <Scene key={s.id} id={s.id} label={s.label} ref={(el) => { sectionRefs.current[i] = el; }}>
            {s.id === 'bismillah' && <Opening cfg={cfg} />}
            {s.id === 'blessing' && <Blessing cfg={cfg} />}
            {s.id === 'couple' && <Couple cfg={cfg} bride={bride} groom={groom} />}
            {s.id === 'events' && <Events cfg={cfg} longDate={longDate} />}
            {s.id === 'date' && <DateScene cfg={cfg} date={date} start={start} calendarHref={calendarHref} />}
            {s.id === 'venue' && <Venue cfg={cfg} directions={directions} />}
            {s.id === 'rsvp' && <Rsvp cfg={cfg} bride={bride} groom={groom} rsvpHref={rsvp} deadline={deadline} />}
          </Scene>
        ))}
        <Finale ref={finaleRef} cfg={cfg} instagram={instagramUrl(cfg.socialLinks?.instagram ?? '')} />
      </main>

      <Nav items={navItems} active={active} visible={opened} onGo={go} />

      {!coverGone ? (
        <Cover bride={bride} groom={groom} bismillah={cfg.bismillah} dateLine={dateLine} hasMusic={music.available} onOpen={open} />
      ) : null}
    </>
  );
}
