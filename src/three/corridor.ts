/**
 * The 3D corridor: carved Mughal arches with gold trim, hanging lanterns,
 * floating eight-pointed stars, gold dust, and a domed mosque beyond the last
 * arch. The camera position is a pure function of `progress` (0 = first arch,
 * 1 = second arch, …) so it can follow the page scroll exactly.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const SPACING = 7.5;
const FLOOR = -2.6;
const REST_DISTANCE = 6.3;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const easeInOut = (x: number) => {
  const v = clamp(x);
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
};
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ---------- procedural textures (no image downloads) ---------- */
function girihCanvas(size: number, base: string, line: string, hi: string, cell: number) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  g.fillStyle = base;
  g.fillRect(0, 0, size, size);
  const star = (cx: number, cy: number, r: number, ri: number) => {
    g.beginPath();
    for (let k = 0; k < 16; k++) {
      const a = (k * Math.PI) / 8 - Math.PI / 2;
      const rr = k % 2 ? ri : r;
      g.lineTo(cx + rr * Math.cos(a), cy + rr * Math.sin(a));
    }
    g.closePath();
  };
  for (let y = 0; y <= size; y += cell) {
    for (let x = 0; x <= size; x += cell) {
      g.lineWidth = cell * 0.05;
      g.strokeStyle = hi;
      star(x + 1.5, y + 1.5, cell * 0.36, cell * 0.27);
      g.stroke();
      g.strokeStyle = line;
      star(x, y, cell * 0.36, cell * 0.27);
      g.stroke();
      g.lineWidth = cell * 0.03;
      g.beginPath();
      g.arc(x, y, cell * 0.12, 0, 7);
      g.stroke();
      g.beginPath();
      g.moveTo(x + cell * 0.36, y);
      g.lineTo(x + cell * 0.64, y);
      g.moveTo(x, y + cell * 0.36);
      g.lineTo(x, y + cell * 0.64);
      g.stroke();
      g.beginPath();
      for (let k = 0; k < 4; k++) {
        const a = (k * Math.PI) / 2 + Math.PI / 4;
        g.moveTo(x + cell / 2 + Math.cos(a) * cell * 0.08, y + cell / 2 + Math.sin(a) * cell * 0.08);
        g.lineTo(x + cell / 2 + Math.cos(a) * cell * 0.22, y + cell / 2 + Math.sin(a) * cell * 0.22);
      }
      g.stroke();
    }
  }
  return c;
}

