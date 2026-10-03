import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import LinearRegressionLabLesson from '../components/public/LinearRegressionLabLesson';
import { HeroBands } from '../components/public/regression/BandsChart';

// ─── /linear-regression-lab — MBI806B, public and ungated ─────────────────
// Built on Blend (src/components/blend/README.md), on MBI806B's teal. What
// the lab is and how it was put together is at the top of
// LinearRegressionLabLesson.tsx.
//
// The hero shows where the student ends up: the real dataset, thinned out,
// with the finished model's two lines drawn through it. The same picture
// comes back, at full size and interactive, at the end of step 6.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'brief', label: 'The job' },
  { id: 'step-find', label: '1 Find' },
  { id: 'step-card', label: '2 Data card' },
  { id: 'step-download', label: '3 Download' },
  { id: 'step-colab', label: '4 Colab' },
  { id: 'step-explore', label: '5 Explore' },
  { id: 'step-clean', label: '6 Clean' },
  { id: 'step-model', label: '7 Model' },
  { id: 'step-predict', label: '8 Predict' },
  { id: 'limits', label: 'Limits' },
  { id: 'step-report', label: '9 Report' },
  { id: 'check', label: 'Quiz' },
  { id: 'help', label: 'Stuck?' },
];

export default function LinearRegressionLabPage() {
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
              What makes a medical bill bigger<span className="bt-stop">?</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              Download 1,338 real insurance records from Kaggle, check and clean them in Google Colab, train a linear
              regression model, and use it to predict a new customer's bill. Then send me a short report in Teams.
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
          </div>

          <motion.div
            className="bt-heroart lr-hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.18 }}
          >
            <span className="bt-heroart__lbl">Where you'll end up</span>
            <HeroBands />
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span>
                <b>Two lines, $23,043 apart.</b> That gap is the biggest single thing your model will find, and you'll
                see it in the data before the model does.
              </span>
            </p>
          </motion.div>
        </div>
      }
    >
      <LinearRegressionLabLesson />
    </CoursePage>
  );
}
