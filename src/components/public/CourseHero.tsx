import { type ComponentType, Suspense } from 'react';
import { motion } from 'framer-motion';

// Shared animated hero for the course intro pages. Two-column on desktop
// (copy left, an ambient 3D scene right), stacked on mobile with the scene
// scaled down behind the text. The 3D scene is optional (Scene prop) and
// loaded inside its own Suspense boundary so a slow WebGL init never blocks
// the headline from appearing — the text animates in immediately either way.

const EASE = [0.16, 1, 0.3, 1] as const;

interface CourseHeroProps {
  eyebrow: string;
  title: string;
  author: string;
  authorUrl: string;
  intro: string;
  accent: string;
  orb2: string;
  Scene?: ComponentType;
}

export default function CourseHero({ eyebrow, title, author, authorUrl, intro, accent, orb2, Scene }: CourseHeroProps) {
  return (
    <header className="relative overflow-hidden border-b border-black/[0.08]">
      {/* Ambient gradient backdrop, same language as PublicLessonShell's hero */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-24 left-1/3 h-[520px] w-[520px] rounded-full blur-3xl"
          style={{ background: accent + '14' }}
        />
        <div
          className="absolute bottom-[-10%] right-[4%] h-[360px] w-[360px] rounded-full blur-3xl"
          style={{ background: orb2 + '12' }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-24 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-[13px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: accent }}
          >
            {eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE, delay: 0.08 }}
            className="mt-4 text-[36px] sm:text-[50px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#111827]"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE, delay: 0.16 }}
            className="mt-3 text-[14px] text-[#6b7280]"
          >
            By{' '}
            <a href={authorUrl} target="_blank" rel="noreferrer" className="font-medium hover:underline" style={{ color: accent }}>
              {author}
            </a>
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE, delay: 0.24 }}
            className="mt-6 text-[16px] sm:text-[17px] leading-relaxed text-[#374151]"
          >
            {intro}
          </motion.p>
        </div>

        {Scene && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
            className="relative h-[220px] sm:h-[320px] md:h-[380px] order-first md:order-last"
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="relative flex justify-center pb-8 text-[12px] font-medium text-[#aeaeb2]"
      >
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
          Scroll to explore
        </motion.span>
      </motion.div>
    </header>
  );
}
