import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import FirstERDiagramsLesson, { PdfDownloads } from '../components/public/FirstERDiagramsLesson';
import ChenDiagram from '../components/public/er/ChenDiagram';
import { HERO_DIAGRAM } from '../components/public/er/firstTasks';

// ─── /er-first-steps — MBI802, public and ungated ─────────────────────────
// Built on Blend (src/components/blend/README.md), on MBI802's warm orange.
// The lesson itself is described at the top of FirstERDiagramsLesson.tsx.
// The hero shows part of Task 1's answer, drawn by the same renderer as the
// answers further down.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'start', label: 'Start' },
  { id: 'shapes', label: 'Notation' },
  { id: 'method', label: 'Steps' },
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
              ER diagram <span className="bt-stop">tutorial.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              Five practice tasks for students who are new to ER diagrams, based on a bank, a university and a
              hospital. For each one, identify the entities, attributes and relationships, then draw the diagram in
              Chen’s notation. Answers are included.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Yasas Sri Wickramasinghe, MBI802 lecturer · Two simple tasks, three moderate tasks
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
                Start the tutorial
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <PdfDownloads tertiary />
            </motion.div>
          </div>

          <motion.div
            className="bt-heroart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.18 }}
          >
            <span className="bt-heroart__lbl">Part of the Task 1 answer</span>
            <div className="erf-hero">
              <ChenDiagram
                spec={HERO_DIAGRAM}
                label="A small Chen ER diagram: CUSTOMER, with key CustomerID and FirstName, OWNS ACCOUNT, with key AccountNumber and Balance. 1 next to CUSTOMER, N next to ACCOUNT."
              />
            </div>
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span><b>Read as:</b> one customer owns many accounts, and each account belongs to one customer.</span>
            </p>
          </motion.div>
        </div>
      }
    >
      <FirstERDiagramsLesson />
    </CoursePage>
  );
}
