import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BrandLogo from '../components/ui/BrandLogo';
import FiveStoriesLesson from '../components/slides/FiveStoriesLesson';

const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';

const EASE = [0.16, 1, 0.3, 1] as const;

const COMPANIES = [
  { emoji: '🏠', name: 'Airbnb',   color: '#FF5A5F' },
  { emoji: '🎬', name: 'Netflix',  color: '#E50914' },
  { emoji: '📊', name: 'Xero',     color: '#13B5EA' },
  { emoji: '🎨', name: 'Canva',    color: '#7D2AE8' },
  { emoji: '🌏', name: 'Alibaba',  color: '#FF6A00' },
];

export default function FiveStoriesPage() {
  return (
    <div style={{ fontFamily: APPLE_FONT }} className="min-h-screen bg-white text-[#1d1d1f]">

      {/* ── Top nav ── */}
      <nav className="sticky top-0 z-50 border-b border-black/[0.07] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link to="/home" className="no-underline">
            <BrandLogo iconSize={28} variant="on-light" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[-10%] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[#c9a84c]/[0.08] blur-3xl" />
          <div className="absolute bottom-[-8%] right-[5%] h-[360px] w-[360px] rounded-full bg-[#FF5A5F]/[0.07] blur-3xl" />
          <div className="absolute bottom-[0%] left-[2%] h-[280px] w-[280px] rounded-full bg-[#7D2AE8]/[0.06] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-5 text-[13px] font-semibold uppercase tracking-[0.24em] text-[#c9a84c]"
          >
            MBI800 · Strategic Information Systems
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.06 }}
            className="text-[42px] font-semibold leading-[1.04] tracking-[-0.03em] sm:text-[72px]"
          >
            Five Stories That{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #c9a84c, #FF5A5F, #7D2AE8, #13B5EA, #FF6A00)' }}
            >
              Changed Everything.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.14 }}
            className="mx-auto mt-7 max-w-xl text-[18px] leading-relaxed text-[#6e6e73] sm:text-[20px]"
          >
            Five companies. Five moments where someone noticed something broken and decided to fix it.
            Each one has an information system underneath it that made it work.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.22 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {COMPANIES.map(c => (
              <span
                key={c.name}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[14px] font-semibold"
                style={{ borderColor: c.color + '44', background: c.color + '10', color: c.color }}
              >
                {c.emoji} {c.name}
              </span>
            ))}
          </motion.div>

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
      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <FiveStoriesLesson />
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-black/[0.06] px-6 py-12 text-center">
        <div className="mb-5 flex items-center justify-center">
          <BrandLogo iconSize={28} variant="on-light" />
        </div>
        <p className="mt-3">
          <Link to="/home" className="text-[13px] font-medium text-[#4338CA] hover:underline">
            ‹ Back to all lessons
          </Link>
        </p>
      </footer>
    </div>
  );
}
