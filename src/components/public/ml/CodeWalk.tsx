import { useState, type ReactNode } from 'react';
import { ArrowDown, ArrowRight, Package } from 'lucide-react';
import { MEMBERS, TreeGlyph, VoteMark } from './forestData';
import { COLAB_URL } from './PythonPlayground';
import { highlight } from './pyHighlight';

// ─── A real program, one step at a time ───────────────────────────────────
// The scikit-learn program somebody would actually paste into Colab, built
// on the same twenty gym members as the forest widgets. Each step lights up
// its lines, says what they do in one sentence, breaks the line into words
// with a meaning for each, and changes the picture underneath — so the
// reader sees the data arrive, the model get made, get trained, and answer.
//
// The program's output, [1 0], is what scikit-learn prints for these two new
// members on every run we tried; they sit well inside the quit and stay
// groups, so the forest's randomness does not reach them.

const pair = (m: (typeof MEMBERS)[number]) => `[${m.visits}, ${m.months}]`;
const rowsOf = (from: number) => MEMBERS.slice(from, from + 5).map(pair).join(', ');

const LINES = [
  'from sklearn.ensemble import RandomForestClassifier',
  '',
  '# Inputs: [visits a month, months a member]',
  `X = [${rowsOf(0)},`,
  `     ${rowsOf(5)},`,
  `     ${rowsOf(10)},`,
  `     ${rowsOf(15)}]`,
  '',
  '# Answers: 1 = quit, 0 = stayed',
  `y = [${MEMBERS.map(m => (m.quit ? 1 : 0)).join(', ')}]`,
  '',
  'model = RandomForestClassifier(n_estimators=300)',
  'model.fit(X, y)',
  '',
  'new_members = [[2, 4], [10, 20]]',
  'print(model.predict(new_members))',
];

export const WALK_PROGRAM = LINES.join('\n');

interface Step {
  lines: number[];
  title: string;
  body: string;
  words: [string, ReactNode][];
}

const STEPS: Step[] = [
  {
    lines: [0],
    title: 'Bring in the tool',
    body: 'scikit-learn is a free box of ready-made models. This line takes one model out of the box so the program can use it.',
    words: [
      ['from sklearn.ensemble', 'from the part of scikit-learn that keeps the forests'],
      ['import', 'bring in'],
      ['RandomForestClassifier', <>the random forest. <i>Classifier</i> means it picks between answers, like quit or stay.</>],
    ],
  },
  {
    lines: [2, 3, 4, 5, 6],
    title: 'Write down the inputs',
    body: 'One pair of numbers per gym member. Each pair holds two facts: how often they come, and how long they have been a member.',
    words: [
      ['#', 'a note for people. Python skips the whole line.'],
      ['X', 'just a name. Everyone calls the inputs X.'],
      ['=', 'store what is on the right under the name on the left'],
      ['[1, 2]', `one member: comes 1× a month, joined 2 months ago (that is ${MEMBERS[0].name})`],
      ['[ … ]', 'the outer square brackets hold the whole list of 20 members'],
    ],
  },
  {
    lines: [8, 9],
    title: 'Write down the answers',
    body: 'What really happened to each member, in the same order as the inputs. The first answer belongs to the first pair.',
    words: [
      ['y', 'the name everyone uses for the answers'],
      ['1', 'this member quit'],
      ['0', 'this member stayed'],
    ],
  },
  {
    lines: [11],
    title: 'Make an empty model',
    body: 'This makes a forest of 300 trees — but they are blank. The model has not seen a single member yet.',
    words: [
      ['model', 'a name we chose. It could be anything.'],
      ['RandomForestClassifier( )', 'make a new random forest'],
      ['n_estimators=300', 'with 300 trees. A setting you can change.'],
    ],
  },
  {
    lines: [12],
    title: 'Train it — the learning happens here',
    body: 'fit shows the model every example together with its answer. All 300 trees grow their questions now. It takes about a second.',
    words: [
      ['model.fit', <>the model&rsquo;s <i>fit</i>. The dot means &ldquo;belonging to&rdquo;.</>],
      ['(X, y)', 'these inputs, with these answers'],
    ],
  },
  {
    lines: [14],
    title: 'Describe some new people',
    body: 'Two members the model has never seen, written the same way as the inputs: [visits, months].',
    words: [
      ['new_members', 'another name we chose'],
      ['[2, 4]', 'comes 2× a month, joined 4 months ago'],
      ['[10, 20]', 'comes 10× a month, joined 20 months ago'],
    ],
  },
  {
    lines: [15],
    title: 'Ask, and show the answer',
    body: 'predict asks all 300 trees about each new person and counts the votes. print shows the result on the screen.',
    words: [
      ['model.predict( )', 'what do you think about these people?'],
      ['print( )', 'show it on the screen'],
      ['[1 0]', 'what gets printed: the first person will quit (1), the second will stay (0)'],
    ],
  },
];

const stepOfLine = (i: number) => STEPS.findIndex(s => s.lines.includes(i));

type Look = 'off' | 'on' | 'focus';

function Card({ look, name, label, children }: { look: Look; name: string; label: string; children: ReactNode }) {
  return (
    <div className={`bt-cw-card bt-cw-card--${look}`} style={{ gridArea: name }}>
      <p className="bt-cw-card__label">{label}</p>
      {children}
    </div>
  );
}

function Arrow({ lit, label, area }: { lit: boolean; label: string; area: string }) {
  return (
    <div className={`bt-cw-arrow${lit ? ' is-lit' : ''}`} style={{ gridArea: area }} aria-hidden="true">
      <span className="bt-cw-arrow__side"><ArrowRight size={20} /></span>
      <span className="bt-cw-arrow__down"><ArrowDown size={20} /></span>
      <code>{label}</code>
    </div>
  );
}

