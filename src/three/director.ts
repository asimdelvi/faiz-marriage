/**
 * One animation loop for the whole page. Each frame it:
 *  - turns the scroll position into corridor progress (one arch per section),
 *    eased so the camera glides rather than jitters under the finger;
 *  - writes --e / --l (entering / leaving, 0…1) onto every section so CSS can
 *    fly the content in from depth and past the viewer;
 *  - marks sections as revealed and reports which one is active;
 *  - renders the 3D corridor, lowering resolution on slow devices.
 * The Three.js code is loaded lazily so the cover paints immediately.
 */
import type { Corridor } from './corridor';

type Options = {
  canvas: HTMLCanvasElement;
  sections: HTMLElement[];
  /** Trailing element after the last section; scrolling into it flies to the mosque. */
  finale: HTMLElement | null;
  gold: string;
  reducedMotion: boolean;
  /** 0 before the guest taps Open, then rises to 1 over the intro. */
  opened: () => number;
  onActive: (index: number) => void;
  onNoWebGL: () => void;
};

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

export function startDirector(o: Options): () => void {
  let corridor: Corridor | null = null;
  let raf = 0;
  let stopped = false;
  let cam = 0;
  let last = performance.now();
  let active = -1;
  const t0 = last;

  const lowPower = window.matchMedia('(max-width: 820px)').matches || (navigator.hardwareConcurrency ?? 8) <= 4;
  let ratio = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 1.75);
  const frameTimes: number[] = [];

  import('./corridor')
    .then(({ createCorridor }) => {
      if (stopped) return;
      try {
        corridor = createCorridor(o.canvas, { arches: o.sections.length, gold: o.gold, lowPower, reducedMotion: o.reducedMotion });
        corridor.setPixelRatio(ratio);
        corridor.resize(window.innerWidth, window.innerHeight);
        o.canvas.classList.add('ready');
      } catch {
        o.onNoWebGL();
      }
    })
    .catch(() => o.onNoWebGL());

  const onResize = () => corridor?.resize(window.innerWidth, window.innerHeight);
  window.addEventListener('resize', onResize);

  /** Scroll position → progress: section i at rest = i; the finale adds up to 1. */
  function targetProgress(vh: number) {
    const y = window.scrollY;
    const tops = o.sections.map((s) => s.offsetTop + Math.max(0, s.offsetHeight - vh) / 2);
    const lastIdx = tops.length - 1;
    for (let i = 0; i < lastIdx; i++) {
      if (y < tops[i + 1]) return i + clamp((y - tops[i]) / (tops[i + 1] - tops[i]), -1, 1);
    }
    const maxScroll = document.documentElement.scrollHeight - vh;
    const span = Math.max(1, maxScroll - tops[lastIdx]);
    return lastIdx + (o.finale ? clamp((y - tops[lastIdx]) / span) : 0);
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (document.hidden) return;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    const vh = window.innerHeight;

    // sections: entering / leaving amounts, reveal, active
    let best = Infinity;
    let bestIdx = 0;
    o.sections.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const q = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.setProperty('--e', clamp(q).toFixed(3));
      el.style.setProperty('--l', clamp(-q).toFixed(3));
      if (q < 0.45 && q > -0.9 && o.opened() > 0) el.classList.add('in');
      if (Math.abs(q) < best) {
        best = Math.abs(q);
        bestIdx = i;
      }
    });
    if (bestIdx !== active) {
      active = bestIdx;
      o.onActive(bestIdx);
    }

    if (!corridor) return;
    const target = targetProgress(vh);
    cam = o.reducedMotion ? target : cam + (target - cam) * (1 - Math.exp(-dt * 5.5));
    corridor.render(cam, (now - t0) / 1000, o.opened());

    // adaptive resolution: if frames are slow, render fewer pixels
    frameTimes.push(dt);
    if (frameTimes.length === 90) {
      const sorted = [...frameTimes].sort((a, b) => a - b);
      const median = sorted[45];
      frameTimes.length = 0;
      if (median > 1 / 42 && ratio > 1) {
        ratio = Math.max(1, ratio - 0.25);
        corridor.setPixelRatio(ratio);
        corridor.resize(window.innerWidth, window.innerHeight);
      }
    }
  }
  raf = requestAnimationFrame(frame);

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
    corridor?.dispose();
  };
}
