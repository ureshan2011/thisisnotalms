import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useAsset } from './LabContext';

// ─── A real screenshot, with a cursor that shows you where to click ───────
// The pictures are genuine captures of Kaggle and Colab taken for this lab.
// Each one carries numbered marks. When the picture scrolls into view a
// cursor glides to mark 1, clicks, and moves on, so the reader's eye is
// walked round the screen in the order they will use it. It plays once.
// Pressing a step underneath sends the cursor back to that mark; Replay
// runs the whole tour again.
//
// Mark positions are percentages of the image, measured from the element
// boxes Playwright reported when the screenshot was taken, so they stay on
// target at any width.
//
// Reduced motion: no cursor, no tour — every mark is shown at once.

export interface Mark {
  /** Left, top, width, height — percentages of the image. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** The instruction for this mark. Bold the thing to click with **. */
  text: string;
}

const STEP_MS = 1500;

/** Render "Click **Download**" with the starred words in bold. */
export function rich(text: string) {
  return text.split('**').map((part, i) => (i % 2 ? <b key={i}>{part}</b> : <span key={i}>{part}</span>));
}

export default function Shot({ src, dir, url, alt, width, height, marks, caption, maxWidth }: {
  /** File name inside the lab's asset folder (see LabContext). */
  src: string;
  /** Another lab's folder instead, for screenshots the labs share. */
  dir?: string;
  /** What the browser's address bar should say. */
  url: string;
  alt: string;
  width: number;
  height: number;
  marks: Mark[];
  caption?: string;
  /** Cap the width for a screenshot that would otherwise be blown up. */
  maxWidth?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });
  const reduce = useReducedMotion();
  // -1 before the tour starts. `drawn` is how far the tour has got, so every
  // mark up to it stays on the picture; `active` is the one the cursor is on.
  const [active, setActive] = useState(-1);
  const [drawn, setDrawn] = useState(-1);
  const [touring, setTouring] = useState(false);
  // True once the reader has picked a step themselves: then the picked mark
  // stays bright and the others step back.
  const [picked, setPicked] = useState(false);
  const [clicks, setClicks] = useState(0);
  const full = useAsset(src, dir);

  useEffect(() => {
    if (reduce) {
      setDrawn(marks.length - 1);
      return;
    }
    if (inView) setTouring(true);
  }, [inView, reduce, marks.length]);

  useEffect(() => {
    if (!touring) return;
    if (active >= marks.length - 1) {
      setTouring(false);
      return;
    }
    const t = window.setTimeout(() => {
      setActive(a => a + 1);
      setDrawn(d => Math.max(d, active + 1));
      setClicks(c => c + 1);
    }, active === -1 ? 500 : STEP_MS);
    return () => window.clearTimeout(t);
  }, [touring, active, marks.length]);

  function replay() {
    setActive(-1);
    setDrawn(-1);
    setPicked(false);
    setTouring(true);
  }

  function goTo(i: number) {
    setTouring(false);
    setPicked(true);
    setActive(i);
    setDrawn(d => Math.max(d, i));
    setClicks(c => c + 1);
  }

  const target = marks[Math.max(0, active)];
  const showCursor = !reduce && active >= 0;
  const dimmed = (i: number) => (touring || picked) && i !== active;

  return (
    <figure className="lr-shot" style={{ margin: 0, maxWidth }}>
      <div className="lr-browser">
        <div className="lr-browser__bar" aria-hidden="true">
          <span className="lr-browser__dot" style={{ background: '#f87171' }} />
          <span className="lr-browser__dot" style={{ background: '#fbbf24' }} />
          <span className="lr-browser__dot" style={{ background: '#34d399' }} />
          <span className="lr-browser__url">{url}</span>
        </div>
        <div className="lr-shot__stage" ref={ref}>
          <img src={full} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
          {marks.map((m, i) =>
            i <= drawn ? (
              <motion.span
                key={i}
                className="lr-mark"
                style={{ left: `${m.x}%`, top: `${m.y}%`, width: `${m.w}%`, height: `${m.h}%` }}
                initial={reduce ? false : { opacity: 0, scale: 1.25 }}
                animate={{ opacity: dimmed(i) ? 0.45 : 1, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="lr-mark__n">{i + 1}</span>
              </motion.span>
            ) : null,
          )}

          {showCursor && target && (
            <motion.svg
              className="lr-cursor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              initial={{ left: '96%', top: '96%', opacity: 0 }}
              animate={{ left: `${target.x + target.w / 2}%`, top: `${target.y + target.h / 2}%`, opacity: 1 }}
              transition={{ duration: 0.75, ease: [0.2, 0.8, 0.25, 1] }}
            >
              <path d="M4 2l15 9.5-6.6 1.4 3.8 7.4-2.8 1.4-3.8-7.5L4 19z" fill="#0e0c0b" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
            </motion.svg>
          )}

          <AnimatePresence>
            {showCursor && target && (
              <motion.span
                key={clicks}
                className="lr-ripple"
                style={{ left: `${target.x + target.w / 2}%`, top: `${target.y + target.h / 2}%` }}
                initial={{ opacity: 0.9, scale: 0.3 }}
                animate={{ opacity: 0, scale: 1.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.7, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <ol className="lr-shot__steps">
        {marks.map((m, i) => (
          <li key={i}>
            <button type="button" aria-current={(touring || picked) && i === active} onClick={() => goTo(i)}>
              <span className="lr-shot__num">{i + 1}</span>
              <span>{rich(m.text)}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="lr-shot__foot">
        {!reduce && (
          <button type="button" className="lr-replay" onClick={replay}>
            <RotateCcw size={13} aria-hidden="true" /> Show me again
          </button>
        )}
        <a href={full} target="_blank" rel="noreferrer">Open the full-size screenshot ↗</a>
        {caption && <figcaption className="lr-caption">{caption}</figcaption>}
      </div>
    </figure>
  );
}

/** A plain "this is what you should see" picture, no marks. */
export function Figure({ src, dir, alt, width, height, caption, narrow }: {
  src: string;
  dir?: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  narrow?: boolean;
}) {
  const url = useAsset(src, dir);
  return (
    <figure className={`lr-figure${narrow ? ' lr-figure--narrow' : ''}`}>
      <img src={url} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
