export type NavItem = { index: number; label: string };

/**
 * Floating glass navigation. The gold pill slides to the section in view;
 * tapping a label glides the camera there through the arches.
 */
export default function Nav({ items, active, visible, onGo }: {
  items: NavItem[];
  active: number;
  visible: boolean;
  onGo: (index: number) => void;
}) {
  const pos = items.findIndex((it) => it.index === active);
  return (
    <nav
      className={`nav glass${visible ? ' show' : ''}`}
      aria-label="Sections"
      style={{ ['--n' as string]: items.length }}
    >
      <span
        className="nav-ind"
        aria-hidden="true"
        style={{ transform: `translateX(${Math.max(0, pos) * 100}%)`, opacity: pos < 0 ? 0 : 1 }}
      />
      {items.map((it) => (
        <button
          key={it.index}
          type="button"
          className={it.index === active ? 'on' : ''}
          aria-current={it.index === active ? 'true' : undefined}
          onClick={() => onGo(it.index)}
        >
          {it.label}
        </button>
      ))}
    </nav>
  );
}
