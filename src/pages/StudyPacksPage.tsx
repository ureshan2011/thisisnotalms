// StudyPacksPage.tsx
// Public /study-packs page — the complete course study packs, presented as a
// gift from the lecturer. Warm paper-and-ink aesthetic echoing the PDFs'
// classical typesetting; passwords shown openly (they gate note-sharing
// sites, not the students the packs were made for).

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BrandLogo from '../components/ui/BrandLogo';

const BASE = import.meta.env.BASE_URL;

const SERIF =
  '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif';
const SANS =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';

const EASE = [0.16, 1, 0.3, 1] as const;

// ── The two packs ───────────────────────────────────────────────────────────

interface Pack {
  code: string;
  title: string;
  titleLines: [string, string?];
  password: string;
  file: string;
  ribbon: string;      // ribbon / accent colour
  ribbonDeep: string;  // darker ink version for text on cream
  chapters: number;
  pages: number;
  extras: string;
  toc: string[];
}

const PACKS: Pack[] = [
  {
    code: 'MBI800',
    title: 'Strategic Information Systems Planning',
    titleLines: ['Strategic Information', 'Systems Planning'],
    password: 'strategy2026',
    file: 'MBI800-Master-Study-Pack-AY2026.pdf',
    ribbon: '#d97706',
    ribbonDeep: '#92610a',
    chapters: 11,
    pages: 61,
    extras: 'consolidated answer key',
    toc: [
      'Systems Thinking & the Iceberg Model',
      'SISP Foundations & the Six Process Dimensions',
      'Strategic IT Planning, Business Case & the SDLC',
      'Business Model & Idea Canvases',
      'Risk Management Standards',
      'Global SISP Case Studies',
      'Five Stories That Changed Everything',
      'Immersive Realities — AR/VR',
      'Systems Security · Platform Strategy',
    ],
  },
  {
    code: 'MBI802',
    title: 'Database Management Systems',
    titleLines: ['Database Management', 'Systems'],
    password: 'database2026',
    file: 'MBI802-Master-Study-Pack-AY2026.pdf',
    ribbon: '#7c3aed',
    ribbonDeep: '#5b21b6',
    chapters: 8,
    pages: 56,
    extras: 'glossary + consolidated answer key',
    toc: [
      'Introduction to DBMS',
      'SQL Programming Fundamentals',
      'Advanced SQL Queries',
      'ER Diagrams — Foundations & Advanced',
      'ER → Relational Mapping',
      'Database Normalization',
      'Consolidation & Exam Preparation',
      'Glossary of Key Terms',
    ],
  },
];

// ── Small pieces ────────────────────────────────────────────────────────────

/** The open-book seal from the PDF covers, in miniature. */
function BookSeal({ size = 34, ink = '#1b1b1b' }: { size?: number; ink?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={ink} aria-hidden>
      <circle cx="24" cy="24" r="22.6" strokeWidth="1.4" />
      <circle cx="24" cy="24" r="20.2" strokeWidth="0.5" />
      <path
        d="M24 17.8 C20.4 15.6 15.6 15.6 12.4 17.4 V31.6 C15.6 29.8 20.4 29.8 24 32 C27.6 29.8 32.4 29.8 35.6 31.6 V17.4 C32.4 15.6 27.6 15.6 24 17.8 Z"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M24 17.8 V32" strokeWidth="1.2" />
    </svg>
  );
}

