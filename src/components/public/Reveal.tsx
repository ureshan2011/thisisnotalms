import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

// Shared scroll-reveal wrapper for the course intro pages (/intro-to-dbms,
// /intro-to-business-analytics). Fades and lifts content in as it enters
// the viewport, the same easing curve PublicLessonShell's hero uses, so
// motion feels consistent across the public pages. Runs once per element
// (viewport.once) so re-scrolling past a section never replays it.

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
