# Wedding Invitation

A premium, mobile-first, single-page wedding invitation — built to be reused for
any couple by editing **one file**: `src/config.ts`.

React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # bakes SEO, type-checks, builds to dist/
npm run preview  # serve the production build
```

`npm run build` runs `scripts/generate-static.mjs` first, which reads
`src/config.ts` and writes the real `<title>`, meta description, OpenGraph and
Twitter tags, Schema.org `Event` JSON-LD into `index.html`, plus `public/robots.txt`
and `public/sitemap.xml`. Crawlers and link previews therefore see the couple's
details without running any JavaScript.

## Configuring

Everything lives in [`src/config.ts`](src/config.ts). Nothing is hardcoded in the
components, and every field degrades gracefully:

| Field | Notes |
| --- | --- |
| `brideName`, `groomName` | Drive the hero, monogram, SEO and RSVP copy. |
| `weddingDate` | ISO `YYYY-MM-DD`. Powers the countdown, calendar link and JSON-LD. |
| `weddingTime` | Free text (`'7:00 PM onwards'`). A clock time in it is parsed for the countdown. |
| `venueName`, `venueAddress`, `googleMapsUrl` | The venue section, the embedded map and "Open directions". A share link, an embed URL or nothing at all (the address is then geocoded by Google) all work. |
| `hashtag`, `logo`, `socialLinks.instagram` | Branding. No logo → an engraved monogram is drawn from the initials. |
| `heroImage`, `heroVideo` | Video wins when both are set; it is muted, looping and swapped for the image under `prefers-reduced-motion`. |
| `backgroundMusic` | Any audio URL. See *Music* below. |
| `colors` | `primary`, `secondary`, `accent` — pushed into CSS custom properties at runtime, so the whole site (gradients, shadows, generated artwork) follows the palette. |
| `timeline[]` | The ceremonies. Each card is `{ id, title, date, time, venue, description, image, mapsUrl }`. |
| `family[]`, `gallery[]`, `story[]` | Arrays; an empty one hides its section *and* its navigation link. |
| `rsvp` | `type: 'whatsapp' \| 'form' \| 'url' \| 'none'`. WhatsApp takes a phone number in international format; the others take a URL. |
| `contacts[]` | Tap-to-call numbers in the RSVP section. |
| `siteUrl`, `seo` | Canonical URL, sitemap and social preview overrides. |
| `imageGenerator` | Optional text-to-image endpoint for missing artwork — see [ASSET_PROMPTS.md](ASSET_PROMPTS.md). |

Sections with no content simply do not render, and the navigation is built from
whatever remains — so a minimal config produces a clean, short page rather than
empty placeholders.

## Missing images

Any image you do not supply is replaced by deterministic, palette-aware SVG
artwork (~2 KB, no network requests) and the element carries `data-ai-prompt`
with the prompt that would produce the real photograph. Prompts and both ways to
materialise them are documented in [ASSET_PROMPTS.md](ASSET_PROMPTS.md).

## Music

- Never autoplays with sound. A *muted* autoplay warms the element up.
- On first genuine interaction (pointer, key, touch, wheel) the track fades in
  over 1.5s.
- On Android a welcome modal asks first — no surprise audio.
- The floating control toggles playback with the same 1.5s fade.
- The choice is remembered in `localStorage`; "off" is respected on return.

## Accessibility

Skip link, landmark elements, labelled controls, `aria-current` on the active
nav link, Escape closes the menu and the modal, visible focus rings, and a full
`prefers-reduced-motion` path (parallax, hero video, floats and stagger all stand
down).

## Performance

- The hero is the only above-the-fold work: every section below it is a lazy
  chunk, and animation features load after first paint via `LazyMotion`.
- Images are lazy by default, `fetchPriority="high"` for the hero, and every
  image box reserves its aspect ratio so nothing shifts.
- Fonts are loaded non-blocking with `display=swap` and a matching system fallback.
- React is pinned to its own long-lived chunk for cache hits across deploys.

## Deploying

### GitHub Pages (configured)

`.github/workflows/deploy.yml` builds and publishes on every push to the default
branch, and can be run by hand from the Actions tab. The site lands at:

**https://asimdelvi.github.io/faiz-marriage/**

One-time setup in the repository settings:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
   This has to be done by hand once — the workflow token is not permitted to
   create the Pages site, so the deploy job fails until it is set.
2. GitHub Pages on a **private** repository needs a paid plan (Pro/Team/
   Enterprise). On a free account, make the repository public first —
   Settings → General → Danger Zone → Change visibility.
3. Re-run the workflow (Actions → Deploy to GitHub Pages → Run workflow), or
   just push again.

The build is served from a subdirectory, so `vite.config.ts` sets
`base: '/faiz-marriage/'` and every site-root path in the config (`/images/…`,
`/music/…`, the logo, the hero video) is rebased at runtime by `asset()` in
`src/lib/media.ts`. Nothing else needs to change.

Custom domain? Add the domain in Settings → Pages, put a `CNAME` file in
`public/`, set `BASE_PATH: /` in the workflow, and update `siteUrl` in the config.

### Anywhere else

The output is plain static files, so `dist/` also works on Vercel, Netlify,
Cloudflare Pages or any bucket:

```bash
npm run build && npx serve dist        # BASE_PATH=/ for a domain root
```

Set `siteUrl` in the config before the production build so the canonical URL and
sitemap are correct.

## Project layout

```
src/
  config.ts          ← the only file you normally edit
  types.ts           ← the shape of the config
  sections/          ← Hero, Invitation, Story, Timeline, Family, Gallery, Venue, RSVP, Footer
  components/        ← Navigation, MusicPlayer, WelcomeModal, Countdown
  components/ui/     ← Section, Reveal, Button, SmartImage, GeneratedArt, Monogram, Ornament
  hooks/             ← audio, scroll, active section, scroll lock, SEO
  lib/               ← theme, dates, links, meta, prompts, media resolution
scripts/
  generate-static.mjs← build-time SEO, robots.txt, sitemap.xml
.github/workflows/
  deploy.yml         ← build + publish to GitHub Pages
```