function canvasTexture(canvas: HTMLCanvasElement, rx: number, ry: number, srgb = true) {
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,236,190,1)');
  gr.addColorStop(0.25, 'rgba(255,214,140,.55)');
  gr.addColorStop(1, 'rgba(255,200,120,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---------- shapes ---------- */
type Seg = ['L', number, number] | ['C', number, number, number, number, number, number];
const ARCH: Seg[] = [
  ['L', -1.3, FLOOR],
  ['L', -1.3, 0.6],
  ['C', -1.3, 1.25, -0.8, 1.3, -0.35, 1.6],
  ['C', -0.1, 1.75, -0.02, 1.95, 0, 2.25],
  ['C', 0.02, 1.95, 0.1, 1.75, 0.35, 1.6],
  ['C', 0.8, 1.3, 1.3, 1.25, 1.3, 0.6],
  ['L', 1.3, FLOOR],
];

function wallShape() {
  const s = new THREE.Shape();
  s.moveTo(-14, FLOOR);
  for (const seg of ARCH) {
    if (seg[0] === 'L') s.lineTo(seg[1], seg[2]);
    else s.bezierCurveTo(seg[1], seg[2], seg[3], seg[4], seg[5], seg[6]);
  }
  s.lineTo(14, FLOOR);
  s.lineTo(14, 11);
  s.lineTo(-14, 11);
  s.closePath();
  return s;
}

function archCurve(inset = 0) {
  const path = new THREE.CurvePath<THREE.Vector3>();
  const v = (x: number, y: number) =>
    new THREE.Vector3(x + (x < 0 ? inset : x > 0 ? -inset : 0), y - (y > 1 ? inset * 0.6 : 0), 0);
  let prev = v(-1.3, FLOOR);
  for (const seg of ARCH.slice(1)) {
    if (seg[0] === 'L') {
      const p = v(seg[1], seg[2]);
      path.add(new THREE.LineCurve3(prev, p));
      prev = p;
    } else {
      const p = v(seg[5], seg[6]);
      path.add(new THREE.CubicBezierCurve3(prev, v(seg[1], seg[2]), v(seg[3], seg[4]), p));
      prev = p;
    }
  }
  return path;
}

function starShape(r: number) {
  const s = new THREE.Shape();
  const ri = r * 0.765;
  for (let k = 0; k < 16; k++) {
    const a = (k * Math.PI) / 8 + Math.PI / 16;
    const rr = k % 2 ? ri : r;
    if (k) s.lineTo(rr * Math.cos(a), rr * Math.sin(a));
    else s.moveTo(rr * Math.cos(a), rr * Math.sin(a));
  }
  s.closePath();
  return s;
}

/** Crescent = outer circle minus an offset inner circle, traced as one outline. */
function crescentShape(r1 = 0.5, c2: [number, number] = [0.2, 0.09], r2 = 0.42) {
  const d = Math.hypot(c2[0], c2[1]);
  const u = [c2[0] / d, c2[1] / d];
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(r1 * r1 - a * a);
  const P1 = [a * u[0] - h * u[1], a * u[1] + h * u[0]];
  const P2 = [a * u[0] + h * u[1], a * u[1] - h * u[0]];
  const ang = (p: number[], c = [0, 0]) => Math.atan2(p[1] - c[1], p[0] - c[0]);
  const s = new THREE.Shape();
  const N = 64;
  let a0 = ang(P1);
  let a1 = ang(P2);
  while (a1 < a0) a1 += Math.PI * 2;
  let m = Math.atan2(-u[1], -u[0]);
  while (m < a0) m += Math.PI * 2;
  if (m > a1) [a0, a1] = [a1, a0 + Math.PI * 2];
  for (let i = 0; i <= N; i++) {
    const t = a0 + ((a1 - a0) * i) / N;
    if (i) s.lineTo(r1 * Math.cos(t), r1 * Math.sin(t));
    else s.moveTo(r1 * Math.cos(t), r1 * Math.sin(t));
  }
  const endP = [r1 * Math.cos(a1), r1 * Math.sin(a1)];
  const startP = [r1 * Math.cos(a0), r1 * Math.sin(a0)];
  const b0 = ang(endP, c2);
  const b1 = ang(startP, c2);
  const midIn = Math.atan2(-u[1], -u[0]);
  let d1 = b1 - b0;
  while (d1 > Math.PI) d1 -= 2 * Math.PI;
  while (d1 < -Math.PI) d1 += 2 * Math.PI;
  if (Math.cos(b0 + d1 / 2 - midIn) < 0) d1 = d1 > 0 ? d1 - 2 * Math.PI : d1 + 2 * Math.PI;
  for (let i = 1; i <= N; i++) {
    const t = b0 + (d1 * i) / N;
    s.lineTo(c2[0] + r2 * Math.cos(t), c2[1] + r2 * Math.sin(t));
  }
  s.closePath();
  return s;
}

export type CorridorOptions = {
  /** Number of arches = number of sections. */
  arches: number;
  /** Gold tone, usually the config accent colour. */
  gold?: string;
  /** Fewer particles, lower resolution. */
  lowPower?: boolean;
  reducedMotion?: boolean;
};

export type Corridor = {
  /** progress: 0 → first arch … arches-1 → last arch; up to arches-1+1 flies through to the mosque. */
  render: (progress: number, time: number, opened: number) => void;
  resize: (width: number, height: number) => void;
  setPixelRatio: (ratio: number) => void;
  dispose: () => void;
};

export function createCorridor(canvas: HTMLCanvasElement, opts: CorridorOptions): Corridor {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const fogColor = new THREE.Color('#EAD7BA');
  scene.background = fogColor;
  scene.fog = new THREE.Fog(fogColor, 10, 58);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.45;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(50, 1, 0.05, 200);

  scene.add(new THREE.HemisphereLight('#FFF3E0', '#9C7B52', 1.25));
  const sun = new THREE.DirectionalLight('#FFE4C0', 2.1);
  sun.position.set(4, 7, 9);
  scene.add(sun);
  const warm = new THREE.PointLight('#FFB85C', 9, 14, 1.6);
  scene.add(warm);

  const goldColor = opts.gold && /^#[0-9a-f]{6}$/i.test(opts.gold) ? opts.gold : '#D6B06A';
  const wallCv = girihCanvas(512, '#F2E6D2', '#D2B991', '#FFF9EE', 128);
  const wallMat = new THREE.MeshStandardMaterial({
    color: '#FFF6E8',
    map: canvasTexture(wallCv, 0.55, 0.55),
    bumpMap: canvasTexture(wallCv, 0.55, 0.55, false),
    bumpScale: 1.6,
    roughness: 0.82,
  });
  const gold = new THREE.MeshStandardMaterial({ color: new THREE.Color(goldColor).lerp(new THREE.Color('#E0BC78'), 0.5), metalness: 1, roughness: 0.28 });
  const goldSoft = new THREE.MeshStandardMaterial({ color: goldColor, metalness: 0.85, roughness: 0.4 });
  const ivory = new THREE.MeshStandardMaterial({ color: '#FBF3E6', roughness: 0.7 });

  const floorCv = girihCanvas(512, '#EADBC3', '#CDB28A', '#F7EEDF', 256);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 140),
    new THREE.MeshStandardMaterial({
      map: canvasTexture(floorCv, 10, 35),
      bumpMap: canvasTexture(floorCv, 10, 35, false),
      bumpScale: 0.8,
      roughness: 0.55,
      metalness: 0.05,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, FLOOR, -55);
  scene.add(floor);

  /* arches */
  const n = opts.arches;
  const wallGeo = new THREE.ExtrudeGeometry(wallShape(), {
    depth: 0.8, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2, curveSegments: 40,
  });
  const trimGeo = new THREE.TubeGeometry(archCurve(0), 220, 0.035, 8, false);
  const trimGeo2 = new THREE.TubeGeometry(archCurve(-0.16), 220, 0.016, 6, false);
  const alfizGeo = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(
      [[-1.78, FLOOR], [-1.78, 2.72], [1.78, 2.72], [1.78, FLOOR]].map(([x, y]) => new THREE.Vector3(x, y, 0)),
      false, 'catmullrom', 0,
    ),
    80, 0.02, 6, false,
  );
  const starGeo = new THREE.ExtrudeGeometry(starShape(0.2), { depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.015, bevelSegments: 2 });
  const smallStar = new THREE.ExtrudeGeometry(starShape(0.1), { depth: 0.03, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.01, bevelSegments: 1 });
  const colGeo = new THREE.CylinderGeometry(0.085, 0.085, 3.2, 20);
  const ringGeo = new THREE.TorusGeometry(0.1, 0.025, 8, 24);
  for (let k = 0; k < n; k++) {
    const g = new THREE.Group();
    g.position.z = -k * SPACING;
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.z = -0.8;
    g.add(wall);
    const trim = new THREE.Mesh(trimGeo, gold);
    trim.position.z = 0.05;
    g.add(trim);
    const trim2 = new THREE.Mesh(trimGeo2, goldSoft);
    trim2.position.z = 0.04;
    g.add(trim2);
    const alfiz = new THREE.Mesh(alfizGeo, goldSoft);
    alfiz.position.z = 0.04;
    g.add(alfiz);
    for (const sx of [-1, 1]) {
      const st = new THREE.Mesh(starGeo, gold);
      st.position.set(sx * 1.2, 2.2, 0.02);
      g.add(st);
      const col = new THREE.Mesh(colGeo, ivory);
      col.position.set(sx * 1.42, FLOOR + 1.6, 0.12);
      g.add(col);
      for (const y of [FLOOR + 0.1, FLOOR + 3.15, FLOOR + 2.9]) {
        const r = new THREE.Mesh(ringGeo, gold);
        r.rotation.x = Math.PI / 2;
        r.position.set(sx * 1.42, y, 0.12);
        g.add(r);
      }
    }
    const key = new THREE.Mesh(smallStar, gold);
    key.position.set(0, 2.47, 0.05);
    g.add(key);
    scene.add(g);
  }

  /* lanterns */
  const glowTex = glowTexture();
  const profile = [[0, 0], [0.05, 0.01], [0.1, 0.06], [0.13, 0.14], [0.14, 0.22], [0.12, 0.3], [0.08, 0.36], [0.04, 0.4], [0, 0.41]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  const lanGlass = new THREE.LatheGeometry(profile, 20);
  const lanCage = new THREE.LatheGeometry(profile.map((v) => new THREE.Vector2(v.x * 1.04, v.y)), 8);
  const glassMat = new THREE.MeshStandardMaterial({ color: '#FFE2A8', emissive: '#FFB24A', emissiveIntensity: 1.3, roughness: 0.3, transparent: true, opacity: 0.92 });
  const cageMat = new THREE.MeshStandardMaterial({ color: '#C9A05A', metalness: 1, roughness: 0.3, wireframe: true });
  const capGeo = new THREE.ConeGeometry(0.1, 0.14, 16);
  const cordGeo = new THREE.CylinderGeometry(0.004, 0.004, 1, 4);
  const R = rng(5);
  const lanterns: { pivot: THREE.Group; glow: THREE.Sprite; ph: number }[] = [];
  for (let k = 0; k < n; k++) {
    for (const sx of [-1, 1]) {
      const pivot = new THREE.Group();
      const top = 6.5;
      const yEnd = 1.35 + (sx > 0 ? -0.18 : 0.05) + (R() - 0.5) * 0.1;
      pivot.position.set(sx * 0.74, top, -k * SPACING + 2.4);
      scene.add(pivot);
      const len = top - yEnd;
      const cord = new THREE.Mesh(cordGeo, goldSoft);
      cord.scale.y = len;
      cord.position.y = -len / 2;
      pivot.add(cord);
      const lan = new THREE.Group();
      lan.position.y = -len - 0.44;
      pivot.add(lan);
      lan.add(new THREE.Mesh(lanGlass, glassMat), new THREE.Mesh(lanCage, cageMat));
      const cap = new THREE.Mesh(capGeo, gold);
      cap.position.y = 0.47;
      lan.add(cap);
      const bot = new THREE.Mesh(capGeo, gold);
      bot.rotation.x = Math.PI;
      bot.scale.setScalar(0.6);
      bot.position.y = -0.03;
      lan.add(bot);
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.8 }));
      glow.scale.set(1.1, 1.1, 1);
      glow.position.y = 0.2;
      lan.add(glow);
      lanterns.push({ pivot, glow, ph: R() * 6.28 });
    }
  }

  /* floating stars */
  const floaters: { m: THREE.Mesh; y0: number; ph: number; sp: number }[] = [];
  for (let k = 0; k < n + 1; k++) {
    for (let i = 0; i < 3; i++) {
      const m = new THREE.Mesh(smallStar, gold);
      const sx = R() < 0.5 ? -1 : 1;
      m.position.set(sx * (0.95 + R() * 0.25), FLOOR + 1 + R() * 2.8, -k * SPACING + 1 + R() * 4.5);
      m.scale.setScalar(0.35 + R() * 0.4);
      scene.add(m);
      floaters.push({ m, y0: m.position.y, ph: R() * 6.28, sp: 0.3 + R() * 0.5 });
    }
  }

  /* hero crescent over the first arch */
  const hero = new THREE.Group();
  const cresGeo = new THREE.ExtrudeGeometry(crescentShape(), { depth: 0.07, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 3, curveSegments: 12 });
  const cres = new THREE.Mesh(cresGeo, gold);
  cres.rotation.z = 0.5;
  cres.position.z = -0.05;
  hero.add(cres);
  const heroStar = new THREE.Mesh(
    new THREE.ExtrudeGeometry(starShape(0.11), { depth: 0.04, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.01 }),
    gold,
  );
  heroStar.position.set(0.2, 0.1, -0.02);
  hero.add(heroStar);
  const heroGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.5 }));
  heroGlow.scale.set(2.2, 2.2, 1);
  heroGlow.position.z = -0.3;
  hero.add(heroGlow);
  scene.add(hero);

  /* mosque beyond the last arch */
  const mosque = new THREE.Group();
  const mz = -(n - 1) * SPACING - 28;
  mosque.position.set(0, FLOOR, mz);
  const domeProfile = [[2.05, 0], [2.3, 0.5], [2.4, 1.1], [2.25, 1.8], [1.8, 2.5], [1.15, 3.1], [0.5, 3.6], [0.18, 3.95], [0, 4.15]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  const add = (m: THREE.Object3D, x: number, y: number, z = 0, parent: THREE.Object3D = mosque) => {
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };
  add(new THREE.Mesh(new THREE.BoxGeometry(11, 3.2, 7), ivory), 0, 1.6);
  add(new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.4, 1.5, 40), ivory), 0, 3.95);
  add(new THREE.Mesh(new THREE.LatheGeometry(domeProfile, 40), ivory), 0, 4.7);
  const dRing = add(new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.06, 8, 64), gold), 0, 4.72);
  dRing.rotation.x = Math.PI / 2;
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.05, 1, 8), gold), 0, 9.3);
  const topC = add(new THREE.Mesh(cresGeo, gold), 0, 10.1);
  topC.scale.setScalar(0.7);
  topC.rotation.z = 2.07;
  for (const sx of [-1, 1]) {
    const mn = add(new THREE.Group(), sx * 6.6, 0);
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, 9, 20), ivory), 0, 4.5, 0, mn);
    for (const y of [4.2, 7.3]) {
      add(new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 0.25, 20), ivory), 0, y, 0, mn);
      const r = add(new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.03, 6, 32), gold), 0, y + 0.13, 0, mn);
      r.rotation.x = Math.PI / 2;
    }
    add(new THREE.Mesh(new THREE.LatheGeometry(domeProfile.map((v) => new THREE.Vector2(v.x * 0.17, v.y * 0.22))), ivory), 0, 9, 0, mn);
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.025, 0.5, 6), gold), 0, 10.1, 0, mn);
    add(new THREE.Mesh(new THREE.LatheGeometry(domeProfile.map((v) => new THREE.Vector2(v.x * 0.45, v.y * 0.45))), ivory), sx * 3.9, 3.2, 0.5);
  }
  scene.add(mosque);
  const sky = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.9, fog: false, color: '#FFD9A0' }));
  sky.scale.set(26, 26, 1);
  sky.position.set(0, 5.5, mz - 8);
  scene.add(sky);

  /* gold dust */
  const N = opts.lowPower ? 450 : 900;
  const pos = new Float32Array(N * 3);
  const dust0: number[][] = [];
  for (let i = 0; i < N; i++) dust0.push([(R() - 0.5) * 3.6, FLOOR + R() * 6, 9 - R() * (n * SPACING + 12), 0.05 + R() * 0.12, R() * 6.28]);
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dcv = document.createElement('canvas');
  dcv.width = dcv.height = 32;
  {
    const g = dcv.getContext('2d')!;
    const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    gr.addColorStop(0, 'rgba(255,230,170,1)');
    gr.addColorStop(0.4, 'rgba(230,190,110,.7)');
    gr.addColorStop(1, 'rgba(230,190,110,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 32, 32);
  }
  const dustTex = new THREE.CanvasTexture(dcv);
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ size: 0.045, map: dustTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: '#E9C98A' })));

  const still = Boolean(opts.reducedMotion);

  function render(progress: number, time: number, opened: number) {
    const t = still ? 0 : time;
    const last = n - 1;
    const base = Math.min(progress, last);
    const finale = 9.5 * easeInOut(progress - last);
    const intro = (1 - easeOut(opened)) * 3.2;
    const z = REST_DISTANCE - SPACING * base - finale + intro;
    const sx = 0.12 * Math.sin(t * 0.42);
    const sy = 0.06 * Math.sin(t * 0.31 + 1);
    camera.position.set(sx, sy + 0.02, z);
    camera.lookAt(sx * 0.25, sy * 0.5 + 0.05, z - 10);
    camera.rotation.z += 0.012 * Math.sin(t * 0.37);
    warm.position.set(0, 1.3, z - 3.4);
    warm.intensity = 8 + 0.8 * Math.sin(time * 7.3) + 0.5 * Math.sin(time * 13.1);

    for (const l of lanterns) {
      l.pivot.rotation.z = 0.035 * Math.sin(t * 1.1 + l.ph);
      l.pivot.rotation.x = 0.02 * Math.sin(t * 0.8 + l.ph * 1.3);
      l.glow.material.opacity = 0.62 + 0.12 * Math.sin(time * 8.7 + l.ph) + 0.08 * Math.sin(time * 21 + l.ph);
    }
    for (const f of floaters) {
      f.m.rotation.set(t * f.sp * 0.6, t * f.sp + f.ph, 0);
      f.m.position.y = f.y0 + 0.08 * Math.sin(t * 0.7 + f.ph);
    }

    // crescent spins in when the invitation opens, rises away as you scroll on
    const inP = easeOut(opened * 1.15);
    const outP = easeInOut(progress / 0.85);
    hero.visible = outP < 1;
    hero.position.set(0, 0.82 + outP * 1.6 + 0.03 * Math.sin(t * 1.3), 1.9 - outP * 0.5);
    hero.rotation.set(0, (1 - inP) * Math.PI * 3 + 0.25 * Math.sin(t * 0.9), 0);
    hero.scale.setScalar(0.62 * (0.3 + 0.7 * inP) * (1 - outP * 0.4));
    heroGlow.material.opacity = 0.5 * inP * (1 - outP);

    const p = dustGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < N; i++) {
      const b = dust0[i];
      p[i * 3] = b[0] + 0.08 * Math.sin(t * 0.5 + b[4]);
      p[i * 3 + 1] = FLOOR + ((b[1] - FLOOR + t * b[3]) % 6);
      p[i * 3 + 2] = b[2];
    }
    dustGeo.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  }

  function resize(width: number, height: number) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Landscape screens: widen the view a touch so the arch is not cropped.
    camera.fov = width > height ? 42 : 50;
    camera.updateProjectionMatrix();
  }

  return {
    render,
    resize,
    setPixelRatio: (r: number) => renderer.setPixelRatio(r),
    dispose: () => {
      renderer.dispose();
      envRT.dispose();
    },
  };
}
