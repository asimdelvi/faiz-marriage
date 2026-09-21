/**
 * AI fallback prompts. Any image the couple has not supplied is described here
 * so it can be generated — either automatically via `config.imageGenerator`,
 * or by hand (see ASSET_PROMPTS.md, generated from this file).
 */
export const PROMPTS = {
  PROMPT_HERO:
    'Ultra realistic luxury Indian wedding couple during golden hour, elegant traditional attire, editorial wedding photography, shallow depth of field, premium lighting, warm cinematic colors, 8K.',
  PROMPT_HERO_COUPLE:
    'Ultra realistic Indian bride and groom during golden hour, premium editorial wedding photography, soft bokeh, luxury styling, 8K.',
  PROMPT_VENUE:
    'Luxury floral mandap with warm fairy lights, elegant décor, cinematic wedding venue, premium destination wedding aesthetic.',
  PROMPT_FAMILY:
    'Warm candid Indian family portrait in traditional attire, multi-generational, coordinated festive clothing, editorial quality, natural window light.',
  PROMPT_DINNER:
    'Luxury Indian wedding buffet with elegant table styling, candlelight, gold cutlery, editorial food photography.',
  PROMPT_SAAT_PHERE:
    'Traditional Hindu wedding ceremony around the sacred fire inside a floral mandap, warm cinematic light, documentary wedding photography.',
  PROMPT_BACKGROUND:
    'Elegant ivory textured paper with subtle gold floral embossing, seamless, soft studio light.',
  PROMPT_MEHENDI:
    'Close up of intricate bridal mehendi henna on hands, marigold petals, soft golden light, luxury Indian wedding photography, shallow depth of field.',
  PROMPT_HALDI:
    'Indian haldi ceremony, turmeric paste and marigold garlands, laughing family, bright airy courtyard, editorial wedding photography, vibrant warm colors.',
  PROMPT_SANGEET:
    'Indian sangeet night, family dancing on a decorated stage, warm stage lighting and bokeh, luxury wedding photography, cinematic motion.',
  PROMPT_BARAAT:
    'Indian groom riding a decorated horse, family dancing, marigold flowers, luxury wedding photography, sunset, vibrant colors, cinematic realism.',
  PROMPT_RECEPTION:
    'Elegant Indian wedding reception, couple on a floral stage, chandeliers and fairy lights, luxury editorial photography, warm champagne tones.',
  PROMPT_STORY_MEET:
    'Candid portrait of a young Indian couple laughing together, golden hour, film grain, editorial engagement photography, shallow depth of field.',
  PROMPT_STORY_PROPOSAL:
    'Indian couple holding hands with a ring, soft marigold bokeh background, intimate editorial photography, warm cinematic tones.',
  PROMPT_GALLERY:
    'Luxury Indian pre-wedding editorial photograph, warm champagne tones, soft bokeh, premium styling, 8K.',
} as const;

export type PromptKey = keyof typeof PROMPTS;

/** Resolves a prompt key (or a literal prompt string) to prompt text. */
export function promptText(key?: string, fallback: PromptKey = 'PROMPT_GALLERY'): string {
  if (!key) return PROMPTS[fallback];
  if (key in PROMPTS) return PROMPTS[key as PromptKey];
  return key;
}
