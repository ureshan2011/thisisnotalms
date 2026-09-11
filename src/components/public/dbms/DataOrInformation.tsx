import { useState } from 'react';

// ─── Data or information? (section 1.1) ───────────────────────────────────
// The builder above shows how data turns into information. This shows you
// whether you can tell them apart, which is the half an exam actually asks.
// Six items, all from the chapter and its answer key, including the pair
// that catches people: ten thousand transaction amounts is still data, and
// a sentence drawn from those same transactions is information.

type Answer = 'data' | 'information';

interface Item { v: string; a: Answer; src: string; why: string; }

const ITEMS: Item[] = [
  {
    v: '42',
    a: 'data',
    src: 'practice question 1(a)',
    why: 'A bare number with no context. It could be an age, a mark, a bus route or a temperature, and you can’t decide anything from it.',
  },
  {
    v: '“Auckland”',
    a: 'data',
    src: 'practice question 1(b)',
    why: 'A place name on its own. Whose Auckland, doing what, when? Nothing here is actionable yet.',
  },
  {
    v: 'A file of 10,000 transaction amounts',
    a: 'data',
    src: 'practice question 1(d)',
    why: 'The one that catches people. Volume doesn’t create meaning — ten thousand bare numbers is still ten thousand pieces of data.',
  },
  {
    v: 'Sales rose 12% in March, driven by the Auckland store',
    a: 'information',
    src: 'section 1.1',
    why: 'The same transactions as the file above, now processed and given context. Somebody can act on this one.',
  },
  {
    v: 'Enrolments in MBI802 grew 15% between 2025 and 2026',
    a: 'information',
    src: 'practice question 1(c)',
    why: 'Processed, contextualised and decision-ready. Someone can now choose whether to open a second class.',
  },
  {
    v: 'John Smith achieved a distinction (85%) in MBI802 during Semester 1',
    a: 'information',
    src: 'the 1.1 definition box',
    why: 'Who, what, how well and when. The chapter’s worked example of data plus context plus processing.',
  },
];

export default function DataOrInformation() {
  const [i, setI] = useState(0);
  const [marks, setMarks] = useState<(boolean | null)[]>(Array(ITEMS.length).fill(null));
  const [shown, setShown] = useState(false);

  const item = ITEMS[i];
  const done = marks.every(m => m !== null);
  const right = marks.filter(m => m === true).length;

  function answer(pick: Answer) {
    if (shown) return;
    setMarks(prev => prev.map((m, k) => (k === i ? pick === item.a : m)));
    setShown(true);
  }

  function next() {
    setShown(false);
    setI(k => (k + 1) % ITEMS.length);
  }

  function restart() {
    setMarks(Array(ITEMS.length).fill(null));
    setShown(false);
    setI(0);
  }

  return (
    <div className="doi">
      <div className="doi__main">
        <div className="doi__card">
          <p className="doi__value">{item.v}</p>
          <p className="doi__src">{item.src}</p>
        </div>

        <div className="doi__buttons">
          <button type="button" className="doi__btn" disabled={shown} onClick={() => answer('data')}>Data</button>
          <button type="button" className="doi__btn" disabled={shown} onClick={() => answer('information')}>Information</button>
        </div>
      </div>

      <div className="doi__side">
        <div className={`doi__result${shown ? (marks[i] ? ' doi__result--right' : ' doi__result--wrong') : ''}`} aria-live="polite">
          {shown ? (
            <>
              <p className="doi__verdict">
                {marks[i] ? 'Correct.' : 'Not quite.'} That one is {item.a}.
              </p>
              <p>{item.why}</p>
              <button type="button" className="bt-btn bt-btn--sm" onClick={next} style={{ marginTop: 16 }}>
                {done ? 'Go round again' : 'Next item'}
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
            </>
          ) : (
            <>
              <p className="doi__verdict">Which is it?</p>
              <p>
                Data is raw. Information is data that’s been processed and given context, so somebody can decide
                something with it. You’ll get the reasoning either way.
              </p>
            </>
          )}
        </div>

        <div className="doi__tally">
          <span className="doi__pips" aria-hidden="true">
            {marks.map((m, k) => (
              <span key={k} className={`doi__pip${m === true ? ' doi__pip--r' : m === false ? ' doi__pip--w' : ''}${k === i ? ' doi__pip--now' : ''}`} />
            ))}
          </span>
          <span>
            {done
              ? `${right} of ${ITEMS.length} first time.`
              : `${marks.filter(m => m !== null).length} of ${ITEMS.length} called.`}
          </span>
          {done && (
            <button type="button" className="doi__restart" onClick={restart}>Reset</button>
          )}
        </div>
      </div>
    </div>
  );
}
