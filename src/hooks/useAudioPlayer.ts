import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'wedding-invite:music';
const FADE_MS = 1500;
const TARGET_VOLUME = 0.45;

type Preference = 'on' | 'off' | null;

function readPreference(): Preference {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'on' || stored === 'off' ? stored : null;
  } catch {
    return null;
  }
}

function writePreference(value: Exclude<Preference, null>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* private mode — preference simply isn't remembered */
  }
}

export function isAndroid(): boolean {
  return typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);
}

export type AudioPlayer = {
  available: boolean;
  playing: boolean;
  /** Android (and any declined session) sees a welcome modal before sound. */
  needsWelcome: boolean;
  toggle: () => void;
  acceptWelcome: () => void;
  declineWelcome: () => void;
};

/**
 * Background music that behaves itself:
 * muted autoplay only, sound after a real interaction, 1.5s fades,
 * a remembered preference, and an explicit welcome gate on Android.
 */
export function useAudioPlayer(src: string): AudioPlayer {
  const available = Boolean(src?.trim());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [needsWelcome, setNeedsWelcome] = useState(false);

  const cancelFade = useCallback(() => {
    if (fadeRef.current) {
      window.cancelAnimationFrame(fadeRef.current);
      fadeRef.current = null;
    }
  }, []);

  /** Linear volume ramp over 1.5s; resolves when the ramp finishes. */
  const fadeTo = useCallback(
    (target: number, onDone?: () => void) => {
      const audio = audioRef.current;
      if (!audio) return;
      cancelFade();
      const from = audio.volume;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / FADE_MS);
        audio.volume = Math.max(0, Math.min(1, from + (target - from) * t));
        if (t < 1) {
          fadeRef.current = window.requestAnimationFrame(step);
        } else {
          fadeRef.current = null;
          onDone?.();
        }
      };
      fadeRef.current = window.requestAnimationFrame(step);
    },
    [cancelFade],
  );

  const startSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    audio.volume = 0;
    void audio
      .play()
      .then(() => {
        setPlaying(true);
        writePreference('on');
        fadeTo(TARGET_VOLUME);
      })
      .catch(() => setPlaying(false));
  }, [fadeTo]);

  const stopSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setPlaying(false);
    writePreference('off');
    fadeTo(0, () => audio.pause());
  }, [fadeTo]);

  // Create the element once and try a *muted* autoplay so playback is warm.
  useEffect(() => {
    if (!available) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    audio.muted = true;
    audio.volume = 0;
    audioRef.current = audio;
    void audio.play().catch(() => undefined);

    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'touchstart', 'wheel'];
    const unlock = () => {
      events.forEach((event) => window.removeEventListener(event, unlock));
      startSound();
    };

    const preference = readPreference();
    if (preference !== 'off') {
      if (isAndroid()) {
        // Android browsers are strict and the surprise is jarring — ask first.
        setNeedsWelcome(true);
      } else {
        events.forEach((event) =>
          window.addEventListener(event, unlock, { once: true, passive: true }),
        );
      }
    }

    return () => {
      events.forEach((event) => window.removeEventListener(event, unlock));
      cancelFade();
      audio.pause();
      audio.removeAttribute('src');
      audioRef.current = null;
    };
  }, [available, src, startSound, cancelFade]);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (needsWelcome) setNeedsWelcome(false);
    if (playing) stopSound();
    else startSound();
  }, [needsWelcome, playing, startSound, stopSound]);

  const acceptWelcome = useCallback(() => {
    setNeedsWelcome(false);
    startSound();
  }, [startSound]);

  const declineWelcome = useCallback(() => {
    setNeedsWelcome(false);
    writePreference('off');
  }, []);

  return { available, playing, needsWelcome, toggle, acceptWelcome, declineWelcome };
}
