import LessonBuilder, { type BuilderStep, type BuilderValues } from '../../blend/LessonBuilder';
import type { Artefact } from '../../../lib/artefactPdf';

// ─── The Corrective Action Plan, built one field at a time ────────────────
// The activity's second deliverable is a one-page plan handed to the
// assigned project's sponsor. It has six required parts, and the commonest
// way it goes wrong is that a student writes six paragraphs of analysis
// where six short, committing sentences were asked for.
//
// So the fields enforce the shape rather than the length: single lines for
// the problem statement and root cause, a named response strategy chosen
// from the four, and two next actions that cannot be written without an
// owner and a timeframe beside them. A plan whose actions have no owner is
// a wish list, and the form makes that visible before a marker has to.
//
// It runs on the same builder as the Lesson 1 post-mortem — everything stays
// in the browser, nothing is uploaded, and the export is a plain PDF the
// student attaches to their audit report.

const METHODS = [
  { value: 'No change needed', label: 'No change needed' },
  { value: 'Agile', label: 'Move to Agile' },
  { value: 'Waterfall', label: 'Move to Waterfall' },
  { value: 'PRINCE2', label: 'Add PRINCE2 governance' },
  { value: 'Keep the framework, fix the practice', label: 'Keep the framework, fix the practice' },
];

const RESPONSES = [
  { value: 'Avoid', label: 'Avoid' },
  { value: 'Mitigate', label: 'Mitigate' },
  { value: 'Transfer', label: 'Transfer' },
  { value: 'Accept', label: 'Accept' },
];

const STEPS: BuilderStep[] = [
  {
    id: 'project',
    label: 'The project',
    eyebrow: 'Start here',
    question: 'Which project is this plan for?',
    hint: 'The project you were assigned, in the author’s own words or your own. This is the plan’s header, not a finding.',
    fields: [
      { kind: 'line', id: 'project', label: 'One line', placeholder: 'A tablet sign-in kiosk for a community health clinic' },
    ],
  },
  {
    id: 'problem',
    label: 'Problem',
    eyebrow: 'Part 1 of 6',
    question: 'The problem statement, in one sentence.',
    hint: 'What is wrong now, stated so the sponsor recognises it. Not the history, not the blame — the condition that still exists today.',
    fields: [
      {
        kind: 'line',
        id: 'problem',
        label: 'One sentence',
        placeholder: 'Patients who cannot use a touchscreen have no reliable way to sign in since the paper sheet was removed.',
      },
    ],
    example: {
      label: 'What a good answer does here',
      body: 'It describes a present condition, not a past event. “The project ran three weeks late” is history and the sponsor can do nothing with it. “Patients who cannot use a touchscreen have no reliable way to sign in” is a problem that is still happening this morning, and it points at an action.',
    },
  },
  {
    id: 'cause',
    label: 'Root cause',
    eyebrow: 'Part 2 of 6',
    question: 'The root cause, in one sentence.',
    hint: 'Not the last thing that went wrong — the thing that made it likely. Keep asking “and why was that?” until the answer is a decision somebody made rather than an event that happened.',
    fields: [
      {
        kind: 'line',
        id: 'cause',
        label: 'One sentence',
        placeholder: 'Every requirement was taken from the clinic manager, and the people who use the system daily were never consulted.',
      },
    ],
    example: {
      label: 'What a good answer does here',
      body: 'It lands on a decision rather than an incident. “The accessibility work was cut” is an event. “Accessibility was scheduled last, so it was the only thing left to cut when the schedule tightened” is a cause — and it names something a sponsor can change for the next project as well as this one.',
    },
  },
  {
    id: 'method',
    label: 'Methodology',
    eyebrow: 'Part 3 of 6',
    question: 'What methodology adjustment do you recommend?',
    hint: 'If none is needed, say so — that is a legitimate answer and a stronger one than a change you cannot justify. Either way the reason is one line, argued from this project’s attributes.',
    fields: [
      { kind: 'choice', id: 'method', label: 'The adjustment', options: METHODS },
      {
        kind: 'line',
        id: 'method_why',
        label: 'The reason, in one line',
        placeholder: 'The framework was right; what was missing was a usable increment in front of a real user every sprint.',
      },
    ],
    example: {
      label: 'What a good answer does here',
      body: 'It distinguishes the framework from the practice. A project that holds standups but never shows working software to a user does not need a different methodology — it needs the one it claims to have. Recommending a switch where the practice is the problem is the commonest weak answer in this section.',
    },
  },
  {
    id: 'risk',
    label: 'Top risk',
    eyebrow: 'Part 4 of 6',
    question: 'The top risk, and the response strategy you would name for it.',
    hint: 'One risk, not a register. Choose the response from the four, and remember that mitigating is the default everybody reaches for — when the consequence lands on a person rather than a date, it is often the wrong one.',
    fields: [
      {
        kind: 'text',
        id: 'risk',
        label: 'The risk, and what it would cost',
        placeholder: 'A patient who cannot use the kiosk is not signed in and is not seen. Low likelihood on any given day, and the consequence is somebody missing care…',
        enough: 60,
      },
      { kind: 'choice', id: 'response', label: 'Response strategy', options: RESPONSES },
    ],
    example: {
      label: 'What a good answer does here',
      body: 'It states the consequence before the likelihood, and picks the response from the consequence. A one-in-a-thousand chance of somebody not being seen at a clinic is not a mitigate — it is an avoid, because the residual risk after mitigation is still a person who did not get care.',
    },
  },
  {
    id: 'action1',
    label: 'Action 1',
    eyebrow: 'Part 5 of 6',
    question: 'First next action — what, who, and by when.',
    hint: 'Something a named person could start on Monday. If you cannot name the owner, the action is not concrete enough yet.',
    fields: [
      { kind: 'line', id: 'a1_what', label: 'The action', placeholder: 'Reinstate a staffed sign-in path that does not depend on the kiosk' },
      { kind: 'line', id: 'a1_who', label: 'Owner', placeholder: 'Clinic manager' },
      { kind: 'line', id: 'a1_when', label: 'By when', placeholder: 'Within two weeks' },
    ],
    example: {
      label: 'What a good answer does here',
      body: 'An owner is a role or a person, never “the team”. A timeframe is a date or a number of weeks, never “as soon as possible”. Both of those substitutions are how an action plan turns into a statement of intent that nobody can be asked about later.',
    },
  },
  {
    id: 'action2',
    label: 'Action 2',
    eyebrow: 'Part 6 of 6',
    question: 'Second next action — what, who, and by when.',
    hint: 'Make this one different in kind from the first. Two versions of the same fix is one action with two sentences.',
    fields: [
      { kind: 'line', id: 'a2_what', label: 'The action', placeholder: 'Run one sign-in session with the receptionist and two patients, and log what fails' },
      { kind: 'line', id: 'a2_who', label: 'Owner', placeholder: 'Project lead' },
      { kind: 'line', id: 'a2_when', label: 'By when', placeholder: 'Before the next sprint review' },
    ],
  },
];

