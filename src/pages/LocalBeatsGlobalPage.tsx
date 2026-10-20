import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import LocalBeatsGlobalLesson from '../components/public/LocalBeatsGlobalLesson';
import { Frieze } from '../components/public/abroad/Art';

// ─── /local-beats-global — MBI800 ──────────────────────────────────────────
// Built on Blend (src/components/blend/README.md), on MBI800's indigo, next
// to /threats-to-strategy. The hero is an airport departures board for the
// giants, over a frieze of the nine landmarks the lesson visits. The lesson
// itself is documented at the top of LocalBeatsGlobalLesson.tsx.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'declare', label: 'Before you fly' },
  { id: 'route', label: 'The route' },
  { id: 'stops', label: 'Nine stops' },
  { id: 'timeline', label: 'Time in market' },
  { id: 'system', label: 'The system' },
  { id: 'try', label: 'Your turn' },
];

// Departed in the first year, came home in the second.
const BOARD: [string, string, string, string][] = [
  ['1997', 'Walmart', 'Germany', 'Home 2006'],
  ['2000', 'Starbucks', 'Australia', 'Cut back 2008'],
  ['2003', 'eBay', 'China', 'Home 2006'],
  ['2004', 'Amazon', 'China', 'Home 2019'],
  ['2006', 'Home Depot', 'China', 'Home 2012'],
  ['2013', 'Uber', 'SE Asia', 'Sold 2018'],
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
        <>
          <div className="bt-herogrid">
            <div>
              <motion.p
                className="lbg-hero__kicker"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                A trip through nine markets
              </motion.p>
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
                  onClick={() => document.getElementById('declare')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                >
                  Start the trip
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
              className="lbg-board"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: EASE, delay: 0.18 }}
            >
              <div className="lbg-board__head">
                <span>Departures</span>
                <span className="lbg-board__sub">Global giants</span>
              </div>
              <table className="lbg-board__table">
                <thead>
                  <tr><th scope="col">Year</th><th scope="col">Giant</th><th scope="col">To</th><th scope="col">Status</th></tr>
                </thead>
                <tbody>
                  {BOARD.map(([year, giant, to, status]) => (
                    <tr key={`${giant}-${to}`}>
                      <td><span className="lbg-flap bt-tnum">{year}</span></td>
                      <td><span className="lbg-flap">{giant}</span></td>
                      <td><span className="lbg-flap">{to}</span></td>
                      <td><span className="lbg-flap lbg-flap--status">{status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="lbg-board__foot">Why did the local win? That’s the question for today.</p>
            </motion.div>
          </div>

          <motion.div
            className="lbg-pano"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.36 }}
          >
            <Frieze />
          </motion.div>
        </>
      }
    >
      <LocalBeatsGlobalLesson />
    </CoursePage>
  );
}
