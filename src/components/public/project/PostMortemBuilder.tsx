import LessonBuilder, { type BuilderStep, type BuilderValues } from '../../blend/LessonBuilder';
import type { Artefact } from '../../../lib/artefactPdf';

// ─── One project, six questions, one page ─────────────────────────────────
// The lesson asks a student to bring a project they watched go wrong. This
// builds it, and it is deliberately shaped like a small version of the 60%
// assessment: a project's attributes, the methodology those attributes called
// for, and an argument for the gap between that and what was actually done.
//
// A student who finishes this has written the spine of the case study four
// months before it is due, using a project they already know, which is the
// only way the assessment stops being a research exercise.
//
// The questions follow the lesson's own order — constraint, delay, method,
// risk — so each one is the thing they read about ten minutes earlier.

const CORNERS = [
  { value: 'Scope', label: 'Scope' },
  { value: 'Time', label: 'Time' },
  { value: 'Cost', label: 'Cost' },
  { value: 'Quality', label: 'Quality, undeclared' },
];

const METHODS = [
  { value: 'Agile', label: 'Agile' },
  { value: 'Waterfall', label: 'Waterfall' },
  { value: 'PRINCE2', label: 'PRINCE2' },
  { value: 'Nothing named', label: 'Nothing named' },
];

const MOVED = [
  { value: 'Yes, straight away', label: 'Yes, straight away' },
  { value: 'Yes, eventually', label: 'Yes, eventually' },
  { value: 'No, it was absorbed', label: 'No, it was absorbed' },
];

const RESPONSES = [
  { value: 'Avoid', label: 'Avoid' },
  { value: 'Transfer', label: 'Transfer' },
  { value: 'Mitigate', label: 'Mitigate' },
  { value: 'Accept', label: 'Accept' },
];

const STEPS: BuilderStep[] = [
  {
    id: 'name',
    label: 'The project',
    eyebrow: 'Start here',
    question: 'Which project are you writing up?',
    hint: 'Work, university, a group assignment, a house renovation. It does not have to be IT, and it does not have to have failed — only to have surprised somebody.',
    fields: [
      { kind: 'line', id: 'name', label: 'One line', placeholder: 'Moving our team onto a new CRM in one quarter' },
    ],
  },
  {
    id: 'constraint',
    label: 'What moved',
    eyebrow: 'Section 1.2 · the triple constraint',
    question: 'Which corner actually moved?',
    hint: 'Whatever anybody said at kick-off, one of the three absorbed the surprises. If you cannot find it, the answer is usually quality, because that is the one nobody names.',
    fields: [
      { kind: 'choice', id: 'corner', label: 'The corner that gave', options: CORNERS },
      {
        kind: 'text',
        id: 'corner_note',
        label: 'What that looked like',
        placeholder: 'The date held, so two of the five reports were dropped the week before launch and nobody told the finance team…',
      },
    ],
    example: {
      label: 'What a good answer does here',
      body: 'It names the corner and then shows the evidence, rather than asserting it. "Scope moved" is a claim. "Two of the five reports were dropped in the last week, and finance found out at go-live" is the same claim with something behind it, and it is the difference between a pass and a good mark on the case study.',
    },
  },
  {
    id: 'delay',
    label: 'The delay',
    eyebrow: 'Section 1.3 · critical path and float',
    question: 'What slipped, and what was waiting on it?',
    hint: 'Something always runs late. The question this lesson asks is whether anything downstream was actually waiting, because that is what decides whether it cost the end date or cost nothing at all.',
    fields: [
      {
        kind: 'text',
        id: 'delay',
        label: 'The task that slipped',
        placeholder: 'Data cleaning ran two weeks over, and the training sessions could not be booked until it finished…',
      },
      { kind: 'choice', id: 'moved', label: 'Did the end date move?', options: MOVED },
    ],
  },
  {
    id: 'method',
    label: 'The method',
    eyebrow: 'Section 1.4 · LO1',
    question: 'How was it run, and how should it have been?',
    hint: 'This is the 60% assessment in miniature. The mark is not in which methodology you name, it is in whether the project’s own attributes justify it.',
    fields: [
      { kind: 'choice', id: 'ran_as', label: 'How it was actually run', options: METHODS },
      { kind: 'choice', id: 'called_for', label: 'What its attributes called for', options: METHODS },
      {
        kind: 'text',
        id: 'method_why',
        label: 'Why, in terms of the project itself',
        placeholder: 'Requirements changed every time a department saw a demo, which is the case for short cycles rather than a signed specification…',
        enough: 80,
      },
    ],
    example: {
      label: 'What a good answer does here',
      body: 'It argues from the project’s attributes, not from preference or fashion. Requirements that move, a customer who is available, a regulator who wants traceability, a board that funds one stage at a time: each of those points at a methodology on its own. An answer that says "Agile is more modern" has not done the work. An answer that says "the client changed their mind at every demo, so a signed specification would have turned every conversation into a variation request" has.',
    },
  },
  {
    id: 'risk',
    label: 'The risk',
    eyebrow: 'Section 1.5 · LO2',
    question: 'What went wrong that somebody could have written down first?',
    hint: 'Not every problem was foreseeable. Some were, and the test is simple: could a reasonable person have named it at kick-off? Pick the response that would have been right for it.',
    fields: [
      {
        kind: 'text',
        id: 'risk',
        label: 'The risk nobody named',
        placeholder: 'Our only person who understood the old data model was contracting until March…',
      },
      { kind: 'choice', id: 'response', label: 'The response that would have fitted', options: RESPONSES },
    ],
  },
  {
    id: 'change',
    label: 'Your move',
    eyebrow: 'The point of the write-up',
    question: 'What is the one thing you would change?',
    hint: 'One change, and say when it would have had to happen. A recommendation without a moment attached is a wish.',
    fields: [
      {
        kind: 'text',
        id: 'change',
        label: 'The change, and the moment',
        placeholder: 'At kick-off, before the date was announced, I would have made the department demos a fortnightly commitment…',
        enough: 50,
      },
    ],
  },
];

