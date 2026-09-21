import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import SmartImage from '../components/ui/SmartImage';
import type { GalleryItem } from '../types';

type Props = { items: GalleryItem[]; hashtag?: string };

const ratios: Record<NonNullable<GalleryItem['orientation']>, string> = {
  portrait: '3 / 4',
  landscape: '4 / 3',
  square: '1 / 1',
};

export function Gallery({ items, hashtag }: Props) {
  if (!items.length) return null;

  return (
    <Section
      id="gallery"
      tone="cream"
      eyebrow="Moments"
      title="A few favourites"
      description={
        hashtag
          ? `Share yours from the celebrations with ${hashtag.startsWith('#') ? hashtag : `#${hashtag}`}.`
          : undefined
      }
    >
      <ul className="columns-2 gap-4 sm:gap-6 lg:columns-3">
        {items.map((item, index) => (
          <Reveal
            as="li"
            key={item.id}
            index={index % 3}
            className="mb-4 break-inside-avoid sm:mb-6"
          >
            <figure className="group overflow-hidden rounded-[1.5rem] shadow-[var(--shadow-soft)]">
              <SmartImage
                image={item}
                fallbackKey="PROMPT_GALLERY"
                alt={item.alt || item.caption || 'Wedding photograph'}
                label={item.caption}
                ratio={ratios[item.orientation ?? 'portrait']}
                sizes="(max-width: 640px) 46vw, (max-width: 1024px) 46vw, 30vw"
                imgClassName="group-hover:scale-[1.07]"
              />
              {item.caption ? (
                <figcaption className="bg-ivory px-4 py-3 text-center text-xs uppercase tracking-[0.16em] text-mocha">
                  {item.caption}
                </figcaption>
              ) : null}
            </figure>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

export default Gallery;
