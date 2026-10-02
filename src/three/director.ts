/**
 * Paged navigation + one animation loop for the whole page.
 *
 * The page never scrolls natively. Every swipe, wheel gesture or key press
 * moves exactly one section, and a single spring-driven value `pos`
 * (0 = first section … N-1 = last, N = the finale at the mosque) drives BOTH
 * the 3D camera and the text layer, so they can never drift apart.
 *
 * Each frame (only while something moves):
 *  - steps the spring towards the target page;
 *  - writes --e / --l (entering / leaving, 0…1) and --fit on each section so
 *    CSS can fly the content in from depth, centred and scaled to fit;
 *  - adds `in` to a section once the glide has landed on it (reveals start
 *    on a still panel, not mid-flight);
 *  - renders the 3D corridor. When idle it renders at ~30 fps for the
 *    ambient lantern sway and dust.
 * Three.js is loaded lazily so the cover paints immediately.
 */
import type { Corridor } from './corridor';

type Options = {
  canvas: HTMLCanvasElement;
  sections: HTMLElement[];
  /** The finale layer, shown as one extra page after the last section. */
  finale: HTMLElement | null;
  gold: string;
  reducedMotion: boolean;
  /** 0 before the guest taps Open, then rises to 1 over the intro. */
  opened: () => number;
  onActive: (index: number) => void;
  onNoWebGL: () => void;
};

export type Director = {
  /** Glide to a page (0-based; N = finale). */
  goTo: (index: number) => void;
  stop: () => void;
};

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
/** Spring stiffness: settles in about 0.8 s, no overshoot (critically damped). */
const OMEGA = 7.5;
/** Space reserved for the top bar and the bottom navigation. */
const SAFE_TOP = 76;
const SAFE_BOTTOM = 96;

