// The worked case both the Iceberg explorer and the build-your-own activity
// run on, kept in one place so the model answer a student compares against is
// literally the same text they read a screen earlier.
//
// The CrowdStrike content update of 19 July 2024, chosen because the Events
// layer was reported everywhere and the three layers underneath it were
// reported almost nowhere.

export interface IcebergLayer {
  title: string;
  kicker: string;
  question: string;
  body: string;
  ask: string;
}

export const ICEBERG_LAYERS: IcebergLayer[] = [
  {
    title: 'Events',
    kicker: 'what happened',
    question: 'What is happening?',
    body: 'On 19 July 2024 a faulty content update from a security vendor crashed Windows machines worldwide. Flights were grounded, hospital systems went dark, payment terminals stopped. This is the layer that gets reported, and the only one visible without going looking for the rest.',
    ask: 'React here and you restore service. Nothing about the next one has changed.',
  },
  {
    title: 'Patterns of behaviour',
    kicker: 'what keeps happening',
    question: 'What has been happening, over and over?',
    body: 'Ask what recurs rather than what occurred. Outages of this class cluster around urgent updates pushed outside the normal review window — in every vendor, for years. Seen as a pattern, one event stops looking like bad luck and starts looking like a schedule.',
    ask: 'Patterns turn a one-off into something you can plan against.',
  },
  {
    title: 'Structures',
    kicker: 'what makes it possible',
    question: 'What arrangement produces that pattern?',
    body: 'The policies, architecture, workflows and resource allocations underneath it: kernel-level deployment with no staged rollout, no canary ring, and a channel classified as content rather than as code, so it skipped the review that code gets.',
    ask: 'Change a structure and you change every future event it would have produced.',
  },
  {
    title: 'Mental models',
    kicker: 'what holds it in place',
    question: 'What belief made that arrangement seem reasonable?',
    body: 'That a vendor security update is low-risk enough not to need staged deployment. Nobody wrote it down. Everybody acted on it, and every structure above was built to match.',
    ask: 'The least visible layer, and the one with the most leverage of all.',
  },
];
