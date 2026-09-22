import Section from '../components/ui/Section';
import Reveal from '../components/ui/Reveal';
import SmartImage from '../components/ui/SmartImage';
import type { FamilyMember } from '../types';

type Props = { members: FamilyMember[] };

export function Family({ members }: Props) {
  if (!members.length) return null;

  return (
    <Section
      id="family"
      tone="ivory"
      eyebrow="With the blessings of our elders"
      title="Our families"
      description="The people whose love, patience and duas made this day possible."
    >
      <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {members.map((member, index) => (
          <Reveal as="li" key={member.id} index={index % 3}>
            <article className="card group h-full overflow-hidden">
              <div className="overflow-hidden">
                <SmartImage
                  image={member.image}
                  fallbackKey="PROMPT_FAMILY"
                  alt={member.name}
                  label={member.name}
                  ratio="5 / 4"
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 24vw"
                  imgClassName="group-hover:scale-[1.06]"
                />
              </div>
              <div className="px-4 py-4 text-center sm:px-5 sm:py-5">
                <h3 className="font-display text-lg text-espresso sm:text-xl">{member.name}</h3>
                {member.relation ? (
                  <p className="mt-1.5 text-[0.65rem] uppercase tracking-[0.18em] text-primary">
                    {member.relation}
                    {member.side && member.side !== 'both'
                      ? ` · ${member.side === 'bride' ? "Bride's side" : "Groom's side"}`
                      : ''}
                  </p>
                ) : null}
                {member.note ? (
                  <p className="mt-3 text-[0.82rem] leading-relaxed text-mocha">{member.note}</p>
                ) : null}
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

export default Family;
