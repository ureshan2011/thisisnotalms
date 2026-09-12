import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import IntroToProjectManagementLesson from '../components/public/IntroToProjectManagementLesson';

// ─── /intro-to-project-management — MBI804 Lesson 1, public ───────────────
// Built on Blend, the Blended Teaching Content course-page design system
// (src/components/blend/README.md), running on MBI804's plum through the
// `project` accent.
//
// The page is the course's actual first lesson: objectives, five numbered
// teaching sections, a knowledge check and a recap, with everything after
// that labelled as what comes next. The hero is one real schedule rather
// than a course blurb — four phases of the SecurePay NZ integration used
// throughout the cost-management lecture, with the middle phase at nearly
// twice its plan. Section 1.3 then hands the reader that same schedule and
// lets them find out which delays the launch date actually cares about.
//
// Lesson 1 is a position in a sequence, not a day in a term. Nothing here is
// pinned to a calendar date, because when somebody reads this page has
// nothing to do with when a class runs.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'project', label: '1.1 What a project is' },
  { id: 'constraints', label: '1.2 The triangle' },
  { id: 'slip', label: '1.3 Delay' },
  { id: 'methods', label: '1.4 Methodology' },
  { id: 'risk', label: '1.5 Risk' },
  { id: 'yours', label: '1.6 Your turn' },
  { id: 'check', label: 'Check yourself' },
  { id: 'ahead', label: "What's next" },
  { id: 'course', label: 'The course' },
  { id: 'prepared', label: 'Come prepared' },
];

// Weeks actually taken, against a plan of 3 / 6 / 4 / 2. Integration is the
// one that ran, which is why it carries the accent.
const HERO_ROWS: [string, number, boolean][] = [
  ['Discovery', 3, false],
  ['Integration', 11, true],
  ['Testing', 4, false],
  ['Handover', 2, false],
];
const HERO_MAX = 12;

export default function IntroToProjectManagementPage() {
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
              On time, on budget, still <span className="bt-stop">wrong.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              A project can hit every date and every dollar and still be run the wrong way for what it was. This is
              Lesson 1 of MBI804: what is really fixed, what a delay actually costs, and which methodology the
              project’s own attributes call for. Open it before the first class.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Yasas Sri Wickramasinghe, MBI804 lecturer · 15 credits, Level 8 · prerequisites MBI800 and MBI801
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
                onClick={() => document.getElementById('project')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Start Lesson 1
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="bt-btn bt-btn--tertiary"
                onClick={() => document.getElementById('slip')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                See what this delay cost
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
            </motion.div>
          </div>

          {/* The schedule the whole page argues about: one phase at nearly
              twice its plan, on a project that was estimated carefully. */}
          <motion.div
            className="bt-heroart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.18 }}
          >
            <span className="bt-heroart__lbl">SecurePay NZ · weeks actually taken</span>
            <div className="bt-minichart">
              {HERO_ROWS.map(([phase, weeks, over], i) => (
                <div className="bt-minichart__row" key={phase}>
                  <span className="bt-minichart__name">{phase}</span>
                  <span className="bt-minichart__track">
                    <motion.i
                      initial={{ width: 0 }}
                      animate={{ width: `${(weeks / HERO_MAX) * 100}%` }}
                      transition={{ duration: 0.7, ease: EASE, delay: 0.5 + i * 0.09 }}
                      style={{ background: over ? 'var(--accent-500)' : 'var(--accent-200)' }}
                    />
                  </span>
                  <span className="bt-minichart__val bt-tnum">{weeks}</span>
                </div>
              ))}
            </div>
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span><b>Integration was planned at six weeks.</b> The estimate was not wrong by five. The method was wrong for a scope the client had not finished deciding.</span>
            </p>
          </motion.div>
        </div>
      }
    >
      <IntroToProjectManagementLesson />
    </CoursePage>
  );
}
