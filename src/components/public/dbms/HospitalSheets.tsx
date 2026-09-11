import { useState } from 'react';

// ─── Lesson 1, section 1.2: why file-based systems fail ────────────────────
// The hospital spreadsheet worked example from the MBI802 study pack, made
// playable. Three sheets hold the same patient because nobody has a database.
// Change her address in one of them and the other two go stale in front of
// you; flip the switch to "one database" and the problem stops existing.
//
// Everything the widget says is straight out of the chapter — the five
// failures (redundancy, inconsistency, security, concurrency, integrity) and
// the DBMS answer to each. Students get to cause the failure themselves,
// which is the one version of this argument they remember.

const ORIGINAL = '14 Queen St, Auckland';

interface Sheet { file: string; by: string; addr: string; }

const INITIAL_SHEETS: Sheet[] = [
  { file: 'Admissions.xlsx', by: 'reception, 9:14 AM', addr: ORIGINAL },
  { file: 'Ward_3B.xlsx', by: 'the charge nurse, 8:02 AM', addr: ORIGINAL },
  { file: 'Pharmacy.xlsx', by: 'dispensary, yesterday 4:40 PM', addr: ORIGINAL },
];

const PATIENTS = [
  { id: 'P-4471', name: 'Mere Rangi', nhi: 'ABC1234', ward: '3B', tracked: true, addr: '' },
  { id: 'P-4472', name: 'Tom Fletcher', nhi: 'DEF5678', ward: '3B', tracked: false, addr: '6 Ponsonby Rd, Auckland' },
  { id: 'P-4488', name: 'Sina Faleolo', nhi: 'GHI9012', ward: '3B', tracked: false, addr: '22 Dominion Rd, Auckland' },
];

type FailKey = 'redundancy' | 'inconsistency' | 'security' | 'concurrency' | 'integrity';

const FAILURES: { n: string; key: FailKey; title: string; body: string; fix: string }[] = [
  { n: '01', key: 'redundancy', title: 'Redundancy', body: 'The same patient is re-typed in admissions, the ward sheet and pharmacy.', fix: 'One shared store. Each fact written once.' },
  { n: '02', key: 'inconsistency', title: 'Inconsistency', body: 'She moves. Two of the three copies never get updated. Which one is true?', fix: 'Centralised updates, with constraints keeping data valid.' },
  { n: '03', key: 'security', title: 'Security', body: 'Anyone holding the file holds all of it. Reception sees what the doctors see.', fix: 'Per-user permissions, so each role sees only its own slice.' },
  { n: '04', key: 'concurrency', title: 'Concurrency', body: 'Two nurses open it at once. The second save silently wins.', fix: 'Concurrency control, so many people can work at once.' },
  { n: '05', key: 'integrity', title: 'No integrity rules', body: 'Nothing stops a discharge date earlier than the admission date.', fix: 'Validation and types enforced by the system itself.' },
];

type Tone = 'neutral' | 'bad' | 'good';

