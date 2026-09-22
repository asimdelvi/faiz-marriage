/**
 * AI fallback prompts. Any image the couple has not supplied is described here
 * so it can be generated — either automatically via `config.imageGenerator`,
 * or by hand (see ASSET_PROMPTS.md, generated from this file).
 */
export const PROMPTS = {
  PROMPT_HERO:
    'Ultra realistic luxury Indian Muslim wedding couple during golden hour, bride in an ornate gharara with a jewelled dupatta, groom in an embroidered sherwani, editorial wedding photography, shallow depth of field, premium lighting, warm cinematic colors, 8K.',
  PROMPT_HERO_COUPLE:
    'Ultra realistic Indian Muslim bride and groom during golden hour, sherwani and gharara, premium editorial wedding photography, soft bokeh, luxury styling, 8K.',
  PROMPT_VENUE:
    'Luxury nikah stage with a floral arch and warm fairy lights, elegant Islamic geometric décor, cinematic wedding venue, premium destination wedding aesthetic.',
  PROMPT_FAMILY:
    'Warm candid Indian Muslim family portrait in traditional attire, multi-generational, coordinated festive clothing, editorial quality, natural window light.',
  PROMPT_DINNER:
    'Luxury walima dinner with elegant table styling, candlelight, gold cutlery, biryani and kebabs beautifully plated, editorial food photography.',
  PROMPT_NIKAH:
    'Indian Muslim nikah ceremony, the couple seated before an ornate floral backdrop as the nikah nama is signed, elders offering dua, warm cinematic light, documentary wedding photography.',
  PROMPT_BACKGROUND:
    'Elegant ivory textured paper with subtle gold Islamic geometric embossing, eight-pointed star tessellation, seamless, soft studio light.',
  PROMPT_MANGNI:
    'Indian Muslim engagement ceremony, rings exchanged on a decorated tray with flowers, families watching, warm editorial photography, soft bokeh.',
  PROMPT_MEHENDI:
    'Close up of intricate bridal mehendi henna on hands, roses and marigold petals, soft golden light, luxury Indian wedding photography, shallow depth of field.',
  PROMPT_HALDI:
    'Indian Muslim manjha ceremony, turmeric paste and yellow florals, laughing family in yellow attire, bright airy courtyard, editorial wedding photography, vibrant warm colors.',
  PROMPT_SANGEET:
    'Indian Muslim mehendi night, family dancing on a decorated stage, warm stage lighting and bokeh, luxury wedding photography, cinematic motion.',
  PROMPT_BARAAT:
    'Indian Muslim groom in an embroidered sherwani and sehra arriving with the baraat, family dancing, flowers and lanterns, luxury wedding photography, sunset, vibrant colors, cinematic realism.',
  PROMPT_WALIMA:
    'Elegant walima reception, the couple on a floral stage, chandeliers and fairy lights, luxury editorial photography, warm champagne and emerald tones.',
  PROMPT_STORY_MEET:
    'Candid portrait of a young Indian Muslim couple laughing together, golden hour, film grain, editorial engagement photography, shallow depth of field.',
  PROMPT_STORY_PROPOSAL:
    'Indian Muslim couple holding hands with a ring, soft floral bokeh background, intimate editorial photography, warm cinematic tones.',
  PROMPT_GALLERY:
    'Luxury Indian Muslim pre-wedding editorial photograph, warm champagne tones, soft bokeh, premium styling, 8K.',
} as const;

export type PromptKey = keyof typeof PROMPTS;

/** Resolves a prompt key (or a literal prompt string) to prompt text. */
export function promptText(key?: string, fallback: PromptKey = 'PROMPT_GALLERY'): string {
  if (!key) return PROMPTS[fallback];
  if (key in PROMPTS) return PROMPTS[key as PromptKey];
  return key;
}
