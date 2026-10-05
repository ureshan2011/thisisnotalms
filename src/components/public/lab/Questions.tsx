import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

// ─── Questions you answer from a page, then check ─────────────────────────
// The student answers on paper first, then opens the answer. Every item says
// where on the page the answer lives, because the skill being taught is
// finding it, not knowing it. Used for each lab's data-card detective.

export interface QuestionItem {
  q: string;
  where: string;
  a: ReactNode;
}

export default function Questions({ items }: { items: QuestionItem[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setOpen(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="lr-qs">
      {items.map((item, i) => (
        <div key={item.q} className="lr-q">
          <div className="lr-q__row">
            <span className="lr-q__n bt-tnum">{String(i + 1).padStart(2, '0')}</span>
            <h4>
              {item.q}
              <span className="lr-q__where">Where to look: {item.where}</span>
            </h4>
            <button type="button" className="lr-navbtn" aria-expanded={open.has(i)} onClick={() => toggle(i)}>
              {open.has(i) ? 'Hide' : 'Check my answer'}
            </button>
          </div>
          {open.has(i) && (
            <motion.p
              className="lr-q__ans"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {item.a}
            </motion.p>
          )}
        </div>
      ))}
    </div>
  );
}
