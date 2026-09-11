import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import IntroToDBMSLesson from '../components/public/IntroToDBMSLesson';

// ─── /intro-to-dbms — MBI802 course intro, public and ungated ─────────────
// Built on Blend, the Blended Teaching Content course-page design system:
// see src/components/blend/README.md. This page supplies a hero, a nav list
// and the lesson body; the frame, theme and footer come from CoursePage.
//
// The hero leads with the hospital spreadsheet rather than a course blurb,
// because that is the thing a reader can act on straight away — and acting on
// it is the entire argument for why databases exist.
//
// Nothing here is pinned to a particular class, session or calendar day: when
// somebody reads this page has nothing to do with when a class runs.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'break', label: 'The problem' },
  { id: 'meaning', label: 'Data' },
  { id: 'course', label: 'The course' },
  { id: 'outline', label: 'Outline' },
  { id: 'preview', label: 'Preview' },
  { id: 'practice', label: "You'll build" },
  { id: 'resources', label: 'Resources' },
];

const HERO_ROWS = [
  ['1001', 'Alice Chen', '20', 'Auckland'],
  ['1002', 'Ben Kumar', '22', 'Wellington'],
  ['1003', 'Mia Tuilagi', '19', 'Hamilton'],
];

export default function IntroToDBMSPage() {
  return (
    <CoursePage
      courseCode="MBI802"
      courseName="Database Management Systems"
      nav={NAV}
      hero={
        <div className="bt-herogrid">
          <div>
            <motion.span
              className="bt-flag"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span className="bt-dot" style={{ background: 'var(--accent-500)' }} />
              Open to everyone · no login, no install
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.06 }}
            >
              A hospital keeps patients in a <span className="bt-stop">spreadsheet.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              Break it and you’ll see why databases exist. That’s roughly where MBI802 starts, and you can do
              it before you enrol. No account, nothing to install.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Yasas Sri Wickramasinghe, MBI802 lecturer · 15 credits, Level 8, no prerequisites
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
                onClick={() => document.getElementById('break')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Break the spreadsheet
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="bt-btn bt-btn--tertiary"
                onClick={() => document.getElementById('outline')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                See all eight lessons
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
            </motion.div>
          </div>

          {/* A real relational table, with the primary key called out — the
              thing the whole course is ultimately about. */}
          <motion.div
            className="bt-heroart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.18 }}
          >
            <span className="bt-heroart__lbl">school_db · students</span>
            <div className="bt-scroll">
              <table className="bt-grid">
                <thead>
                  <tr><th>student_id</th><th>name</th><th>age</th><th>city</th></tr>
                </thead>
                <tbody>
                  {HERO_ROWS.map(r => (
                    <tr key={r[0]}>
                      <td><span className="bt-pk">{r[0]}</span></td>
                      <td>{r[1]}</td>
                      <td className="bt-tnum">{r[2]}</td>
                      <td>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span><b>Primary key.</b> Unique, never NULL. It’s what makes a row findable, and by Lesson 3 you’ll be joining on it.</span>
            </p>
          </motion.div>
        </div>
      }
    >
      <IntroToDBMSLesson />
    </CoursePage>
  );
}