function line(values: BuilderValues, what: string, who: string, when: string): string {
  const w = values[what]?.trim();
  if (!w) return '';
  const owner = values[who]?.trim();
  const by = values[when]?.trim();
  const tail = [owner && `owner: ${owner}`, by && `by: ${by}`].filter(Boolean).join(' · ');
  return tail ? `${w} (${tail})` : w;
}

function Sheet({ values }: { values: BuilderValues }) {
  const title = values.project?.trim();
  const rows: { label: string; body: string; tag?: string }[] = [
    { label: 'Problem statement', body: values.problem ?? '' },
    { label: 'Root cause', body: values.cause ?? '' },
    { label: 'Methodology adjustment', body: values.method_why ?? '', tag: values.method || undefined },
    { label: 'Top risk', body: values.risk ?? '', tag: values.response || undefined },
    { label: 'Next action 1', body: line(values, 'a1_what', 'a1_who', 'a1_when') },
    { label: 'Next action 2', body: line(values, 'a2_what', 'a2_who', 'a2_when') },
  ];

  return (
    <div className="bt-sheet2">
      <div className="bt-sheet2__head">
        <span className="bt-sheet2__code">MBI804 · Corrective Action Plan</span>
        <span className="bt-sheet2__code">Peer audit</span>
      </div>

      <p className={`bt-sheet2__title${title ? '' : ' bt-sheet2__title--empty'}`}>
        {title || 'The project you were assigned'}
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
  const title = values.project?.trim() || 'Corrective Action Plan';
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'corrective-action-plan';

  return {
    code: 'MBI804',
    course: 'IT Project Management',
    framework: 'Corrective Action Plan',
    title,
    source: 'Prepared from the MBI804 peer audit activity · Blended Teaching Content',
    fileName: `MBI804-corrective-action-plan-${slug}`,
    blocks: [
      {
        label: 'Problem statement',
        caption: 'A condition that still exists today, in one sentence.',
        body: values.problem ?? '',
      },
      {
        label: 'Root cause',
        caption: 'A decision somebody made, not the last event before the failure.',
        body: values.cause ?? '',
      },
      {
        label: 'Methodology adjustment',
        caption: 'Argued from this project’s attributes. “None needed” is a legitimate answer.',
        tag: values.method || undefined,
        body: values.method_why ?? '',
      },
      {
        label: 'Top risk',
        caption: 'Consequence first, then likelihood — the consequence is what picks the response.',
        tag: values.response ? `Response: ${values.response}` : undefined,
        body: values.risk ?? '',
      },
      {
        label: 'Next action 1',
        caption: 'Something a named person could start on Monday.',
        body: line(values, 'a1_what', 'a1_who', 'a1_when'),
      },
      {
        label: 'Next action 2',
        caption: 'Different in kind from the first, not a second version of it.',
        body: line(values, 'a2_what', 'a2_who', 'a2_when'),
      },
    ],
  };
}

export default function CorrectiveActionBuilder() {
  return (
    <LessonBuilder
      storageKey="mbi804-corrective-action-draft"
      steps={STEPS}
      preview={values => <Sheet values={values} />}
      toArtefact={toArtefact}
      privacyNote="Everything you type stays in this browser and is saved as you go. Nothing is uploaded from this page — export the PDF and attach it to the report you submit through the activity site."
    />
  );
}