function Stage({ step }: { step: number }) {
  const look = (appearsAt: number, focusAt: number[]): Look =>
    focusAt.includes(step) ? 'focus' : step >= appearsAt ? 'on' : 'off';
  const shown = MEMBERS.slice(0, 4);
  const trained = step >= 4;

  return (
    <div className="bt-cw-stage" aria-hidden="true">
      <Card look={look(1, [1])} name="x" label="X · inputs">
        <table className="bt-cw-mini">
          <thead>
            <tr><th>visits</th><th>months</th></tr>
          </thead>
          <tbody>
            {shown.map(m => (
              <tr key={m.name}><td>{m.visits}</td><td>{m.months}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="bt-cw-card__more">… 16 more rows</p>
      </Card>

      <Card look={look(2, [2])} name="y" label="y · answers">
        <ul className="bt-cw-answers">
          {shown.map(m => (
            <li key={m.name}>
              <VoteMark quit={m.quit} size={13} /> {m.quit ? 'quit' : 'stayed'}
            </li>
          ))}
        </ul>
        <p className="bt-cw-card__more">… 16 more</p>
      </Card>

      <Arrow lit={step === 4} label="fit" area="a1" />

      <Card look={step === 0 ? 'focus' : look(3, [3, 4])} name="m" label="model">
        {step < 3 ? (
          <div className="bt-cw-tool">
            <Package size={26} aria-hidden="true" />
            <span>{step === 0 ? 'Random forest, ready to use' : 'Not made yet'}</span>
          </div>
        ) : (
          <>
            <div className={`bt-cw-forest${trained ? ' is-trained' : ''}`}>
              {Array.from({ length: 12 }, (_, i) => (
                <TreeGlyph key={i} size={22} color={trained ? 'var(--accent-500)' : 'var(--ink-200)'} />
              ))}
            </div>
            <p className="bt-cw-card__more">
              × 300 trees · <b>{trained ? 'trained ✓' : 'empty — knows nothing yet'}</b>
            </p>
          </>
        )}
      </Card>

      <Arrow lit={step === 6} label="predict" area="a2" />

      <Card look={look(5, [5, 6])} name="n" label="new members → answer">
        <ul className="bt-cw-new">
          {[
            { pair: '[2, 4]', quit: true },
            { pair: '[10, 20]', quit: false },
          ].map(p => (
            <li key={p.pair}>
              <code>{p.pair}</code>
              <span className="bt-cw-new__arrow">→</span>
              {step >= 6 ? (
                <span className="bt-cw-new__ans" style={{ color: p.quit ? 'var(--cat-2)' : 'var(--cat-3)' }}>
                  <VoteMark quit={p.quit} size={13} /> {p.quit ? 'quit' : 'stay'}
                </span>
              ) : (
                <span className="bt-cw-new__ans bt-cw-new__ans--q">?</span>
              )}
            </li>
          ))}
        </ul>
        {step >= 6 && <pre className="bt-cw-console">[1 0]</pre>}
      </Card>
    </div>
  );
}

export default function CodeWalk() {
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  async function copy() {
    try {
      await navigator.clipboard.writeText(WALK_PROGRAM);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="bt-sim bt-cw">
      <div className="bt-cw__top">
        <div className="bt-cw-code">
          <div className="bt-cw-code__bar">
            <span>gym.py · a real program</span>
            <button type="button" className="bt-cw-code__btn" onClick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button>
            <a className="bt-cw-code__btn" href={COLAB_URL} target="_blank" rel="noreferrer">Open Colab ↗</a>
          </div>
          <ol className="bt-cw-lines">
            {LINES.map((line, i) => {
              const owner = stepOfLine(i);
              const lit = s.lines.includes(i);
              return (
                <li
                  key={i}
                  className={`${lit ? 'is-lit' : ''}${owner >= 0 ? ' is-step' : ''}`}
                  onClick={owner >= 0 ? () => setStep(owner) : undefined}
                >
                  <span className="bt-cw-lines__n">{i + 1}</span>
                  <code>{highlight(line)}</code>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="bt-cw-explain" aria-live="polite">
          <p className="bt-sim__label">Step {step + 1} of {STEPS.length}</p>
          <h4>{s.title}</h4>
          <p className="bt-cw-explain__body">{s.body}</p>
          <p className="bt-sim__label" style={{ marginTop: 16 }}>Word by word</p>
          <dl className="bt-cw-words">
            {s.words.map(([code, meaning]) => (
              <div key={code}>
                <dt><code>{code}</code></dt>
                <dd>{meaning}</dd>
              </div>
            ))}
          </dl>

          <div className="bt-cw-nav">
            <button type="button" className="bt-cw-back" onClick={() => setStep(step - 1)} disabled={step === 0}>
              ← Back
            </button>
            <button type="button" className="bt-btn bt-btn--md" onClick={() => setStep(last ? 0 : step + 1)}>
              {last ? 'Start again' : 'Next line'}
              <span className="bt-btn__badge" aria-hidden="true">{last ? '↺' : '→'}</span>
            </button>
          </div>
          <div className="bt-cw-dots">
            {STEPS.map((st, i) => (
              <button
                key={st.title}
                type="button"
                aria-label={`Step ${i + 1}: ${st.title}`}
                aria-current={i === step ? 'step' : undefined}
                onClick={() => setStep(i)}
              />
            ))}
          </div>
        </div>
      </div>

      <Stage step={step} />
    </div>
  );
}
