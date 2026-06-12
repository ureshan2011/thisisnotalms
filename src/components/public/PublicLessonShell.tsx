import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BrandLogo from '../ui/BrandLogo';

// ─── Shared shell for the standalone, public "Let's make sense of…" lessons ──
// Mirrors the design language of the existing public lessons (FiveStories,
// SystemsSecurity, Normalisation): a sticky nav, an Apple-style hero with
// drifting colour orbs, the interactive lesson body, a Blackboard embed panel,
// and a quiet footer. No auth, no Firebase — everything runs in the browser.

const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';

const EASE = [0.16, 1, 0.3, 1] as const;

export interface LessonPill {
  emoji: string;
  name: string;
  color: string;
}

interface PublicLessonShellProps {
  /** Small uppercase line above the title, e.g. "MBI802 · Database Management". */
  eyebrow: string;
  /** Leading part of the headline, e.g. "Let's make sense of". */
  titleLead: string;
  /** Gradient-highlighted part of the headline, e.g. "SQL.". */
  titleAccent: string;
  /** CSS gradient used for the accent text. */
  gradient: string;
  /** Primary accent colour — links, back button, first orb. */
  accent: string;
  /** Secondary orb colour. */
  orb2: string;
  /** Tertiary orb colour. */
  orb3: string;
  /** One-paragraph hero subtitle. */
  subtitle: string;
  /** Topic chips shown under the subtitle. */
  pills: LessonPill[];
  /** The interactive lesson body. */
  children: ReactNode;
}

export default function PublicLessonShell({
  eyebrow,
  titleLead,
  titleAccent,
  gradient,
  accent,
  orb2,
  orb3,
  subtitle,
  pills,
  children,
}: PublicLessonShellProps) {
  return (
    <div style={{ fontFamily: APPLE_FONT }} className="min-h-screen bg-white text-[#1d1d1f]">
      {/* ── Top nav ── */}
      <nav className="sticky top-0 z-50 border-b border-black/[0.07] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link to="/home" className="no-underline">
            <BrandLogo iconSize={28} variant="on-light" />
          </Link>
          <Link
            to="/home"
            className="flex items-center gap-1.5 rounded-full border border-black/[0.10] px-4 py-1.5 text-[13px] font-medium text-[#6e6e73] transition hover:text-[#1d1d1f]"
            style={{ borderColor: accent + '33' }}
          >
            <span className="text-[15px]">‹</span>
            All lessons
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-[-10%] h-[560px] w-[560px] -translate-x-1/2 rounded-full blur-3xl"
            style={{ background: accent + '17' }}
          />
          <div
            className="absolute bottom-[-8%] right-[5%] h-[360px] w-[360px] rounded-full blur-3xl"
            style={{ background: orb2 + '14' }}
          />
          <div
            className="absolute bottom-[0%] left-[2%] h-[280px] w-[280px] rounded-full blur-3xl"
            style={{ background: orb3 + '12' }}
          />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-5 text-[13px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: accent }}
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.06 }}
            className="text-[40px] font-semibold leading-[1.04] tracking-[-0.03em] sm:text-[68px]"
          >
            {titleLead}{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: gradient }}>
              {titleAccent}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.14 }}
            className="mx-auto mt-7 max-w-xl text-[18px] leading-relaxed text-[#6e6e73] sm:text-[20px]"
          >
            {subtitle}
          </motion.p>

          {pills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.22 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              {pills.map((p) => (
                <span
                  key={p.name}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[14px] font-semibold"
                  style={{ borderColor: p.color + '44', background: p.color + '10', color: p.color }}
                >
                  {p.emoji} {p.name}
                </span>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 flex flex-col items-center gap-1.5"
          >
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="text-[13px] font-medium text-[#aeaeb2]"
            >
              Scroll to begin
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Lesson content ── */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">{children}</section>

      {/* ── Footer ── */}
      <footer className="border-t border-black/[0.06] px-6 py-12 text-center">
        <div className="mb-5 flex items-center justify-center">
          <BrandLogo iconSize={28} variant="on-light" />
        </div>
        <p className="text-[12px] text-[#aeaeb2]">
          Everything here runs in your own browser. No login, no personal data collected.
        </p>
        <p className="mt-3">
          <Link to="/home" className="text-[13px] font-medium hover:underline" style={{ color: accent }}>
            ‹ Back to all lessons
          </Link>
        </p>
      </footer>
    </div>
  );
}
