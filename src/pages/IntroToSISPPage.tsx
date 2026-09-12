import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import IntroToSISPLesson from '../components/public/IntroToSISPLesson';

// ─── /intro-to-sisp — MBI800 course intro, public and ungated ─────────────
// Built on Blend, the Blended Teaching Content course-page design system
// (src/components/blend/README.md), running on MBI800's indigo through the
// `planning` accent.
//
// The hero is the Iceberg Model drawn to scale rather than a course blurb:
// one event above the waterline and three layers beneath it. It is the
// course's own first framework, it explains the page's colour, and it is the
// thing a reader can act on immediately — the stepper below asks them to take
// a real outage down through all four layers.
//
// Nothing here is pinned to a session number or a calendar day: when somebody
// reads this page has nothing to do with when a class runs.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'iceberg', label: 'The iceberg' },
  { id: 'systems', label: 'Systems' },
  { id: 'course', label: 'The course' },
  { id: 'outcomes', label: 'Outcomes' },
  { id: 'preview', label: 'Preview' },
  { id: 'dimensions', label: 'Six dimensions' },
  { id: 'outline', label: 'Outline' },
  { id: 'prepared', label: 'Come prepared' },
];

// The four layers, top to bottom, with the y-band each occupies in the hero
// drawing. Only the first sits above the waterline.
const LAYERS: [string, string][] = [
  ['Patterns of behaviour', 'what keeps happening'],
  ['Structures', 'what makes it possible'],
  ['Mental models', 'what holds it in place'],
];

export default function IntroToSISPPage() {
  return (
    <CoursePage
      accent="planning"
      courseCode="MBI800"
      courseName="Strategic Information Systems Planning"
      nav={NAV}
      footerNote="Nothing on this page is tracked or collected. No login required."
      hero={
        <div className="bt-herogrid">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.06 }}
            >
              The outage is the <span className="bt-stop">tip.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              Under it sit the patterns, the structures and the beliefs that made it likely. MBI800 plans at those
              layers rather than the visible one. You can try the method before you enrol — no account, nothing to
              install.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Yasas Sri Wickramasinghe, MBI800 lecturer · 15 credits, Level 8, no prerequisites
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
                onClick={() => document.getElementById('iceberg')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Take an outage apart
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="bt-btn bt-btn--tertiary"
                onClick={() => document.getElementById('outline')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                See the whole course
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
            </motion.div>
          </div>

          {/* The Iceberg Model, drawn with the waterline where it belongs:
              one visible layer and three that have to be looked for. */}
          <motion.div
            className="bt-heroart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.18 }}
          >
            <span className="bt-heroart__lbl">Senge · the iceberg model</span>
            <svg
              viewBox="0 0 470 300"
              width="100%"
              style={{ display: 'block', marginTop: 14, maxWidth: '100%' }}
              role="img"
              aria-label="An iceberg: the Events layer above the waterline, with patterns of behaviour, structures and mental models beneath it in order of decreasing visibility and increasing leverage."
            >
              {/* Event — above the line */}
              <path d="M250 12 L308 74 L192 74 Z" fill="var(--accent-500)" />
              <text x="250" y="52" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" fontFamily="var(--font-display)">Events</text>

              {/* Waterline */}
              <line x1="10" y1="80" x2="460" y2="80" stroke="var(--accent-300)" strokeWidth="1.5" strokeDasharray="5 5" />
              <text x="10" y="72" fontSize="10" letterSpacing="1.3" fill="var(--ink-400)" fontFamily="var(--font-body)">WHAT YOU CAN SEE</text>

              {/* The three submerged layers */}
              {LAYERS.map(([name, sub], i) => {
                const top = 88 + i * 66;
                const halfTopW = 62 + i * 52;
                const halfBottomW = 114 + i * 52;
                return (
                  <g key={name}>
                    <path
                      d={`M${250 - halfTopW} ${top} L${250 + halfTopW} ${top} L${250 + halfBottomW} ${top + 58} L${250 - halfBottomW} ${top + 58} Z`}
                      fill={i === 2 ? 'var(--accent-100)' : 'var(--accent-50)'}
                      stroke="var(--accent-200)"
                    />
                    <text x="250" y={top + 28} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--accent-700)" fontFamily="var(--font-display)">{name}</text>
                    <text x="250" y={top + 44} textAnchor="middle" fontSize="10.5" fill="var(--accent-600)" fontFamily="var(--font-body)">{sub}</text>
                  </g>
                );
              })}

              {/* Leverage runs downward */}
              <line x1="14" y1="96" x2="14" y2="272" stroke="var(--ink-300)" strokeWidth="1.2" />
              <path d="M10 266 L14 274 L18 266 z" fill="var(--ink-300)" />
              <text x="22" y="186" fontSize="10" letterSpacing="1.3" fill="var(--ink-400)" fontFamily="var(--font-body)">LEVERAGE</text>
            </svg>
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span><b>Events are the layer you get for free.</b> Everything with real leverage is below the line, and only turns up if somebody goes looking.</span>
            </p>
          </motion.div>
        </div>
      }
    >
      <IntroToSISPLesson />
    </CoursePage>
  );
}
