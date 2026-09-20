// ─── The practice scenario (MBI804 · peer audit activity) ─────────────────
// A worked example for the audit trainer, in exactly the shape a Lesson 1
// post-mortem artefact comes out in — the same six fields, the same labels,
// the same author's voice — so a student who trains here recognises the real
// thing when the activity hands them one.
//
// It is FICTIONAL, and says so on the page. The real scenarios are
// classmates' own write-ups about their own workplaces, and they live behind
// the activity site the lecturer runs, never on a public page.
//
// It is written to be genuinely auditable rather than obviously wrong: every
// one of the four audit questions has a defensible answer with evidence in
// the text, and in each case the author's own verdict is the plausible wrong
// answer. The moves it rewards — spotting a reclassification, checking a
// methodology against the project rather than the ceremonies, separating a
// closed defect from an open risk, and testing whether a fix touches the
// thing that actually mattered — are the four the activity is marked on.

export interface ScenarioField {
  /** The field's name, as the post-mortem sheet prints it. */
  label: string;
  /** The author's own one-line verdict, shown as a tag. */
  tag?: string;
  body: string;
}

export const PRACTICE_TITLE =
  'Replacing the paper sign-in sheet at a community health clinic with a tablet kiosk';

export const PRACTICE_BYLINE =
  'A fictional post-mortem, written for practice in the same six fields a real one uses';

export const PRACTICE_FIELDS: ScenarioField[] = [
  {
    label: 'What actually moved',
    tag: 'Time',
    body:
      'We said eight weeks and it took eleven, so time is the one that gave. Scope held — every feature on the original list shipped — and we did not go over budget. The extra three weeks went on the kiosk crashing when two people tapped at once, and on waiting for the clinic’s IT person to come back from leave to open a port for us. We did drop the large-text mode and the screen-reader labels near the end, and the paper sheet stayed on the desk as a backup because we ran out of time to test what happens when the kiosk is offline, but those were not really features, they were nice-to-haves we had talked about rather than promised.',
  },
  {
    label: 'The delay',
    tag: 'End date: yes, eventually',
    body:
      'Three weeks late in total. The crash under two simultaneous taps took two weeks to find and fix because we could only reproduce it on the real device. The port took another week, and there was nothing to do while we waited — the IT person was the only one with the rights and he was away. Nothing outside the project was waiting on us. The clinic just kept using paper for three more weeks and the manager was relaxed about it.',
  },
  {
    label: 'Methodology',
    tag: 'Run as Agile, called for Agile',
    body:
      'We ran it in two-week sprints with a standup every morning and a board, so it was Agile, and I think that was right for it. The requirements did move — the manager kept thinking of things once she saw the screens. We showed the working kiosk to the clinic at the end of week ten, a week before go-live, and she asked for three changes, which we did in the last week. If we had written a specification up front we would have got it wrong, so Agile was the right call.',
  },
  {
    label: 'The risk nobody named',
    tag: 'Response: Mitigate',
    body:
      'Nobody wrote down that the clinic’s IT was one person. We should have mitigated it by getting a second person with admin rights named at the start, or by asking for the port to be opened in week one instead of week nine.',
  },
  {
    label: 'What the original author would change',
    body:
      'I would have asked for the port in week one instead of week nine. That is the three weeks, and everything else went fine. The receptionist did say in the second week that she would rather keep the paper sheet, but she came round once she saw it working.',
  },
];
