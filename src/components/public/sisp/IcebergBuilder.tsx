import LessonBuilder, { type BuilderStep, type BuilderValues } from '../../blend/LessonBuilder';
import { ICEBERG_LAYERS } from './icebergCase';
import type { Artefact } from '../../../lib/artefactPdf';

// ─── Your own incident, down all four layers ──────────────────────────────
// The lesson asks a student to bring one system that annoys them. This is
// where they build it, and the sheet on the right is what they bring.
//
// The five questions are the four Iceberg layers plus the one the model
// exists to make possible: having found the belief underneath, where would
// you actually intervene? That last step is what turns a description into
// the recommendation LO1 asks for, and it is the reason the activity is
// worth doing rather than reading.
//
// The sheet indents each layer less than the one above it, so the shape
// widens as it deepens. It is the iceberg from the section above, holding
// the student's own words instead of mine.

const LAYER_CHOICES = [
  { value: 'Events', label: 'Events' },
  { value: 'Patterns of behaviour', label: 'Patterns' },
  { value: 'Structures', label: 'Structures' },
  { value: 'Mental models', label: 'Mental models' },
];

const STEPS: BuilderStep[] = [
  {
    id: 'name',
    label: 'The incident',
    eyebrow: 'Start here',
    question: 'What are you taking apart?',
    hint: 'Something you actually watched happen. An outage, a breach, a rollout nobody adopted, a process everybody works around.',
    fields: [
      {
        kind: 'line',
        id: 'name',
        label: 'One line',
        placeholder: 'The booking system went down on our busiest day',
      },
    ],
  },
  {
    id: 'event',
    label: 'Events',
    eyebrow: 'Layer 1 of 4 · what happened',
    question: 'What happened, exactly once?',
    hint: 'Only what an observer could have seen. No causes yet, and no blame — those belong further down.',
    fields: [
      {
        kind: 'text',
        id: 'event',
        label: 'The event',
        placeholder: 'On the morning of the sale, the booking page returned an error for about four hours…',
      },
    ],
    example: { label: 'How the worked case answered this', body: ICEBERG_LAYERS[0].body },
  },
  {
    id: 'pattern',
    label: 'Patterns',
    eyebrow: 'Layer 2 of 4 · what keeps happening',
    question: 'What has been happening, more than once?',
    hint: 'Zoom out from the single day. Has this class of thing happened before, here or somewhere you have worked? What does it cluster around?',
    fields: [
      {
        kind: 'text',
        id: 'pattern',
        label: 'The pattern',
        placeholder: 'It goes down every time we run a promotion, and always in the first hour…',
      },
    ],
    example: { label: 'How the worked case answered this', body: ICEBERG_LAYERS[1].body },
  },
  {
    id: 'structure',
    label: 'Structures',
    eyebrow: 'Layer 3 of 4 · what makes it possible',
    question: 'What arrangement produces that pattern?',
    hint: 'Policies, architecture, workflows, who is allowed to approve what, how the budget is split. The things that would still be true tomorrow if everybody involved changed jobs today.',
    fields: [
      {
        kind: 'text',
        id: 'structure',
        label: 'The structure',
        placeholder: 'Marketing schedules promotions without telling engineering, and there is no load test before a campaign…',
      },
    ],
    example: { label: 'How the worked case answered this', body: ICEBERG_LAYERS[2].body },
  },
  {
    id: 'belief',
    label: 'Mental models',
    eyebrow: 'Layer 4 of 4 · what holds it in place',
    question: 'What belief made that arrangement seem reasonable?',
    hint: 'Nobody wrote this one down, which is why it is the hard one. It often helps to finish the sentence: we assumed that…',
    fields: [
      {
        kind: 'text',
        id: 'belief',
        label: 'The belief',
        placeholder: 'We assumed that a marketing decision is not a technical decision…',
      },
    ],
    example: { label: 'How the worked case answered this', body: ICEBERG_LAYERS[3].body },
  },
  {
    id: 'act',
    label: 'Your move',
    eyebrow: 'The point of the model',
    question: 'Where would you intervene, and with what?',
    hint: 'Pick the layer you would act at, then say what you would actually do. Acting deeper is more durable and slower to show a result, and both halves of that are worth defending.',
    fields: [
      { kind: 'choice', id: 'layer', label: 'The layer you would act at', options: LAYER_CHOICES },
      {
        kind: 'text',
        id: 'action',
        label: 'What you would do',
        placeholder: 'Put a promotion on the engineering calendar as a release, with a load test as its gate…',
        enough: 50,
      },
    ],
  },
];

