import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { CoursePage } from '../components/blend';
import NormalisationSimpleLesson from '../components/public/NormalisationSimpleLesson';
import { EASE, PrintProvider, savePageAsPdf, usePrinting } from '../components/public/NormalisationSimpleParts';
import '../styles/normalisation-simple.css';

// ─── /normalisation-basics — MBI802, normalisation the simple way ─────────
// Built on Blend (src/components/blend/README.md) on MBI802's orange. The
// body is NormalisationSimpleLesson.tsx; its styles are scoped `ns-` in
// src/styles/normalisation-simple.css, which also holds the print rules that
// make "Save as PDF" come out as a proper document.
//
// The hero object is the whole lesson in one picture: the pizza shop's sheet
// as eight columns, coloured by what each depends on, then split into the
// four tables the page ends with. It plays once on load; there is a replay
// button, and no loop.

const NAV = [
  { id: 'why', label: '1 Why' },
  { id: 'plan', label: '2 The plan' },
  { id: 'first', label: '3 1NF' },
  { id: 'second', label: '4 2NF' },
  { id: 'third', label: '5 3NF' },
  { id: 'result', label: '6 Result' },
  { id: 'check', label: 'Check' },
  { id: 'pdf', label: 'Save as PDF' },
];

// ── The hero picture ─────────────────────────────────────────────────────
const W = 56; // one column strip
const HEAD = 24;
const CELL = 18;
const GAP = 3;

const FILL = {
  key: '#1a1615',
  order: '#1d4ed8',
  item: '#0e7c70',
  whole: '#a21caf',
  cust: '#b45309',
  plain: '#efd8c9',
};
type Tone = keyof typeof FILL;

interface Strip {
  id: string;
  label: string;
  tone: Tone;
  /** Column index in the one big sheet. */
  col: number;
  /** Where it ends up: [x, y] and how many rows its table has. */
  to: [number, number];
  rows: number;
  /** A copied key column: hidden under its original until the split. */
  copy?: boolean;
  /** Rows whose value is a repeat of a row above it. */
  repeats?: number[];
}

const TOP = 58;
const BOTTOM = 238;
const LEFT = 24;
const RIGHT = 290;
const at = (x: number, i: number) => x + i * (W + 4);

// Sheet rows: 1001 Chicken, 1001 Garlic, 1002 Veggie, 1003 Chicken, 1003 Cola.
const STRIPS: Strip[] = [
  { id: 'order', label: 'Order', tone: 'key', col: 0, to: [at(RIGHT, 0), TOP], rows: 3 },
  { id: 'item', label: 'Item', tone: 'key', col: 1, to: [at(RIGHT, 1), BOTTOM], rows: 5 },
  { id: 'qty', label: 'Qty', tone: 'whole', col: 2, to: [at(RIGHT, 2), BOTTOM], rows: 5 },
  { id: 'price', label: 'Price', tone: 'item', col: 3, to: [at(LEFT, 1), BOTTOM], rows: 4, repeats: [3] },
  { id: 'date', label: 'Date', tone: 'order', col: 4, to: [at(RIGHT, 1), TOP], rows: 3, repeats: [1, 4] },
  { id: 'cust', label: 'Cust ID', tone: 'order', col: 5, to: [at(RIGHT, 2), TOP], rows: 3, repeats: [1, 4] },
  { id: 'name', label: 'Name', tone: 'cust', col: 6, to: [at(LEFT, 1), TOP], rows: 2, repeats: [1, 3, 4] },
  { id: 'phone', label: 'Phone', tone: 'cust', col: 7, to: [at(LEFT, 2), TOP], rows: 2, repeats: [1, 3, 4] },
  { id: 'order2', label: 'Order', tone: 'key', col: 0, to: [at(RIGHT, 0), BOTTOM], rows: 5, copy: true },
  { id: 'item2', label: 'Item', tone: 'key', col: 1, to: [at(LEFT, 0), BOTTOM], rows: 4, copy: true },
  { id: 'cust2', label: 'Cust ID', tone: 'key', col: 5, to: [at(LEFT, 0), TOP], rows: 2, copy: true },
];

const TABLES: [string, Tone, number, number][] = [
  ['Customers', 'cust', LEFT, TOP],
  ['Orders', 'order', RIGHT, TOP],
  ['Menu', 'item', LEFT, BOTTOM],
  ['Order items', 'whole', RIGHT, BOTTOM],
];

const SHEET_X = 12;
const SHEET_Y = 120;

const CAPTIONS = [
  'One big sheet. The red marks are values typed again and again.',
  'Colour each column by what it depends on.',
  'Split by colour. Four small tables, and each fact is stored once.',
];

