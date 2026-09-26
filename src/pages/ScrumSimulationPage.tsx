import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import ScrumSimulationLesson from '../components/public/ScrumSimulationLesson';

// ─── /scrum-simulation — MBI804 Lesson 3, public ──────────────────────────
// Built on Blend (src/components/blend/README.md) on MBI804's plum. Lesson 2
// explained Scrum as a diagram; this page is the same framework as a 3D
// studio the reader can drive. The hero art is the loop the studio walks,
// reduced to six stations — the shape a student should be able to draw
// from memory after watching it go round three times.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'studio', label: '3.1 The studio' },
  { id: 'roles', label: '3.2 Roles' },
  { id: 'artefacts', label: '3.3 Artefacts' },
  { id: 'events', label: '3.4 Events' },
  { id: 'loop', label: '3.5 The loop' },
  { id: 'check', label: 'Check yourself' },
  { id: 'ahead', label: "What's next" },
];

/** The Sprint loop as six stations on a ring, with the Increment growing
 *  in the middle: the same route the miniatures walk in the studio. */
function HeroLoop() {
  const cx = 140, cy = 92, r = 66;
  const stations = ['Backlog', 'Planning', 'Daily', 'Work', 'Review', 'Retro'];
  const pt = (i: number, rad = r) => {
    const a = -Math.PI / 2 + (i / stations.length) * Math.PI * 2;
    return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad] as const;
  };
  return (
    <svg viewBox="0 0 280 184" width="100%" style={{ display: 'block' }} role="img"
      aria-label="The Scrum loop as six stations on a ring — Product Backlog, Sprint Planning, Daily Scrum, the work, Sprint Review, Retrospective — with the Increment growing in the centre.">
      {stations.map((_, i) => {
        const a0 = -Math.PI / 2 + (i / 6) * Math.PI * 2 + 0.3;
        const a1 = -Math.PI / 2 + ((i + 1) / 6) * Math.PI * 2 - 0.3;
        const p = (a: number) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
        return <path key={i} d={`M${p(a0)} A${r} ${r} 0 0 1 ${p(a1)}`} fill="none" stroke="var(--accent-300)" strokeWidth="3" strokeLinecap="round" />;
      })}
      {stations.map((s, i) => {
        const [x, y] = pt(i);
        const [lx, ly] = pt(i, r + 22);
        return (
          <g key={s}>
            <circle cx={x} cy={y} r="9" fill={i === 3 ? 'var(--accent-500)' : 'var(--accent-100)'} stroke="var(--accent-500)" strokeWidth="2" />
            <text x={lx} y={ly + 3.5} fontSize="9.5" fontWeight="700" fontFamily="var(--font-display)" fill="var(--ink-400)" textAnchor="middle">{s}</text>
          </g>
        );
      })}
      {/* The Increment: three stacked layers, one per Sprint */}
      {[0, 1, 2].map(i => (
        <rect key={i} x={cx - 16 + i * 4} y={cy + 8 - i * 10} width={32 - i * 8} height="7" rx="2.5" fill={i === 2 ? 'var(--accent-500)' : 'var(--accent-200)'} />
      ))}
      <text x={cx} y={cy - 16} fontSize="8.5" fontWeight="700" fontFamily="var(--font-display)" fill="var(--ink-400)" textAnchor="middle" letterSpacing="0.08em">INCREMENT</text>
    </svg>
  );
}

export default function ScrumSimulationPage() {
  return (
    <CoursePage
      accent="project"
      courseCode="MBI804"
      courseName="IT Project Management"
      nav={NAV}
      footerNote="Nothing on this page is tracked or collected. No login required. The 3D studio runs entirely in your browser."
      hero={
        <div className="bt-herogrid">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.06 }}
            >
              Watch a Scrum Team build <span className="bt-stop">something.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              Six miniatures, one parcel drone, three one-week Sprints in a 3D studio you can pause, scrub and orbit.
              The Product Backlog becomes a Sprint Backlog, the Daily Scrum runs every morning, an impediment lands
              and gets cleared, stakeholders watch the drone lift off — and the whole loop goes round three times.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Lesson 3 of MBI804 · Yasas Sri Wickramasinghe · open to anybody, no login
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
                onClick={() => document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Open the studio
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="bt-btn bt-btn--tertiary"
                onClick={() => document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Just the facts
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
            <span className="bt-heroart__lbl">The loop the studio walks</span>
            <HeroLoop />
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span><b>Scrum is a loop, not a line.</b> Every Sprint ends where the next one starts, and the product grows in the middle.</span>
            </p>
          </motion.div>
        </div>
      }
    >
      <ScrumSimulationLesson />
    </CoursePage>
  );
}
