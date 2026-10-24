import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import APAReferencingLesson from '../components/public/APAReferencingLesson';

// ─── /apa-referencing — MBI800 reference lesson, public and passwordless ──
// Built on Blend (src/components/blend/README.md), on MBI800's indigo through
// the `planning` accent. The body lives in APAReferencingLesson.tsx. It used to
// be a password-gated slide deck; the password is gone along with the deck.
//
// The hero object is the lesson's own core idea: one reference entry split into
// the four parts every entry is built from.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'why', label: '1 Why cite' },
  { id: 'when', label: '2 When to cite' },
  { id: 'intext', label: '3 In-text' },
  { id: 'quotes', label: '4 Quotes' },
  { id: 'reference', label: '5 Reference list' },
  { id: 'mistakes', label: '6 Mistakes' },
  { id: 'check', label: 'Check yourself' },
];

const FOUR_PARTS: [string, string][] = [
  ['Who', 'Slater, M.'],
  ['When', '(2009).'],
  ['What', 'Place illusion and plausibility…'],
  ['Where', 'Philosophical Transactions…, 364(1535), 3549–3557. https://doi.org/…'],
];

export default function APAReferencingPage() {
  return (
    <CoursePage
      accent="planning"
      courseCode="MBI800"
      courseName="Strategic Information Systems Planning"
      nav={NAV}
      footerNote="Nothing on this page is tracked or collected. No login, no password."
      hero={
        <div className="bt-herogrid">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.06 }}
            >
              Every claim needs a <span className="bt-stop">source.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              APA 7 from the first in-text citation to the last reference entry, with worked examples you can
              tap through and an eight-question check at the end. Every assignment in the course needs it, and
              the page opens for anybody: no password, no login.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Yasas Sri Wickramasinghe, MBI800 lecturer · 20 minutes
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
                onClick={() => document.getElementById('why')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Start the lesson
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="bt-btn bt-btn--tertiary"
                onClick={() => document.getElementById('check')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Jump to the check
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
            <span className="bt-heroart__lbl">One reference, four parts</span>
            <table className="bt-plaintable">
              <tbody>
                {FOUR_PARTS.map(([part, text]) => (
                  <tr key={part}>
                    <td>{part}</td>
                    <td>{text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      }
    >
      <APAReferencingLesson />
    </CoursePage>
  );
}
