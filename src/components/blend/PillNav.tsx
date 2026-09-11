import { useEffect, useRef, useState } from 'react';

// Floating near-black pill nav. Sticks below the page header, highlights
// whichever section is currently in view, and jump-scrolls on click. On
// narrow screens the bar scrolls sideways and keeps the active pill centred,
// so you can always see where you are.

export interface NavItem {
  /** The `id` of the <section> this pill scrolls to. */
  id: string;
  /** Two or three words. Anything longer crowds the bar on a phone. */
  label: string;
}

export default function PillNav({ label, items, ariaLabel = 'Sections of this page' }: {
  /** Short lockup pinned to the left of the pills, usually the course code. */
  label: string;
  items: NavItem[];
  ariaLabel?: string;
}) {
  const [active, setActive] = useState(items[0]?.id);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = items
      .map(n => document.getElementById(n.id))
      .filter((el): el is HTMLElement => !!el);

    const observer = new IntersectionObserver(
      entries => {
        const seen = entries.find(e => e.isIntersecting);
        if (seen) setActive(seen.target.id);
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: 0 },
    );
    sections.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const bar = barRef.current;
    const current = bar?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!bar || !current) return;
    const left = current.offsetLeft - bar.clientWidth / 2 + current.clientWidth / 2;
    bar.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [active]);

  return (
    <div className="bt-navdock">
      <nav ref={barRef} className="bt-pillbar" aria-label={ariaLabel}>
        <span className="bt-wordmark" style={{ fontSize: 15, marginRight: 8 }}>{label}</span>
        {items.map(n => (
          <button
            key={n.id}
            type="button"
            aria-current={active === n.id}
            onClick={() => document.getElementById(n.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            {n.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
