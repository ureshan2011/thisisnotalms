import { useState } from 'react';
import { Quiz, Recap, Reveal, SectionHead, type QuizQuestion } from '../blend';

// ─── MBI800 · APA 7 citations: the crash course ───────────────────────────
// A public, ungated page in Blend (src/components/blend/README.md), running on
// MBI800's indigo through the `planning` accent set by the shell. It replaces
// the old 14-slide deck, which sat behind a client-side password; there is no
// gate of any kind on this one.
//
// The teaching content is the deck's, in the same order: why cite, when to
// cite, in-text citations, quotes, the reference list, the five common
// mistakes, then the eight-question check. Where the deck carried a
// placeholder or a mislabelled example (a conference paper with a DOI of
// "xxxxxxx" that was really a journal article), the example here is a real,
// checkable source instead.
//
// Nothing is stored. The check keeps no score anywhere.

const OBJECTIVES = [
  'Say why a claim needs a citation, and tell when it does not',
  'Write parenthetical and narrative in-text citations, including the APA 7 rule for three or more authors',
  'Tell a short quotation from a block quotation, and format each one',
  'Build a reference list entry from its four parts for the six common source types',
  'Spot the five mistakes that cost the most marks, and fix them',
];

const LESSON_META: [string, string][] = [
  ['Reading', '20 minutes'],
  ['Assumes', 'nothing'],
  ['Ends with', 'an 8-question check'],
];

// ── Why cite ─────────────────────────────────────────────────────────────
const PILLARS: [string, string, string][] = [
  [
    'They protect you',
    'Using someone’s idea without credit is plagiarism, even by accident. A citation is your proof that you know which thinking is yours and which is somebody else’s. With no citation, you have no defence.',
    'Academic integrity',
  ],
  [
    'They strengthen you',
    '“Immersion increases presence” is an opinion. “Immersion increases presence (Slater, 2009)” is a claim with research behind it. Same sentence, completely different weight.',
    'Evidence is credibility',
  ],
  [
    'They invite conversation',
    'Academic writing is not a monologue. It is you placing your ideas inside a debate that was already going, and citations show you have been listening and know who said what first.',
    'Join the scholarly conversation',
  ],
];

// ── When to cite ─────────────────────────────────────────────────────────
const WHEN_TO_CITE: [string, string][] = [
  [
    'Facts, statistics and findings',
    'Any fact that came from a specific study, dataset or report. Even if it is widely known in your field, if it has a source, cite it. “87% of Agile teams use Scrum” needs the State of Agile report behind it.',
  ],
  [
    'Arguments and theories',
    'Someone else’s argument, model or framework, even when you paraphrase it. You are using their intellectual work. Presence theory, the Agile Manifesto and the TAM model all need citations.',
  ],
  [
    'Definitions',
    '“Presence is defined as…” is somebody’s definition, so whose? Even for widely agreed terms, citing the first or key theorist shows depth and awareness.',
  ],
  [
    'Direct quotes',
    'Any word-for-word text needs quote marks, the author, the year and a page number. Even one distinctive phrase taken verbatim needs a page-level citation.',
  ],
  [
    'Scales and instruments',
    'Surveys, questionnaires and measurement scales designed by others. The Presence Questionnaire, the SUS and the TAM scales all have original authors who must be credited.',
  ],
  [
    'Your own earlier work',
    'Yes, even work you published yourself. Reusing your own ideas without citing them is self-plagiarism. If it was published elsewhere, treat it like any other source.',
  ],
];

const WHEN_NOT_TO_CITE: [string, string][] = [
  ['Common knowledge', '“The internet is widely used” needs no citation. Any reasonably educated person already knows it.'],
  ['Mathematical or logical facts', '“The sample had 24 participants split into 4 groups of 6” is your own arithmetic. No source needed.'],
  ['Your own original analysis', 'Your interpretation, argument and conclusions are your contribution. Don’t undercut them by citing someone else. Own them.'],
  ['Your own firsthand observations', 'Things you observed, measured or found in your own study. “Participants reported feeling dizzy” is your data.'],
];

