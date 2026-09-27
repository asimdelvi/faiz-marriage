import { useState } from 'react';
import { d, Monogram } from './ui';

type Props = {
  bride: string;
  groom: string;
  bismillah?: string;
  dateLine: string;
  hasMusic: boolean;
  onOpen: () => void;
};

/**
 * The sealed invitation. Tapping Open is the guest's first gesture, which is
 * what lets the soft background sound start — and it sets the camera moving.
 */
export default function Cover({ bride, groom, bismillah, dateLine, hasMusic, onOpen }: Props) {
  const [leaving, setLeaving] = useState(false);
  return (
    <div className={`cover${leaving ? ' leaving' : ''}`} role="dialog" aria-modal="true" aria-labelledby="cover-names">
      <div className="cover-card in">
        {bismillah ? (
          <p lang="ar" dir="rtl" className="arabic cover-bismillah r r-rise" style={d(0.1)}>
            {bismillah}
          </p>
        ) : null}
        <Monogram a={bride} b={groom} className="cover-mono" delay={0.25} />
        <p className="kicker r r-rise" style={d(0.45)}>The Nikah of</p>
        <h2 id="cover-names" className="cover-names r r-flip" style={d(0.55)}>
          {bride} <span className="script">&amp;</span> {groom}
        </h2>
        <p className="kicker cover-date r r-rise" style={d(0.7)}>{dateLine}</p>
        <button
          type="button"
          className="btn btn-gold cover-btn r r-rise"
          style={d(0.85)}
          autoFocus
          onClick={() => {
            setLeaving(true);
            onOpen();
          }}
        >
          Open Invitation
        </button>
        {hasMusic ? <p className="cover-hint r r-rise" style={d(1)}>Best with sound on</p> : null}
      </div>
    </div>
  );
}
