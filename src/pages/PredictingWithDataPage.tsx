import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import PredictingWithDataLesson from '../components/public/PredictingWithDataLesson';
import ModelShapes from '../components/public/ml/ModelShapes';

// ─── /predicting-with-data — MBI806B, public and ungated ──────────────────
// Built on Blend (src/components/blend/README.md), on MBI806B's teal. Who
// the lesson is for, and how it is pitched, is at the top of
// PredictingWithDataLesson.tsx.
//
// The hero shows all three models on the same dots before naming any of
// them. The same picture comes back at the end with the names attached, so
// it has a chance of being the thing somebody remembers a month later.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'what', label: 'What is a model' },
  { id: 'line', label: '1. Regression' },
  { id: 'tree', label: '2. Tree' },
  { id: 'forest', label: '3. Forest' },
  { id: 'which', label: 'Which one' },
  { id: 'code', label: 'The code' },
  { id: 'check', label: 'Quiz' },
];

export default function PredictingWithDataPage() {
  return (
    <CoursePage
      accent="analytics"
      courseCode="MBI806B"
      courseName="Business Data Analytics with AI and ML"
      nav={NAV}
      footerNote="Everything on this page, including the Python, runs in your own browser. No login, nothing installed, nothing collected."
      hero={
        <div className="bt-herogrid">
          <div>
            <motion.span
              className="bt-flag"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span className="bt-dot" style={{ background: 'var(--accent-500)', width: 6, height: 6, borderRadius: 999, display: 'inline-block' }} />
              No maths, no setup
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.06 }}
            >
              Three ways to predict things<span className="bt-stop">.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              Linear regression, decision trees and random forests. You will try all three by hand, then run them in
              real Python without installing anything. No maths needed.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Yasas Sri Wickramasinghe, MBI806B lecturer · for people who have never opened a data tool
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
                Start the lesson
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="bt-btn bt-btn--tertiary"
                onClick={() => document.getElementById('code')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Skip to the Python
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
            <span className="bt-heroart__lbl">The same dots, three times</span>
            <div style={{ marginTop: 14 }}>
              <ModelShapes captions={['one line', 'a few straight cuts', 'hundreds of cuts, voting']} />
            </div>
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span>
                <b>The dots never change.</b> All that changes is the shape of the rule you let the computer draw.
              </span>
            </p>
          </motion.div>
        </div>
      }
    >
      <PredictingWithDataLesson />
    </CoursePage>
  );
}