function Sheet({ values }: { values: BuilderValues }) {
  const title = values.name?.trim();
  const rows: { label: string; body?: string; tag?: string }[] = [
    { label: 'What actually moved', body: values.corner_note, tag: values.corner },
    { label: 'The delay', body: values.delay, tag: values.moved },
    {
      label: 'Methodology',
      body: values.method_why,
      tag: values.ran_as && values.called_for
        ? `${values.ran_as} → ${values.called_for}`
        : values.ran_as || values.called_for || undefined,
    },
    { label: 'The risk nobody named', body: values.risk, tag: values.response },
    { label: 'What I would change', body: values.change },
  ];

  return (
    <div className="bt-sheet2">
      <div className="bt-sheet2__head">
        <span className="bt-sheet2__code">MBI804 · Project post-mortem</span>
        <span className="bt-sheet2__code">Lesson 1</span>
      </div>

      <p className={`bt-sheet2__title${title ? '' : ' bt-sheet2__title--empty'}`}>
        {title || 'Your project goes here'}
      </p>

      <div className="bt-sheet2__rows">
        {rows.map(row => {
          const body = row.body?.trim();
          return (
            <div key={row.label} className={`bt-sheet2__row${body ? ' bt-sheet2__row--filled' : ''}`}>
              <div className="bt-sheet2__rowhead">
                <span className="bt-sheet2__label">{row.label}</span>
                {row.tag && <span className="bt-sheet2__tag">{row.tag}</span>}
              </div>
              <p className={`bt-sheet2__body${body ? '' : ' bt-sheet2__body--empty'}`}>
                {body || 'Not yet answered.'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function toArtefact(values: BuilderValues): Artefact {
  const title = values.name?.trim() || 'A project, written up';
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'post-mortem';
  const methodTag = values.ran_as && values.called_for
    ? `Run as ${values.ran_as}, called for ${values.called_for}`
    : values.ran_as || values.called_for || undefined;

  return {
    code: 'MBI804',
    course: 'IT Project Management',
    framework: 'Project post-mortem',
    title,
    source: 'Prepared from MBI804 Lesson 1 · Blended Teaching Content',
    fileName: `MBI804-post-mortem-${slug}`,
    blocks: [
      {
        label: 'What actually moved',
        caption: 'Scope, time, cost — or quality, which is the one nobody declares.',
        tag: values.corner || undefined,
        body: values.corner_note ?? '',
      },
      {
        label: 'The delay',
        caption: 'A slip only costs the end date if something downstream was waiting on it.',
        tag: values.moved ? `End date: ${values.moved.toLowerCase()}` : undefined,
        body: values.delay ?? '',
      },
      {
        label: 'Methodology',
        caption: 'The argument has to come from the project’s attributes, not from preference.',
        tag: methodTag,
        body: values.method_why ?? '',
      },
      {
        label: 'The risk nobody named',
        caption: 'Could a reasonable person have named it at kick-off?',
        tag: values.response ? `Response: ${values.response}` : undefined,
        body: values.risk ?? '',
      },
      {
        label: 'What I would change',
        caption: 'One change, with the moment it would have had to happen.',
        body: values.change ?? '',
      },
    ],
  };
}

export default function PostMortemBuilder() {
  return (
    <LessonBuilder
      storageKey="mbi804-postmortem-draft"
      steps={STEPS}
      preview={values => <Sheet values={values} />}
      toArtefact={toArtefact}
      privacyNote="Everything you type stays in this browser and is saved as you go. Nothing is uploaded, so you can name what really happened — bring the printed page to class instead."
    />
  );
}
