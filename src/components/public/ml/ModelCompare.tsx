import { Check, X } from 'lucide-react';
import { ModelShape, type ShapeKind } from './ModelShapes';

// ─── The three models, side by side ───────────────────────────────────────
// Three columns, same six rows, and each cell is four or five words. A wide
// table with sentences in it does not get read; this is meant to be scanned
// in about twenty seconds and then remembered as a shape.
//
// Every cell carries its own small label, so when the three columns stack on
// a phone each one still reads as a complete little card rather than a list
// of orphaned values.
//
// The one claim that needs care is accuracy, because it depends entirely on
// the problem. So the row says "usually" and the note under the table says
// so again — a forest beating a line is the common case, not a law.

interface Model {
  kind: ShapeKind;
  name: string;
  /** One line: what it actually is. */
  lead: string;
  answers: string;
  explain: boolean;
  explainNote: string;
  accuracy: string;
  watch: string;
  useWhen: string;
}

const MODELS: Model[] = [
  {
    kind: 'line',
    name: 'Linear regression',
    lead: 'One straight line through your data.',
    answers: 'A number',
    explain: true,
    explainNote: 'Yes — in one sentence',
    accuracy: 'Fine, if the dots are roughly straight',
    watch: 'Curves. And questions outside your data.',
    useWhen: 'The answer is a number and you want to know what drives it.',
  },
  {
    kind: 'cuts',
    name: 'Decision tree',
    lead: 'A flowchart of yes/no questions.',
    answers: 'A choice',
    explain: true,
    explainNote: 'Yes — print the chart',
    accuracy: 'Fine, if you stop it early',
    watch: 'Memorising your data instead of learning from it.',
    useWhen: 'Someone will ask you to justify every decision.',
  },
  {
    kind: 'forest',
    name: 'Random forest',
    lead: 'Hundreds of trees. They vote.',
    answers: 'A choice, or a number',
    explain: false,
    explainNote: 'No — 300 trees is not a chart',
    accuracy: 'Usually the best of the three',
    watch: 'You cannot show anyone your working.',
    useWhen: 'It mostly just has to be right.',
  },
];

const ROWS: { label: string; get: (m: Model) => React.ReactNode }[] = [
  { label: 'What it answers', get: m => m.answers },
  {
    label: 'Can you explain it',
    get: m => (
      <span className={`bt-cmp__flag bt-cmp__flag--${m.explain ? 'yes' : 'no'}`}>
        {m.explain ? <Check size={13} strokeWidth={3} aria-hidden="true" /> : <X size={13} strokeWidth={3} aria-hidden="true" />}
        {m.explainNote}
      </span>
    ),
  },
  { label: 'How accurate', get: m => m.accuracy },
  { label: 'Watch out for', get: m => m.watch },
  { label: 'Use it when', get: m => m.useWhen },
];

export default function ModelCompare() {
  return (
    <>
      <div className="bt-cmp">
        {MODELS.map(m => (
          <div key={m.name} className="bt-cmp__col">
            <div className="bt-cmp__head">
              <ModelShape kind={m.kind} />
              <h4>{m.name}</h4>
              <p>{m.lead}</p>
            </div>
            {ROWS.map(row => (
              <div key={row.label} className="bt-cmp__row">
                <span className="bt-cmp__label">{row.label}</span>
                <span className="bt-cmp__val">{row.get(m)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="bt-note">
        Same twelve dots in all three pictures. Only the shape of the rule changes. &ldquo;Usually the best&rdquo;
        means exactly that — on a problem where the answer really is a straight line, the line wins.
      </p>
    </>
  );
}
