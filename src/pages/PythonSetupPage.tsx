import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import PythonSetupLesson from '../components/public/PythonSetupLesson';

// ─── /python-setup — Google Colab, no install, for Mac and Windows alike ──
// Built on Blend (src/components/blend/README.md), on MBI806B's teal, next
// to /power-bi-setup. The guide itself is documented at the top of
// PythonSetupLesson.tsx.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'why', label: 'Why Colab' },
  { id: 'open', label: 'Open it' },
  { id: 'hello', label: 'Hello, World' },
  { id: 'next', label: "What's next" },
  { id: 'help', label: 'Stuck?' },
];

export default function PythonSetupPage() {
  return (
    <CoursePage
      accent="analytics"
      courseCode="MBI806B"
      courseName="Setting up Python"
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
              Your first line of Python, in <span className="bt-stop">two minutes.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              No installing. No downloads. Works the same on Mac and Windows. We use Google Colab —
              free notebooks that run in your browser.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Yasas Sri Wickramasinghe, MBI806B lecturer
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
                onClick={() => document.getElementById('open')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Start here
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="bt-btn bt-btn--tertiary"
                onClick={() => document.getElementById('hello')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Skip to Hello World
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
            </motion.div>
          </div>

          {/* What you are aiming for: one line of code and its answer. */}
          <motion.div
            className="bt-heroart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.18 }}
          >
            <span className="bt-heroart__lbl">What you'll have typed</span>
            <div
              style={{
                marginTop: 14,
                background: 'var(--ink-900)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                fontFamily: 'var(--font-mono)',
                fontSize: 13.5,
              }}
            >
              <span style={{ color: '#ede6e2' }}>print(</span>
              <span style={{ color: 'var(--accent-300)' }}>"Hello, World!"</span>
              <span style={{ color: '#ede6e2' }}>)</span>
            </div>
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span><b>One line, one button.</b> Everything else in the course starts from this same notebook.</span>
            </p>
          </motion.div>
        </div>
      }
    >
      <PythonSetupLesson />
    </CoursePage>
  );
}
