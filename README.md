# Fida & Talha — 3D Nikah Invitation

A mobile-first invitation that guests *walk through*: every swipe moves the
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
5. **Events** — a card per ceremony with Arabic calligraphy, time and hall.
6. **Date** — Insha'Allah, the big flip-in date, a live countdown and
   **Add to calendar**.
7. **Venue** — address, parking note and **Get directions** (Google Maps).
8. **RSVP / Dua** — the marriage dua, plus **RSVP on WhatsApp** and tap-to-call contacts when configured (otherwise a closing dua scene).
9. **Finale** — the camera leaves the last arch and the mosque comes into view.

A glass navigation bar glides the camera straight to any section. On a laptop or
desktop, the directions and RSVP buttons also show a **QR code**, so guests
viewing on a big screen can scan it with their phone.

## Configuring

Everything lives in [`src/config.json`](src/config.json). Placeholders in it
(names, phone numbers, map link) are marked in its `_readme` notes.

| Field | Notes |
| --- | --- |
| `brideName`, `groomName`, `groomTitle`, `brideParent`, `groomParent` | Cover and names scene (title above the groom's name, D/o and S/o lines under each). |
| `shortNames` | Short forms for the top bar, monogram initials and page title. |
| `eventsHeading` | Heading of the ceremonies scene, e.g. "Nikah Ceremony". |
| `weddingDate`, `weddingTime`, `timezone` | ISO date; free-text time whose first clock time (`4:00 PM`) drives the countdown and calendar link; venue offset such as `+05:30` so both are right for guests abroad. |
| `venueName`, `venueAddress`, `venueNote` | The venue card. |
| `googleMapsUrl` | Paste the Google Maps **Share** link for an exact pin. Empty → directions search the name and address. |
| `bismillah`, `bismillahMeaning`, `blessing`, `closingDua` | Arabic and English for the opening, the ayah and the closing dua. |
| `heroEyebrow`, `heroSubtitle`, `invitationNote`, `dateEyebrow` | Lines around the names and the date. |
| `timeline[]` | One card per ceremony: `{ id, title, arabic, time, venue, description }`. |
| `rsvp` | `type: whatsapp \| form \| url \| none`; WhatsApp takes the number with country code, digits only, plus an optional pre-filled `message` and `deadline`. |
| `contacts[]` | Tap-to-call chips under the RSVP button. |
| `backgroundMusic` | A file in `public/music/` or a URL; `""` removes the sound button. The bundled `melody.m4a` is the invitation video's soundtrack: a warm drone with a plucked melody in the Arabic Hijaz scale and soft bells, looped seamlessly. |
| `colors` | `primary` (text), `secondary` (background), `accent` (gold — the 3D gold follows it too). |
| `hashtag`, `socialLinks.instagram`, `footerNote` | The finale. |
| `siteUrl`, `seo` | Canonical URL, sitemap and link preview (`public/og.jpg`). |

## How it works

- `src/three/corridor.ts` builds the whole 3D scene from code — arches, girih
  patterns, lanterns, crescent, mosque — with no image or model downloads.
- **Paged navigation** (`src/three/director.ts`): the page never scrolls
  natively. Any swipe (30 px+, or a quick flick), wheel/trackpad gesture, arrow
  key, Page Up/Down, Space or nav tap moves exactly one section. One
  critically damped spring value drives both the 3D camera and the text
  (`--e` / `--l` on each section), so they can never drift apart, and every
  section lands centred between the top bar and the nav. Panels taller than
  the screen are scaled to fit (`--fit`). A section's reveal starts once the
  glide has landed.
- Reveal animations are plain CSS 3D transforms (`.r-flip`, `.r-coin`,
  `.r-cardL` …, see `src/index.css`), staggered with `--d`.

## Performance and accessibility

- Three.js (~130 KB gzipped) loads in its own chunk after the cover paints.
- Resolution is fixed per device (1.5× on phones, 1.75× on desktops), so it
  never changes mid-visit; when nothing is moving the 3D view renders at about
  30 fps, and rendering pauses when the tab is hidden.
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
  three/director.ts    ← paged input → one spring → camera + section 3D state
  hooks/               ← background sound, SEO
  lib/                 ← dates, links, meta, theme
public/
  music/melody.m4a     ← looping soundtrack (Hijaz melody)
  og.jpg               ← link preview image
scripts/generate-static.mjs ← build-time SEO, robots.txt, sitemap.xml
```
