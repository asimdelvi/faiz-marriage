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
      eyebrow="With blessings from"
      title="Our families"
      description="The people whose love, patience and prayers made this day possible."
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member, index) => (
          <Reveal as="li" key={member.id} index={index % 3}>
            <article className="card group h-full overflow-hidden">
              <div className="overflow-hidden">
                <SmartImage
                  image={member.image}
                  fallbackKey="PROMPT_FAMILY"
                  alt={member.name}
                  label={member.name}
                  ratio="1 / 1"
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                  imgClassName="group-hover:scale-[1.06]"
                />
              </div>
              <div className="px-6 py-6 text-center">
                <h3 className="font-display text-xl text-espresso sm:text-2xl">{member.name}</h3>
                {member.relation ? (
                  <p className="mt-2 text-[0.7rem] uppercase tracking-[0.2em] text-primary">
                    {member.relation}
                    {member.side && member.side !== 'both'
                      ? ` · ${member.side === 'bride' ? "Bride's side" : "Groom's side"}`
                      : ''}
                  </p>
                ) : null}
                {member.note ? (
                  <p className="mt-4 text-sm leading-relaxed text-mocha">{member.note}</p>
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
