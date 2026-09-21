import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import SmartImage from '../components/ui/SmartImage';
import type { StoryChapter } from '../types';

type Props = { chapters: StoryChapter[]; pair: string };

/** Alternating editorial spreads — image on one side, chapter on the other. */
export function Story({ chapters, pair }: Props) {
  if (!chapters.length) return null;

  return (
    <Section
      id="story"
      tone="ivory"
      eyebrow="Our story"
      title="How we got here"
      description={`A few of the moments that brought ${pair} to this day.`}
    >
      <div className="space-y-16 sm:space-y-24">
        {chapters.map((chapter, index) => (
          <Reveal
            key={chapter.id}
            as="article"
            index={index}
            className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2"
          >
            <div className={`group overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-soft)] ${
              index % 2 === 1 ? 'lg:order-2' : ''
            }`}>
              <SmartImage
                image={chapter.image}
                fallbackKey="PROMPT_STORY_MEET"
                alt={chapter.title}
                label={chapter.title}
                ratio="4 / 3"
                sizes="(max-width: 1024px) 92vw, 46vw"
                imgClassName="group-hover:scale-[1.06]"
              />
            </div>
            <div className={index % 2 === 1 ? 'lg:order-1 lg:pr-6' : 'lg:pl-6'}>
              {chapter.date ? <p className="eyebrow mb-3">{chapter.date}</p> : null}
              <h3 className="font-display text-3xl text-espresso sm:text-4xl">{chapter.title}</h3>
              <p className="mt-5 text-balance leading-relaxed text-mocha sm:text-lg">
                {chapter.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export default Story;
