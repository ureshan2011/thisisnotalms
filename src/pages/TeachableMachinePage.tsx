import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import TeachableMachineLesson from '../components/public/TeachableMachineLesson';

// ─── /teachable-machine — meeting Google's Teachable Machine ──────────────
// Built on Blend (src/components/blend/README.md), on MBI800's own indigo
// accent. Not affiliated with or endorsed by Google — an independent
// look at a real, external tool, written for MBI800 (Strategic Information
// System Planning) students.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'what', label: 'What it is' },
  { id: 'why', label: 'Why it matters' },
  { id: 'train', label: 'Try it here' },
  { id: 'tutorial', label: 'Build the real thing' },
  { id: 'scenarios', label: 'Scenarios' },
  { id: 'limits', label: 'Fine print' },
  { id: 'links', label: 'Links' },
];

const PREVIEW: [string, number][] = [['Rock', 6], ['Paper', 9], ['Scissors', 85]];

export default function TeachableMachinePage() {
  return (
    <CoursePage
      accent="strategy"
      courseCode="MBI800"
      courseName="Meeting Teachable Machine"
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
              Train an AI by <span className="bt-stop">showing it.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              Teachable Machine is a free tool from Google that builds a working image, sound or pose classifier
              from examples you give it — trained right there in your browser, no coding and no account required
              to start.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Yasas Sri Wickramasinghe, MBI800 lecturer · an independent look at a tool made by Google, not
              affiliated with or endorsed by Google
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
                onClick={() => document.getElementById('train')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Try the trainer below
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <a
                className="bt-btn bt-btn--tertiary"
                href="https://teachablemachine.withgoogle.com/"
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                Open the real site
                <span className="bt-btn__badge" aria-hidden="true">↗</span>
              </a>
            </motion.div>
          </div>

          <motion.div
            className="bt-heroart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.18 }}
          >
            <span className="bt-heroart__lbl">What a trained guess looks like</span>
            <div className="bt-minichart">
              {PREVIEW.map(([item, value], i) => (
                <div className="bt-minichart__row" key={item}>
                  <span className="bt-minichart__name">{item}</span>
                  <span className="bt-minichart__track">
                    <motion.i
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.7, ease: EASE, delay: 0.5 + i * 0.09 }}
                      style={{ background: i === 2 ? 'var(--accent-500)' : 'var(--accent-200)' }}
                    />
                  </span>
                  <span className="bt-minichart__val bt-tnum">{value}%</span>
                </div>
              ))}
            </div>
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span><b>Three percentages that add up to one guess.</b> The trainer below lets you build this yourself, from nothing.</span>
            </p>
          </motion.div>
        </div>
      }
    >
      <TeachableMachineLesson />
    </CoursePage>
  );
}
