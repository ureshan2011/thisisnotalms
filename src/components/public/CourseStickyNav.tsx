import { useEffect, useRef, useState } from 'react';

// Slim sticky section nav for the course intro pages, in the spirit of the
// sub-nav bar on Apple product pages: sits under the main brand bar once
// you scroll past the hero, highlights whichever section is currently in
// view, and jump-scrolls on click. Purely a navigation aid — every section
// it links to also works fine on its own via normal scrolling.

interface NavItem { id: string; label: string; }

export default function CourseStickyNav({ items, accent }: { items: NavItem[]; accent: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const [visible, setVisible] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const sections = items
      .map(i => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el);

    const observer = new IntersectionObserver(
      entries => {
        const visibleEntry = entries.find(e => e.isIntersecting);
        if (visibleEntry) setActive(visibleEntry.target.id);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    );
    sections.forEach(el => observer.observe(el));

    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 420);
        ticking.current = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [items]);

  return (
    <div
      className="sticky top-0 z-40 border-b transition-all duration-300"
      style={{
        borderColor: visible ? 'rgba(0,0,0,0.08)' : 'transparent',
        background: visible ? 'rgba(255,255,255,0.85)' : 'transparent',
        backdropFilter: visible ? 'blur(12px)' : 'none',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <nav
        className="mx-auto max-w-5xl px-6 flex items-center gap-6 overflow-x-auto transition-all duration-300"
        style={{ height: visible ? 44 : 0, opacity: visible ? 1 : 0 }}
      >
        {items.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
            className="flex-none text-[12.5px] font-medium whitespace-nowrap transition-colors"
            style={{ color: active === item.id ? accent : '#8e8e93' }}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
