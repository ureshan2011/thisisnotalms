import { useState, useRef, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import BrandMark from '../components/ui/BrandMark';
import { useFeatureTracking } from '../lib/useFeatureTracking';

const InstagramReel = lazy(() => import('../components/sql/InstagramReel'));

// ─── SQL lesson: UPDATE & DELETE (Not a LMS) ────────────────────────────────
// A single-page, Apple-styled lesson that teaches the two most dangerous SQL
// statements — UPDATE and DELETE — through funny Instagram reels and two things
// students can try right here: a live WHERE-clause simulator and a "Safe or
// Sus?" quiz. Same look, feel and branding as the XR Explorer lesson.

const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';

const EASE = [0.16, 1, 0.3, 1] as const;

// Generic scroll-reveal wrapper
function Reveal({
  children,
  delay = 0,
  y = 48,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// ─── Section: eyebrow + title + subtitle ────────────────────────────────────
function SectionHead({
  eyebrow,
  title,
  sub,
  dark = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      {eyebrow && (
        <p className="mb-3 text-[15px] font-semibold tracking-tight text-[#0071e3]">{eyebrow}</p>
      )}
      <h2
        className={`text-[32px] font-semibold leading-[1.08] tracking-tight sm:text-[44px] ${
          dark ? 'text-white' : 'text-[#1d1d1f]'
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p className={`mx-auto mt-4 max-w-2xl text-[19px] leading-relaxed ${dark ? 'text-white/70' : 'text-[#6e6e73]'}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

const DemoFallback = ({ label }: { label: string }) => (
  <div className="mx-auto flex aspect-[9/16] w-full max-w-[360px] items-center justify-center rounded-[1.75rem] bg-[#f5f5f7] text-[15px] text-[#86868b]">
    Loading {label}…
  </div>
);

// Smooth-scroll to a section by id WITHOUT touching the URL hash. The app runs
// under a HashRouter, so plain `href="#..."` anchors would hijack the router.
function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------------------------------------------------------------- *
 * Data
 * ---------------------------------------------------------------- */

const REELS = [
  { shortcode: 'DUbBkrHD8Dy', title: 'When you forget the WHERE clause 💀', caption: 'UPDATE gone wild.' },
  { shortcode: 'DU3XLpljxxz', title: 'DELETE without WHERE be like…', caption: 'The whole table is gone.' },
  { shortcode: 'DY2jWvqv5FU', title: 'Running it straight in production', caption: 'No backup, no problem? 😬' },
  { shortcode: 'DYkPRjsPSIc', title: 'WHERE clause = your best friend', caption: 'Always target your rows.' },
];

interface Row {
  id: number;
  name: string;
  status: string;
  deleted?: boolean;
  changed?: boolean;
}

const INITIAL_ROWS: Row[] = [
  { id: 1, name: 'Aisha', status: 'active' },
  { id: 2, name: 'Ben', status: 'active' },
  { id: 3, name: 'Chen', status: 'active' },
  { id: 4, name: 'Diego', status: 'active' },
  { id: 5, name: 'Esha', status: 'active' },
];

interface QuizCard {
  query: string;
  dangerous: boolean;
  explanation: string;
}

const QUIZ_CARDS: QuizCard[] = [
  { query: 'DELETE FROM students;', dangerous: true, explanation: 'No WHERE clause — this wipes every student from the table. 🪦' },
  { query: 'UPDATE accounts SET balance = 0 WHERE id = 42;', dangerous: false, explanation: 'Targets exactly one row with a WHERE clause. Precise and safe.' },
  { query: 'UPDATE products SET price = 9.99;', dangerous: true, explanation: 'Every single product is now $9.99 — the WHERE clause is missing!' },
  { query: "DELETE FROM orders WHERE status = 'cancelled';", dangerous: false, explanation: 'Only cancelled orders are removed. The WHERE clause keeps it scoped.' },
  { query: "UPDATE users SET role = 'admin' WHERE 1 = 1;", dangerous: true, explanation: 'WHERE 1=1 is always true — so every user just became an admin. 😱' },
];

/* ---------------------------------------------------------------- *
 * Comparison table (UPDATE vs DELETE) — Apple style
 * ---------------------------------------------------------------- */

function ComparisonTable() {
  const rows = [
    { aspect: 'What it does', upd: 'Changes values in rows', del: 'Removes rows entirely' },
    { aspect: 'Needs WHERE?', upd: 'Yes — or every row changes', del: 'Yes — or every row is deleted' },
    { aspect: 'Keyword to set values', upd: 'SET column = value', del: '— (no SET)' },
    { aspect: 'Worst-case mistake', upd: 'All rows overwritten', del: 'Whole table emptied' },
    { aspect: 'Safety habit', upd: 'SELECT first, then UPDATE', del: 'SELECT first, then DELETE' },
  ];
  const head = [
    { k: 'upd', label: 'UPDATE', color: '#0071e3' },
    { k: 'del', label: 'DELETE', color: '#ff375f' },
  ] as const;
  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-black/[0.08] bg-white">
      <table className="w-full text-[15px]">
        <thead>
          <tr className="border-b border-black/[0.06]">
            <th className="w-48 px-5 py-4 text-left font-medium text-[#86868b]">Aspect</th>
            {head.map((h) => (
              <th key={h.k} className="px-5 py-4 text-center font-semibold" style={{ color: h.color }}>
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.aspect} className={i % 2 ? 'bg-[#fafafa]' : ''}>
              <td className="px-5 py-4 font-medium text-[#6e6e73]">{r.aspect}</td>
              <td className="px-5 py-4 text-center text-[#1d1d1f]">{r.upd}</td>
              <td className="px-5 py-4 text-center text-[#1d1d1f]">{r.del}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Live WHERE-clause simulator — Apple style
 * ---------------------------------------------------------------- */

function Simulator() {
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);
  const [op, setOp] = useState<'UPDATE' | 'DELETE'>('UPDATE');
  const [useWhere, setUseWhere] = useState(true);
  const [targetId, setTargetId] = useState(3);
  const [result, setResult] = useState<{ msg: string; danger: boolean } | null>(null);

  const newValue = 'banned';
  const query =
    op === 'UPDATE'
      ? `UPDATE users\n   SET status = '${newValue}'${useWhere ? `\n WHERE id = ${targetId}` : ''};`
      : `DELETE FROM users${useWhere ? `\n WHERE id = ${targetId}` : ''};`;

  function run() {
    const live = rows.filter((r) => !r.deleted);
    if (op === 'DELETE') {
      if (useWhere) {
        setRows((rs) => rs.map((r) => (r.id === targetId ? { ...r, deleted: true, changed: false } : { ...r, changed: false })));
        setResult({ msg: `1 row deleted (id = ${targetId}).`, danger: false });
      } else {
        setRows((rs) => rs.map((r) => ({ ...r, deleted: true })));
        setResult({ msg: `💥 ${live.length} rows deleted. The whole table is empty!`, danger: true });
      }
    } else {
      if (useWhere) {
        setRows((rs) => rs.map((r) => (r.id === targetId && !r.deleted ? { ...r, status: newValue, changed: true } : { ...r, changed: false })));
        setResult({ msg: `1 row updated (id = ${targetId}).`, danger: false });
      } else {
        setRows((rs) => rs.map((r) => (r.deleted ? r : { ...r, status: newValue, changed: true })));
        setResult({ msg: `💥 ${live.length} rows updated. Everyone is now '${newValue}'!`, danger: true });
      }
    }
  }

  function reset() {
    setRows(INITIAL_ROWS);
    setResult(null);
  }

  const liveRows = rows.filter((r) => !r.deleted);

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
      {/* Controls + query */}
      <div className="rounded-[28px] border border-black/[0.08] bg-white p-7 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.10)]">
        {/* operation */}
        <p className="mb-2 text-[13px] font-medium text-[#86868b]">Operation</p>
        <div className="mb-6 grid grid-cols-2 gap-2">
          {(['UPDATE', 'DELETE'] as const).map((o) => (
            <button
              key={o}
              onClick={() => setOp(o)}
              className={`rounded-2xl py-3 text-[15px] font-semibold transition ${
                op === o
                  ? o === 'DELETE'
                    ? 'bg-[#ff375f]/12 text-[#d70015] ring-1 ring-[#ff375f]/40'
                    : 'bg-[#0071e3]/10 text-[#0071e3] ring-1 ring-[#0071e3]/30'
                  : 'bg-[#f5f5f7] text-[#6e6e73] hover:bg-[#ececee]'
              }`}
            >
              {o}
            </button>
          ))}
        </div>

        {/* WHERE toggle */}
        <p className="mb-2 text-[13px] font-medium text-[#86868b]">WHERE clause</p>
        <button
          onClick={() => setUseWhere((v) => !v)}
          className={`mb-6 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-semibold transition ${
            useWhere ? 'bg-[#30d158]/12 text-[#248a3d] ring-1 ring-[#30d158]/40' : 'bg-[#ff375f]/12 text-[#d70015] ring-1 ring-[#ff375f]/40'
          }`}
        >
          <span>{useWhere ? 'WHERE clause ON · safe' : 'WHERE clause OFF · danger!'}</span>
          <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${useWhere ? 'bg-[#30d158]' : 'bg-[#ff375f]'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useWhere ? 'translate-x-6' : 'translate-x-1'}`} />
          </span>
        </button>

        {/* target row */}
        <div className={`mb-6 transition-opacity ${useWhere ? 'opacity-100' : 'pointer-events-none opacity-40'}`}>
          <p className="mb-2 text-[13px] font-medium text-[#86868b]">Target row (id)</p>
          <div className="flex flex-wrap gap-2">
            {INITIAL_ROWS.map((r) => (
              <button
                key={r.id}
                onClick={() => setTargetId(r.id)}
                className={`h-10 w-10 rounded-xl text-[15px] font-semibold transition ${
                  targetId === r.id ? 'bg-[#0071e3] text-white' : 'bg-[#f5f5f7] text-[#6e6e73] hover:bg-[#ececee]'
                }`}
              >
                {r.id}
              </button>
            ))}
          </div>
        </div>

        {/* generated query */}
        <p className="mb-2 text-[13px] font-medium text-[#86868b]">Your query</p>
        <pre className="overflow-x-auto rounded-2xl bg-[#1d1d1f] p-4 font-mono text-[14px] leading-relaxed text-[#f5f5f7]">
{query}
        </pre>

        <div className="mt-5 flex gap-3">
          <button
            onClick={run}
            className="flex-1 rounded-full bg-[#0071e3] px-5 py-3 text-[15px] font-medium text-white transition hover:bg-[#0077ed]"
          >
            Run query
          </button>
          <button
            onClick={reset}
            className="rounded-full bg-[#f5f5f7] px-5 py-3 text-[15px] font-medium text-[#1d1d1f] transition hover:bg-[#ececee]"
          >
            Reset
          </button>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 rounded-2xl px-4 py-3 text-[14px] font-medium ${
              result.danger ? 'bg-[#ff375f]/12 text-[#d70015]' : 'bg-[#30d158]/12 text-[#248a3d]'
            }`}
          >
            {result.msg}
          </motion.div>
        )}
      </div>

      {/* The table */}
      <div className="rounded-[28px] border border-black/[0.08] bg-white p-7 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.10)]">
        <div className="mb-4 flex items-center gap-2 text-[15px] font-semibold text-[#1d1d1f]">
          users
          <span className="text-[13px] font-normal text-[#aeaeb2]">({liveRows.length} {liveRows.length === 1 ? 'row' : 'rows'})</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-black/[0.06]">
          <table className="w-full text-left text-[15px]">
            <thead className="bg-[#fafafa] text-[#86868b]">
              <tr>
                <th className="px-4 py-3 font-medium">id</th>
                <th className="px-4 py-3 font-medium">name</th>
                <th className="px-4 py-3 font-medium">status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className={`border-t border-black/[0.05] transition-all duration-300 ${
                    r.deleted ? 'text-[#ff375f] line-through opacity-40' : r.changed ? 'bg-[#0071e3]/[0.06] text-[#0071e3]' : 'text-[#1d1d1f]'
                  }`}
                >
                  <td className="px-4 py-3 font-mono">{r.id}</td>
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3 font-mono">{r.deleted ? '— deleted —' : r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {liveRows.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-[#ff375f]/40 bg-[#ff375f]/[0.05] py-8 text-center">
            <p className="text-[28px]">🪦</p>
            <p className="mt-1 font-semibold text-[#d70015]">Table is empty.</p>
            <p className="mt-1 text-[14px] text-[#d70015]/70">This is why you never forget the WHERE clause. Hit Reset to try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Quiz: Safe or Sus? — Apple style (mirrors XR quiz)
 * ---------------------------------------------------------------- */

function Quiz() {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const card = QUIZ_CARDS[idx];

  const choose = (guessDangerous: boolean) => {
    if (answer !== null) return;
    setAnswer(guessDangerous);
    if (guessDangerous === card.dangerous) setScore((s) => s + 1);
  };
  const next = () => {
    if (idx + 1 >= QUIZ_CARDS.length) return setDone(true);
    setIdx((i) => i + 1);
    setAnswer(null);
  };
  const reset = () => {
    setIdx(0);
    setAnswer(null);
    setScore(0);
    setDone(false);
  };

  return (
    <div className="mx-auto max-w-2xl rounded-[28px] border border-black/[0.08] bg-white p-8 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.12)] sm:p-10">
      {!done ? (
        <>
          <div className="mb-2 flex justify-between text-[14px] font-medium text-[#86868b]">
            <span>Question {idx + 1} of {QUIZ_CARDS.length}</span>
            <span>Score {score}</span>
          </div>
          <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
            <motion.div
              className="h-full rounded-full bg-[#0071e3]"
              animate={{ width: `${(idx / QUIZ_CARDS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>

          <p className="mb-3 text-[13px] font-medium text-[#86868b]">Would you run this in production?</p>
          <pre className="mb-8 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl bg-[#1d1d1f] p-5 font-mono text-[16px] leading-relaxed text-[#f5f5f7]">
{card.query}
          </pre>

          <div className="flex gap-4">
            {[false, true].map((opt) => {
              const answered = answer !== null;
              const correct = opt === card.dangerous;
              const chosen = opt === answer;
              let cls = 'flex-1 rounded-2xl py-4 text-[17px] font-medium transition ';
              if (!answered) cls += 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#ececee]';
              else if (correct) cls += 'bg-[#30d158]/15 text-[#248a3d] ring-1 ring-[#30d158]/40';
              else if (chosen) cls += 'bg-[#ff375f]/12 text-[#d70015] ring-1 ring-[#ff375f]/40';
              else cls += 'bg-[#f5f5f7] text-[#aeaeb2]';
              return (
                <button key={String(opt)} onClick={() => choose(opt)} className={cls}>
                  {opt ? 'Dangerous 💀' : 'Safe ✅'}
                </button>
              );
            })}
          </div>

          {answer !== null && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl bg-[#f5f5f7] p-5">
              <p className={`font-semibold ${answer === card.dangerous ? 'text-[#248a3d]' : 'text-[#d70015]'}`}>
                {answer === card.dangerous ? 'Correct' : 'Not quite'} — this query is {card.dangerous ? 'dangerous.' : 'safe.'}
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-[#424245]">{card.explanation}</p>
              <button
                onClick={next}
                className="mt-4 rounded-full bg-[#0071e3] px-5 py-2 text-[15px] font-medium text-white transition hover:bg-[#0077ed]"
              >
                {idx + 1 < QUIZ_CARDS.length ? 'Next question' : 'See results'}
              </button>
            </motion.div>
          )}
        </>
      ) : (
        <div className="py-6 text-center">
          <div className="text-6xl">{score === QUIZ_CARDS.length ? '🏆' : score >= QUIZ_CARDS.length - 1 ? '🎯' : '📚'}</div>
          <p className="mt-4 text-[44px] font-semibold tracking-tight text-[#1d1d1f]">
            {score} / {QUIZ_CARDS.length}
          </p>
          <p className="mx-auto mt-2 max-w-md text-[17px] text-[#6e6e73]">
            {score === QUIZ_CARDS.length
              ? 'Flawless — your tables are safe in your hands. 🛡️'
              : score >= QUIZ_CARDS.length - 1
              ? 'So close to perfect. One more pass and you’ve got it.'
              : 'Good start. Re-watch the reels and play with the simulator, then try again.'}
          </p>
          <button
            onClick={reset}
            className="mt-6 rounded-full bg-[#0071e3] px-6 py-2.5 text-[15px] font-medium text-white transition hover:bg-[#0077ed]"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Page
 * ---------------------------------------------------------------- */

export default function SQLReelsPage() {
  useFeatureTracking('sql_reels_view');

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <div className="bg-white text-[#1d1d1f]" style={{ fontFamily: APPLE_FONT }}>
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        {/* brand lockup */}
        <div className="absolute left-6 top-6 z-20 flex items-center gap-2.5 sm:left-10 sm:top-8">
          <BrandMark className="h-8 w-8 rounded-[9px]" />
          <span className="text-[17px] font-semibold tracking-tight text-[#1d1d1f]">
            Not a <span className="text-[#0071e3]">LMS</span>
          </span>
        </div>

        {/* soft ambient wash */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#0071e3]/[0.07] blur-3xl" />
          <div className="absolute bottom-[-10%] right-[12%] h-[420px] w-[420px] rounded-full bg-[#ff375f]/[0.06] blur-3xl" />
        </div>

        <motion.div style={{ scale: heroScale, opacity: heroOpacity, y: heroY }} className="relative z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-5 text-[17px] font-medium text-[#6e6e73]"
          >
            An interactive lesson · Dr. Yasas Sri Wickramasinghe
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
            className="text-[44px] font-semibold leading-[1.04] tracking-[-0.02em] sm:text-[72px] lg:text-[88px]"
          >
            UPDATE &amp; DELETE,
            <br />
            <span className="bg-gradient-to-r from-[#0071e3] via-[#962fbf] to-[#ff375f] bg-clip-text text-transparent">
              without the tears.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-[19px] leading-relaxed text-[#6e6e73] sm:text-[22px]"
          >
            One missing WHERE clause and your whole table is gone. In this lesson you’ll watch the funny
            reels, run a live query simulator, and play “Safe or Sus?” so you never make that mistake.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
          >
            <button
              onClick={() => scrollToSection('simulator')}
              className="rounded-full bg-[#0071e3] px-7 py-3 text-[17px] font-medium text-white transition hover:bg-[#0077ed]"
            >
              Try the simulator
            </button>
            <button onClick={() => scrollToSection('reels')} className="text-[17px] font-medium text-[#0071e3] hover:underline">
              Watch the reels ›
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-9 left-1/2 -translate-x-1/2 text-[13px] font-medium text-[#aeaeb2]"
        >
          Scroll to explore
        </motion.div>
      </section>

      {/* ── WHY IT MATTERS / COMPARISON ────────────────────────────────────── */}
      <section className="px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="Start here"
            title="Two statements, one little safety net"
            sub="UPDATE changes rows; DELETE removes them. Both quietly hit every row in the table unless you add a WHERE clause to say which rows you mean. Here’s the difference at a glance."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <ComparisonTable />
        </Reveal>

        {/* danger vs safe */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2"
        >
          <motion.div variants={item} className="rounded-[28px] border border-[#ff375f]/20 bg-[#ff375f]/[0.04] p-8">
            <div className="mb-4 text-3xl">💀</div>
            <h3 className="text-[20px] font-semibold tracking-tight text-[#d70015]">Without WHERE</h3>
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-[#1d1d1f] p-4 font-mono text-[14px] leading-relaxed text-[#ff8a9b]">
{`DELETE FROM students;
UPDATE students SET grade = 'F';`}
            </pre>
            <p className="mt-4 text-[16px] leading-relaxed text-[#6e6e73]">
              Hits <strong>every single row</strong>. Everyone fails. Everyone is deleted.
            </p>
          </motion.div>

          <motion.div variants={item} className="rounded-[28px] border border-[#30d158]/25 bg-[#30d158]/[0.05] p-8">
            <div className="mb-4 text-3xl">✅</div>
            <h3 className="text-[20px] font-semibold tracking-tight text-[#248a3d]">With WHERE</h3>
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-[#1d1d1f] p-4 font-mono text-[14px] leading-relaxed text-[#7ee2a8]">
{`DELETE FROM students WHERE id = 3;
UPDATE students SET grade = 'F'
 WHERE id = 3;`}
            </pre>
            <p className="mt-4 text-[16px] leading-relaxed text-[#6e6e73]">
              Only the rows you <strong>target</strong> change. Precise, predictable, sane.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── SIMULATOR ──────────────────────────────────────────────────────── */}
      <section id="simulator" className="bg-[#f5f5f7] px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="Try it · live simulator"
            title="Toggle the WHERE clause and watch"
            sub="Pick UPDATE or DELETE, switch the WHERE clause on or off, then run it. See exactly what happens to the table — no real database is harmed."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <Simulator />
        </Reveal>
      </section>

      {/* ── REELS ──────────────────────────────────────────────────────────── */}
      <section id="reels" className="px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="Watch · learn · laugh"
            title="SQL pain, turned into reels"
            sub="Real mistakes everyone makes once, made funny. Tap a reel to play it right here — it stays on this page."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {REELS.map((r) => (
              <Suspense key={r.shortcode} fallback={<DemoFallback label="reel" />}>
                <InstagramReel shortcode={r.shortcode} title={r.title} caption={r.caption} />
              </Suspense>
            ))}
          </div>
        </Reveal>
        <p className="mx-auto mt-10 max-w-xl text-center text-[14px] leading-relaxed text-[#86868b]">
          Reels load only when you press play, to keep the page fast on phones.
        </p>
      </section>

      {/* ── TIPS ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7] px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead eyebrow="Keep them tame" title="Three habits that save your data" sub="Do these every time and you’ll never empty a table by accident." />
        </Reveal>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {[
            { e: '🔍', t: 'SELECT before you change', d: 'Run a SELECT with the same WHERE first. If it returns the rows you expect, swap SELECT for UPDATE or DELETE.' },
            { e: '⚠️', t: 'Beware WHERE 1=1', d: 'A condition that is always true affects every row — the same as having no WHERE at all.' },
            { e: '↩️', t: 'Wrap it in a transaction', d: 'BEGIN, run your change, check it, then COMMIT if happy or ROLLBACK to undo. Your future self says thanks.' },
          ].map((c) => (
            <motion.div
              key={c.t}
              variants={item}
              className="rounded-[28px] border border-black/[0.07] bg-white p-8 transition hover:-translate-y-1 hover:shadow-[0_18px_50px_-20px_rgba(0,0,0,0.18)]"
            >
              <div className="mb-4 text-4xl">{c.e}</div>
              <h3 className="text-[20px] font-semibold tracking-tight text-[#1d1d1f]">{c.t}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-[#6e6e73]">{c.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── QUIZ ───────────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead eyebrow="Check yourself" title="Safe or Sus?" sub="Read each query and decide: would you really run it in production?" />
        </Reveal>
        <Reveal delay={0.1}>
          <Quiz />
        </Reveal>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-black/[0.06] px-6 py-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-2.5">
          <BrandMark className="h-7 w-7 rounded-[8px]" />
          <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">
            Not a <span className="text-[#0071e3]">LMS</span>
          </span>
        </div>
        <p className="text-[14px] text-[#6e6e73]">
          An SQL lesson on UPDATE &amp; DELETE, put together by{' '}
          <span className="font-medium text-[#1d1d1f]">Dr. Yasas Sri Wickramasinghe</span>.
        </p>
        <p className="mt-2 text-[12px] text-[#aeaeb2]">
          Everything here runs in your own browser. The simulator never touches a real database.
        </p>
      </footer>
    </div>
  );
}
