import { useState } from 'react';

// ─── Knowledge check ──────────────────────────────────────────────────────
// Answer, read why, move on. Nothing is stored, nothing is reported, and
// there is no pass mark: this exists so a student finds out whether the last
// ten minutes landed while they can still do something about it.
//
// Every wrong option gets its own explanation rather than a shared "not
// quite". A distractor a student picked is the most useful thing on the
// page — it names the specific misunderstanding they arrived with.

export interface QuizOption {
  text: string;
  /** Why this option is right, or exactly what it gets wrong. */
  why: string;
}

export interface QuizQuestion {
  q: string;
  /** Index into `options` of the correct answer. */
  answer: number;
  options: QuizOption[];
}

const KEYS = ['A', 'B', 'C', 'D', 'E'];

export default function Quiz({ questions, closing }: {
  questions: QuizQuestion[];
  /** One line shown once every question has been answered. */
  closing: string;
}) {
  const [at, setAt] = useState(0);
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));

  const question = questions[at];
  const choice = picked[at];
  const answered = choice !== null;
  const right = answered && choice === question.answer;
  const done = picked.every(p => p !== null);
  const correct = picked.filter((p, i) => p === questions[i].answer).length;

  function pick(i: number) {
    if (answered) return;
    setPicked(prev => prev.map((p, n) => (n === at ? i : p)));
  }

  return (
    <div className="bt-quiz">
      <div className="bt-quiz__bar">
        <span className="bt-quiz__count bt-tnum">{at + 1} / {questions.length}</span>
        <span className="bt-bar" aria-hidden="true">
          <i style={{ width: `${((at + (answered ? 1 : 0)) / questions.length) * 100}%` }} />
        </span>
        {done && <span className="bt-quiz__count bt-tnum">{correct} of {questions.length} first time</span>}
      </div>

      <p className="bt-quiz__q">{question.q}</p>

      <ul className="bt-quiz__opts">
        {question.options.map((opt, i) => {
          const isAnswer = i === question.answer;
          const state = !answered ? '' : isAnswer ? ' bt-quiz__opt--right' : i === choice ? ' bt-quiz__opt--wrong' : '';
          return (
            <li key={opt.text}>
              <button
                type="button"
                className={`bt-quiz__opt${state}`}
                disabled={answered}
                onClick={() => pick(i)}
              >
                <span className="bt-quiz__key">{KEYS[i]}</span>
                <span>{opt.text}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {answered && (
        <div className="bt-quiz__why" aria-live="polite">
          <p className="bt-quiz__stamp">{right ? 'That’s it' : 'Not this one'}</p>
          <p>{question.options[choice].why}</p>
        </div>
      )}

      <div className="bt-quiz__nav">
        <button
          type="button"
          className="bt-btn bt-btn--tertiary bt-btn--sm"
          disabled={at === 0}
          onClick={() => setAt(a => Math.max(0, a - 1))}
        >
          Back
        </button>
        <button
          type="button"
          className="bt-btn bt-btn--sm"
          disabled={at === questions.length - 1}
          onClick={() => setAt(a => Math.min(questions.length - 1, a + 1))}
        >
          Next question
          <span className="bt-btn__badge" aria-hidden="true">→</span>
        </button>
        {done && <span className="bt-quiz__done">{closing}</span>}
      </div>
    </div>
  );
}