export default function HospitalSheets() {
  const [sheets, setSheets] = useState<Sheet[]>(INITIAL_SHEETS);
  const [active, setActive] = useState(0);
  const [dbMode, setDbMode] = useState(false);
  const [edited, setEdited] = useState(false);
  const [draft, setDraft] = useState(ORIGINAL);
  const [lit, setLit] = useState<FailKey | null>(null);
  const [verdict, setVerdict] = useState<{ tone: Tone; title: string; body: string }>({
    tone: 'neutral',
    title: 'Nothing is wrong yet.',
    body: 'All three sheets agree, because nobody has changed anything yet.',
  });

  const truth = sheets[0].addr;
  const staleSheets = sheets.filter(s => s.addr === ORIGINAL);
  const distinct = new Set(sheets.map(s => s.addr)).size;

  function say(tone: Tone, title: string, body: string) {
    setVerdict({ tone, title, body });
  }

  function selectSheet(i: number) {
    setActive(i);
    setDraft(dbMode ? truth : sheets[i].addr);
    if (!dbMode && edited && sheets[i].addr === ORIGINAL) {
      setLit('inconsistency');
      say(
        'bad',
        'This sheet never got the memo.',
        `${sheets[i].file} still says ${ORIGINAL}. Her prescription goes to a flat she doesn’t live in any more.`,
      );
    }
  }

  function save() {
    const value = draft.trim();
    if (!value) {
      setLit('integrity');
      say('bad', 'You saved a blank address.', 'The spreadsheet accepted it without complaint. A column marked NOT NULL would have refused. That’s failure 05.');
      return;
    }
    setEdited(true);

    if (dbMode) {
      setSheets(sheets.map(s => ({ ...s, addr: value })));
      setLit(null);
      say('good', 'Saved once, true everywhere.', 'Admissions, the ward and pharmacy read the same row, because there is only one row. Nothing left to keep in sync.');
      return;
    }

    const next = sheets.map((s, i) => (i === active ? { ...s, addr: value } : s));
    setSheets(next);
    setLit('inconsistency');
    const behind = next.filter(s => s.addr === ORIGINAL);
    say(
      'bad',
      'Now the hospital contradicts itself.',
      behind.length
        ? `You fixed ${next[active].file}. ${behind.map(s => s.file).join(' and ')} still ${behind.length > 1 ? 'say' : 'says'} ${ORIGINAL}. Which address is the real one, and who in the building would know?`
        : 'Every sheet is current, but only because you went and fixed each one yourself. Miss a file, or hire a second receptionist, and you’re guessing again.',
    );
  }

  function collide() {
    if (dbMode) {
      setLit('concurrency');
      say('good', 'Both edits survive.', 'The database queues the two writes and applies them in order. Both notes land, and you can see who made each one.');
      return;
    }
    setEdited(true);
    setSheets(sheets.map((s, i) => (i === active ? { ...s, addr: '9 Symonds St, Auckland' } : s)));
    setDraft('9 Symonds St, Auckland');
    setLit('concurrency');
    say('bad', 'Last writer wins, silently.', 'Nurse A typed a new address and saved. Nurse B had the file open from before, typed something else, and saved two seconds later. Nurse A’s work is gone. No warning, no version history.');
  }

  function setMode(on: boolean) {
    setDbMode(on);
    if (on) {
      const current = sheets[active].addr;
      setSheets(sheets.map(s => ({ ...s, addr: current })));
      setDraft(current);
      setLit(null);
      say('good', 'Three sheets, now one table.', 'Same data, stored once, behind software that enforces the rules. Change the address and every tab agrees. Try the two nurses again too.');
    } else {
      setSheets(sheets.map((s, i) => (i === 0 ? s : { ...s, addr: ORIGINAL })));
      setDraft(sheets[active].addr);
      setLit(null);
      say('neutral', 'Back to files.', 'The copies are back, and so is the problem. Save an address and the other two sheets go out of date immediately.');
    }
  }

  const shownAddr = (p: typeof PATIENTS[number]) =>
    p.tracked ? (dbMode ? truth : sheets[active].addr) : p.addr;

  function addrClass(p: typeof PATIENTS[number]) {
    if (!p.tracked || !edited) return '';
    if (dbMode) return 'bt-addr--fresh';
    return sheets[active].addr === ORIGINAL ? 'bt-addr--stale' : 'bt-addr--fresh';
  }

  return (
    <div className="bt-demo">
      {/* ── sheet tabs and the storage-mode switch ── */}
      <div className="bt-demobar">
        {sheets.map((s, i) => (
          <button
            key={s.file}
            type="button"
            className={`bt-tab${!dbMode && edited && s.addr === ORIGINAL ? ' bt-tab--stale' : ''}`}
            aria-pressed={i === active}
            onClick={() => selectSheet(i)}
          >
            {dbMode ? ['patients', 'patients', 'patients'][i] : s.file}
            <span className="bt-tab__warn" aria-hidden="true" />
          </button>
        ))}

        <div className="bt-modeswitch" role="group" aria-label="How the hospital stores this patient">
          <button type="button" aria-pressed={!dbMode} onClick={() => setMode(false)}>Spreadsheets</button>
          <button type="button" aria-pressed={dbMode} onClick={() => setMode(true)}>One database</button>
        </div>
      </div>

      <div className="bt-sheetbody">
        {/* ── the sheet itself ── */}
        <div className="bt-sheet">
          <div className="bt-sheetname">
            <span className="bt-dot" style={{ background: dbMode ? 'var(--green-500)' : 'var(--amber-500)' }} />
            {dbMode
              ? 'hospital_db · patients — one row, one address, one truth'
              : `${sheets[active].file} — last saved by ${sheets[active].by}`}
          </div>
          <div className="bt-scroll">
            <table className="bt-grid">
              <thead>
                <tr>
                  <th>Patient ID</th><th>Name</th><th>Address</th><th>NHI</th><th>Ward</th>
                </tr>
              </thead>
              <tbody>
                {PATIENTS.map(p => (
                  <tr key={p.id}>
                    <td>{dbMode && p.tracked ? <span className="bt-pk">{p.id}</span> : p.id}</td>
                    <td>{p.name}</td>
                    <td className={`bt-addr ${addrClass(p)}`}>{shownAddr(p)}</td>
                    <td>{p.nhi}</td>
                    <td>{p.ward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── the controls ── */}
        <div className="bt-ctrl">
          <div className="bt-field">
            <label htmlFor="dbms-addr">Mere Rangi has moved. Type her new address.</label>
            <input
              id="dbms-addr"
              value={draft}
              autoComplete="off"
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') save(); }}
            />
          </div>

          <button type="button" className="bt-btn bt-btn--md" style={{ alignSelf: 'flex-start' }} onClick={save}>
            {dbMode ? 'Save to the database' : 'Save to this sheet'}
            <span className="bt-btn__badge" aria-hidden="true">→</span>
          </button>

          <div className="bt-counter">
            <b className="bt-tnum">{dbMode ? 1 : 3}</b>
            <span>
              {dbMode
                ? 'copy of her address exists. Every screen in the hospital reads it.'
                : `copies of her address exist. ${edited ? `${distinct} of them disagree with each other.` : 'Only the sheet you save will be right.'}`}
            </span>
          </div>

          <div className={`bt-verdict${verdict.tone === 'bad' ? ' bt-verdict--bad' : verdict.tone === 'good' ? ' bt-verdict--good' : ''}`} aria-live="polite">
            <strong>{verdict.title}</strong>
            {verdict.body}
          </div>

          <button type="button" className="bt-btn bt-btn--tertiary bt-btn--sm" style={{ alignSelf: 'flex-start' }} onClick={collide}>
            Two nurses save at once
            <span className="bt-btn__badge" aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      {/* ── the five failures, lit as you cause them ── */}
      <div className="bt-faillist">
        {FAILURES.map(f => (
          <div key={f.key} className={`bt-fail${lit === f.key ? ' bt-fail--lit' : ''}`}>
            <span className="bt-fail__n">{f.n}</span>
            <h4>{f.title}</h4>
            <p>{f.body}</p>
            <p className="bt-fail__fix"><span>A DBMS:</span> {f.fix}</p>
          </div>
        ))}
      </div>

      <p className="bt-demofoot">
        Redundancy, inconsistency, security, concurrency, integrity. Learn those five names — they come up in
        the exam more often than any definition. We do this same exercise in pairs, on paper, in class.
        {staleSheets.length > 0 && !dbMode && edited
          ? ` Right now ${staleSheets.length} of your three sheets ${staleSheets.length > 1 ? 'are' : 'is'} out of date.`
          : ''}
      </p>
    </div>
  );
}
