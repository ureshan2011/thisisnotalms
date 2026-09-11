import type { ReactNode } from 'react';
import Reveal from './Reveal';

// Shared section wrapper for the course intro pages. Was duplicated inside
// IntroToDBMSLesson.tsx and IntroToBusinessAnalyticsLesson.tsx; pulled out
// once both pages needed the same scroll-reveal treatment rather than keep
// two copies in sync.

export default function CourseSection({
  id, eyebrow, title, lead, children,
}: { id?: string; eyebrow?: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <section id={id} className="border-t border-black/[0.08] py-14 scroll-mt-16">
      <Reveal>
        {eyebrow && (
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8e8e93]">{eyebrow}</p>
        )}
        <h2 className={`font-semibold tracking-[-0.01em] text-[#111827] text-[24px] sm:text-[28px] ${eyebrow ? 'mt-2' : ''}`}>
          {title}
        </h2>
        {lead && <p className="mt-3 max-w-2xl text-[15px] sm:text-[16px] leading-relaxed text-[#4b5563]">{lead}</p>}
        {children && <div className="mt-8">{children}</div>}
      </Reveal>
    </section>
  );
}