// ── In-text citations ────────────────────────────────────────────────────
const CHEAT_SHEET: [string, string, string][] = [
  ['One author', '(Author, Year)', '(Slater, 2009)'],
  ['Two authors', '(Author & Author, Year)', '(Slater & Sanchez-Vives, 2016)'],
  ['Three or more authors', 'First author + et al., from the first use', '(Cummings et al., 2020)'],
  ['Organisation, first mention', '(Full Name [ABBR], Year)', '(World Health Organization [WHO], 2022)'],
  ['Organisation, after that', '(Abbreviation, Year)', '(WHO, 2022)'],
  ['No date available', '(Author, n.d.)', '(Smith, n.d.)'],
  ['Same author, same year', '(Author, Yeara, Yearb)', '(Brown, 2021a, 2021b)'],
  ['Several sources together', '(Auth1 & Auth2, Year; Auth3, Year)', '(Milgram & Kishino, 1994; Witmer & Singer, 1998)'],
  ['Direct quote', '(Author, Year, p. N)', '(Witmer & Singer, 1998, p. 225)'],
];

// ── Reference list ───────────────────────────────────────────────────────
interface Seg { t: string; i?: boolean }

const FOUR_PARTS: { key: string; label: string; rule: string; segs: Seg[] }[] = [
  {
    key: 'who',
    label: 'Who',
    rule: 'Last name, then initials. For several authors: Last, I., & Last, I.',
    segs: [{ t: 'Slater, M.' }],
  },
  {
    key: 'when',
    label: 'When',
    rule: 'The year of publication in brackets, then a full stop. Use n.d. when the source has no date.',
    segs: [{ t: '(2009).' }],
  },
  {
    key: 'what',
    label: 'What',
    rule: 'The title in sentence case. An article title is plain; a book or report title is italic.',
    segs: [{ t: 'Place illusion and plausibility can lead to realistic behaviour in immersive virtual environments.' }],
  },
  {
    key: 'where',
    label: 'Where',
    rule: 'Where a reader can find it: the journal, volume, issue and pages, or the publisher, then a DOI. Always prefer a DOI to a URL.',
    segs: [
      { t: 'Philosophical Transactions of the Royal Society B, 364', i: true },
      { t: '(1535), 3549–3557. https://doi.org/10.1098/rstb.2009.0138' },
    ],
  },
];

interface SourceExample {
  name: string;
  segs: Seg[];
  notes: string[];
}

const SOURCE_TYPES: SourceExample[] = [
  {
    name: 'Journal article',
    segs: [
      { t: 'Slater, M. (2009). Place illusion and plausibility can lead to realistic behaviour in immersive virtual environments. ' },
      { t: 'Philosophical Transactions of the Royal Society B, 364', i: true },
      { t: '(1535), 3549–3557. https://doi.org/10.1098/rstb.2009.0138' },
    ],
    notes: [
      'The article title is in sentence case, with no italics.',
      'The journal name is in Title Case, and it and the volume number are italic.',
      'Always use the https://doi.org/ prefix.',
    ],
  },
  {
    name: 'Book',
    segs: [
      { t: 'Sherman, W. R., & Craig, A. B. (2018). ' },
      { t: 'Understanding virtual reality: Interface, application, and design', i: true },
      { t: ' (2nd ed.). Morgan Kaufmann.' },
    ],
    notes: [
      'The book title is italic and in sentence case.',
      'Put the edition in brackets if it is not the first.',
      'Publisher name only. APA 7 no longer wants the location.',
    ],
  },
  {
    name: 'Webpage',
    segs: [
      { t: 'University of Canterbury. (2023, August 1). ' },
      { t: 'HIT Lab NZ research overview', i: true },
      { t: '. https://www.hitlabnz.org' },
    ],
    notes: [
      'Include the specific date if the page shows one.',
      'The page title is italic, in sentence case.',
      'No “Retrieved from” in APA 7.',
    ],
  },
  {
    name: 'Book chapter',
    segs: [
      { t: 'Steuer, J. (1995). Defining virtual reality: Dimensions determining telepresence. In F. Biocca & M. R. Levy (Eds.), ' },
      { t: 'Communication in the age of virtual reality', i: true },
      { t: ' (pp. 33–56). Lawrence Erlbaum Associates.' },
    ],
    notes: [
      'The chapter’s author comes first, and the editors follow “In”.',
      'Only the book title is italic. The chapter title is plain.',
      'Give the page range as (pp. x–x).',
    ],
  },
  {
    name: 'Conference paper',
    segs: [
      { t: 'Sutherland, I. E. (1968). A head-mounted three dimensional display. In ' },
      { t: 'Proceedings of the December 9–11, 1968, Fall Joint Computer Conference, Part I', i: true },
      { t: ' (pp. 757–764). ACM. https://doi.org/10.1145/1476589.1476686' },
    ],
    notes: [
      'The proceedings title is italic, like a book.',
      'Include the publisher, such as ACM, IEEE or Springer.',
      'A DOI is strongly preferred to a URL.',
    ],
  },
  {
    name: 'Software',
    segs: [
      { t: 'Unity Technologies. (2023). ' },
      { t: 'Unity', i: true },
      { t: ' (Version 2022.3 LTS) [Computer software]. https://unity.com' },
    ],
    notes: [
      'The software name is italic.',
      'The version number goes in plain brackets after the name.',
      '[Computer software] follows the title as a descriptor.',
    ],
  },
];

