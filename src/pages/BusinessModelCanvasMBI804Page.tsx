import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import BusinessModelCanvasMBI804Lesson from '../components/public/BusinessModelCanvasMBI804Lesson';

// ─── /business-model-canvas-mbi804 — MBI804's copy of the canvas lesson ───
// Built on Blend (src/components/blend/README.md), on MBI804's plum. A
// duplicate of BusinessModelCanvasPage.tsx (MBI800, at /business-model-
// canvas) with the course code and accent renamed — see the top of
// BusinessModelCanvasMBI804Lesson.tsx for why the two pages are kept
// separate rather than sharing one parameterised component.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'what', label: 'What it is' },
  { id: 'blocks', label: 'The nine blocks' },
  { id: 'example', label: 'Worked example' },
  { id: 'activity', label: 'Group activity' },
];

export default function BusinessModelCanvasMBI804Page() {
  return (
    <CoursePage
      accent="project"
      courseCode="MBI804"
      courseName="The Business Model Canvas"
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
              Business Model Canvas
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              A simple way to describe how a business creates value, in nine blocks on one page.
              Then a 90-minute group activity: six people, one IT business idea, a canvas filled
              in digitally and presented to the class.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Yasas Sri Wickramasinghe, MBI804 lecturer
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
                Start here
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="bt-btn bt-btn--tertiary"
                onClick={() => document.getElementById('activity')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Jump to the activity
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
            <span className="bt-heroart__lbl">The 90-minute activity</span>
            <div className="bmc-mini">
              <div style={{ gridColumn: 1, gridRow: '1 / span 2' }}>KP</div>
              <div style={{ gridColumn: 2, gridRow: 1 }}>KA</div>
              <div className="bmc-mini__vp" style={{ gridColumn: 3, gridRow: '1 / span 2' }}>VALUE</div>
              <div style={{ gridColumn: 4, gridRow: 1 }}>CR</div>
              <div style={{ gridColumn: 5, gridRow: '1 / span 2' }}>CS</div>
              <div style={{ gridColumn: 2, gridRow: 2 }}>KR</div>
              <div style={{ gridColumn: 4, gridRow: 2 }}>CH</div>
            </div>
            <div className="bmc-mini-bottom">
              <div>COST STRUCTURE</div>
              <div>REVENUE STREAMS</div>
            </div>
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span><b>90 minutes, start to finish.</b> Six people, one IT business idea, a canvas filled in digitally.</span>
            </p>
          </motion.div>
        </div>
      }
    >
      <BusinessModelCanvasMBI804Lesson />
    </CoursePage>
  );
}
