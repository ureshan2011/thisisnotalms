import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, CheckCircle2, EyeOff, XCircle, Zap } from 'lucide-react';
import { CHALLENGES, cascadeAnswer, challengeXp, grade, type Challenge, type TestResult } from '../../lib/sqlSandbox/challenges';
import { statementKinds } from '../../lib/sqlSandbox/engine';
import { report, reportFail } from '../../lib/sqlSandbox/activity';
import { loadSql } from '../../lib/sqlSandbox/loadSql';
import type { Profile } from '../../lib/sqlSandbox/progress';
import { ResultGrid } from './RunOutput';
import type { ProfileApi } from './useProfile';
import { useSandbox } from './useSandbox';
import Workspace from './Workspace';

// ── The list ────────────────────────────────────────────────────────────────

export function ChallengeList({ profile, onOpen }: { profile: Profile; onOpen: (id: string) => void }) {
  const solved = CHALLENGES.filter(c => profile.challenges[c.id]?.solved).length;
  return (
    <div className="sb-chs">
      <div className="sb-map__intro">
        <h2>
          Think you know SQL<span className="bt-stop">?</span>
        </h2>
        <p>
          Only the basics: CREATE, INSERT, UPDATE, DELETE. Every one has a trap. Your data is not the same as anyone else&apos;s, and most are
          also marked on data you can&apos;t see.
        </p>
        <p className="sb-muted">{solved} of {CHALLENGES.length} solved.</p>
      </div>
      <div className="sb-chgrid">
        {CHALLENGES.map(c => {
          const s = profile.challenges[c.id];
          return (
            <button key={c.id} type="button" className={`sb-chcard ${s?.solved ? 'is-done' : ''}`} onClick={() => onOpen(c.id)}>
              <span className="sb-chcard__n">{String(c.n).padStart(2, '0')}</span>
              <span className="sb-chcard__title">{c.title}</span>
              <span className="sb-chcard__skill">{c.skill}</span>
              <span className="sb-chcard__foot">
                <span className="sb-diff" aria-label={`Difficulty ${c.stars} of 3`}>
                  {[1, 2, 3].map(i => (
                    <i key={i} className={i <= c.stars ? 'on' : ''} />
                  ))}
                </span>
                {s?.solved ? (
                  <span className="sb-chcard__ok">
                    <Check size={14} strokeWidth={3} /> Solved
                  </span>
                ) : s?.attempts ? (
                  <span className="sb-muted">{s.attempts} {s.attempts === 1 ? 'try' : 'tries'}</span>
                ) : (
                  <span className="sb-muted">{challengeXp(c)} XP</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── One challenge ───────────────────────────────────────────────────────────

const draftKey = (id: string) => `sqlsb:draft:${id}`;
const variantKey = (id: string) => `sqlsb:cv:${id}`;
const readNum = (k: string) => {
  try {
    return parseInt(localStorage.getItem(k) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
};

export function ChallengePlayer({ ch, api, onExit }: { ch: Challenge; api: ProfileApi; onExit: () => void }) {
  const profile = api.profile!;
  const seed = profile.id;
  const [variant, setVariant] = useState(() => readNum(variantKey(ch.id)));
  const sb = useSandbox(`ch:${ch.id}:${variant}`, () => ch.setup(seed, variant));
  const brief = useMemo(() => ch.brief(seed, variant), [ch, seed, variant]);
  const panels = useMemo(() => ch.panels?.(seed) ?? [], [ch, seed]);
  const state = profile.challenges[ch.id];

  const [editor, setEditor] = useState(() => {
    try {
      return localStorage.getItem(draftKey(ch.id)) ?? ch.starter?.(seed) ?? '';
    } catch {
      return ch.starter?.(seed) ?? '';
    }
  });
  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(draftKey(ch.id), editor);
      } catch {
        /* fine */
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [editor, ch.id]);

  const pastes = useRef(0);
  const opened = useRef(Date.now());
  const [busy, setBusy] = useState(false);
  const [tests, setTests] = useState<TestResult[] | null>(null);
  const [win, setWin] = useState<number | null>(null);
  const [wsMsg, setWsMsg] = useState<string | null>(null);

  const [decision, setDecision] = useState<'can' | 'cannot' | null>(null);
  const [reason, setReason] = useState<number | null>(null);
  const [undoMsg, setUndoMsg] = useState<string | null>(null);

  const [guess, setGuess] = useState<Record<string, string>>({});
  const [verdict, setVerdict] = useState<{ ok: boolean; answer: Record<string, number> } | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    report({ key: `ch:${ch.id}:${variant}`, where: `Challenge ${ch.n} · ${ch.title}`, detail: state?.solved ? 'Already solved, having another go' : ch.skill });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ch.id, variant]);

  const secs = () => Math.round((Date.now() - opened.current) / 1000);
  const record = (solved: boolean, note: string) => {
    if (solved) report({ key: `ch:${ch.id}:${variant}`, where: `Challenge ${ch.n} · ${ch.title}`, detail: 'Solved' });
    else reportFail();
    api.recordChallenge(ch.id, { solved, xp: challengeXp(ch), pastes: pastes.current, secs: secs(), note: note.slice(0, 120) });
    pastes.current = 0;
    if (solved && !state?.solved) setWin(challengeXp(ch));
    else if (solved) setWin(0);
  };

  const onRun = (text: string) => {
    setWsMsg(null);
    if (ch.mode === 'predict' && !verdict) {
      const bad = statementKinds(text).find(k => !ch.predict!.lookOnly.includes(k));
      if (bad) {
        setWsMsg('Look, don\'t touch. Only SELECT until your prediction is in.');
        return;
      }
    }
    sb.run(text);
  };

  const submitScript = async () => {
    setBusy(true);
    try {
      const SQL = await loadSql();
      const r = grade(SQL, ch, seed, editor);
      setTests(r.tests);
      record(r.solved, r.tests.find(t => !t.ok)?.msg ?? 'failed');
    } finally {
      setBusy(false);
    }
  };

  const submitCannot = () => {
    const u = ch.undo!;
    if (reason === null) return;
    if (u.reversible(seed)) {
      setUndoMsg('Look again. Can you tell exactly which rows the intern touched, and what they were before? If you can, it can be undone.');
      record(false, 'said cannot (wrong)');
    } else if (reason !== u.correct) {
      setUndoMsg('Right call: it can\'t be undone. Wrong reason, though. Which one explains it?');
      record(false, 'right call, wrong reason');
    } else {
      setUndoMsg(null);
      record(true, 'solved');
    }
  };

  const submitPredict = async () => {
    setBusy(true);
    setWsMsg(null);
    try {
      const SQL = await loadSql();
      const answer = cascadeAnswer(SQL, seed, variant);
      const ok = ch.predict!.fields.every(f => parseInt(guess[f.key] ?? '', 10) === answer[f.key]);
      setVerdict({ ok, answer });
      const right = ch.predict!.fields.filter(f => parseInt(guess[f.key] ?? '', 10) === answer[f.key]).length;
      record(ok, `${right} of ${ch.predict!.fields.length} right`);
    } finally {
      setBusy(false);
    }
  };

  const another = () => {
    const v = variant + 1;
    try {
      localStorage.setItem(variantKey(ch.id), String(v));
    } catch {
      /* fine */
    }
    setVariant(v);
    setGuess({});
    setVerdict(null);
    setRevealed(false);
    setWsMsg(null);
  };

  const showWorkspace = ch.mode !== 'undo' || decision === 'can';
  const submitBtn =
    ch.mode === 'script' || (ch.mode === 'undo' && decision === 'can') ? (
      <button type="button" className="bt-btn bt-btn--md bt-btn--dark" onClick={submitScript} disabled={busy || !editor.trim()}>
        {busy ? 'Marking…' : 'Submit'}
        <span className="bt-btn__badge" aria-hidden="true">✓</span>
      </button>
    ) : null;

  const above = (
    <div className="sb-card sb-brief">
      <p className="sb-step__count">
        Challenge {ch.n} · {ch.skill}
        {state?.solved && (
          <span className="sb-chip-ok">
            <Check size={12} strokeWidth={3} /> Solved
          </span>
        )}
      </p>
      <p className="sb-brief__story">{brief.story}</p>
      <ul className="sb-brief__rules">
        {brief.rules.map(r => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      {brief.code && (
        <details className="sb-details" open={brief.code.sql.split('\n').length < 14}>
          <summary>{brief.code.label}</summary>
          <pre className="sb-code">{brief.code.sql}</pre>
        </details>
      )}
      <p className="sb-step__task">{brief.ask}</p>

      {panels.length > 0 && (
        <div className="sb-panels">
          {panels.map(p => (
            <div key={p.title} className="sb-panel">
              <p className="sb-panel__title">
                {p.title} {p.note && <span className="sb-muted">· {p.note}</span>}
              </p>
              <ResultGrid result={p.table} marks={new Set(p.marks ?? [])} />
            </div>
          ))}
        </div>
      )}

      {ch.mode === 'undo' && (
        <div className="sb-decide">
          <button type="button" className={`sb-option ${decision === 'can' ? 'is-picked' : ''}`} onClick={() => { setDecision('can'); setUndoMsg(null); }}>
            It can be undone
          </button>
          <button type="button" className={`sb-option ${decision === 'cannot' ? 'is-picked' : ''}`} onClick={() => { setDecision('cannot'); setUndoMsg(null); }}>
            It can&apos;t be undone
          </button>
        </div>
      )}
      {ch.mode === 'undo' && decision === 'cannot' && (
        <div className="sb-reasons">
          <p className="sb-step__task">Why not?</p>
          {ch.undo!.reasons.map((r, i) => (
            <label key={i} className={`sb-radio ${reason === i ? 'is-on' : ''}`}>
              <input type="radio" name="reason" checked={reason === i} onChange={() => setReason(i)} />
              {r}
            </label>
          ))}
          <button type="button" className="bt-btn bt-btn--md bt-btn--dark" onClick={submitCannot} disabled={reason === null}>
            Submit
            <span className="bt-btn__badge" aria-hidden="true">✓</span>
          </button>
          {undoMsg && <p className="sb-nudge">{undoMsg}</p>}
        </div>
      )}

      {ch.mode === 'predict' && (
        <div className="sb-predict">
          <pre className="sb-code">{ch.predict!.action(seed, variant)}</pre>
          <div className="sb-predict__fields">
            {ch.predict!.fields.map(f => {
              const v = verdict ? (parseInt(guess[f.key] ?? '', 10) === verdict.answer[f.key] ? 'is-right' : 'is-wrong') : '';
              return (
                <label key={f.key} className={`sb-num ${v}`}>
                  <span>{f.label}</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={guess[f.key] ?? ''}
                    disabled={!!verdict}
                    onChange={e => setGuess({ ...guess, [f.key]: e.target.value })}
                  />
                  {verdict && !verdict.ok && <em>Answer: {verdict.answer[f.key]}</em>}
                </label>
              );
            })}
          </div>
          {!verdict && (
            <button
              type="button"
              className="bt-btn bt-btn--md bt-btn--dark"
              onClick={submitPredict}
              disabled={busy || ch.predict!.fields.some(f => (guess[f.key] ?? '') === '')}
            >
              Lock it in
              <span className="bt-btn__badge" aria-hidden="true">✓</span>
            </button>
          )}
          {verdict && (
            <div className="sb-predict__after">
              <p className={verdict.ok ? 'sb-good' : 'sb-nudge'}>
                {verdict.ok ? 'All four right.' : 'Not quite. Run it to see why, then try another customer.'}
              </p>
              {!revealed && (
                <button type="button" className="sb-tool" onClick={() => { sb.run(ch.predict!.action(seed, variant)); setRevealed(true); }}>
                  Run it and see
                </button>
              )}
              <button type="button" className="sb-tool" onClick={another}>
                Try another customer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="sb-player">
      <div className="sb-player__top">
        <button type="button" className="sb-back" onClick={onExit} aria-label="Back to the challenges">
          <ArrowLeft size={18} />
        </button>
        <div className="sb-player__title">
          <span className="sb-muted">Challenge {ch.n}</span> {ch.title}
        </div>
        <span className="sb-diff" aria-label={`Difficulty ${ch.stars} of 3`}>
          {[1, 2, 3].map(i => (
            <i key={i} className={i <= ch.stars ? 'on' : ''} />
          ))}
        </span>
      </div>

      {showWorkspace ? (
        <Workspace
          sb={sb}
          value={editor}
          onChange={setEditor}
          onRun={onRun}
          onPaste={() => {
            pastes.current += 1;
          }}
          actions={submitBtn}
          above={
            <>
              {above}
              {wsMsg && <p className="sb-nudge">{wsMsg}</p>}
            </>
          }
          placeholder={ch.mode === 'predict' ? 'SELECT * FROM orders WHERE customer_id = …' : undefined}
        />
      ) : (
        <Workspace sb={sb} value="" onChange={() => undefined} showEditor={false} above={above} />
      )}

      {tests && (
        <div className="sb-card sb-tests" aria-live="polite">
          <p className="sb-step__task">Results</p>
          <ul>
            {tests.map(t => (
              <li key={t.label} className={t.ok ? 'is-ok' : ''}>
                {t.ok ? <CheckCircle2 size={16} className="sb-ok" /> : t.label.startsWith('Hidden') ? <EyeOff size={16} className="sb-bad" /> : <XCircle size={16} className="sb-bad" />}
                <span>
                  <strong>{t.label}</strong>
                  {t.msg && <> · {t.msg}</>}
                </span>
              </li>
            ))}
          </ul>
          <p className="sb-muted">
            Submit runs your whole script from the start on a fresh copy of your data
            {ch.hidden ? `, then on ${ch.hidden} hidden datasets` : ''}.
          </p>
        </div>
      )}

      {win !== null && (
        <div className="sb-modal" role="dialog" aria-modal="true" aria-label="Challenge solved">
          <div className="sb-modal__card sb-levelup">
            <div className="sb-burst" aria-hidden="true">
              {Array.from({ length: 12 }, (_, i) => (
                <i key={i} style={{ ['--a' as string]: `${i * 30}deg` }} />
              ))}
            </div>
            <p className="bt-eyebrow">Challenge {ch.n} solved</p>
            <h2>
              {ch.title}
              <span className="bt-stop">.</span>
            </h2>
            {win > 0 && (
              <p className="sb-levelup__xp">
                <Zap size={16} fill="currentColor" /> +{win} XP
              </p>
            )}
            <p className="sb-muted">Could you explain your answer to the TA in two minutes? That&apos;s the real test.</p>
            <div className="sb-levelup__actions">
              <button type="button" className="bt-btn" onClick={onExit}>
                More challenges
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <button type="button" className="bt-btn bt-btn--tertiary" onClick={() => setWin(null)}>
                Stay here
                <span className="bt-btn__badge" aria-hidden="true">×</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
