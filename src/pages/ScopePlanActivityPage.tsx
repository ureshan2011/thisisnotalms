import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import ScopePlanActivityLesson from '../components/public/ScopePlanActivityLesson';

// ─── /scope-plan — MBI804 scope management plan, a 30-minute team activity ─
// Built on Blend (src/components/blend/README.md), on MBI804's plum. The body
// and the download link live in ScopePlanActivityLesson.tsx; the PDF itself is
// built by scripts/scope-plan-pdf/build.py.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'what', label: 'What it is' },
  { id: 'activity', label: 'Team activity' },
];

const SHAPE: [string, string][] = [
  ['0 to 4', 'Read the project, agree a summary'],
  ['4 to 5', 'Split the sections'],
  ['5 to 17', 'Write your own section'],
  ['17 to 25', 'Swap and check'],
  ['25 to 28', 'Fix what you found'],
  ['28 to 30', 'Say what you left out'],
];

export default function ScopePlanActivityPage() {
  return (
    <CoursePage
      accent="project"
      courseCode="MBI804"
      courseName="Write a scope management plan"
      nav={NAV}
      footerNote="Nothing on this page is tracked or collected. No login required to read it."
      hero={
        <div className="bt-herogrid">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.06 }}
            >
              Write a scope plan, as a team
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              A 30-minute team activity. You get a small IT project, a template, and half an hour to
              write a rough scope management plan. Then you find out what is wrong with it.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Yasas Sri Wickramasinghe, MBI804 lecturer
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
                onClick={() => document.getElementById('what')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Start here
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="bt-btn bt-btn--tertiary"
                onClick={() => document.getElementById('activity')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Jump to the activity
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
            <span className="bt-heroart__lbl">The 30 minutes</span>
            <table className="bt-plaintable">
              <tbody>
                {SHAPE.map(([time, what]) => (
                  <tr key={time}>
                    <td>{time}</td>
                    <td>{what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      }
    >
      <ScopePlanActivityLesson />
    </CoursePage>
  );
}
