import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import ThreatsToStrategyLesson from '../components/public/ThreatsToStrategyLesson';

// ─── /threats-to-strategy — MBI800 ─────────────────────────────────────────
// Built on Blend (src/components/blend/README.md), on MBI800's indigo, next
// to /business-model-canvas. The lesson itself is documented at the top of
// ThreatsToStrategyLesson.tsx.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'flip', label: 'The flip' },
  { id: 'cases', label: 'Real companies' },
  { id: 'endings', label: 'Two endings' },
  { id: 'sisp', label: 'Where it fits' },
  { id: 'try', label: 'Your turn' },
];

export default function ThreatsToStrategyPage() {
  return (
    <CoursePage
      accent="planning"
      courseCode="MBI800"
      courseName="Threats to Strategy"
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
              Turn the threat into the <span className="bt-stop">plan.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              Every threat has a customer need hiding inside it. Find the need, and you've found
              your next strategy. Here's how real companies did it.
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
                onClick={() => document.getElementById('flip')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Start here
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="bt-btn bt-btn--tertiary"
                onClick={() => document.getElementById('try')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Jump to your turn
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
            <span className="bt-heroart__lbl">The whole lesson, in three words</span>
            <div className="tos-herostack">
              <div className="tos-herostack__row tos-herostack__row--t">
                <span className="tos-herostack__n">01</span>
                <span className="tos-herostack__w">Threat</span>
              </div>
              <span className="tos-herostack__arrow" aria-hidden="true">↓</span>
              <div className="tos-herostack__row tos-herostack__row--o">
                <span className="tos-herostack__n">02</span>
                <span className="tos-herostack__w">Opportunity</span>
              </div>
              <span className="tos-herostack__arrow" aria-hidden="true">↓</span>
              <div className="tos-herostack__row tos-herostack__row--s">
                <span className="tos-herostack__n">03</span>
                <span className="tos-herostack__w">Strategy</span>
              </div>
            </div>
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span><b>How does the business capitalise on its threats?</b> That's the only question today.</span>
            </p>
          </motion.div>
        </div>
      }
    >
      <ThreatsToStrategyLesson />
    </CoursePage>
  );
}
