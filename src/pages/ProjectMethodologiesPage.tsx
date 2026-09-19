import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import ProjectMethodologiesLesson from '../components/public/ProjectMethodologiesLesson';

// ─── /project-methodologies — MBI804 Lesson 2, public ─────────────────────
// Built on Blend, the Blended Teaching Content course-page design system
// (src/components/blend/README.md), running on MBI804's plum through the
// `project` accent.
//
// Lesson 1 (/intro-to-project-management) ends by asking which methodology a
// project's attributes call for. This page is the answer in detail:
// Waterfall, Spiral, PRINCE2 and the Agile family, then Scrum at length.
//
// The hero art is the four lifecycles reduced to four glyphs, because the
// shape is the thing this lesson is actually teaching — a reader who can
// draw all four from memory has most of what the 60% case study asks for.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'shapes', label: '2.1 Four shapes' },
  { id: 'waterfall', label: '2.2 Waterfall' },
  { id: 'spiral', label: '2.3 Spiral' },
  { id: 'prince2', label: '2.4 PRINCE2' },
  { id: 'agile', label: '2.5 Agile' },
  { id: 'scrum', label: '2.6 Scrum' },
  { id: 'compare', label: '2.7 Side by side' },
  { id: 'check', label: 'Check yourself' },
  { id: 'ahead', label: "What's next" },
];

/** The four lifecycles at glyph size, drawn from the same parts as the
 *  full-size diagrams further down the page. Two columns, two rows, each
 *  glyph sitting above its own label with room to spare — a coil that
 *  wanders into the cell next door stops reading as a spiral. */
function HeroGlyphs() {
  const SPIRAL_CX = 196;
  const SPIRAL_CY = 34;
  const spiral: string[] = [];
  for (let t = 0; t <= Math.PI * 3.4; t += 0.08) {
    const r = 2.5 + t * 2.2;
    spiral.push(
      `${spiral.length === 0 ? 'M' : 'L'}${(SPIRAL_CX + r * Math.cos(Math.PI + t)).toFixed(1)} ${(SPIRAL_CY + r * Math.sin(Math.PI + t)).toFixed(1)}`,
    );
  }
  return (
    <svg viewBox="0 0 280 176" width="100%" style={{ display: 'block' }} role="img"
      aria-label="Four lifecycle shapes at a glance: Waterfall as descending steps, Spiral as a widening coil, PRINCE2 as stages with decision diamonds between them, and Agile as a repeating loop leaving increments behind it.">
      {([
        ['Waterfall', 6, 76],
        ['Spiral', 152, 76],
        ['PRINCE2', 6, 166],
        ['Agile', 152, 166],
      ] as const).map(([label, x, y]) => (
        <text key={label} x={x} y={y} fontSize="10.5" fontWeight="700"
          fontFamily="var(--font-display)" fill="var(--ink-400)" letterSpacing="0.02em">{label}</text>
      ))}

      {/* Waterfall — four steps down to one release */}
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={10 + i * 28} y={10 + i * 13} width="24" height="9" rx="3"
          fill={i === 3 ? 'var(--accent-500)' : 'var(--accent-200)'} />
      ))}

      {/* Spiral — a coil widening from the centre */}
      <path d={spiral.join(' ')} fill="none" stroke="var(--accent-500)" strokeWidth="2" strokeLinecap="round" />
      <circle cx={SPIRAL_CX} cy={SPIRAL_CY} r="2" fill="var(--ink-900)" />

      {/* PRINCE2 — a board above, stages below, a decision between each */}
      <g transform="translate(6 98)">
        <rect x="0" y="0" width="118" height="5" rx="2.5" fill="var(--accent-200)" />
        {[0, 1, 2].map(i => (
          <rect key={i} x={i * 44} y="16" width="30" height="16" rx="5" fill="var(--accent-100)" />
        ))}
        {[0, 1].map(i => (
          <path key={i} d={`M${i * 44 + 37} 18 L${i * 44 + 44} 24 L${i * 44 + 37} 30 L${i * 44 + 30} 24 Z`} fill="var(--accent-500)" />
        ))}
      </g>

      {/* Agile — a loop that keeps turning, stacking increments */}
      <g transform="translate(150 98)">
        {[0, 1, 2, 3].map(i => {
          const a0 = -Math.PI / 2 + i * (Math.PI / 2) + 0.22;
          const a1 = -Math.PI / 2 + (i + 1) * (Math.PI / 2) - 0.22;
          const r = 17;
          const p = (a: number) => `${(26 + r * Math.cos(a)).toFixed(1)} ${(26 + r * Math.sin(a)).toFixed(1)}`;
          return <path key={i} d={`M${p(a0)} A${r} ${r} 0 0 1 ${p(a1)}`} fill="none" stroke="var(--accent-400)" strokeWidth="4" strokeLinecap="round" />;
        })}
        {[0, 1, 2].map(i => (
          <rect key={i} x={62 + i * 15} y={42 - i * 11} width="11" height={9 + i * 11} rx="3"
            fill={i === 2 ? 'var(--accent-500)' : 'var(--accent-200)'} />
        ))}
      </g>
    </svg>
  );
}

export default function ProjectMethodologiesPage() {
  return (
    <CoursePage
      accent="project"
      courseCode="MBI804"
      courseName="IT Project Management"
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
              Four ways to shape the same <span className="bt-stop">work.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              Waterfall, Spiral, PRINCE2 and Agile — drawn rather than described, with ten things on this page you
              can move yourself. Then Scrum in full: the roles, the artefacts, the events and the board, at the depth
              an interview will actually ask about.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Lesson 2 of MBI804 · Yasas Sri Wickramasinghe · open to anybody, no login
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
                onClick={() => document.getElementById('shapes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Start Lesson 2
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="bt-btn bt-btn--tertiary"
                onClick={() => document.getElementById('scrum')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Straight to Scrum
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
            <span className="bt-heroart__lbl">The four shapes, at a glance</span>
            <HeroGlyphs />
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span><b>None of these is the modern one.</b> A methodology is a bet about when you find things out, and a project decides which bet it can afford to make.</span>
            </p>
          </motion.div>
        </div>
      }
    >
      <ProjectMethodologiesLesson />
    </CoursePage>
  );
}
