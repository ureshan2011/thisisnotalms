import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Database, AlertTriangle, Trash2, Pencil, Play, Sparkles, ChevronRight,
  Skull, RotateCcw, ShieldAlert, Terminal, Trophy, Zap, CheckCircle2,
  XCircle, Flame, PartyPopper, Lightbulb, ArrowRight, Github, Linkedin,
} from 'lucide-react';
import InstagramReel from '../components/sql/InstagramReel';
import { useFeatureTracking } from '../lib/useFeatureTracking';

type Section = 'intro' | 'rule' | 'simulator' | 'reels' | 'quiz';

/* ---------------------------------------------------------------- *
 * Data
 * ---------------------------------------------------------------- */

const REELS = [
  {
    shortcode: 'DUbBkrHD8Dy',
    title: 'When you forget the WHERE clause 💀',
    caption: 'UPDATE gone wild',
  },
  {
    shortcode: 'DU3XLpljxxz',
    title: 'DELETE without WHERE be like…',
    caption: 'The whole table is gone',
  },
  {
    shortcode: 'DY2jWvqv5FU',
    title: 'Me confidently running it in production',
    caption: 'No backup, no problem? 😬',
  },
  {
    shortcode: 'DYkPRjsPSIc',
    title: 'WHERE clause = your best friend',
    caption: 'Always target your rows',
  },
];

interface Row {
  id: number;
  name: string;
  status: string;
  deleted?: boolean;
  changed?: boolean;
}

const INITIAL_ROWS: Row[] = [
  { id: 1, name: 'Aisha',  status: 'active' },
  { id: 2, name: 'Ben',    status: 'active' },
  { id: 3, name: 'Chen',   status: 'active' },
  { id: 4, name: 'Diego',  status: 'active' },
  { id: 5, name: 'Esha',   status: 'active' },
];

interface QuizCard {
  query: string;
  dangerous: boolean;
  explanation: string;
}

const QUIZ_CARDS: QuizCard[] = [
  {
    query: "DELETE FROM students;",
    dangerous: true,
    explanation: 'No WHERE clause — this wipes EVERY student from the table. 🪦',
  },
  {
    query: "UPDATE accounts SET balance = 0 WHERE id = 42;",
    dangerous: false,
    explanation: 'Targets exactly one row with a WHERE clause. Precise and safe.',
  },
  {
    query: "UPDATE products SET price = 9.99;",
    dangerous: true,
    explanation: 'Every single product is now $9.99. The WHERE clause is missing!',
  },
  {
    query: "DELETE FROM orders WHERE status = 'cancelled';",
    dangerous: false,
    explanation: 'Only cancelled orders are removed. The WHERE clause keeps it scoped.',
  },
  {
    query: "UPDATE users SET role = 'admin' WHERE 1 = 1;",
    dangerous: true,
    explanation: "WHERE 1=1 is always true — so EVERY user just became an admin. 😱",
  },
];

/* ---------------------------------------------------------------- *
 * Page
 * ---------------------------------------------------------------- */

