import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

// ─── A short animated walkthrough of a screen you can't screenshot ───────
// Some steps only exist once you are signed in — uploading into Colab,
// sending a file in Teams — so they can't be captured from outside. These
// are drawn instead, from the real screens' layout, and say so in the tag
// at the top. Nobody should mistake a drawing for a screenshot.
//
// The walkthrough plays itself once when it scrolls into view, a step
// every couple of seconds, then stops on the last frame. Back and Next let
// a reader go at their own pace; the dots jump straight to a step. A cursor
// moves to wherever the current step clicks: each step names a target, and
// the drawing marks the matching element with data-target, so the cursor
// lands on it at any screen width.
//
// Reduced motion: it does not autoplay, and the cursor jumps rather than
// glides.

export interface DemoStep {
  caption: ReactNode;
  /** The data-target of the element the cursor points at in this step. */
  cursor?: string;
  /** Show a click ripple when the cursor lands. */
  click?: boolean;
}

const STEP_MS = 2300;

export default function Demo({ tag, steps, children }: {
  tag: string;
  steps: DemoStep[];
  children: (step: number) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-140px' });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [point, setPoint] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (inView && !reduce) setPlaying(true);
  }, [inView, reduce]);

  useEffect(() => {
    if (!playing) return;
    if (step >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setStep(s => s + 1), STEP_MS);
    return () => window.clearTimeout(t);
  }, [playing, step, steps.length]);

  // Find the current step's target and put the cursor on its centre. Runs
  // after the frame has drawn, and again whenever the screen changes size.
  const target = steps[step].cursor;
  useLayoutEffect(() => {
    const screen = ref.current;
    if (!screen || !target) {
      setPoint(null);
      return;
    }
    const place = () => {
      const el = screen.querySelector<HTMLElement>(`[data-target="${target}"]`);
      if (!el) return setPoint(null);
      const a = screen.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      setPoint([b.left - a.left + b.width / 2, b.top - a.top + b.height / 2]);
    };
    place();
    // Panels slide open over a third of a second; measure again after.
    const t = window.setTimeout(place, 380);
    const ro = new ResizeObserver(place);
    ro.observe(screen);
    return () => {
      window.clearTimeout(t);
      ro.disconnect();
    };
  }, [target, step]);

  function go(i: number) {
    setPlaying(false);
    setStep(Math.max(0, Math.min(steps.length - 1, i)));
  }

  const s = steps[step];

  return (
    <div className="lr-demo">
      <div className="lr-demo__top">
        <span className="lr-demo__tag">{tag}</span>
      </div>
      <div className="lr-demo__screen" ref={ref}>
        {children(step)}
        {point && (
          <motion.svg
            className="lr-cursor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            initial={false}
            animate={{ left: point[0], top: point[1] }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: [0.2, 0.8, 0.25, 1] }}
          >
            <path d="M4 2l15 9.5-6.6 1.4 3.8 7.4-2.8 1.4-3.8-7.5L4 19z" fill="#0e0c0b" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
          </motion.svg>
        )}
        <AnimatePresence>
          {point && s.click && !reduce && (
            <motion.span
              key={step}
              className="lr-ripple"
              style={{ left: point[0], top: point[1] }}
              initial={{ opacity: 0.9, scale: 0.3 }}
              animate={{ opacity: 0, scale: 1.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="lr-demo__caption" aria-live="polite">
        <span className="bt-flow__n bt-tnum" style={{ width: 26, height: 26 }}>{step + 1}</span>
        <p>{s.caption}</p>
      </div>

      <div className="lr-demo__nav">
        <button type="button" className="lr-navbtn" onClick={() => go(step - 1)} disabled={step === 0}>
          Back
        </button>
        <button type="button" className="lr-navbtn" onClick={() => go(step + 1)} disabled={step === steps.length - 1}>
          Next
        </button>
        {!reduce && (
          <button
            type="button"
            className="lr-replay"
            onClick={() => {
              setStep(0);
              setPlaying(true);
            }}
          >
            <RotateCcw size={13} aria-hidden="true" /> Play again
          </button>
        )}
        <div className="lr-demo__dots">
          {steps.map((_, i) => (
            <button key={i} type="button" aria-label={`Step ${i + 1}`} aria-current={i === step} onClick={() => go(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
