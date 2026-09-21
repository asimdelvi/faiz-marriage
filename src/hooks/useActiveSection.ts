import { useEffect, useState } from 'react';

/**
 * Highlights the nav link for whichever section owns the viewport centre.
 * Sections arrive late (they are code-split), so the observer re-attaches
 * until every id in the menu actually exists in the document.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!ids.length || typeof IntersectionObserver === 'undefined') return;

    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    );
    nodes.forEach((node) => observer.observe(node));

    // Lazy sections may not have mounted yet — look again shortly.
    let timer = 0;
    if (nodes.length < ids.length && attempt < 20) {
      timer = window.setTimeout(() => setAttempt((value) => value + 1), 250);
    }

    return () => {
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [ids.join('|'), attempt]);

  return active;
}
