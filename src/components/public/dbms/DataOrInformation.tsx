import { useState } from 'react';

// ─── Data or information? (section 1.1) ───────────────────────────────────
// The builder above shows how data turns into information. This shows you
// whether you can tell them apart, which is the half an exam actually asks.
// Six items, all from the chapter and its answer key, written plainly.
// The pair that catches people sits together: ten thousand payment amounts
// is still data, and one sentence drawn from those same payments is not.

type Answer = 'data' | 'information';

interface Item { v: string; a: Answer; src: string; why: string; }

const ITEMS: Item[] = [
  {
    v: '42',
    a: 'data',
    src: 'practice question 1(a)',
    why: 'Forty-two what? It could be an age, a test mark, a bus route or a temperature. Nobody can do anything with it.',
  },
  {
    v: '“Auckland”',
    a: 'data',
    src: 'practice question 1(b)',
    why: 'Just a place name. Whose Auckland? Doing what? When? There’s nothing here you could act on.',
  },
  {
    v: 'A file with 10,000 payment amounts in it',
    a: 'data',
    src: 'practice question 1(d)',
    why: 'The one that catches people. Piling numbers up doesn’t give them meaning. Ten thousand of them is still just ten thousand numbers.',
  },
  {
    v: 'Sales rose 12% in March, driven by the Auckland store',
    a: 'information',
    src: 'section 1.1',
    why: 'Built from the very same payments as the file above — but somebody worked them out and said what they mean. A manager could act on this today.',
  },
  {
    v: 'Enrolments in MBI802 grew 15% between 2025 and 2026',
    a: 'information',
    src: 'practice question 1(c)',
    why: 'Someone can do something with this: open a second class, or hire another tutor. That’s the test.',
  },
  {
    v: 'John Smith achieved a distinction (85%) in MBI802 during Semester 1',
    a: 'information',
    src: 'the 1.1 definition box',
    why: 'Who, what, how well and when. Once you know all four, the 85 finally means something.',
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
                Data is raw — numbers and words on their own. It turns into information once somebody adds
                enough around it that you could act on it. You’ll get the reasoning either way.
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
