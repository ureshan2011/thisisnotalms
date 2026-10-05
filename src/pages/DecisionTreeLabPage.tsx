import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import DecisionTreeLabLesson from '../components/public/DecisionTreeLabLesson';
import { HeroPath } from '../components/public/tree/DepthWidgets';
import { CountdownStrip } from '../components/public/lab/Countdown';
import { DT_DEADLINE } from '../components/public/tree/deadline';
import '../styles/tree-lab.css';

// ─── /decision-tree-lab — MBI806B, public and ungated ─────────────────────
// Built on Blend (src/components/blend/README.md), on MBI806B's teal, as a
// sibling of /linear-regression-lab. What the lab is and how it was put
// together is at the top of DecisionTreeLabLesson.tsx.
//
// The hero shows where the student ends up: the one path through the
// finished tree that says "leaves", a question at a time.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'brief', label: 'The job' },
  { id: 'step-find', label: '1 Find' },
  { id: 'step-card', label: '2 Data card' },
  { id: 'step-download', label: '3 Download' },
  { id: 'step-colab', label: '4 Colab' },
  { id: 'step-explore', label: '5 Explore' },
  { id: 'step-clean', label: '6 Clean' },
  { id: 'step-model', label: '7 Tree' },
  { id: 'step-predict', label: '8 Predict' },
  { id: 'limits', label: 'Limits' },
  { id: 'step-report', label: '9 Report' },
  { id: 'check', label: 'Quiz' },
  { id: 'help', label: 'Stuck?' },
];

export default function DecisionTreeLabPage() {
  return (
    <CoursePage
      accent="analytics"
      courseCode="MBI806B"
      courseName="Business Data Analytics with AI and ML"
      nav={NAV}
      footerNote="Nothing on this page is tracked or collected. Your checklist ticks stay in your own browser."
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
              Hands-on lab · real data
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.06 }}
            >
              Who is about to cancel<span className="bt-stop">?</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              Download 7,043 phone and internet customers from Kaggle, find the dirty data hiding in them, and grow a
              decision tree in Google Colab that tells a retention team exactly who to call. Then post a short report as
              a reply to my Teams announcement.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Yasas Sri Wickramasinghe, MBI806B lecturer · about two hours · a laptop and a Google account
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
                onClick={() => document.getElementById('brief')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Start the lab
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="bt-btn bt-btn--tertiary"
                onClick={() => document.getElementById('step-report')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                What to hand in
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.38 }}
            >
              <CountdownStrip deadline={DT_DEADLINE} />
            </motion.div>
          </div>

          <motion.div
            className="bt-heroart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.18 }}
          >
            <span className="bt-heroart__lbl">The rule you'll find</span>
            <HeroPath />
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span>
                <b>Three questions, one answer.</b> Your tree will find this rule in 5,634 customers, and you'll have
                spotted most of it yourself before it does.
              </span>
            </p>
          </motion.div>
        </div>
      }
    >
      <DecisionTreeLabLesson />
    </CoursePage>
  );
}