/** Faithful miniature of the actual PDF title page, wrapped in a ribbon. */
function MiniCover({ pack }: { pack: Pack }) {
  return (
    <div
      className="relative mx-auto overflow-hidden"
      style={{
        width: 210,
        height: 292,
        background: '#fffdf8',
        border: '1px solid rgba(27,27,27,0.16)',
        boxShadow: '0 22px 44px -18px rgba(27,27,27,0.35), 0 2px 6px rgba(27,27,27,0.08)',
        fontFamily: SERIF,
        color: '#1b1b1b',
      }}
    >
      {/* cover contents */}
      <div className="flex h-full flex-col items-center justify-between py-5 text-center">
        <div className="flex flex-col items-center gap-1.5">
          <BookSeal size={30} />
          <div style={{ fontSize: 6.5, letterSpacing: '0.22em', fontWeight: 600, color: '#454545' }}>
            ADDITIONAL LEARNING MATERIALS
          </div>
        </div>

        {/* Oxford-rule title block */}
        <div className="w-full px-4">
          <div style={{ borderTop: '2px solid #1b1b1b', marginBottom: 1.5 }} />
          <div style={{ borderTop: '0.5px solid #1b1b1b', padding: '14px 4px' }}>
            <div style={{ fontSize: 7, letterSpacing: '0.2em', color: '#6a6a66', fontWeight: 600 }}>
              {pack.code} · ACADEMIC YEAR 2026
            </div>
            <div style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.22, marginTop: 7 }}>
              {pack.titleLines[0]}
              {pack.titleLines[1] && <br />}
              {pack.titleLines[1]}
            </div>
            <div style={{ fontSize: 10, fontStyle: 'italic', color: '#454545', marginTop: 6 }}>
              Master Study Pack
            </div>
          </div>
          <div style={{ borderBottom: '0.5px solid #1b1b1b', marginBottom: 1.5 }} />
          <div style={{ borderBottom: '2px solid #1b1b1b' }} />
        </div>

        <div>
          <div style={{ fontSize: 8.5, fontWeight: 700 }}>Dr. Yasas Sri Wickramasinghe</div>
          <div style={{ fontSize: 6, color: '#8f8f8a', marginTop: 3 }}>
            Student Edition · For enrolled students only
          </div>
        </div>
      </div>

      {/* ribbon — unties by itself as the card scrolls into view
          (variants propagate from the whileInView wrapper in PackCard) */}
      <motion.div
        variants={{ rest: { x: 0, opacity: 0.92 }, unwrapped: { x: 60, opacity: 0 } }}
        transition={{ duration: 0.7, ease: EASE, delay: 1.05 }}
        className="pointer-events-none absolute inset-y-0"
        style={{ left: '68%', width: 26, background: pack.ribbon }}
        aria-hidden
      >
        <div
          className="absolute inset-y-0 left-1/2 -translate-x-1/2"
          style={{ width: 2, background: 'rgba(255,255,255,0.35)' }}
        />
      </motion.div>
      <motion.div
        variants={{ rest: { y: 0, rotate: 0, opacity: 1 }, unwrapped: { y: -46, rotate: 24, opacity: 0 } }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.9 }}
        className="pointer-events-none absolute text-2xl"
        style={{ left: 'calc(68% + 13px)', top: 26, transform: 'translateX(-50%)' }}
        aria-hidden
      >
        🎀
      </motion.div>
    </div>
  );
}

/** Swing-tag showing the password, with a copy button. */
function PasswordTag({ pack }: { pack: Pack }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pack.password);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = pack.password;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div
      initial={{ rotate: -1.5 }}
      animate={{ rotate: [-1.5, 1.2, -1.5] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="relative inline-flex items-center gap-3 rounded-lg px-4 py-3"
      style={{
        background: '#fffdf8',
        border: `1.5px dashed ${pack.ribbonDeep}55`,
        boxShadow: '0 6px 18px -8px rgba(27,27,27,0.25)',
        transformOrigin: 'top left',
      }}
    >
      {/* tag hole + string */}
      <span
        className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full"
        style={{ background: '#fffdf8', border: '1.5px solid rgba(27,27,27,0.3)' }}
        aria-hidden
      />
      <div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.16em',
            color: pack.ribbonDeep,
          }}
        >
          PDF PASSWORD
        </div>
        <div
          style={{
            fontFamily: '"SF Mono", ui-monospace, "Courier New", monospace',
            fontSize: 20,
            fontWeight: 700,
            color: '#1b1b1b',
            letterSpacing: '0.04em',
          }}
        >
          {pack.password}
        </div>
      </div>
      <button
        onClick={copy}
        className="rounded-md px-3 py-2 text-xs font-bold transition-transform active:scale-95"
        style={{
          fontFamily: SANS,
          background: copied ? '#3e5c46' : pack.ribbonDeep,
          color: '#fffdf8',
          border: 'none',
          cursor: 'pointer',
        }}
        aria-label={`Copy the ${pack.code} password`}
      >
        {copied ? 'Copied ✓' : 'Copy'}
      </button>
    </motion.div>
  );
}