// ── Five mistakes ────────────────────────────────────────────────────────
const MISTAKES: [string, string][] = [
  [
    'Muddling et al. when names clash',
    'Two papers share a first author and a year. APA says to write enough names to tell them apart, then use et al. Don’t assume the first name is enough.',
  ],
  [
    'Using ibid. or op. cit.',
    'Those footnote shorthands belong to Chicago and Oxford style. APA never uses them. Repeat the full author–year citation every time.',
  ],
  [
    'Citing only the abstract',
    'If you read only the abstract, you read only part of the paper. Don’t cite findings from sections you haven’t read. Read the paper, then cite it.',
  ],
  [
    'Padding the reference list',
    'An APA reference list holds only the sources cited in the text, and nothing extra. A bibliography includes background reading, and APA doesn’t. Remove anything you didn’t cite.',
  ],
  [
    'Missing DOIs and raw URLs',
    'Search for a DOI before you reach for a plain URL. DOIs are permanent and URLs rot. Always use the https://doi.org/ prefix, not dx.doi.org and not the bare number.',
  ],
];

// ── The check ────────────────────────────────────────────────────────────
const CHECK: QuizQuestion[] = [
  {
    q: 'In APA 7, how do you cite a source with three or more authors for the very first time?',
    answer: 1,
    options: [
      { text: 'Write all the author names in full', why: 'That was the APA 6 rule for up to five authors on first mention. APA 7 dropped it.' },
      { text: 'First author + et al., from the first citation', why: 'That’s it. (Cummings et al., 2020) from the very first time you cite the source. There is no first mention in full any more.' },
      { text: 'Write the first three names, then et al.', why: 'APA has no “first three, then et al.” step. The shortening is used from the first citation, not after it.' },
      { text: 'Write only the first author’s last name', why: 'Without et al. it reads as a single-author source, which misrepresents who wrote it.' },
    ],
  },
  {
    q: 'What does “n.d.” stand for in a citation like (Smith, n.d.)?',
    answer: 1,
    options: [
      { text: 'Not documented', why: 'Nothing about the source is undocumented. The only thing missing is its date.' },
      { text: 'No date', why: 'Right. It marks a source with no identifiable publication date, which is common on websites and for unpublished work.' },
      { text: 'Not determined', why: 'It isn’t a verdict on anything. It simply fills the year slot when there is no year.' },
      { text: 'No digital copy', why: 'It says nothing about format or where the source lives. It is about the date only.' },
    ],
  },
  {
    q: 'What is the minimum word count that turns a quotation into a block quote in APA 7?',
    answer: 2,
    options: [
      { text: '25 words', why: '25 is not an APA threshold. A 30-word quote stays inline, in quotation marks.' },
      { text: '30 words', why: 'Still inline. Thirty words is well short of the point where APA changes the format.' },
      { text: '40 words', why: 'That’s it. Forty or more words becomes a block quote: its own indented paragraph, no quotation marks, with the citation after the final full stop.' },
      { text: '50 words', why: 'That would leave a 45-word quotation inline, and APA wants it as a block.' },
    ],
  },
  {
    q: 'Which is the correct APA 7 in-text format for two authors?',
    answer: 1,
    options: [
      { text: '(Brown and Jones, 2021)', why: 'The word “and” belongs in the sentence, as in Brown and Jones (2021). Inside brackets, APA uses an ampersand.' },
      { text: '(Brown & Jones, 2021)', why: 'Right. An ampersand inside the brackets. Use “and” only when the authors are part of the sentence itself.' },
      { text: '(Brown, Jones, 2021)', why: 'Two commas and no ampersand reads as a list, not as two authors of one work.' },
      { text: '(Brown-Jones, 2021)', why: 'A hyphen makes it one double-barrelled surname, so it names a different person.' },
    ],
  },
  {
    q: 'In what order do you arrange an APA 7 reference list?',
    answer: 1,
    options: [
      { text: 'By year, newest first', why: 'Year only sorts entries by the same author, and there it runs oldest first.' },
      { text: 'Alphabetically by the first author’s surname', why: 'That’s it. Always alphabetical by first author’s surname, and same-author entries are then sorted by year, oldest first.' },
      { text: 'In the order each source first appears in the text', why: 'That is how numbered styles such as IEEE and Vancouver work. APA is author–year, so it sorts by author.' },
      { text: 'By type, with books before articles', why: 'APA doesn’t group a list by source type. Everything sits in one alphabetical list.' },
    ],
  },
  {
    q: 'Which DOI format is correct in APA 7?',
    answer: 2,
    options: [
      { text: 'doi:10.1234/example', why: 'That’s the older APA 6 pattern. APA 7 wants a full link.' },
      { text: 'dx.doi.org/10.1234/example', why: 'No longer recommended. The domain is doi.org, with the https:// in front.' },
      { text: 'https://doi.org/10.1234/example', why: 'That’s it. Always the https://doi.org/ prefix, so the DOI works as a link.' },
      { text: '10.1234/example', why: 'A bare number is incomplete. A reader can’t click it, and it doesn’t say what it is.' },
    ],
  },
  {
    q: 'Which title capitalisation is correct for a journal article in APA 7?',
    answer: 1,
    options: [
      { text: '“The Role of Presence in Virtual Reality” (Title Case)', why: 'Title Case is for the journal’s name, not for the title of the article inside it.' },
      { text: '“The role of presence in virtual reality” (sentence case)', why: 'That’s it. Capitalise only the first word, proper nouns, and the first word after a colon. The journal name stays in Title Case and italic.' },
      { text: '“THE ROLE OF PRESENCE IN VIRTUAL REALITY” (all caps)', why: 'APA never asks for all caps in a title.' },
      { text: '“the role of presence in virtual reality” (all lowercase)', why: 'The first word, and proper nouns, still take a capital letter.' },
    ],
  },
  {
    q: 'A paper has five reference list entries that are never cited in the text. What is the problem?',
    answer: 1,
    options: [
      { text: 'Nothing. A reference list works like a bibliography', why: 'A bibliography can include background reading. An APA reference list can’t.' },
      { text: 'An APA reference list holds only sources cited in the text, so these five are orphans', why: 'That’s it. Cite them where you used them, or take them out. A reference list is not a “further reading” list.' },
      { text: 'The five entries need page numbers', why: 'Page numbers go in the in-text citation for a direct quote. Their absence has nothing to do with an entry being uncited.' },
      { text: 'They belong in a separate “Further reading” section', why: 'APA has no such section. Anything you didn’t cite is left out of the paper.' },
    ],
  },
];

