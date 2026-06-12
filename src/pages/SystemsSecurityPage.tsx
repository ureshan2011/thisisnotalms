import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BrandLogo from '../components/ui/BrandLogo';
import SystemsSecurityLesson from '../components/slides/SystemsSecurityLesson';

const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';

const EASE = [0.16, 1, 0.3, 1] as const;

const TOPICS = [
  { emoji: '⚖️', name: 'Risk & exposure', color: '#4f46e5' },
  { emoji: '🦠', name: 'Active threats',  color: '#e5484d' },
  { emoji: '🛡️', name: 'Layered defence', color: '#30a46c' },
  { emoji: '🗃️', name: 'Backups',         color: '#0071e3' },
  { emoji: '🔥', name: 'Disaster recovery', color: '#f59e0b' },
];

// Public, embeddable URL for this lesson (GitHub Pages + HashRouter).
const EMBED_URL = 'https://ureshan2011.github.io/thisisnotalms/#/systems-security';

function EmbedPanel() {
  const [copied, setCopied] = useState(false);
  const snippet = `<iframe
  src="${EMBED_URL}"
  width="100%"
  height="900"
  style="border:1px solid #e5e5e5;border-radius:12px;"
  loading="lazy"
  allowfullscreen
  title="Strategic Information Systems Security">
</iframe>`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the textarea below is selectable as a fallback */
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-6 pb-20">
      <div className="rounded-[24px] border border-black/[0.08] bg-[#fafafa] p-7">
        <div className="flex items-center gap-2">
          <span className="text-[20px]">🧩</span>
          <h2 className="text-[19px] font-semibold tracking-tight text-[#1d1d1f]">Embed this lesson in Blackboard</h2>
        </div>
        <p className="mt-2 text-[14px] leading-relaxed text-[#6e6e73]">
          In Blackboard, add an item and choose <b>HTML / “Insert/Edit HTML”</b> (or a Content Block), then paste
          the snippet below. Students get the full interactive lesson inside your course — no login required.
        </p>

        <pre className="mt-4 overflow-x-auto rounded-xl border border-black/[0.08] bg-white p-4 text-[12.5px] leading-relaxed text-[#1d1d1f]">
{snippet}
        </pre>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={copy}
            className="rounded-full bg-[#4f46e5] px-5 py-2 text-[14px] font-semibold text-white transition hover:bg-[#4338ca]"
          >
            {copied ? '✓ Copied' : 'Copy embed code'}
          </button>
          <a
            href={EMBED_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] font-medium text-[#4f46e5] hover:underline"
          >
            Open the standalone link ↗
          </a>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-[#aeaeb2]">
          Tip: if your Blackboard theme clips the frame, increase <code>height</code>, or link directly to the
          standalone URL above instead of embedding.
        </p>
      </div>
    </section>
  );
}

export default function SystemsSecurityPage() {
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
            className="flex items-center gap-1.5 rounded-full border border-black/[0.10] px-4 py-1.5 text-[13px] font-medium text-[#6e6e73] transition hover:border-[#4f46e5]/40 hover:text-[#4f46e5]"
          >
            <span className="text-[15px]">‹</span>
            All lessons
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[-10%] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[#4f46e5]/[0.09] blur-3xl" />
          <div className="absolute bottom-[-8%] right-[5%] h-[360px] w-[360px] rounded-full bg-[#e5484d]/[0.07] blur-3xl" />
          <div className="absolute bottom-[0%] left-[2%] h-[280px] w-[280px] rounded-full bg-[#30a46c]/[0.06] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-5 text-[13px] font-semibold uppercase tracking-[0.24em] text-[#4f46e5]"
          >
            MBI800 · Strategic Information Systems
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.06 }}
            className="text-[40px] font-semibold leading-[1.04] tracking-[-0.03em] sm:text-[68px]"
          >
            Systems{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #4f46e5, #0071e3, #30a46c)' }}
            >
              Security.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.14 }}
            className="mx-auto mt-7 max-w-xl text-[18px] leading-relaxed text-[#6e6e73] sm:text-[20px]"
          >
            What can go wrong, how much it would cost, and how to defend and recover.
            A hands-on tour of protecting the information systems a business runs on.
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
        <SystemsSecurityLesson />
      </section>

      {/* ── Blackboard embed ── */}
      <EmbedPanel />

      {/* ── Footer ── */}
      <footer className="border-t border-black/[0.06] px-6 py-12 text-center">
        <div className="mb-5 flex items-center justify-center">
          <BrandLogo iconSize={28} variant="on-light" />
        </div>
        <p className="mt-3">
          <Link to="/home" className="text-[13px] font-medium text-[#4f46e5] hover:underline">
            ‹ Back to all lessons
          </Link>
        </p>
      </footer>
    </div>
  );
}
