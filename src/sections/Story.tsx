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
      <div className="grid gap-6 sm:grid-cols-2">
        {chapters.map((chapter, index) => (
          <Reveal key={chapter.id} as="article" index={index} className="card group overflow-hidden">
            <div className="overflow-hidden">
              <SmartImage
                image={chapter.image}
                fallbackKey="PROMPT_STORY_MEET"
                alt={chapter.title}
                label={chapter.title}
                ratio="16 / 9"
                sizes="(max-width: 640px) 92vw, 46vw"
                imgClassName="group-hover:scale-[1.06]"
              />
            </div>
            <div className="px-6 py-6">
              {chapter.date ? <p className="eyebrow mb-2">{chapter.date}</p> : null}
              <h3 className="font-display text-2xl text-espresso">{chapter.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mocha sm:text-base">{chapter.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export default Story;
