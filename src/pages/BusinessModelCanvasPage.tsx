import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import BusinessModelCanvasLesson from '../components/public/BusinessModelCanvasLesson';

// ─── /business-model-canvas — MBI800, Lesson 5 of 11 ──────────────────────
// Built on Blend (src/components/blend/README.md), on MBI800's indigo, next
// to /intro-to-sisp. The lesson itself is documented at the top of
// BusinessModelCanvasLesson.tsx.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'what', label: 'What it is' },
  { id: 'blocks', label: 'The nine blocks' },
  { id: 'example', label: 'Worked example' },
  { id: 'activity', label: 'Group activity' },
  { id: 'present', label: 'Present it' },
];

export default function BusinessModelCanvasPage() {
  return (
    <CoursePage
      accent="planning"
      courseCode="MBI800"
      courseName="The Business Model Canvas"
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
              One page, nine <span className="bt-stop">questions.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              How a business model actually works, laid out on one page. Then a 90-minute group
              activity: six people, one real business idea, a canvas filled by hand.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Yasas Sri Wickramasinghe, MBI800 lecturer
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
            <span className="bt-heroart__lbl">The 90-minute activity</span>
            <div className="bt-minichart">
              {([['Form up, pick an idea', 15], ['Build the canvas', 50], ['Present and wrap up', 25]] as [string, number][]).map(([item, value], i) => (
                <div className="bt-minichart__row" key={item}>
                  <span className="bt-minichart__name">{item}</span>
                  <span className="bt-minichart__track">
                    <motion.i
                      initial={{ width: 0 }}
                      animate={{ width: `${(value / 50) * 100}%` }}
                      transition={{ duration: 0.7, ease: EASE, delay: 0.5 + i * 0.09 }}
                      style={{ background: i === 1 ? 'var(--accent-500)' : 'var(--accent-200)' }}
                    />
                  </span>
                  <span className="bt-minichart__val bt-tnum">{value} min</span>
                </div>
              ))}
            </div>
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span><b>90 minutes, start to finish.</b> Six people, one real business idea, a canvas filled in by hand.</span>
            </p>
          </motion.div>
        </div>
      }
    >
      <BusinessModelCanvasLesson />
    </CoursePage>
  );
}
