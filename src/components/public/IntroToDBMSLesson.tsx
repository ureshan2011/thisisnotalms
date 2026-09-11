import { useState } from 'react';
import {
  Sparkles, Clock, Coffee, MessageSquare, Gamepad2, Terminal, Wrench,
  ClipboardCheck, CheckCircle2, GraduationCap, ExternalLink, Database,
  Lightbulb, PartyPopper,
} from 'lucide-react';
import ClassMapIcebreaker from './ClassMapIcebreaker';

// ─── MBI802 · Class 1 — Introduction to Database Management Systems ────────
// A public, ungated "Day 1" companion page: course overview, learning
// objectives (course-level + today's), the live class icebreaker, today's
// lesson outline, and a quick Data-vs-Information teaser. Content grounded in
// the MBI programme's official MBI802 course descriptor and the Class 1
// lecturer lesson plan (public/lesson-plans/class-1.html).

const SCHEDULE = [
  { time: '10:40', icon: Sparkles,        color: '#8b5cf6', title: 'Welcome & the icebreaker',       body: "Who's in the room, where you're joining from, and what a database even is — in your own words." },
  { time: '10:50', icon: Lightbulb,       color: '#0ea5e9', title: 'Data, Information & DBMS 101',    body: "The difference between data and information, and why file-based systems (yes, that shared Excel sheet) eventually fall over." },
  { time: '11:10', icon: MessageSquare,   color: '#f59e0b', title: 'Think–Pair–Share',                body: "A hospital is running patient records out of spreadsheets. What could possibly go wrong? Two minutes alone, five with a neighbour, then we compare notes." },
  { time: '11:25', icon: Gamepad2,        color: '#ec4899', title: 'Kahoot! knowledge check',         body: 'A fast, low-stakes quiz on everything so far — right or wrong, you get the explanation immediately.' },
  { time: '11:40', icon: Coffee,          color: '#a16207', title: 'Break',                           body: 'Twenty minutes. Good time to start the MySQL download if you haven’t already.' },
  { time: '12:00', icon: Terminal,        color: '#4f46e5', title: 'Live demo: installing MySQL',     body: 'Windows and macOS, side by side, start to finish — including the bits that usually go wrong.' },
  { time: '12:20', icon: Wrench,          color: '#059669', title: 'Hands-on: your first connection', body: 'Install it yourself, run SHOW DATABASES;, and screenshot the proof. No admin rights? A VM is ready for you.' },
  { time: '12:45', icon: ClipboardCheck,  color: '#0d9488', title: 'Reflection & exit ticket',        body: 'One thing you learned, one question you still have — plus a preview of Class 2: SQL Programming.' },
];

const COURSE_LEARNING_OUTCOMES = [
  {
    n: 1,
    title: 'Data ownership, handled ethically',
    body: 'Apply ethical and cultural considerations of data ownership and access in database management — including, in the New Zealand context, Te Tiriti o Waitangi and Māori data sovereignty.',
  },
  {
    n: 2,
    title: 'Design choices that actually scale',
    body: 'Assess database design choices for their impact on query performance and storage — the difference between a database that copes and one that buckles under real load.',
  },
  {
    n: 3,
    title: 'Critique, don’t just build',
    body: 'Critique a working database implementation and propose concrete enhancements to reduce risks like data inconsistency and downtime.',
  },
];

const TODAY_OBJECTIVES = [
  'Tell data and information apart using real, everyday examples',
  'Explain why a DBMS beats a folder full of spreadsheets',
  'Name the core pieces of a relational database — tables, rows, columns, keys',
  'Install and configure MySQL Community Server, end to end',
];

function DataVsInfoTeaser() {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped(f => !f)}
      className="w-full text-left rounded-2xl p-5 sm:p-6 border transition-colors"
      style={{ background: flipped ? '#111827' : '#fff', borderColor: flipped ? '#111827' : 'rgba(0,0,0,0.1)' }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: flipped ? '#a78bfa' : '#8b5cf6' }}>
        A sneak peek — tap to flip
      </p>
      {!flipped ? (
        <p className="mt-3 text-3xl sm:text-4xl font-semibold tabular-nums" style={{ color: '#111827' }}>
          37°C
        </p>
      ) : (
        <p className="mt-3 text-lg sm:text-xl font-medium leading-relaxed" style={{ color: '#f9fafb' }}>
          "37°C — and it's your patient's temperature, taken ten minutes ago, and it's climbing."
        </p>
      )}
      <p className="mt-3 text-sm" style={{ color: flipped ? '#9ca3af' : '#6b7280' }}>
        {!flipped
          ? "That's data — a number sitting by itself. Tap to see it become information."
          : 'Same number, but now it means something you can act on. Every database you design today is really a machine for making that jump — reliably, at scale, for thousands of numbers at once.'}
      </p>
    </button>
  );
}

