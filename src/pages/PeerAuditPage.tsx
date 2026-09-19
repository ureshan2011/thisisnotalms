import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import PeerAuditLesson from '../components/public/PeerAuditLesson';

// ─── /peer-audit — MBI804's peer audit round, public ──────────────────────
// Built on Blend (src/components/blend/README.md), on MBI804's plum through
// the `project` accent.
//
// The page is the training and the brief for the activity, not the activity
// itself. The real scenarios are classmates' own post-mortems about their own
// workplaces and live behind the site the lecturer runs; this page carries a
// fictional practice scenario in the same six fields.
//
// The hero art is the shuffle the activity is built on: every student's
// write-up going to somebody else, and nobody receiving their own. It is the
// first question anyone asks about a peer round, so it is answered before
// the fold rather than in a paragraph further down.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'stance', label: '1 The stance' },
  { id: 'brief', label: '2 The brief' },
  { id: 'practice', label: '3 Practice' },
  { id: 'evidence', label: '4 What earns marks' },
  { id: 'response', label: '5 The response' },
  { id: 'plan', label: '6 Your plan' },
  { id: 'submit', label: '7 The real round' },
  { id: 'check', label: 'Check yourself' },
];

/** Every write-up goes to the next person along, so nobody gets their own. */
function ShuffleArt() {
  const n = 5;
  const rowY = (i: number) => 26 + i * 27;
  return (
    <svg viewBox="0 0 280 168" width="100%" style={{ display: 'block' }} role="img"
      aria-label="Five post-mortems on the left, each linked by a curve to a different reader on the right. No line goes straight across, so nobody is assigned their own write-up.">
      <text x="6" y="14" fontSize="9" letterSpacing="1.1" fontFamily="var(--font-body)" fill="var(--ink-400)">WROTE IT</text>
      <text x="274" y="14" textAnchor="end" fontSize="9" letterSpacing="1.1" fontFamily="var(--font-body)" fill="var(--ink-400)">AUDITS IT</text>

      {Array.from({ length: n }, (_, i) => {
        // Shift by one, wrapping — the same rule the activity's assignment
        // table uses, and the reason no line is horizontal.
        const to = (i + 1) % n;
        const on = i === 0;
        return (
          <g key={i}>
            <path
              d={`M52 ${rowY(i)} C 120 ${rowY(i)}, 160 ${rowY(to)}, 228 ${rowY(to)}`}
              fill="none"
              stroke={on ? 'var(--accent-500)' : 'var(--border-subtle)'}
              strokeWidth={on ? 2 : 1.2}
            />
            <rect x="6" y={rowY(i) - 9} width="46" height="18" rx="6" fill={on ? 'var(--accent-500)' : 'var(--accent-100)'} />
            <rect x="228" y={rowY(to) - 9} width="46" height="18" rx="6" fill={on ? 'var(--accent-200)' : 'var(--paper-200)'} />
          </g>
        );
      })}
      <text x="140" y="162" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--ink-400)">no line runs straight across</text>
    </svg>
  );
}

export default function PeerAuditPage() {
  return (
    <CoursePage
      accent="project"
      courseCode="MBI804"
      courseName="IT Project Management"
      nav={NAV}
      footerNote="Nothing on this page is tracked or collected, and the plan you build stays in your own browser. No login required."
      hero={
        <div className="bt-herogrid">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.06 }}
            >
              Somebody else reads it <span className="bt-stop">properly.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              You wrote up a project you lived through. Now you audit a classmate’s — four questions, no stake in
              their conclusions, and a Corrective Action Plan their sponsor could act on. Practise the whole thing
              here first, on a scenario nobody has to defend.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              MBI804 peer audit round · Yasas Sri Wickramasinghe · open to anybody, no login
            </motion.p>

            <motion.div
              className="bt-hero__cta"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.3 }}
            >
              <button
                type="button"
                className="bt-btn"
                onClick={() => document.getElementById('practice')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Try the practice audit
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="bt-btn bt-btn--tertiary"
                onClick={() => document.getElementById('submit')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                How to submit
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
            </motion.div>
          </div>

          <motion.div
            className="bt-heroart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.18 }}
          >
            <span className="bt-heroart__lbl">How the round is dealt</span>
            <ShuffleArt />
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span><b>Nobody audits their own project.</b> Every write-up goes to the next person along, which is also why you will not be told whose you have.</span>
            </p>
          </motion.div>
        </div>
      }
    >
      <PeerAuditLesson />
    </CoursePage>
  );
}
