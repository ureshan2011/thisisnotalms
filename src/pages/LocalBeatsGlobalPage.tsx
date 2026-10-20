import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import LocalBeatsGlobalLesson from '../components/public/LocalBeatsGlobalLesson';

// ─── /local-beats-global — MBI800 ──────────────────────────────────────────
// Built on Blend (src/components/blend/README.md), on MBI800's indigo, next
// to /threats-to-strategy. The lesson itself is documented at the top of
// LocalBeatsGlobalLesson.tsx.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'lenses', label: 'Six lenses' },
  { id: 'cases', label: 'The giants' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'locals', label: 'The locals' },
  { id: 'system', label: 'The system' },
  { id: 'try', label: 'Your turn' },
];

const SCORE: [string, string, string][] = [
  ['eBay', 'Taobao', 'China'],
  ['Uber', 'Grab', 'SE Asia'],
  ['Walmart', 'Aldi', 'Germany'],
  ['Amazon', 'Tmall', 'China'],
  ['McDonald’s', 'Jollibee', 'Philippines'],
  ['eBay', 'Trade Me', 'New Zealand'],
];

export default function LocalBeatsGlobalPage() {
  return (
    <CoursePage
      accent="planning"
      courseCode="MBI800"
      courseName="When the Local Wins"
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
              Big at home. Lost <span className="bt-stop">abroad.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              Walmart, Uber, eBay, Amazon and Starbucks all walked into a new market and walked
              back out. Not because of money or technology. Because of how people there pay, eat,
              shop, believe and trust.
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
                onClick={() => document.getElementById('lenses')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
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
            <span className="bt-heroart__lbl">Who won the home market</span>
            <ul className="lbg-score">
              {SCORE.map(([giant, local, where]) => (
                <li key={`${giant}-${where}`}>
                  <s>{giant}</s>
                  <span className="lbg-score__arrow" aria-label="lost the home market to">→</span>
                  <b>{local}</b>
                  <span className="lbg-score__where">{where}</span>
                </li>
              ))}
            </ul>
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span><b>Why did the local win?</b> That’s the question for today.</span>
            </p>
          </motion.div>
        </div>
      }
    >
      <LocalBeatsGlobalLesson />
    </CoursePage>
  );
}