/** Download button with a small sparkle burst on click. */
function DownloadButton({ pack }: { pack: Pack }) {
  const [bursts, setBursts] = useState<number[]>([]);

  return (
    <div className="relative inline-block">
      <motion.a
        href={`${BASE}study-packs/${pack.file}`}
        download
        onClick={() => setBursts((b) => [...b, Date.now()])}
        whileHover={{ y: -2, boxShadow: '0 14px 30px -10px rgba(27,27,27,0.45)' }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 no-underline"
        style={{
          fontFamily: SANS,
          fontSize: 15,
          fontWeight: 700,
          background: '#1b1b1b',
          color: '#fffdf8',
          boxShadow: '0 10px 24px -12px rgba(27,27,27,0.5)',
        }}
      >
        <span aria-hidden>⤓</span> Download the {pack.code} pack
        <span style={{ fontWeight: 400, opacity: 0.6, fontSize: 13 }}>· PDF</span>
      </motion.a>

      {bursts.map((id) => (
        <span key={id} className="pointer-events-none absolute inset-0" aria-hidden>
          {['✦', '✧', '✦', '✧', '✦'].map((s, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
              animate={{
                opacity: 0,
                x: (i - 2) * 34,
                y: -38 - (i % 3) * 16,
                scale: 1.15,
                rotate: (i - 2) * 40,
              }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              onAnimationComplete={() => setBursts((b) => b.filter((x) => x !== id))}
              className="absolute left-1/2 top-1/2 text-lg"
              style={{ color: pack.ribbon }}
            >
              {s}
            </motion.span>
          ))}
        </span>
      ))}
    </div>
  );
}

function PackCard({ pack, index }: { pack: Pack; index: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: EASE, delay: index * 0.08 }}
      className="grid items-center gap-10 rounded-3xl p-8 md:grid-cols-[auto_1fr] md:p-12"
      style={{
        background: '#f7f3ea',
        border: '1px solid rgba(27,27,27,0.09)',
        boxShadow: '0 30px 60px -40px rgba(27,27,27,0.3)',
      }}
      aria-label={`${pack.code} study pack`}
    >
      <motion.div
        initial="rest"
        whileInView="unwrapped"
        viewport={{ once: true, margin: '-140px' }}
      >
        <MiniCover pack={pack} />
      </motion.div>

      <div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.2em',
            color: pack.ribbonDeep,
          }}
        >
          {pack.code} · ACADEMIC YEAR 2026
        </div>
        <h2
          className="mt-2 mb-3"
          style={{ fontFamily: SERIF, fontSize: 'clamp(24px, 3.4vw, 34px)', fontWeight: 700, color: '#1b1b1b', lineHeight: 1.15 }}
        >
          {pack.title}
        </h2>
        <p style={{ fontFamily: SANS, fontSize: 14.5, lineHeight: 1.65, color: '#454545', maxWidth: 560 }}>
          {pack.chapters} chapters · {pack.pages} pages · {pack.extras}. Typeset like a real
          book — worked examples, practice questions, key-concept tables and a linked table
          of contents. Works offline, prints beautifully on A4, and screen readers are fully
          supported.
        </p>

        <ul
          className="mt-4 mb-6 grid list-none gap-x-6 gap-y-1.5 p-0 sm:grid-cols-2"
          style={{ fontFamily: SERIF, fontSize: 13.5, color: '#333' }}
        >
          {pack.toc.map((t) => (
            <li key={t} className="flex gap-2">
              <span style={{ color: pack.ribbon }} aria-hidden>❧</span> {t}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
          <DownloadButton pack={pack} />
          <PasswordTag pack={pack} />
        </div>
      </div>
    </motion.section>
  );
}

// ── The page ────────────────────────────────────────────────────────────────

export default function StudyPacksPage() {
  return (
    <div style={{ background: '#faf6ee', color: '#1b1b1b', minHeight: '100vh' }}>
      {/* paper grain */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(27,27,27,0.045) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
        aria-hidden
      />

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-black/[0.07] bg-[#faf6ee]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link to="/home" className="no-underline">
            <BrandLogo iconSize={28} variant="on-light" />
          </Link>
          <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 13, color: '#6a6a66' }}>
            for enrolled students, with care
          </span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="relative mx-auto max-w-4xl px-6 pb-14 pt-20 text-center">
        {[
          { s: '✦', l: '8%', t: '18%', d: 0 },
          { s: '❧', l: '88%', t: '26%', d: 1.2 },
          { s: '✧', l: '14%', t: '72%', d: 0.6 },
          { s: '✦', l: '82%', t: '78%', d: 1.8 },
        ].map((f, i) => (
          <motion.span
            key={i}
            animate={{ y: [-6, 6, -6], rotate: [-4, 5, -4] }}
            transition={{ duration: 7 + i, repeat: Infinity, ease: 'easeInOut', delay: f.d }}
            className="pointer-events-none absolute select-none text-xl"
            style={{ left: f.l, top: f.t, color: '#c9a84c', opacity: 0.55 }}
            aria-hidden
          >
            {f.s}
          </motion.span>
        ))}

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, letterSpacing: '0.24em', color: '#92610a' }}
        >
          🎁 A GIFT FROM YOUR LECTURER
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
          className="mx-auto mt-5 max-w-3xl"
          style={{ fontFamily: SERIF, fontSize: 'clamp(34px, 6vw, 58px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.01em' }}
        >
          Your study packs are ready.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.18 }}
          className="mx-auto mt-5 max-w-xl"
          style={{ fontFamily: SANS, fontSize: 16.5, lineHeight: 1.65, color: '#454545' }}
        >
          Every lesson from this semester, rewritten as a properly typeset book you can keep —
          revise on the bus, print for the exam desk, or read years from now. The password for
          each pack is printed right below its cover, because it was made for <em>you</em>.
        </motion.p>
      </header>

      {/* ── Personal note ── */}
      <motion.figure
        initial={{ opacity: 0, y: 24, rotate: -1.2 }}
        whileInView={{ opacity: 1, y: 0, rotate: -0.8 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative mx-auto mb-16 max-w-lg rounded-lg px-8 py-7"
        style={{
          background: '#fffdf8',
          border: '1px solid rgba(27,27,27,0.1)',
          boxShadow: '0 20px 40px -24px rgba(27,27,27,0.35)',
        }}
      >
        {/* tape corners */}
        <span className="absolute -top-2.5 left-8 h-5 w-16 -rotate-6 rounded-sm" style={{ background: 'rgba(201,168,76,0.3)' }} aria-hidden />
        <span className="absolute -top-2.5 right-8 h-5 w-16 rotate-6 rounded-sm" style={{ background: 'rgba(201,168,76,0.3)' }} aria-hidden />
        <blockquote className="m-0" style={{ fontFamily: SERIF, fontSize: 16.5, lineHeight: 1.7, fontStyle: 'italic', color: '#333' }}>
          “Slides disappear when the projector turns off. I wanted you to have something that
          lasts — the whole course, in a book you can hold. Study well, ask questions, and keep
          these long after the exam.”
        </blockquote>
        <figcaption className="mt-4 text-right" style={{ fontFamily: SERIF, fontSize: 15 }}>
          — <strong>Dr. Yasas Sri Wickramasinghe</strong>
        </figcaption>
      </motion.figure>

      {/* ── Packs ── */}
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 pb-8">
        {PACKS.map((p, i) => (
          <PackCard key={p.code} pack={p} index={i} />
        ))}
      </main>

      {/* ── Three steps ── */}
      <section className="mx-auto max-w-4xl px-6 py-14" aria-label="How to open your pack">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { n: '1', t: 'Download', b: 'Tap the button — the PDF is yours to keep, on any device.' },
            { n: '2', t: 'Open it', b: 'Any PDF reader works: phone, tablet, laptop, or the library computers.' },
            { n: '3', t: 'Type the password', b: 'It’s printed on the tag above — once entered, most readers remember it.' },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
              className="rounded-2xl px-6 py-6 text-center"
              style={{ background: '#f7f3ea', border: '1px solid rgba(27,27,27,0.08)' }}
            >
              <div
                className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full"
                style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, background: '#1b1b1b', color: '#fffdf8' }}
              >
                {s.n}
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700 }}>{s.t}</div>
              <p className="mt-1.5" style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.6, color: '#555' }}>
                {s.b}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Small print + footer ── */}
      <footer className="mx-auto max-w-3xl px-6 pb-16 text-center">
        <div className="mx-auto mb-6 h-px w-24" style={{ background: 'rgba(27,27,27,0.25)' }} />
        <p style={{ fontFamily: SANS, fontSize: 12.5, lineHeight: 1.7, color: '#6a6a66' }}>
          These packs are for enrolled students only — please don't upload them to note-sharing
          sites; they carry a watermark and copyright. Copying and editing are locked, but
          printing and screen-reader access are fully enabled, on purpose.
          <br />© 2026 Dr. Yasas Sri Wickramasinghe · MBI800 · MBI802 · AY 2026
        </p>
        <Link
          to="/home"
          className="mt-6 inline-block no-underline"
          style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 14, color: '#92610a' }}
        >
          ← back to the launchpad
        </Link>
      </footer>
    </div>
  );
}
