import { Suspense, lazy, useEffect, useMemo } from 'react';
import { AnimatePresence, LazyMotion } from 'framer-motion';
import Navigation, { type NavItem } from './components/Navigation';
import MusicPlayer from './components/MusicPlayer';
import WelcomeModal from './components/WelcomeModal';
import Hero from './sections/Hero';
import Invitation from './sections/Invitation';
import Footer from './sections/Footer';
import { config } from './config';
import { applyTheme } from './lib/theme';
import { coupleNames } from './lib/meta';
import { rsvpHref } from './lib/links';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useSeo } from './hooks/useSeo';

/* Animation features load in their own chunk, after first paint. */
const loadMotionFeatures = () => import('framer-motion').then((mod) => mod.domMax);

/* Everything below the fold is code-split — the hero ships alone. */
const Story = lazy(() => import('./sections/Story'));
const Timeline = lazy(() => import('./sections/Timeline'));
const Family = lazy(() => import('./sections/Family'));
const Gallery = lazy(() => import('./sections/Gallery'));
const Venue = lazy(() => import('./sections/Venue'));
const Rsvp = lazy(() => import('./sections/Rsvp'));

/** Reserves vertical space while a chunk loads, so nothing jumps. */
const Placeholder = () => <div aria-hidden="true" className="min-h-[60vh]" />;

export default function App() {
  const { bride, groom, pair } = coupleNames(config);
  const music = useAudioPlayer(config.backgroundMusic);
  const href = rsvpHref(config.rsvp);
  const rsvpLabel = config.rsvp?.label?.trim() || 'RSVP';

  useSeo(config);

  useEffect(() => {
    applyTheme(config.colors);
  }, []);

  const story = config.story ?? [];
  const timeline = config.timeline ?? [];
  const family = config.family ?? [];
  const gallery = config.gallery ?? [];
  const hasVenue = Boolean(
    config.venueName?.trim() || config.venueAddress?.trim() || config.googleMapsUrl?.trim(),
  );
  const hasRsvp = Boolean(href) || Boolean(config.contacts?.length);

  /* The menu only ever lists sections that actually exist. */
  const navItems = useMemo<NavItem[]>(
    () =>
      [
        { id: 'invitation', label: 'Invitation', show: true },
        { id: 'story', label: 'Our Story', show: story.length > 0 },
        { id: 'events', label: 'Events', show: timeline.length > 0 },
        { id: 'family', label: 'Family', show: family.length > 0 },
        { id: 'gallery', label: 'Gallery', show: gallery.length > 0 },
        { id: 'venue', label: 'Venue', show: hasVenue },
        { id: 'rsvp', label: rsvpLabel, show: hasRsvp },
      ]
        .filter((item) => item.show)
        .map(({ id, label }) => ({ id, label })),
    [story.length, timeline.length, family.length, gallery.length, hasVenue, hasRsvp, rsvpLabel],
  );

  return (
    <LazyMotion features={loadMotionFeatures}>
      <Navigation
        items={navItems}
        bride={bride}
        groom={groom}
        logo={config.logo}
        rsvpHref={href}
        rsvpLabel={rsvpLabel}
      />

      <main id="main">
        <Hero config={config} bride={bride} groom={groom} rsvpHref={href} rsvpLabel={rsvpLabel} />
        <Invitation config={config} pair={pair} />

        <Suspense fallback={<Placeholder />}>
          {story.length ? <Story chapters={story} pair={pair} /> : null}
          {timeline.length ? (
            <Timeline events={timeline} fallbackMapsUrl={config.googleMapsUrl} />
          ) : null}
          {family.length ? <Family members={family} /> : null}
          {gallery.length ? <Gallery items={gallery} hashtag={config.hashtag} /> : null}
          {hasVenue ? <Venue config={config} /> : null}
          {hasRsvp ? <Rsvp config={config} href={href} label={rsvpLabel} pair={pair} /> : null}
        </Suspense>
      </main>

      <Footer config={config} bride={bride} groom={groom} pair={pair} />

      {music.available ? <MusicPlayer playing={music.playing} onToggle={music.toggle} /> : null}

      <AnimatePresence>
        {music.available && music.needsWelcome ? (
          <WelcomeModal
            key="welcome"
            bride={bride}
            groom={groom}
            logo={config.logo}
            onAccept={music.acceptWelcome}
            onDecline={music.declineWelcome}
          />
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  );
}