export function startDirector(o: Options): Director {
  let corridor: Corridor | null = null;
  let raf = 0;
  let stopped = false;
  let last = performance.now();
  let lastRender = 0;
  const t0 = last;

  const pages = [...o.sections, ...(o.finale ? [o.finale] : [])];
  const lastPage = pages.length - 1;
  let target = 0;
  let pos = 0;
  let vel = 0;
  let reported = -1;
  let dirty = true;
  let renderNow = true;
  let fits: number[] = pages.map(() => 1);

  // Fixed resolution chosen once (no mid-session resolution pops).
  const lowPower = window.matchMedia('(max-width: 820px)').matches || (navigator.hardwareConcurrency ?? 8) <= 4;
  const ratio = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 1.75);

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

  /** Scale each panel down if it is taller than the space between the bars. */
  function measure() {
    const avail = window.innerHeight - SAFE_TOP - SAFE_BOTTOM;
    fits = pages.map((page) => {
      const panel = page.querySelector<HTMLElement>('.panel, .finale-inner');
      const h = panel?.offsetHeight ?? 0; // layout height, unaffected by transforms
      return h > avail ? Math.max(0.6, avail / h) : 1;
    });
    dirty = true;
  }
  measure();
  void document.fonts?.ready.then(measure);

  const onResize = () => {
    corridor?.resize(window.innerWidth, window.innerHeight);
    measure();
    renderNow = true; // a resize clears the canvas: redraw this frame, idle or not
  };
  window.addEventListener('resize', onResize);

  function goTo(index: number) {
    const next = Math.round(clamp(index, 0, lastPage));
    if (next === target) return;
    target = next;
    dirty = true;
    const active = Math.min(target, o.sections.length - 1);
    if (active !== reported) {
      reported = active;
      o.onActive(active);
    }
  }
  const step = (dir: number) => goTo(target + dir);
  const enabled = () => o.opened() > 0;

  /* ── input: one gesture = one page ─────────────────────────────────────── */
  // Wheel / trackpad: one step per gesture. A gesture ends after a 180 ms
  // pause in wheel events, which also swallows trackpad inertia.
  let acc = 0;
  let locked = false;
  let lastWheel = 0;
  let lastStep = 0;
  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (!enabled()) return;
    const now = performance.now();
    if (now - lastWheel > 180) {
      locked = false;
      acc = 0;
    }
    lastWheel = now;
    if (locked || now - lastStep < 450) return;
    acc += e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    if (Math.abs(acc) >= 24) {
      step(Math.sign(acc));
      locked = true;
      lastStep = now;
      acc = 0;
    }
  };

  // Touch: a swipe of 30 px+ (or a quick flick of 12 px+) moves one page; taps don't.
  let startY = 0;
  let startX = 0;
  let lastY = 0;
  let lastX = 0;
  let startT = 0;
  let tracking = false;
  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    tracking = true;
    startY = lastY = e.touches[0].clientY;
    startX = lastX = e.touches[0].clientX;
    startT = performance.now();
  };
  const onTouchMove = (e: TouchEvent) => {
    // No native scrolling, rubber-banding or pull-to-refresh.
    if (e.cancelable) e.preventDefault();
    if (e.touches.length === 1) {
      lastY = e.touches[0].clientY;
      lastX = e.touches[0].clientX;
    }
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (!tracking || !enabled()) return;
    tracking = false;
    // Use the last tracked point: some browsers report touchend at the start point.
    const t = e.changedTouches[0];
    const endY = t && t.clientY !== startY ? t.clientY : lastY;
    const endX = t && t.clientX !== startX ? t.clientX : lastX;
    const dy = startY - endY;
    const dx = startX - endX;
    const fast = Math.abs(dy) / Math.max(1, performance.now() - startT) > 0.15;
    if (Math.abs(dy) < Math.abs(dx)) return;
    if (Math.abs(dy) >= 30 || (fast && Math.abs(dy) >= 12)) step(Math.sign(dy));
  };

  // Keyboard.
  const onKey = (e: KeyboardEvent) => {
    if (!enabled() || e.altKey || e.ctrlKey || e.metaKey) return;
    // A held key fires repeats; one press = one section.
    if (e.repeat) {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(e.key)) e.preventDefault();
      return;
    }
    const el = e.target as HTMLElement | null;
    const onControl = !!el?.closest('button, a, input, textarea, select');
    let dir = 0;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !onControl && !e.shiftKey)) dir = 1;
    else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && !onControl && e.shiftKey)) dir = -1;
    else if (e.key === 'Home') return e.preventDefault(), goTo(0);
    else if (e.key === 'End') return e.preventDefault(), goTo(lastPage);
    if (!dir) return;
    e.preventDefault();
    step(dir);
  };

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('keydown', onKey);

  /* ── frame loop ────────────────────────────────────────────────────────── */
  const shown: boolean[] = pages.map(() => false);

  function writeSections() {
    pages.forEach((el, i) => {
      const q = i - pos; // +1 = one page ahead, -1 = one page behind
      const visible = Math.abs(q) < 1.02;
      if (visible !== shown[i]) {
        shown[i] = visible;
        el.style.visibility = visible ? 'visible' : 'hidden';
      }
      if (visible) {
        el.style.setProperty('--e', clamp(q).toFixed(4));
        el.style.setProperty('--l', clamp(-q).toFixed(4));
        el.style.setProperty('--fit', fits[i].toFixed(4));
      }
      const current = i === target;
      el.toggleAttribute('inert', !current);
      // Reveal the target once the glide has (almost) landed on it. Sections
      // flown past on the way to a far target show their text at once
      // (`pass` = no stagger), so a jump never shows an empty panel.
      if (enabled()) {
        if (current && Math.abs(pos - i) < 0.08) el.classList.add('in');
        else if (!current && visible && (i - pos) * (target - i) > 0 && !el.classList.contains('in')) el.classList.add('in', 'pass');
      }
    });
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (document.hidden) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    // Critically damped spring: smooth start, no overshoot, retargets cleanly.
    if (o.reducedMotion) {
      pos = target;
      vel = 0;
    } else {
      const acc = OMEGA * OMEGA * (target - pos) - 2 * OMEGA * vel;
      vel += acc * dt;
      pos += vel * dt;
      // Snap the last ~2 px of the spring's tail so it doesn't creep for a second.
      if (Math.abs(target - pos) < 0.003 && Math.abs(vel) < 0.03) {
        pos = target;
        vel = 0;
      }
    }
    const moving = pos !== target || vel !== 0;
    const intro = o.opened();
    if (moving || dirty || (intro > 0 && intro < 1)) {
      writeSections();
      dirty = moving || (intro > 0 && intro < 1);
    }

    if (!corridor) return;
    // Idle: ~30 fps is plenty for swaying lanterns and drifting dust.
    if (!moving && !renderNow && intro >= 1 && now - lastRender < 32) return;
    lastRender = now;
    renderNow = false;
    corridor.render(pos, (now - t0) / 1000, intro);
  }
  raf = requestAnimationFrame(frame);
  o.onActive(0);
  reported = 0;

  return {
    goTo,
    stop: () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKey);
      corridor?.dispose();
    },
  };
}