// ── Small pieces ─────────────────────────────────────────────────────────

/** A reference entry, with italics where APA wants them. */
function Entry({ segs, highlight }: { segs: Seg[]; highlight?: boolean }) {
  return (
    <>
      {segs.map((s, n) => (
        <span
          key={n}
          style={{
            fontStyle: s.i ? 'italic' : undefined,
            background: highlight ? 'var(--accent-100)' : undefined,
            color: highlight ? 'var(--accent-700)' : undefined,
            borderRadius: 4,
            padding: highlight ? '1px 3px' : undefined,
            transition: 'background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease)',
          }}
        >
          {s.t}
        </span>
      ))}
    </>
  );
}

/** Tap to read the reason a claim needs (or doesn't need) a citation. */
function RevealCard({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      className={`bt-flip${on ? ' bt-flip--on' : ''}`}
      aria-pressed={on}
      onClick={() => setOn(v => !v)}
    >
      <span className="bt-flip__kicker">{on ? title : kicker}</span>
      <span className="bt-flip__body">{on ? body : title}</span>
    </button>
  );
}

export default function APAReferencingLesson() {
  const [part, setPart] = useState<string>('who');
  const [source, setSource] = useState(0);

  const activePart = FOUR_PARTS.find(p => p.key === part) ?? FOUR_PARTS[0];
  const example = SOURCE_TYPES[source];

  return (
    <div>
      {/* ══ Lesson header ════════════════════════════════════════════════ */}
      <section id="why" className="bt-sec">
        <Reveal>
          <section className="bt-lessonhead" aria-labelledby="lessonhead-title">
            <div>
              <p className="bt-eyebrow">Academic writing</p>
              <h2 id="lessonhead-title">APA 7 citations: the crash course</h2>
              <p className="bt-lessonhead__lead">
                Every MBI800 assignment needs citations, and most lost marks on them come from a handful of
                habits. This lesson takes you from the first in-text citation to the last reference entry,
                and ends with a short check.
              </p>
              <p className="bt-lessonmeta">
                {LESSON_META.map(([label, value]) => (
                  <span key={label}>{label} <b>{value}</b></span>
                ))}
              </p>
            </div>
            <div>
              <p className="bt-eyebrow bt-eyebrow--quiet">By the end of this lesson you can</p>
              <ul className="bt-objectives">
                {OBJECTIVES.map(o => (
                  <li key={o}>
                    <span className="bt-objectives__ring" aria-hidden="true" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ marginTop: 52 }}>
            <SectionHead
              eyebrow="1 · Before the format"
              title="Why bother citing"
              stop="?"
              aside="Citations aren’t admin. They decide whether your reader believes you, and whether anyone can accuse you of taking credit for someone else’s work."
            />
          </div>
          <div className="bt-pairgrid bt-pairgrid--three">
            {PILLARS.map(([title, body, tag]) => (
              <div key={title} className="bt-card">
                <span className="bt-eyebrow bt-eyebrow--quiet" style={{ display: 'block' }}>{tag}</span>
                <h4 style={{ marginTop: 8 }}>{title}</h4>
                <p>{body}</p>
              </div>
            ))}
          </div>

          <div className="bt-caution">
            <p className="bt-eyebrow">The “says who?” test</p>
            <p>
              Imagine your marker asking “says who?” after every claim you make. Citations are your answer.
              Without them you are just asserting things into the void.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ marginTop: 40 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">Same sentence, different weight</p>
            <div className="bt-pairgrid" style={{ marginTop: 14 }}>
              <div className="bt-verdict bt-verdict--bad">
                <strong>Without a citation</strong>
                “Scientists say coffee makes you smarter.”
                <ul style={{ margin: '10px 0 0', paddingLeft: 18, display: 'grid', gap: 4, listStyle: 'disc' }}>
                  <li style={{ display: 'list-item' }}>Which scientists? Where? When?</li>
                  <li style={{ display: 'list-item' }}>It sounds like an unverified social media claim.</li>
                  <li style={{ display: 'list-item' }}>It can be marked down as an unsupported assertion.</li>
                  <li style={{ display: 'list-item' }}>If it is someone else’s idea, it is plagiarism.</li>
                </ul>
              </div>
              <div className="bt-verdict bt-verdict--good">
                <strong>With a citation</strong>
                “Caffeine consumption has been associated with enhanced cognitive performance in controlled
                studies (Smith et al., 2021, p. 14).”
                <ul style={{ margin: '10px 0 0', paddingLeft: 18, display: 'grid', gap: 4, listStyle: 'disc' }}>
                  <li style={{ display: 'list-item' }}>A reader can check the source for themselves.</li>
                  <li style={{ display: 'list-item' }}>It shows you engaged with the literature.</li>
                  <li style={{ display: 'list-item' }}>It reads as a claim, not as a rumour.</li>
                  <li style={{ display: 'list-item' }}>You are protected against an accusation of plagiarism.</li>
                </ul>
              </div>
            </div>
            <p className="bt-note" style={{ marginTop: 14 }}>
              The first is an unverified claim. The second, same idea, is one a reader can follow up.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ When to cite ═════════════════════════════════════════════════ */}
      <section id="when" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="2 · The judgement call"
            title="When to cite, and when not"
            aside="Citing everything clutters your writing and hints that you can’t tell common knowledge from a finding. Citing too little is plagiarism."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <p className="bt-eyebrow bt-eyebrow--quiet">Cite it · tap each one to read why</p>
          <div className="bt-flipgrid" style={{ marginTop: 14 }}>
            {WHEN_TO_CITE.map(([title, body]) => (
              <RevealCard key={title} kicker="Tap to read why" title={title} body={body} />
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ marginTop: 40 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">Leave it uncited</p>
            <div className="bt-rows">
              {WHEN_NOT_TO_CITE.map(([title, body]) => (
                <div key={title}>
                  <h4>{title}</h4>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bt-caution">
            <p className="bt-eyebrow">The test</p>
            <p>
              Would a reasonable person in your field consider this general knowledge? If yes, no citation.
              If there is any doubt, cite it. When in doubt, cite.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ In-text citations ════════════════════════════════════════════ */}
      <section id="intext" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="3 · In the sentence"
            title="In-text citations"
            aside="Every citation in the text points at exactly one entry in the reference list, and every entry in the list is cited somewhere in the text."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-caution" style={{ marginTop: 0 }}>
            <p className="bt-eyebrow">The core rule</p>
            <p>
              <b>One in-text citation, one entry. Always.</b> Every citation has exactly one matching entry in
              the reference list, and every entry is cited somewhere in the text. No orphans, no extras.
            </p>
          </div>

          <div className="bt-pairgrid">
            <div className="bt-card">
              <span className="bt-eyebrow bt-eyebrow--quiet" style={{ display: 'block' }}>Orphan</span>
              <h4 style={{ marginTop: 8 }}>An entry nobody cites</h4>
              <p>
                A reference list entry with no matching in-text citation. You read it but never cited it.
                Remove it. APA is not a bibliography.
              </p>
            </div>
            <div className="bt-card">
              <span className="bt-eyebrow bt-eyebrow--quiet" style={{ display: 'block' }}>Ghost</span>
              <h4 style={{ marginTop: 8 }}>A citation with no entry</h4>
              <p>
                An in-text citation such as (Brown, 2021) with no matching entry in the list. Always a
                serious fault, because the reader can’t find the source.
              </p>
            </div>
          </div>

          <div className="bt-scroll">
            <table className="bt-plaintable">
              <thead>
                <tr><th>In the text</th><th>In the reference list</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>(Slater, 2009, p. 12)<br />Slater (2009)</td>
                  <td style={{ fontWeight: 400 }}>
                    Slater, M. (2009). Place illusion and plausibility can lead to realistic behaviour in immersive
                    virtual environments. <i>Philosophical Transactions of the Royal Society B, 364</i>(1535),
                    3549–3557.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ marginTop: 40 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">Two flavours of in-text citation</p>
            <div className="bt-pairgrid" style={{ marginTop: 14 }}>
              <div className="bt-card">
                <h4>Parenthetical</h4>
                <p style={{ color: 'var(--ink-900)', fontSize: 14, marginBottom: 10 }}>
                  Virtual environments have been shown to enhance spatial memory (Bowman &amp; McMahan, 2007).
                </p>
                <p>
                  <b>Use it when</b> the idea matters more than the person who said it. You are reporting a
                  finding, not engaging with one author’s argument.
                </p>
                <p style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                  (Author, Year) or (Author, Year, p. N)
                </p>
              </div>
              <div className="bt-card">
                <h4>Narrative</h4>
                <p style={{ color: 'var(--ink-900)', fontSize: 14, marginBottom: 10 }}>
                  Bowman and McMahan (2007) demonstrated that virtual environments enhance spatial memory.
                </p>
                <p>
                  <b>Use it when</b> you are engaging with who said something: introducing their argument,
                  critiquing it, or setting it against another author’s view.
                </p>
                <p style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                  Author (Year) verb… or Author and Author (Year)…
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ marginTop: 40 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">The author–year cheat sheet</p>
            <div className="bt-scroll">
              <table className="bt-plaintable">
                <thead>
                  <tr><th>Situation</th><th>Format</th><th>Example</th></tr>
                </thead>
                <tbody>
                  {CHEAT_SHEET.map(([situation, format, eg]) => (
                    <tr key={situation}>
                      <td>{situation}</td>
                      <td>{format}</td>
                      <td>{eg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bt-caution">
            <p className="bt-eyebrow">The APA 7 change</p>
            <p>
              With three or more authors, use <b>et al.</b> from the very first citation. APA 6 made you
              write out every name, up to five authors, on first mention. That rule is gone.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ Quotes ═══════════════════════════════════════════════════════ */}
      <section id="quotes" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="4 · Someone else’s words"
            title="Short quotes and block quotes"
            aside="Forty words is the line. Below it the quote stays inside your sentence. At forty or more it becomes its own indented block."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <p className="bt-eyebrow bt-eyebrow--quiet">Under 40 words</p>
          <div className="bt-card" style={{ marginTop: 14 }}>
            <p style={{ fontStyle: 'italic', fontSize: 16, lineHeight: 1.6, color: 'var(--ink-900)' }}>
              Presence is defined as “the subjective experience of being in one place or environment, even
              when one is physically situated in another” (Witmer &amp; Singer, 1998, p. 225).
            </p>
          </div>
          <div className="bt-pairgrid">
            <div className="bt-card">
              <h4>The format</h4>
              <p>
                Put quotation marks around the exact words. Keep it inline, with no break to a new paragraph.
                The page number is required (p. 225). The citation goes at the end, before the full stop.
              </p>
            </div>
            <div className="bt-card">
              <h4>Common errors</h4>
              <p>
                Leaving out the page number on a direct quote. Using block format for under 40 words.
                Changing words inside the quote without [square brackets]. Quoting when you should paraphrase.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ marginTop: 40 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">40 words or more</p>
            <div className="bt-card" style={{ marginTop: 14 }}>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-900)' }}>Slater (2018) argued:</p>
              <div
                style={{
                  marginTop: 12,
                  marginLeft: 'clamp(12px, 4vw, 36px)',
                  paddingLeft: 16,
                  borderLeft: '2px solid var(--accent-300)',
                  fontSize: 14.5,
                  lineHeight: 1.65,
                  color: 'var(--ink-600)',
                }}
              >
                The concept of presence is not simply about visual fidelity but rather about the degree to
                which the virtual environment responds to the actions of the participant. A high-fidelity
                environment that does not react to user input will produce lower presence than a lower-fidelity,
                richly interactive one. (p. 431)
              </div>
            </div>
          </div>
          <div className="bt-pairgrid">
            <div className="bt-card">
              <h4>The rules</h4>
              <p>
                Start the quote on a new line. Indent the whole block about 1.27 cm (half an inch). Leave off
                the quotation marks. Introduce it with a colon, “X argued:” or “According to X (Year):”.
              </p>
            </div>
            <div className="bt-card">
              <h4>Where the page number goes</h4>
              <p>
                The author and year introduce the quote, and the page number sits in brackets <b>after</b> the
                final full stop. That is the reverse of a short quote, where the citation sits before it.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-scroll">
            <table className="bt-plaintable">
              <thead>
                <tr><th>Length</th><th>Layout</th><th>Quote marks</th><th>Citation</th></tr>
              </thead>
              <tbody>
                <tr><td>Under 40 words</td><td>Inline</td><td>Yes</td><td>Before the full stop</td></tr>
                <tr><td>40 words or more</td><td>Indented block</td><td>No</td><td>After the full stop</td></tr>
              </tbody>
            </table>
          </div>
          <p className="bt-note" style={{ marginTop: 14 }}>
            Your marker wants to see you synthesise ideas, not collect them. Quote only when the exact
            wording matters: definitions, key terms, a pivotal statement. A paraphrase that cites correctly
            shows more skill.
          </p>
        </Reveal>
      </section>

      {/* ══ Reference list ═══════════════════════════════════════════════ */}
      <section id="reference" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="5 · At the end of the paper"
            title="The reference list"
            aside="Every entry is built from the same four parts. Learn those and the six source types below are variations on one pattern."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-demo">
            <div className="bt-demobar" role="group" aria-label="The four parts of a reference">
              {FOUR_PARTS.map(p => (
                <button
                  key={p.key}
                  type="button"
                  className="bt-tab"
                  aria-pressed={part === p.key}
                  onClick={() => setPart(p.key)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div style={{ padding: 24 }}>
              <p className="bt-eyebrow bt-eyebrow--quiet">A journal article, part by part</p>
              <p style={{ marginTop: 12, fontSize: 15.5, lineHeight: 1.7, color: 'var(--ink-600)', maxWidth: '68ch' }}>
                {FOUR_PARTS.map((p, n) => (
                  <span key={p.key}>
                    {n > 0 && ' '}
                    <Entry segs={p.segs} highlight={p.key === part} />
                  </span>
                ))}
              </p>
              <p style={{ marginTop: 16, fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-500)', maxWidth: '62ch' }} aria-live="polite">
                <b style={{ color: 'var(--ink-900)' }}>{activePart.label}.</b> {activePart.rule}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ marginTop: 40 }}>
            <p className="bt-eyebrow bt-eyebrow--quiet">Six source types</p>
            <div className="bt-demo" style={{ marginTop: 14 }}>
              <div className="bt-demobar" role="group" aria-label="Source type">
                {SOURCE_TYPES.map((s, n) => (
                  <button
                    key={s.name}
                    type="button"
                    className="bt-tab"
                    aria-pressed={source === n}
                    onClick={() => setSource(n)}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <div style={{ padding: 24 }} aria-live="polite">
                <p
                  style={{
                    fontSize: 15.5,
                    lineHeight: 1.7,
                    color: 'var(--ink-900)',
                    maxWidth: '68ch',
                    paddingLeft: '2em',
                    textIndent: '-2em',
                  }}
                >
                  <Entry segs={example.segs} />
                </p>
                <ul style={{ margin: '18px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
                  {example.notes.map(n => (
                    <li key={n} style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--ink-500)' }}>{n}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="bt-note" style={{ marginTop: 14 }}>
              Each entry has a hanging indent: the first line sits at the margin and every later line is
              indented. Check the list is alphabetical by first author’s surname before you hand it in.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ Five mistakes ════════════════════════════════════════════════ */}
      <section id="mistakes" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="6 · What costs marks"
            title="Five mistakes to avoid"
            stop="."
            aside="Most citation errors in assignments are one of these five. Tap each one to read the fix."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-flipgrid">
            {MISTAKES.map(([title, fix], n) => (
              <RevealCard key={title} kicker={`Mistake ${n + 1} · tap for the fix`} title={title} body={fix} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══ The check ════════════════════════════════════════════════════ */}
      <section id="check" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Check yourself"
            title="Eight questions on APA 7"
            aside="Answer, read why, move on. Nothing is stored or reported, and there is no pass mark."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Quiz
            questions={CHECK}
            closing="That’s all eight. Go back over any section where the explanation surprised you."
          />
        </Reveal>
      </section>

      {/* ══ Recap ═════════════════════════════════════════════════════════ */}
      <Recap
        title="Cite what isn’t yours, then make every citation findable."
        points={[
          ['A citation is your answer to “says who?”.', 'Cite facts, theories, definitions, quotes, instruments and your own earlier work. Leave common knowledge and your own analysis alone.'],
          ['One in-text citation, one entry.', 'No orphans in the list and no ghosts in the text.'],
          ['Three or more authors means et al. from the first citation.', 'The APA 6 habit of writing every name first is gone.'],
          ['Forty words is the line for quotes.', 'Under it, inline with quote marks and the citation before the stop. At forty or more, an indented block with the citation after the stop.'],
          ['Every entry answers who, when, what and where.', 'Sentence-case titles, a DOI in place of a raw URL, and an alphabetical list.'],
        ]}
        footnote="Source for the rules above: American Psychological Association. (2020). Publication manual of the American Psychological Association (7th ed.). https://doi.org/10.1037/0000165-000"
      />

      <section className="bt-sec">
        <Reveal>
          <p className="bt-note">© All rights reserved · Yasas Sri Wickramasinghe</p>
        </Reveal>
      </section>
    </div>
  );
}