function HeroSplit() {
  const printing = usePrinting();
  const [phase, setPhase] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    setPhase(0);
    const a = setTimeout(() => setPhase(1), 1500);
    const b = setTimeout(() => setPhase(2), 3300);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [run]);

  const p = printing ? 2 : phase;

  return (
    <div>
      <div className="ns-hero__top">
        <span className="bt-heroart__lbl">From one sheet to four tables</span>
        <span className="ns-hero__dots" aria-hidden="true">
          {[0, 1, 2].map(i => (
            <i key={i} className={i <= p ? 'on' : undefined} />
          ))}
        </span>
      </div>
      <svg
        viewBox="0 0 500 380"
        className="ns-hero__svg"
        role="img"
        aria-label="An order sheet with eight columns is coloured by what each column depends on, then split into four tables: Customers, Orders, Menu and Order items."
      >
        {TABLES.map(([name, tone, x, y], i) => (
          <motion.text
            key={name}
            x={x}
            y={y - 10}
            className="ns-hero__tname"
            fill={FILL[tone]}
            initial={false}
            animate={{ opacity: p === 2 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: p === 2 ? 0.7 + i * 0.1 : 0 }}
          >
            {name}
          </motion.text>
        ))}
        <motion.text
          x={SHEET_X}
          y={SHEET_Y - 12}
          className="ns-hero__tname"
          fill="#6b615d"
          initial={false}
          animate={{ opacity: p === 2 ? 0 : 1 }}
        >
          The order sheet
        </motion.text>

        {STRIPS.map((s, i) => {
          const x = p === 2 ? s.to[0] : SHEET_X + s.col * (W + 4);
          const y = p === 2 ? s.to[1] : SHEET_Y;
          const fill = p === 0 && s.tone !== 'key' ? FILL.plain : FILL[s.tone];
          const rows = p === 2 ? s.rows : 5;
          return (
            <motion.g
              key={s.id}
              initial={false}
              animate={{ x, y, opacity: s.copy && p < 2 ? 0 : 1 }}
              transition={{ duration: 1, ease: EASE, delay: p === 2 ? i * 0.03 : 0 }}
            >
              <motion.rect
                width={W}
                height={HEAD}
                rx={6}
                initial={false}
                animate={{ fill }}
                transition={{ duration: 0.5, delay: p === 1 ? s.col * 0.12 : 0 }}
              />
              <motion.text
                x={W / 2}
                y={16}
                textAnchor="middle"
                className="ns-hero__th"
                initial={false}
                animate={{ fill: fill === FILL.plain ? '#2e2826' : '#ffffff' }}
                transition={{ duration: 0.5, delay: p === 1 ? s.col * 0.12 : 0 }}
              >
                {s.label}
              </motion.text>
              {[0, 1, 2, 3, 4].map(r => {
                const repeat = p < 2 && s.repeats?.includes(r);
                return (
                  <motion.g
                    key={r}
                    initial={false}
                    animate={{ opacity: r < rows ? 1 : 0 }}
                    transition={{ duration: 0.4, delay: p === 2 ? 0.4 : 0 }}
                  >
                    <rect
                      y={HEAD + GAP + r * (CELL + GAP)}
                      width={W}
                      height={CELL}
                      rx={4}
                      fill="#ffffff"
                      stroke="#efd8c9"
                    />
                    <motion.rect
                      x={7}
                      y={HEAD + GAP + r * (CELL + GAP) + 7}
                      height={4}
                      rx={2}
                      initial={false}
                      animate={{ width: 20 + ((s.col * 7 + r * 5) % 22), fill: repeat ? '#d93a2b' : '#c8c0bc' }}
                    />
                  </motion.g>
                );
              })}
            </motion.g>
          );
        })}
      </svg>
      <div className="ns-hero__foot">
        <motion.p
          key={p}
          className="ns-hero__cap"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          aria-live="polite"
        >
          {CAPTIONS[p]}
        </motion.p>
        <button type="button" className="ns-replay ns-noprint" onClick={() => setRun(n => n + 1)} disabled={phase < 2}>
          <RotateCcw size={13} /> Play again
        </button>
      </div>
    </div>
  );
}

export default function NormalisationSimplePage() {
  return (
    <PrintProvider>
      <CoursePage
        courseCode="MBI802"
        courseName="Database Management Systems"
        nav={NAV}
        footerNote="Nothing on this page is tracked or collected. No login needed."
        hero={
          <div className="bt-herogrid">
            <div>
              <motion.span
                className="bt-flag"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <span className="bt-dot" style={{ background: 'var(--accent-500)' }} />
                Normalisation, the simple way
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: EASE, delay: 0.06 }}
              >
                One fact, one <span className="bt-stop">place.</span>
              </motion.h1>

              <motion.p
                className="bt-hero__lede"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
              >
                Normalisation is how you tidy a messy table so each piece of information is stored once. This page
                shows it with a pizza shop’s order sheet, one step at a time, from 1NF to 3NF.
              </motion.p>

              <motion.p
                className="bt-hero__meta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
              >
                Yasas Sri Wickramasinghe, MBI802 lecturer · 15 minutes · no login
              </motion.p>

              <motion.div
                className="bt-hero__cta ns-noprint"
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
                <button type="button" className="bt-btn bt-btn--tertiary" onClick={savePageAsPdf}>
                  Save as PDF
                  <span className="bt-btn__badge" aria-hidden="true">↓</span>
                </button>
              </motion.div>
            </div>

            <motion.div
              className="bt-heroart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: EASE, delay: 0.18 }}
            >
              <HeroSplit />
            </motion.div>
          </div>
        }
      >
        <NormalisationSimpleLesson />
      </CoursePage>
    </PrintProvider>
  );
}