const ROWS: { id: string; label: string; inset: number; caption: string }[] = [
  { id: 'event', label: 'Events', inset: 42, caption: 'What happened, exactly once.' },
  { id: 'pattern', label: 'Patterns of behaviour', inset: 28, caption: 'What has been happening, more than once.' },
  { id: 'structure', label: 'Structures', inset: 14, caption: 'The arrangement that produces the pattern.' },
  { id: 'belief', label: 'Mental models', inset: 0, caption: 'The belief that holds the arrangement in place.' },
];

const PLACEHOLDER: Record<string, string> = {
  event: 'Not yet answered.',
  pattern: 'Not yet answered.',
  structure: 'Not yet answered.',
  belief: 'Not yet answered.',
};

function Sheet({ values }: { values: BuilderValues }) {
  const title = values.name?.trim();
  return (
    <div className="bt-sheet2">
      <div className="bt-sheet2__head">
        <span className="bt-sheet2__code">MBI800 · The Iceberg Model</span>
        <span className="bt-sheet2__code">Lesson 1</span>
      </div>

      <p className={`bt-sheet2__title${title ? '' : ' bt-sheet2__title--empty'}`}>
        {title || 'Your incident goes here'}
      </p>

      <div className="bt-sheet2__rows">
        {ROWS.map((row, i) => {
          const body = values[row.id]?.trim();
          return (
            <div key={row.id}>
              <div
                className={`bt-sheet2__row${body ? ' bt-sheet2__row--filled' : ''}`}
                style={{ ['--inset' as string]: `${row.inset}px` }}
              >
                <div className="bt-sheet2__rowhead">
                  <span className="bt-sheet2__label">{row.label}</span>
                  {values.layer === row.label && <span className="bt-sheet2__tag">You would act here</span>}
                </div>
                <p className={`bt-sheet2__body${body ? '' : ' bt-sheet2__body--empty'}`}>
                  {body || PLACEHOLDER[row.id]}
                </p>
              </div>
              {i === 0 && (
                <div className="bt-sheet2__line" aria-hidden="true">
                  <span>Waterline</span>
                  <i />
                </div>
              )}
            </div>
          );
        })}

        <div className={`bt-sheet2__row${values.action?.trim() ? ' bt-sheet2__row--filled' : ''}`}>
          <div className="bt-sheet2__rowhead">
            <span className="bt-sheet2__label">What you would do</span>
            {values.layer && <span className="bt-sheet2__tag">{values.layer}</span>}
          </div>
          <p className={`bt-sheet2__body${values.action?.trim() ? '' : ' bt-sheet2__body--empty'}`}>
            {values.action?.trim() || 'Not yet answered.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function toArtefact(values: BuilderValues): Artefact {
  const title = values.name?.trim() || 'An incident, taken apart';
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'iceberg';
  return {
    code: 'MBI800',
    course: 'Strategic Information Systems Planning',
    framework: 'The Iceberg Model',
    title,
    source: 'Prepared from MBI800 Lesson 1 · Blended Teaching Content',
    fileName: `MBI800-iceberg-${slug}`,
    blocks: [
      ...ROWS.map(r => ({
        label: r.label,
        caption: r.caption,
        body: values[r.id] ?? '',
      })),
      {
        label: 'Where I would intervene',
        caption: 'Deeper is more durable, and slower to show a result. Both halves are worth defending.',
        tag: values.layer || undefined,
        body: values.action ?? '',
      },
    ],
  };
}

export default function IcebergBuilder() {
  return (
    <LessonBuilder
      storageKey="mbi800-iceberg-draft"
      steps={STEPS}
      preview={values => <Sheet values={values} />}
      toArtefact={toArtefact}
      privacyNote="Everything you type stays in this browser and is saved as you go. Nothing is uploaded, and I cannot see it — bring the printed page to class instead."
    />
  );
}
