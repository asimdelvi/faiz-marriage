# AI image prompts

Every image on the site is optional. When one is missing, the site draws its own
ornamental artwork in its place (`src/components/ui/GeneratedArt.tsx`) and tags the
element with `data-ai-prompt`, so nothing ever looks broken.

To replace that artwork with real imagery you have two routes.

## 1. Generate automatically

Set an endpoint in `src/config.ts`:

```ts
imageGenerator: 'https://your-image-service.example/generate?prompt={prompt}&seed={seed}&w=1600',
```

`{prompt}` (URL-encoded) and `{seed}` (stable per prompt) are substituted at runtime.
Leave it empty for zero external requests.

## 2. Generate by hand

Run each prompt below through your image tool of choice, drop the files into
`public/images/`, and point the config at them (`heroImage: '/images/hero.jpg'`,
`timeline[].image.src`, `family[].image.src`, `gallery[].src`, `venueImage.src`).

Recommended sizes: hero 2400×1350, timeline/venue 1600×1000, family 1000×1000,
gallery 1200×1600. Export as WebP or AVIF where you can.

| Key | Used for | Prompt |
| --- | --- | --- |
| `PROMPT_HERO` | Hero background | Ultra realistic luxury Indian wedding couple during golden hour, elegant traditional attire, editorial wedding photography, shallow depth of field, premium lighting, warm cinematic colors, 8K. |
| `PROMPT_HERO_COUPLE` | Couple portraits | Ultra realistic Indian bride and groom during golden hour, premium editorial wedding photography, soft bokeh, luxury styling, 8K. |
| `PROMPT_VENUE` | Venue card | Luxury floral mandap with warm fairy lights, elegant décor, cinematic wedding venue, premium destination wedding aesthetic. |
| `PROMPT_FAMILY` | Family cards | Warm candid Indian family portrait in traditional attire, multi-generational, coordinated festive clothing, editorial quality, natural window light. |
| `PROMPT_DINNER` | Dinner / reception dining | Luxury Indian wedding buffet with elegant table styling, candlelight, gold cutlery, editorial food photography. |
| `PROMPT_SAAT_PHERE` | Wedding ceremony | Traditional Hindu wedding ceremony around the sacred fire inside a floral mandap, warm cinematic light, documentary wedding photography. |
| `PROMPT_BACKGROUND` | Page texture | Elegant ivory textured paper with subtle gold floral embossing, seamless, soft studio light. |
| `PROMPT_MEHENDI` | Mehendi | Close up of intricate bridal mehendi henna on hands, marigold petals, soft golden light, luxury Indian wedding photography, shallow depth of field. |
| `PROMPT_HALDI` | Haldi | Indian haldi ceremony, turmeric paste and marigold garlands, laughing family, bright airy courtyard, editorial wedding photography, vibrant warm colors. |
| `PROMPT_SANGEET` | Sangeet | Indian sangeet night, family dancing on a decorated stage, warm stage lighting and bokeh, luxury wedding photography, cinematic motion. |
| `PROMPT_BARAAT` | Baraat | Indian groom riding a decorated horse, family dancing, marigold flowers, luxury wedding photography, sunset, vibrant colors, cinematic realism. |
| `PROMPT_RECEPTION` | Reception | Elegant Indian wedding reception, couple on a floral stage, chandeliers and fairy lights, luxury editorial photography, warm champagne tones. |
| `PROMPT_STORY_MEET` | Story chapter | Candid portrait of a young Indian couple laughing together, golden hour, film grain, editorial engagement photography, shallow depth of field. |
| `PROMPT_STORY_PROPOSAL` | Story chapter | Indian couple holding hands with a ring, soft marigold bokeh background, intimate editorial photography, warm cinematic tones. |
| `PROMPT_GALLERY` | Gallery | Luxury Indian pre-wedding editorial photograph, warm champagne tones, soft bokeh, premium styling, 8K. |

Timeline images pick their prompt from the ceremony name automatically
(`mehendi`, `haldi`, `sangeet`, `baraat`, `reception`, `dinner`, `wedding` /
`nikah` / `phere`), so a new ceremony gets a sensible image without extra wiring.
You can always override per item with `image: { prompt: 'your own prompt' }`.

The table mirrors `src/lib/prompts.ts` — edit the prompts there and they flow
through to the whole site.
