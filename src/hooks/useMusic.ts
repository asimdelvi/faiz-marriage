import { useCallback, useEffect, useRef, useState } from 'react';
import { asset } from '../lib/media';

const STORAGE_KEY = 'wedding-invite:music';
const FADE_MS = 1500;
const VOLUME = 0.5;

function preferenceOff(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'off';
  } catch {
    return false;
  }
}
function remember(value: 'on' | 'off') {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* private mode: not remembered */
  }
}

/**
 * Background sound that never surprises anyone: nothing plays until the guest
 * taps "Open", it fades in and out over 1.5s, and turning it off is remembered.
 */
export function useMusic(src: string | undefined) {
  const available = Boolean(src?.trim());
  const audio = useRef<HTMLAudioElement | null>(null);
  const fade = useRef(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!available) return;
    const el = new Audio(asset(src));
    el.loop = true;
    el.preload = 'auto';
    el.volume = 0;
    audio.current = el;
    return () => {
      cancelAnimationFrame(fade.current);
      el.pause();
      audio.current = null;
    };
  }, [available, src]);

  const ramp = useCallback((to: number, done?: () => void) => {
    const el = audio.current;
    if (!el) return;
    cancelAnimationFrame(fade.current);
    const from = el.volume;
    const start = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / FADE_MS);
      el.volume = from + (to - from) * k;
      if (k < 1) fade.current = requestAnimationFrame(step);
      else done?.();
    };
    fade.current = requestAnimationFrame(step);
  }, []);

  const play = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    void el.play().then(() => {
      setPlaying(true);
      remember('on');
      ramp(VOLUME);
    }).catch(() => setPlaying(false));
  }, [ramp]);

  const pause = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    setPlaying(false);
    remember('off');
    ramp(0, () => el.pause());
  }, [ramp]);

  /** Called from the Open tap — respects an earlier "off". */
  const startIfWanted = useCallback(() => {
    if (!preferenceOff()) play();
  }, [play]);

  const toggle = useCallback(() => (playing ? pause() : play()), [playing, pause, play]);

  return { available, playing, toggle, startIfWanted };
}
