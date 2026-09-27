# Aaliya & Faiz — 3D Wedding Invitation

A mobile-first invitation that guests *walk through*: every scroll moves the
camera one arch deeper down a corridor of carved ivory Mughal arches, past
swaying lanterns and floating gold stars, until it steps out to a domed mosque
at the end. Built to be reused for any couple by editing **one file**:
`src/config.json`.

React 19 · TypeScript · Vite · Three.js. No CSS framework, no animation library.

**Live:** https://asimdelvi.github.io/faiz-marriage/

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173/faiz-marriage/
npm run build    # bakes SEO, type-checks, builds to dist/
npm run preview  # serve the production build
```

## What guests see

1. **Cover** — a sealed card: Bismillah, monogram, names, date and
   **Open Invitation**. That tap is the gesture that allows the soft background
   sound to start, and it sets the camera moving into the corridor.
2. **Bismillah** — a gold crescent spins in above the first arch.
3. **Blessing** — Surah Ar-Rum 30:21 in Arabic with the English meaning.
4. **Couple** — the names flip up letter by letter.
5. **Events** — Nikah and Walima cards with Arabic calligraphy, times and halls.
6. **Date** — Insha'Allah, the big flip-in date, a live countdown and
   **Add to calendar**.
7. **Venue** — address, parking note and **Get directions** (Google Maps).
8. **RSVP** — the marriage dua, **RSVP on WhatsApp** and tap-to-call contacts.
9. **Finale** — the camera leaves the last arch and the mosque comes into view.

A glass navigation bar glides the camera straight to any section. On a laptop or
desktop, the directions and RSVP buttons also show a **QR code**, so guests
viewing on a big screen can scan it with their phone.

## Configuring

Everything lives in [`src/config.json`](src/config.json). Placeholders in it
(names, phone numbers, map link) are marked in its `_readme` notes.

| Field | Notes |
| --- | --- |
| `brideName`, `groomName` | Cover, monogram, names scene, SEO and RSVP copy. |
| `weddingDate`, `weddingTime`, `timezone` | ISO date; free-text time whose first clock time (`4:00 PM`) drives the countdown and calendar link; venue offset such as `+05:30` so both are right for guests abroad. |
| `venueName`, `venueAddress`, `venueNote` | The venue card. |
| `googleMapsUrl` | Paste the Google Maps **Share** link for an exact pin. Empty → directions search the name and address. |
| `bismillah`, `bismillahMeaning`, `blessing`, `closingDua` | Arabic and English for the opening, the ayah and the closing dua. |
| `heroEyebrow`, `heroSubtitle`, `invitationNote`, `dateEyebrow` | Lines around the names and the date. |
| `timeline[]` | One card per ceremony: `{ id, title, arabic, time, venue, description }`. |
| `rsvp` | `type: whatsapp \| form \| url \| none`; WhatsApp takes the number with country code, digits only, plus an optional pre-filled `message` and `deadline`. |
| `contacts[]` | Tap-to-call chips under the RSVP button. |
| `backgroundMusic` | A file in `public/music/` or a URL; `""` removes the sound button. The bundled `ambient.m4a` is a soft hum with gentle chimes — no instruments. |
| `colors` | `primary` (text), `secondary` (background), `accent` (gold — the 3D gold follows it too). |
| `hashtag`, `socialLinks.instagram`, `footerNote` | The finale. |
| `siteUrl`, `seo` | Canonical URL, sitemap and link preview (`public/og.jpg`). |

## How it works

- `src/three/corridor.ts` builds the whole 3D scene from code — arches, girih
  patterns, lanterns, crescent, mosque — with no image or model downloads.
- `src/three/director.ts` runs one animation loop: it turns scroll position into
  corridor progress (one arch per section), eases the camera so it glides, and
  writes `--e` / `--l` (entering / leaving) onto each section so CSS can fly the
  content in from depth and past the viewer.
- Reveal animations are plain CSS 3D transforms (`.r-flip`, `.r-coin`,
  `.r-cardL` …, see `src/index.css`), staggered with `--d`.

## Performance and accessibility

- Three.js (~130 KB gzipped) loads in its own chunk after the cover paints.
- Resolution is capped on phones and drops automatically if frames run slow;
  rendering pauses when the tab is hidden.
- No WebGL → a drawn gold arch on the ivory backdrop; everything still works.
- `prefers-reduced-motion` → no camera sway or flying text, content just fades.
- Fonts are self-hosted (`@fontsource`): Cormorant Garamond, Jost, Great Vibes, Amiri.
- Real headings and links, `lang="ar"` on Arabic, labelled buttons, visible focus.
- Sound never autoplays; it starts only after **Open**, fades in, and "off" is remembered.

## Deploying

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every
push to this branch or `main`. One-time setup: **Settings → Pages → Source:
GitHub Actions** (and the repository must be public on a free plan).

Custom domain? Add it in Settings → Pages, put a `CNAME` file in `public/`, set
`BASE_PATH: /` in the workflow, and update `siteUrl` in the config.

The output in `dist/` is static, so Vercel, Netlify or Cloudflare Pages work too
(`BASE_PATH=/ npm run build`).

## Project layout

```
src/
  config.json          ← the only file you normally edit
  App.tsx              ← cover, scenes, navigation, sound button
  sections/Scenes.tsx  ← the seven scenes + finale
  components/          ← Cover, Nav, Countdown, ui (divider, monogram, QR, icons)
  three/corridor.ts    ← the 3D corridor
  three/director.ts    ← scroll → camera, section 3D state, adaptive quality
  hooks/               ← background sound, SEO
  lib/                 ← dates, links, meta, theme
public/
  music/ambient.m4a    ← no-instrument ambient loop
  og.jpg               ← link preview image
scripts/generate-static.mjs ← build-time SEO, robots.txt, sitemap.xml
```
