import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BrandLogo from '../components/ui/BrandLogo';
import WebArchitectureLesson from '../components/slides/WebArchitectureLesson';

const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';

const EASE = [0.16, 1, 0.3, 1] as const;

const TOPICS = [
  { emoji: '💻', name: 'Client vs server', color: '#0071e3' },
  { emoji: '🌐', name: 'The round trip',  color: '#7c3aed' },
  { emoji: '🗄️', name: 'Databases',       color: '#0d9488' },
  { emoji: '🛡️', name: 'Data validation', color: '#e5484d' },
  { emoji: '🧪', name: 'Attack lab',       color: '#f59e0b' },
];

export default function WebArchitecturePage() {
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
          <div className="absolute left-1/2 top-[-10%] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[#0071e3]/[0.09] blur-3xl" />
          <div className="absolute bottom-[-8%] right-[5%] h-[360px] w-[360px] rounded-full bg-[#7c3aed]/[0.07] blur-3xl" />
          <div className="absolute bottom-[0%] left-[2%] h-[280px] w-[280px] rounded-full bg-[#0d9488]/[0.06] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-5 text-[13px] font-semibold uppercase tracking-[0.24em] text-[#0071e3]"
          >
            MBI802 · Database &amp; Web Systems
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.06 }}
            className="text-[40px] font-semibold leading-[1.04] tracking-[-0.03em] sm:text-[68px]"
          >
            Client, Server &amp;{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #0071e3, #7c3aed, #0d9488)' }}
            >
              Databases.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.14 }}
            className="mx-auto mt-7 max-w-xl text-[18px] leading-relaxed text-[#6e6e73] sm:text-[20px]"
          >
            How a website actually works — and why validating data is the security habit
            that matters most. A hands-on tour for absolute beginners.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.22 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {TOPICS.map(t => (
              <span
                key={t.name}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[14px] font-semibold"
                style={{ borderColor: t.color + '44', background: t.color + '10', color: t.color }}
              >
                {t.emoji} {t.name}
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
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <WebArchitectureLesson />
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-black/[0.06] px-6 py-12 text-center">
        <div className="mb-5 flex items-center justify-center">
          <BrandLogo iconSize={28} variant="on-light" />
        </div>
        <p className="mt-3">
          <Link to="/home" className="text-[13px] font-medium text-[#0071e3] hover:underline">
            ‹ Back to all lessons
          </Link>
        </p>
      </footer>
    </div>
  );
}
