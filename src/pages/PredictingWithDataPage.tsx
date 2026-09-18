import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import PredictingWithDataLesson from '../components/public/PredictingWithDataLesson';

// ─── /predicting-with-data — MBI806B, public and ungated ──────────────────
// Built on Blend (src/components/blend/README.md), on MBI806B's teal.
// The lesson itself, and who it is written for, is documented at the top of
// PredictingWithDataLesson.tsx.
//
// The hero draws the three models on the same handful of dots rather than
// describing them: a line through the cloud, a pair of straight cuts across
// it, and the same cuts drawn many times over faintly. Three pictures, one
// dataset, and the reader can see before reading a word that these are three
// different shapes of answer to the same question.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'what', label: '3.1 What a model is' },
  { id: 'line', label: '3.2 The line' },
  { id: 'tree', label: '3.3 The tree' },
  { id: 'forest', label: '3.4 The forest' },
  { id: 'which', label: '3.5 Which one' },
  { id: 'code', label: '3.6 The code' },
  { id: 'play', label: '3.7 Python' },
  { id: 'check', label: 'Check yourself' },
];

// One small cloud of points, drawn three ways. Coordinates are in the 0–100
// box each panel maps into, so all three panels show the same dots.
const CLOUD: [number, number][] = [
  [10, 78], [20, 70], [26, 60], [34, 62], [40, 50],
  [48, 44], [55, 46], [62, 32], [70, 28], [78, 20],
  [84, 26], [92, 12],
];

const PANEL = 150;
const INSET = 16;
const at = (v: number) => INSET + (v / 100) * (PANEL - INSET * 2);

function Panel({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div>
      <svg viewBox={`0 0 ${PANEL} ${PANEL}`} width="100%" style={{ display: 'block' }} aria-hidden="true">
        <rect
          x="1"
          y="1"
          width={PANEL - 2}
          height={PANEL - 2}
          rx="14"
          fill="var(--paper-50)"
          stroke="var(--border-subtle)"
        />
        {children}
        {CLOUD.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={at(cx)} cy={at(cy)} r="3.4" fill="var(--ink-900)" />
        ))}
      </svg>
      <p
        style={{
          marginTop: 9,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--ink-400)',
          textAlign: 'center',
        }}
      >
        {caption}
      </p>
    </div>
  );
}

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
              A rule nobody wrote down<span className="bt-stop">.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              Linear regression, decision trees and random forests — the three models that do most of the work in
              business analytics. Fit a line by hand, grow a tree until it breaks, watch nine trees outvote the best
              one among them, then run real Python without installing a thing.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Yasas Sri Wickramasinghe, MBI806B lecturer · written for people who have never opened a data tool
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
                onClick={() => document.getElementById('play')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Take me to the Python
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
            <span className="bt-heroart__lbl">One set of dots · three kinds of rule</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10, marginTop: 14 }}>
              <Panel caption="a line">
                <line
                  x1={at(4)}
                  y1={at(78)}
                  x2={at(96)}
                  y2={at(14)}
                  stroke="var(--accent-500)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </Panel>

              <Panel caption="straight cuts">
                <line x1={at(46)} y1={at(0)} x2={at(46)} y2={at(100)} stroke="var(--accent-500)" strokeWidth="2.5" />
                <line x1={at(46)} y1={at(46)} x2={at(100)} y2={at(46)} stroke="var(--accent-500)" strokeWidth="2.5" />
              </Panel>

              <Panel caption="a great many cuts">
                {[38, 42, 46, 50, 54, 58].map(v => (
                  <line key={`v${v}`} x1={at(v)} y1={at(0)} x2={at(v)} y2={at(100)} stroke="var(--accent-300)" strokeWidth="1.4" opacity="0.6" />
                ))}
                {[38, 44, 46, 52, 58].map(h => (
                  <line key={`h${h}`} x1={at(40)} y1={at(h)} x2={at(100)} y2={at(h)} stroke="var(--accent-300)" strokeWidth="1.4" opacity="0.6" />
                ))}
              </Panel>
            </div>
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span>
                <b>The dots never change.</b> What changes is the shape of rule you allow — one straight line, a few
                straight cuts, or hundreds of sets of cuts that then vote on the answer.
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