export default function IntroToDBMSLesson() {
  return (
    <div className="space-y-10">
      {/* ── Instructor welcome ── */}
      <div
        className="rounded-3xl overflow-hidden relative p-6 sm:p-8"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 55%, #059669 130%)' }}
      >
        <div style={{ position: 'absolute', top: -50, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <p className="text-xs inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold relative" style={{ color: '#c7d2fe', background: 'rgba(255,255,255,0.10)' }}>
          <PartyPopper size={12} /> A welcome, from me to you
        </p>
        <h3 className="mt-4 text-2xl sm:text-3xl font-semibold text-white tracking-tight relative">
          Hi — I'm Yasas. Welcome to Class 1.
        </h3>
        <p className="mt-3 text-sm sm:text-[15px] leading-relaxed max-w-2xl relative" style={{ color: 'rgba(224,231,255,0.9)' }}>
          Over the next eight classes we're going to turn "I once used Excel for something like this" into
          "I can design, build, and defend a real database." No prior database experience is assumed — some of
          you have spreadsheet scars, some of you have never opened MySQL, and that's exactly the right starting
          point for today. Grab a seat, say hello to whoever's next to you, and drop your pin below before we start.
        </p>
      </div>

      {/* ── Icebreaker ── */}
      <ClassMapIcebreaker />

      {/* ── What is MBI802 ── */}
      <div>
        <p className="text-xs inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ color: '#3730a3', background: 'rgba(199,210,254,0.5)' }}>
          <Database size={12} /> What MBI802 actually is
        </p>
        <h3 className="mt-3 text-xl sm:text-2xl font-semibold" style={{ color: '#111827' }}>
          Database Management Systems, in one paragraph.
        </h3>
        <p className="mt-3 text-sm sm:text-[15px] leading-relaxed max-w-3xl" style={{ color: '#374151' }}>
          MBI802 is a 15-credit, Level 8 core course — no prerequisites, so everyone starts here on equal footing.
          Across the trimester you'll design relational databases, query them fluently with SQL, and implement
          real security measures, while treating data ownership as an ethical question, not just a technical one
          (including how it intersects with Te Tiriti o Waitangi in a New Zealand healthcare or business context).
          It's 150 learning hours in total: 36 in class with me, and 114 you'll spend building, breaking, and
          fixing things on your own.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {['Relational design', 'SQL querying', 'Normalization', 'Database security', 'Ethical data ownership', 'NoSQL & Big Data (preview)'].map(tag => (
            <span key={tag} className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: 'rgba(139,92,246,0.08)', color: '#5b21b6' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Where this leads ── */}
      <div className="rounded-2xl p-5 sm:p-6 border" style={{ background: 'rgba(249,250,251,0.8)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <p className="text-sm font-semibold" style={{ color: '#111827' }}>This isn't a one-off — it's a foundation.</p>
        <div className="mt-4 flex flex-col sm:flex-row items-stretch gap-3 text-sm">
          <div className="flex-1 rounded-xl p-4" style={{ background: '#fff', border: '1px solid rgba(139,92,246,0.25)' }}>
            <p className="font-semibold" style={{ color: '#8b5cf6' }}>Now — Trimester One</p>
            <p className="mt-1" style={{ color: '#4b5563' }}>MBI802: Database Management Systems</p>
          </div>
          <div className="flex items-center justify-center text-xl" style={{ color: '#c4b5fd' }}>→</div>
          <div className="flex-1 rounded-xl p-4" style={{ background: '#fff', border: '1px solid rgba(14,165,233,0.25)' }}>
            <p className="font-semibold" style={{ color: '#0ea5e9' }}>Trimester Two · Business Analytics</p>
            <p className="mt-1" style={{ color: '#4b5563' }}>Business Intelligence & Data Warehousing</p>
          </div>
          <div className="flex items-center justify-center text-xl" style={{ color: '#c4b5fd' }}>→</div>
          <div className="flex-1 rounded-xl p-4" style={{ background: '#fff', border: '1px solid rgba(236,72,153,0.25)' }}>
            <p className="font-semibold" style={{ color: '#ec4899' }}>Trimester Two · Healthcare Informatics</p>
            <p className="mt-1" style={{ color: '#4b5563' }}>Digital Healthcare Design & Data Safety in Healthcare</p>
          </div>
        </div>
      </div>

      {/* ── Course-level learning outcomes ── */}
      <div>
        <p className="text-xs inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ color: '#3730a3', background: 'rgba(199,210,254,0.5)' }}>
          <GraduationCap size={12} /> By the end of the course
        </p>
        <h3 className="mt-3 text-xl sm:text-2xl font-semibold" style={{ color: '#111827' }}>
          Three things you'll be able to do.
        </h3>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {COURSE_LEARNING_OUTCOMES.map(lo => (
            <div key={lo.n} className="rounded-2xl p-5 border" style={{ background: '#fff', borderColor: 'rgba(0,0,0,0.08)' }}>
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold" style={{ background: '#111827', color: '#fff' }}>
                {lo.n}
              </span>
              <p className="mt-3 text-sm font-semibold" style={{ color: '#111827' }}>{lo.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: '#4b5563' }}>{lo.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Today's objectives ── */}
      <div className="rounded-2xl p-5 sm:p-6 border" style={{ background: 'rgba(139,92,246,0.05)', borderColor: 'rgba(139,92,246,0.2)' }}>
        <p className="text-xs inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold" style={{ color: '#5b21b6', background: 'rgba(139,92,246,0.12)' }}>
          <CheckCircle2 size={12} /> By the end of TODAY
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TODAY_OBJECTIVES.map((obj, i) => (
            <div key={obj} className="flex items-start gap-3 rounded-xl p-3.5" style={{ background: '#fff' }}>
              <span className="flex-none w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#8b5cf6', color: '#fff' }}>
                {i + 1}
              </span>
              <p className="text-sm leading-snug" style={{ color: '#374151' }}>{obj}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Data vs Information teaser ── */}
      <div>
        <p className="text-xs inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ color: '#3730a3', background: 'rgba(199,210,254,0.5)' }}>
          <Lightbulb size={12} /> Today's big idea, teased
        </p>
        <div className="mt-4">
          <DataVsInfoTeaser />
        </div>
      </div>

      {/* ── Today's outline ── */}
      <div>
        <p className="text-xs inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ color: '#3730a3', background: 'rgba(199,210,254,0.5)' }}>
          <Clock size={12} /> How today unfolds
        </p>
        <h3 className="mt-3 text-xl sm:text-2xl font-semibold" style={{ color: '#111827' }}>
          10:40 AM – 1:00 PM · 120 minutes teaching, one break.
        </h3>

        <div className="mt-6 relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-px" style={{ background: 'rgba(0,0,0,0.08)' }} />
          <div className="space-y-4">
            {SCHEDULE.map(step => {
              const Icon = step.icon;
              return (
                <div key={step.time} className="relative flex items-start gap-4">
                  <span
                    className="relative flex-none w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: step.color, color: '#fff', zIndex: 1 }}
                  >
                    <Icon size={17} />
                  </span>
                  <div className="min-w-0 rounded-xl p-3.5 flex-1" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-[11px] font-mono font-semibold tracking-wide" style={{ color: step.color }}>{step.time}</span>
                      <span className="text-sm font-semibold" style={{ color: '#111827' }}>{step.title}</span>
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#4b5563' }}>{step.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Come prepared ── */}
      <div className="rounded-2xl p-5 sm:p-6 border" style={{ background: '#fff', borderColor: 'rgba(0,0,0,0.08)' }}>
        <p className="text-sm font-semibold" style={{ color: '#111827' }}>Come prepared</p>
        <ul className="mt-3 space-y-2 text-sm" style={{ color: '#4b5563' }}>
          <li className="flex gap-2"><span className="mt-1.5 flex-none w-1 h-1 rounded-full" style={{ background: '#8b5cf6' }} />Bring a laptop — no admin rights on it? Say so at the break, a VM will be ready for you.</li>
          <li className="flex gap-2"><span className="mt-1.5 flex-none w-1 h-1 rounded-full" style={{ background: '#8b5cf6' }} />
            Download{' '}
            <a href="https://dev.mysql.com/downloads/mysql/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline font-medium" style={{ color: '#4338ca' }}>
              MySQL Community Server <ExternalLink size={11} />
            </a>{' '}during the break if you haven't already — Windows and macOS both covered in the demo.
          </li>
          <li className="flex gap-2"><span className="mt-1.5 flex-none w-1 h-1 rounded-full" style={{ background: '#8b5cf6' }} />Excel experience? Good — it's the bridge we'll use to get to databases, not something to unlearn.</li>
        </ul>
      </div>

      {/* ── Sign-off ── */}
      <div className="rounded-2xl p-6 sm:p-8 border text-center" style={{ background: 'rgba(249,250,251,0.8)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <h3 className="text-xl sm:text-2xl font-semibold max-w-xl mx-auto" style={{ color: '#111827' }}>
          See you in the room.
        </h3>
        <p className="mt-3 text-sm leading-relaxed max-w-xl mx-auto" style={{ color: '#4b5563' }}>
          Eight classes from now, "database" won't be a scary word anymore — it'll be a tool you reach for on
          purpose. Let's get started.
        </p>
        <p className="mt-5 text-xs font-medium inline-flex items-center gap-1.5" style={{ color: '#6b7280' }}>
          — Yasas Sri Wickramasinghe
          <a href="https://www.linkedin.com/in/yasassri/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline" style={{ color: '#4338ca' }}>
            MBI802 Lecturer <ExternalLink size={11} />
          </a>
        </p>
      </div>
    </div>
  );
}
