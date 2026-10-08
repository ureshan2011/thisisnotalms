import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import FirstERDiagramsLesson from '../components/public/FirstERDiagramsLesson';
import ChenDiagram from '../components/public/er/ChenDiagram';
import { HERO_DIAGRAM } from '../components/public/er/firstTasks';

// ─── /er-first-steps — MBI802, public and ungated ─────────────────────────
// Built on Blend (src/components/blend/README.md), on MBI802's warm orange.
// The lesson itself is documented at the top of FirstERDiagramsLesson.tsx.
//
// The hero shows where a student will be ten minutes from now: Task 1's
// answer, cut down to two attributes a side, drawn by the same renderer as
// every answer on the page.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'start', label: 'Start' },
  { id: 'shapes', label: 'Shapes' },
  { id: 'method', label: 'Routine' },
  { id: 'task1', label: 'Task 1' },
  { id: 'task2', label: 'Task 2' },
  { id: 'task3', label: 'Task 3' },
  { id: 'task4', label: 'Task 4' },
  { id: 'task5', label: 'Task 5' },
  { id: 'mistakes', label: 'Mistakes' },
  { id: 'check', label: 'Check' },
];

export default function FirstERDiagramsPage() {
  return (
    <CoursePage
      courseCode="MBI802"
      courseName="Database Management Systems"
      nav={NAV}
      footerNote="Nothing on this page is tracked or saved. No login, no personal data collected."
      hero={
        <div className="bt-herogrid">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.06 }}
            >
              Your first ER diagram, step by <span className="bt-stop">step.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              Never drawn one before? Good. This page is for you. Five short stories from a bank, a university and a
              hospital. Read each one, find the pieces, and draw it. The answers are here when you’re ready.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Yasas Sri Wickramasinghe, MBI802 lecturer · Practice for ER diagram foundations · Chen’s notation
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
                onClick={() => document.getElementById('start')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Start from the beginning
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="bt-btn bt-btn--tertiary"
                onClick={() => document.getElementById('task1')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Go straight to Task 1
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
            <span className="bt-heroart__lbl">Where you’ll be in ten minutes</span>
            <div className="erf-hero">
              <ChenDiagram
                spec={HERO_DIAGRAM}
                label="A small Chen ER diagram: CUSTOMER, with key CustomerID and FirstName, OWNS ACCOUNT, with key AccountNumber and Balance. 1 beside CUSTOMER, N beside ACCOUNT."
              />
            </div>
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span><b>Read it out loud:</b> one customer owns many accounts. If you can say it, you can draw it.</span>
            </p>
          </motion.div>
        </div>
      }
    >
      <FirstERDiagramsLesson />
    </CoursePage>
  );
}