export default function SQLReelsPage() {
  const [activeSection, setActiveSection] = useState<Section>('intro');

  useFeatureTracking('sql_reels_view');

  const sections: { id: Section; label: string; icon: typeof Database }[] = [
    { id: 'intro',     label: 'Intro',     icon: Sparkles },
    { id: 'rule',      label: 'Golden Rule', icon: ShieldAlert },
    { id: 'simulator', label: 'Simulator', icon: Terminal },
    { id: 'reels',     label: 'Reels',     icon: Play },
    { id: 'quiz',      label: 'Safe or Sus?', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <Database className="w-6 h-6 text-emerald-400" />
              <span>SQL <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-500">Reels</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === s.id ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <s.icon className="w-4 h-4" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile section pills */}
      <div className="md:hidden sticky top-16 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex gap-2 overflow-x-auto px-4 py-2 no-scrollbar">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeSection === s.id ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-300'
              }`}
            >
              <s.icon className="w-3.5 h-3.5" />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {activeSection === 'intro'     && <IntroSection onGo={setActiveSection} />}
      {activeSection === 'rule'      && <RuleSection onGo={setActiveSection} />}
      {activeSection === 'simulator' && <SimulatorSection />}
      {activeSection === 'reels'     && <ReelsSection />}
      {activeSection === 'quiz'      && <QuizSection />}

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">Learn SQL the fun way · UPDATE & DELETE without tears</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Intro
 * ---------------------------------------------------------------- */

function IntroSection({ onGo }: { onGo: (s: Section) => void }) {
  return (
    <section className="relative overflow-hidden">
      {/* glow blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-20 -right-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-sm font-medium mb-6">
            <Flame className="w-4 h-4" />
            Learn SQL with reels, not boredom
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">UPDATE</span> &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-500">DELETE</span>
            <br className="hidden sm:block" /> without nuking your database
          </h1>
          <p className="text-lg text-slate-300 mb-8">
            One missing <code className="px-1.5 py-0.5 rounded bg-white/10 text-emerald-300 font-mono text-base">WHERE</code> clause
            and your whole table is gone. Watch the funny reels, run the live simulator, and play
            <span className="font-semibold text-white"> &ldquo;Safe or Sus?&rdquo;</span> to never make that mistake again.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onGo('simulator')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 font-semibold hover:opacity-90 transition-opacity"
            >
              <Terminal className="w-5 h-5" />
              Try the Simulator
            </button>
            <button
              onClick={() => onGo('reels')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20 font-semibold hover:bg-white/15 transition-colors"
            >
              <Play className="w-5 h-5" />
              Watch the Reels
            </button>
          </div>

          {/* quick stat cards */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Pencil, label: 'UPDATE', desc: 'Change rows safely', color: 'text-cyan-300' },
              { icon: Trash2, label: 'DELETE', desc: 'Remove the right rows', color: 'text-pink-300' },
              { icon: ShieldAlert, label: 'WHERE', desc: 'Your safety net', color: 'text-amber-300' },
            ].map((c) => (
              <div key={c.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <c.icon className={`w-7 h-7 mb-3 ${c.color}`} />
                <p className="font-bold text-lg">{c.label}</p>
                <p className="text-sm text-slate-400">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- *
 * Golden Rule
 * ---------------------------------------------------------------- */

function RuleSection({ onGo }: { onGo: (s: Section) => void }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">The Golden Rule of UPDATE &amp; DELETE</h2>
        <p className="text-slate-400">Two queries do the most damage. Here&apos;s how to keep them tame.</p>
      </div>

      {/* danger vs safe side by side */}
      <div className="grid gap-6 md:grid-cols-2 mb-10">
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6">
          <div className="flex items-center gap-2 mb-4 text-rose-300 font-bold">
            <Skull className="w-5 h-5" />
            Dangerous
          </div>
          <pre className="rounded-lg bg-slate-950/80 p-4 font-mono text-sm text-rose-200 overflow-x-auto">
{`DELETE FROM students;
UPDATE students
   SET grade = 'F';`}
          </pre>
          <p className="mt-4 text-sm text-slate-300">
            No <code className="text-rose-300">WHERE</code> = the change hits <strong>every single row</strong>.
            Everyone fails. Everyone is deleted. 💀
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
          <div className="flex items-center gap-2 mb-4 text-emerald-300 font-bold">
            <CheckCircle2 className="w-5 h-5" />
            Safe
          </div>
          <pre className="rounded-lg bg-slate-950/80 p-4 font-mono text-sm text-emerald-200 overflow-x-auto">
{`DELETE FROM students
 WHERE id = 3;
UPDATE students
   SET grade = 'F'
 WHERE id = 3;`}
          </pre>
          <p className="mt-4 text-sm text-slate-300">
            With <code className="text-emerald-300">WHERE</code>, only the rows you <strong>target</strong> change.
            Precise. Reversible-ish. Sane. ✅
          </p>
        </div>
      </div>

      {/* tips */}
      <div className="space-y-4">
        {[
          { icon: Lightbulb, title: 'SELECT before you UPDATE/DELETE', body: 'Run a SELECT with the same WHERE first. If it returns the rows you expect, swap SELECT for UPDATE/DELETE.' },
          { icon: ShieldAlert, title: 'Beware WHERE 1=1', body: 'A condition that is always true affects every row — same as having no WHERE at all.' },
          { icon: Zap, title: 'Wrap risky changes in a transaction', body: 'BEGIN; … then check; COMMIT if happy, or ROLLBACK to undo. Your future self says thanks.' },
        ].map((t) => (
          <div key={t.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
            <t.icon className="w-6 h-6 shrink-0 text-amber-300" />
            <div>
              <p className="font-semibold">{t.title}</p>
              <p className="text-sm text-slate-400">{t.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => onGo('simulator')}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 font-semibold hover:opacity-90 transition-opacity"
        >
          See it happen in the Simulator
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Simulator
 * ---------------------------------------------------------------- */

function SimulatorSection() {
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);
  const [op, setOp] = useState<'UPDATE' | 'DELETE'>('UPDATE');
  const [useWhere, setUseWhere] = useState(true);
  const [targetId, setTargetId] = useState(3);
  const [lastResult, setLastResult] = useState<{ msg: string; danger: boolean } | null>(null);

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
        setLastResult({ msg: `1 row deleted (id = ${targetId}).`, danger: false });
      } else {
        setRows((rs) => rs.map((r) => ({ ...r, deleted: true })));
        setLastResult({ msg: `💥 ${live.length} rows deleted. The whole table is empty!`, danger: true });
      }
    } else {
      if (useWhere) {
        setRows((rs) => rs.map((r) => (r.id === targetId && !r.deleted ? { ...r, status: newValue, changed: true } : { ...r, changed: false })));
        setLastResult({ msg: `1 row updated (id = ${targetId}).`, danger: false });
      } else {
        setRows((rs) => rs.map((r) => (r.deleted ? r : { ...r, status: newValue, changed: true })));
        setLastResult({ msg: `💥 ${live.length} rows updated. Everyone is now '${newValue}'!`, danger: true });
      }
    }
  }

  function reset() {
    setRows(INITIAL_ROWS);
    setLastResult(null);
  }

  const liveRows = rows.filter((r) => !r.deleted);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">Live Query Simulator</h2>
        <p className="text-slate-400">Toggle the <code className="text-emerald-300">WHERE</code> clause and watch what happens to the table. No real databases were harmed.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls + query */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          {/* operation toggle */}
          <p className="text-sm font-semibold text-slate-300 mb-2">Operation</p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {(['UPDATE', 'DELETE'] as const).map((o) => (
              <button
                key={o}
                onClick={() => setOp(o)}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                  op === o
                    ? o === 'DELETE'
                      ? 'bg-pink-500/20 text-pink-300 ring-1 ring-pink-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {o === 'UPDATE' ? <Pencil className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                {o}
              </button>
            ))}
          </div>

          {/* WHERE toggle */}
          <p className="text-sm font-semibold text-slate-300 mb-2">WHERE clause</p>
          <button
            onClick={() => setUseWhere((v) => !v)}
            className={`flex w-full items-center justify-between rounded-lg px-4 py-3 mb-2 text-sm font-semibold transition-colors ${
              useWhere ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40' : 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40'
            }`}
          >
            <span className="flex items-center gap-2">
              {useWhere ? <ShieldAlert className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              {useWhere ? 'WHERE clause ON (safe)' : 'WHERE clause OFF (danger!)'}
            </span>
            <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${useWhere ? 'bg-emerald-500' : 'bg-rose-500'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useWhere ? 'translate-x-6' : 'translate-x-1'}`} />
            </span>
          </button>

          {/* target row */}
          <div className={`mb-5 transition-opacity ${useWhere ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <p className="text-sm font-semibold text-slate-300 mb-2">Target row (id)</p>
            <div className="flex flex-wrap gap-2">
              {INITIAL_ROWS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setTargetId(r.id)}
                  className={`h-9 w-9 rounded-lg text-sm font-semibold transition-colors ${
                    targetId === r.id ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {r.id}
                </button>
              ))}
            </div>
          </div>

          {/* generated query */}
          <p className="text-sm font-semibold text-slate-300 mb-2">Your query</p>
          <pre className={`rounded-lg bg-slate-950/80 p-4 font-mono text-sm overflow-x-auto ${useWhere ? 'text-emerald-200' : 'text-rose-200'}`}>
{query}
          </pre>

          <div className="mt-5 flex gap-3">
            <button
              onClick={run}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 px-4 py-3 font-semibold hover:opacity-90 transition-opacity"
            >
              <Play className="w-5 h-5" />
              Run query
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-3 font-semibold hover:bg-white/15 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>

          {lastResult && (
            <div className={`mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium ${
              lastResult.danger ? 'bg-rose-500/15 text-rose-300' : 'bg-emerald-500/15 text-emerald-300'
            }`}>
              {lastResult.danger ? <Skull className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
              {lastResult.msg}
            </div>
          )}
        </div>

        {/* The table */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 mb-4 text-slate-300 font-semibold">
            <Database className="w-5 h-5 text-emerald-400" />
            users
            <span className="text-xs font-normal text-slate-500">({liveRows.length} {liveRows.length === 1 ? 'row' : 'rows'})</span>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-400">
                <tr>
                  <th className="px-4 py-2 font-semibold">id</th>
                  <th className="px-4 py-2 font-semibold">name</th>
                  <th className="px-4 py-2 font-semibold">status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className={`border-t border-white/5 transition-all duration-300 ${
                      r.deleted ? 'opacity-30 line-through text-rose-300' : r.changed ? 'bg-cyan-500/10 text-cyan-200' : 'text-slate-200'
                    }`}
                  >
                    <td className="px-4 py-2 font-mono">{r.id}</td>
                    <td className="px-4 py-2">{r.name}</td>
                    <td className="px-4 py-2 font-mono">
                      {r.deleted ? '— deleted —' : r.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {liveRows.length === 0 && (
            <div className="mt-6 flex flex-col items-center gap-2 rounded-lg border border-dashed border-rose-500/40 bg-rose-500/5 py-8 text-center text-rose-300">
              <Skull className="w-8 h-8" />
              <p className="font-semibold">Table is empty.</p>
              <p className="text-sm text-rose-300/70">This is why you never forget the WHERE clause. Hit Reset to try again.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Reels
 * ---------------------------------------------------------------- */

function ReelsSection() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">Watch &amp; Laugh &amp; Learn</h2>
        <p className="text-slate-400">Real SQL pain, turned into reels. Tap a card to play.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {REELS.map((r) => (
          <InstagramReel key={r.shortcode} shortcode={r.shortcode} title={r.title} caption={r.caption} />
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-slate-500">
        Reels load only when you press play, to save your data. 💚
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Quiz: Safe or Sus?
 * ---------------------------------------------------------------- */

function QuizSection() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<null | { correct: boolean }>(null);
  const [done, setDone] = useState(false);

  const card = QUIZ_CARDS[index];

  function answer(guessDangerous: boolean) {
    if (answered) return;
    const correct = guessDangerous === card.dangerous;
    if (correct) setScore((s) => s + 1);
    setAnswered({ correct });
  }

  function next() {
    if (index + 1 >= QUIZ_CARDS.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setAnswered(null);
    }
  }

  function restart() {
    setIndex(0);
    setScore(0);
    setAnswered(null);
    setDone(false);
  }

  if (done) {
    const perfect = score === QUIZ_CARDS.length;
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 mb-6">
          {perfect ? <PartyPopper className="w-10 h-10 text-white" /> : <Trophy className="w-10 h-10 text-white" />}
        </div>
        <h2 className="text-3xl font-bold mb-2">You scored {score} / {QUIZ_CARDS.length}</h2>
        <p className="text-slate-400 mb-8">
          {perfect
            ? 'Flawless! Your tables are safe in your hands. 🛡️'
            : score >= QUIZ_CARDS.length - 1
            ? 'So close to perfect — one more pass and you’ve got it.'
            : 'Re-watch the reels and run the simulator, then try again.'}
        </p>
        <button
          onClick={restart}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 font-semibold hover:opacity-90 transition-opacity"
        >
          <RotateCcw className="w-5 h-5" />
          Play again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3">Safe or Sus? 🕵️</h2>
        <p className="text-slate-400">Read the query. Would you run it in production?</p>
      </div>

      {/* progress */}
      <div className="flex items-center justify-between mb-4 text-sm text-slate-400">
        <span>Question {index + 1} of {QUIZ_CARDS.length}</span>
        <span className="inline-flex items-center gap-1"><Trophy className="w-4 h-4 text-amber-300" /> {score}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10 mb-8 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 transition-all" style={{ width: `${((index + (answered ? 1 : 0)) / QUIZ_CARDS.length) * 100}%` }} />
      </div>

      {/* query card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
        <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs font-mono">
          <Terminal className="w-4 h-4" /> query.sql
        </div>
        <pre className="rounded-lg bg-slate-950/80 p-4 font-mono text-base text-slate-100 overflow-x-auto whitespace-pre-wrap break-words">
{card.query}
        </pre>
      </div>

      {!answered ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => answer(false)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40 px-4 py-4 font-semibold hover:bg-emerald-500/25 transition-colors"
          >
            <CheckCircle2 className="w-5 h-5" />
            Safe
          </button>
          <button
            onClick={() => answer(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40 px-4 py-4 font-semibold hover:bg-rose-500/25 transition-colors"
          >
            <Skull className="w-5 h-5" />
            Sus / Dangerous
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`flex items-start gap-3 rounded-xl px-4 py-4 ${
            answered.correct ? 'bg-emerald-500/15 text-emerald-200' : 'bg-rose-500/15 text-rose-200'
          }`}>
            {answered.correct ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 shrink-0 mt-0.5" />}
            <div>
              <p className="font-semibold mb-1">
                {answered.correct ? 'Correct!' : 'Not quite.'}{' '}
                This query is {card.dangerous ? 'dangerous.' : 'safe.'}
              </p>
              <p className="text-sm opacity-90">{card.explanation}</p>
            </div>
          </div>
          <button
            onClick={next}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 px-4 py-3 font-semibold hover:opacity-90 transition-opacity"
          >
            {index + 1 >= QUIZ_CARDS.length ? 'See results' : 'Next question'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
