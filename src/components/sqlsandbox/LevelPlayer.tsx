import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, Circle, Lightbulb, Star, Zap } from 'lucide-react';
import type { Cell, RunOutput, StmtResult } from '../../lib/sqlSandbox/engine';
import { LEVEL_BONUS, LEVELS, STEP_XP, starsFor, type CheckCtx, type Level, type Step } from '../../lib/sqlSandbox/levels';
import { rng, type Theme } from '../../lib/sqlSandbox/themes';
import type { ProfileApi } from './useProfile';
import { useSandbox, type Sandbox } from './useSandbox';
import Workspace from './Workspace';

// One level, one step at a time. A step is done the moment its check passes:
// after a Run, an Undo, or a tap. Then a green bar, a few XP, Continue.

const WINS = ['Nice.', 'Got it.', 'That\'s it.', 'Spot on.', 'Yes.', 'Sorted.'];

/** Inline `code` and "- " list lines. That's all the formatting steps need. */
export function Rich({ text }: { text: string }) {
  const lines = text.split('\n');
  const inline = (s: string) =>
    s.split(/(`[^`]+`)/).map((p, i) => (p.startsWith('`') && p.endsWith('`') ? <code key={i}>{p.slice(1, -1)}</code> : p));
  const out: JSX.Element[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) out.push(<ul key={`l${out.length}`}>{list.map((l, i) => <li key={i}>{inline(l)}</li>)}</ul>);
    list = [];
  };
  lines.forEach((l, i) => {
    if (l.startsWith('- ')) list.push(l.slice(2));
    else {
      flush();
      if (l.trim()) out.push(<p key={i}>{inline(l)}</p>);
    }
  });
  flush();
  return <>{out}</>;
}

type Slim = Pick<StmtResult, 'kind' | 'ok' | 'table' | 'affected' | 'raw'> & { error?: { code: number } };
const slim = (r: StmtResult): Slim => ({ kind: r.kind, ok: r.ok, table: r.table, affected: r.affected, raw: '', error: r.error ? { code: r.error.code } : undefined });
const histKey = (id: string) => `sqlsb:hist:${id}`;
function loadHist(id: string): StmtResult[] {
  try {
    return JSON.parse(localStorage.getItem(histKey(id)) ?? '[]') as StmtResult[];
  } catch {
    return [];
  }
}
function saveHist(id: string, h: StmtResult[]) {
  try {
    localStorage.setItem(histKey(id), JSON.stringify(h.slice(-200).map(slim)));
  } catch {
    /* fine */
  }
}

function captureRows(sb: Sandbox): Record<string, Record<string, Cell>[]> {
  const e = sb.engine;
  if (!e || !e.current) return {};
  return Object.fromEntries(e.tables().map(t => [t, e.rows(t)]));
}

export default function LevelPlayer({
  level,
  theme,
  api,
  onExit,
  onOpen,
}: {
  level: Level;
  theme: Theme;
  api: ProfileApi;
  onExit: () => void;
  onOpen: (id: string) => void;
}) {
  const profile = api.profile!;
  const steps = useMemo(() => level.steps(theme), [level, theme]);
  const key = (s: Step) => `${level.id}.${s.id}`;
  const [replay] = useState(() => !!profile.levels[level.id]);
  const [idx, setIdx] = useState(() => (replay ? 0 : Math.max(0, steps.findIndex(s => !profile.steps[key(s)]))));
  const raw = useSandbox(`level:${level.id}`, () => level.start(theme), { fresh: replay });
  const step = steps[idx];

  const [editor, setEditor] = useState('');
  const [phase, setPhase] = useState<'work' | 'done' | 'level'>('work');
  const [nudge, setNudge] = useState<string | null>(null);
  const [fails, setFails] = useState(0);
  const [hint, setHint] = useState(false);
  const [usedSolution, setUsedSolution] = useState(false);
  const [shownThisRun, setShownThisRun] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [gain, setGain] = useState(0);
  const [earned, setEarned] = useState(0);
  const [stars, setStars] = useState(0);
  const history = useRef<StmtResult[]>([]);
  const levelHistory = useRef<StmtResult[]>(replay ? [] : loadHist(level.id));
  const startRows = useRef<Record<string, Record<string, Cell>[]>>({});
  const [restart, setRestart] = useState(0);

  // Order step state.
  const order = useMemo(() => {
    if (step?.kind !== 'order') return [];
    const r = rng(`${profile.id}|${key(step)}`);
    let s = r.shuffle(step.pieces.map((_, i) => i));
    if (s.every((v, i) => v === i)) s = s.reverse();
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);
  const [line, setLine] = useState<number[]>([]);

  // A new step: fresh state, the starter in the editor, and a note of how the tables look now.
  useEffect(() => {
    if (!raw.ready) return;
    history.current = [];
    startRows.current = captureRows(raw);
    setNudge(null);
    setFails(0);
    setHint(false);
    setUsedSolution(false);
    setWrong(0);
    setPicked(null);
    setLine([]);
    setPhase('work');
    if (step.kind === 'sql') setEditor(step.starter ?? '');
    else if (step.kind !== 'boss') setEditor('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, raw.ready, restart]);

  useEffect(() => {
    if (replay) saveHist(level.id, []);
  }, [replay, level.id]);

  const ctx = useCallback(
    (last: RunOutput | null): CheckCtx => ({
      engine: raw.engine!, theme, history: history.current, levelHistory: levelHistory.current, last, start: startRows.current,
    }),
    [raw.engine, theme],
  );

  const finish = useCallback(
    (xp: number) => {
      const s = steps[idx];
      if (!profile.steps[key(s)]) {
        api.completeStep(level.id, s.id, xp);
        setGain(xp);
        setEarned(e => e + xp);
      } else setGain(0);
      setNudge(null);
      setPhase('done');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [idx, steps, profile.steps, api, level.id],
  );

  const evaluate = useCallback(
    (last: RunOutput | null) => {
      if (phase !== 'work' || !raw.engine) return false;
      if (step.kind === 'sql') {
        const r = step.check(ctx(last));
        if (r === true) {
          finish(usedSolution ? 5 : STEP_XP);
          return true;
        }
        setNudge(typeof r === 'string' ? r : null);
      }
      if (step.kind === 'boss') {
        if (step.items.every(i => i.check(ctx(last)))) {
          finish(usedSolution ? 15 : 40);
          return true;
        }
      }
      return false;
    },
    [phase, raw.engine, step, ctx, finish, usedSolution],
  );

  const runText = (text: string) => {
    const out = raw.run(text);
    if (!out) return;
    history.current.push(...out.results);
    levelHistory.current.push(...out.results);
    saveHist(level.id, levelHistory.current);
    if (!evaluate(out)) setFails(f => f + 1);
  };

  // Undo and restart also count as actions a step can be waiting for.
  const sb: Sandbox = {
    ...raw,
    undo: () => {
      raw.undo();
      evaluate(null);
    },
    reset: () => {
      raw.reset();
      levelHistory.current = [];
      saveHist(level.id, []);
      setIdx(0);
      setRestart(n => n + 1);
    },
  };

  const next = () => {
    if (idx + 1 < steps.length) {
      setIdx(idx + 1);
      return;
    }
    const st = starsFor(shownThisRun);
    const first = !profile.levels[level.id];
    api.completeLevel(level.id, st, LEVEL_BONUS);
    if (first) setEarned(e => e + LEVEL_BONUS);
    setStars(st);
    setPhase('level');
  };

  // Enter continues, so a keyboard user never has to reach for the mouse.
  useEffect(() => {
    if (phase !== 'done') return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  const showMe = () => {
    if (step.kind !== 'sql' && step.kind !== 'boss') return;
    if (!step.solution) return;
    setEditor(step.solution);
    setUsedSolution(true);
    setShownThisRun(n => n + 1);
    api.markShown(level.id);
  };

  const choose = (i: number) => {
    if (phase !== 'work' || (step.kind !== 'choose' && step.kind !== 'predict')) return;
    setPicked(i);
    if (step.kind === 'predict') {
      if (step.run) {
        const out = raw.run(step.run);
        if (out) {
          history.current.push(...out.results);
          levelHistory.current.push(...out.results);
        }
      }
      finish(i === step.answer ? STEP_XP : 5);
      return;
    }
    if (i === step.answer) finish(wrong ? 5 : STEP_XP);
    else setWrong(w => w + 1);
  };

  const tapPiece = (i: number) => {
    if (phase !== 'work' || step.kind !== 'order') return;
    const nextLine = [...line, i];
    setLine(nextLine);
    if (nextLine.length === step.pieces.length) {
      if (nextLine.every((v, k) => v === k)) finish(STEP_XP);
      else setNudge('Not quite. Tap a piece in your answer to take it back.');
    }
  };

  const bossState = useMemo(
    () => (step?.kind === 'boss' && raw.engine ? step.items.map(i => i.check(ctx(raw.last))) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [raw.version, idx, raw.engine],
  );

  if (!step) return null;
  const nextLevel = LEVELS.find(l => l.n === level.n + 1);
  const canShow = (step.kind === 'sql' || step.kind === 'boss') && !!step.solution && (fails >= 2 || hint);

  const card = (
    <div className="sb-card sb-step">
      <p className="sb-step__count">
        Step {idx + 1} of {steps.length}
      </p>
      {step.say && (
        <div className="sb-step__say">
          <Rich text={step.say} />
        </div>
      )}

      {(step.kind === 'sql' || step.kind === 'boss' || step.kind === 'order') && <p className="sb-step__task">{step.task}</p>}

      {(step.kind === 'choose' || step.kind === 'predict') && (
        <>
          <p className="sb-step__task">{step.question}</p>
          {step.code && <pre className="sb-code">{step.code}</pre>}
          <div className="sb-options">
            {step.options.map((o, i) => {
              const state =
                picked === null ? '' : i === step.answer && (phase === 'done' || step.kind === 'predict') ? 'is-right' : i === picked ? 'is-wrong' : '';
              return (
                <button key={i} type="button" className={`sb-option ${state}`} onClick={() => choose(i)} disabled={phase !== 'work'}>
                  {o}
                </button>
              );
            })}
          </div>
          {picked !== null && phase === 'work' && step.kind === 'choose' && picked !== step.answer && (
            <p className="sb-nudge">{step.why[picked]} Try again.</p>
          )}
        </>
      )}

      {step.kind === 'order' && (
        <div className="sb-order">
          <div className="sb-order__line" aria-label="Your answer">
            {line.length === 0 && <span className="sb-muted">Tap the pieces below, in order.</span>}
            {line.map((p, k) => (
              <button
                key={k}
                type="button"
                className="sb-piece is-placed"
                onClick={() => phase === 'work' && (setLine(line.filter((_, j) => j !== k)), setNudge(null))}
              >
                {step.pieces[p]}
              </button>
            ))}
          </div>
          <div className="sb-order__pool">
            {order.filter(p => !line.includes(p)).map(p => (
              <button key={p} type="button" className="sb-piece" onClick={() => tapPiece(p)}>
                {step.pieces[p]}
              </button>
            ))}
          </div>
        </div>
      )}

      {step.kind === 'boss' && (
        <ul className="sb-checklist">
          {step.items.map((it, i) => (
            <li key={i} className={bossState[i] ? 'is-on' : ''}>
              {bossState[i] ? <Check size={16} strokeWidth={3} /> : <Circle size={16} />}
              {it.label}
            </li>
          ))}
        </ul>
      )}

      {nudge && <p className="sb-nudge">{nudge}</p>}

      {(step.kind === 'sql' || step.kind === 'boss') && phase === 'work' && (step.hint || step.solution) && (
        <div className="sb-help">
          {step.hint && !hint && (
            <button type="button" className="sb-tool" onClick={() => setHint(true)}>
              <Lightbulb size={15} /> Hint
            </button>
          )}
          {hint && step.hint && <p className="sb-hint">{step.hint}</p>}
          {canShow && (
            <button type="button" className="sb-tool" onClick={showMe}>
              Show me
            </button>
          )}
        </div>
      )}
    </div>
  );

  const doneText =
    step.kind === 'choose' || step.kind === 'predict'
      ? picked === step.answer
        ? step.why[step.answer]
        : `${step.why[picked ?? 0]} The answer: ${step.options[step.answer]}.`
      : 'after' in step
        ? step.after
        : undefined;
  const right = !((step.kind === 'choose' || step.kind === 'predict') && picked !== step.answer);

  return (
    <div className={`sb-player ${phase === 'done' ? 'is-done' : ''}`}>
      <div className="sb-player__top">
        <button type="button" className="sb-back" onClick={onExit} aria-label="Back to the levels">
          <ArrowLeft size={18} />
        </button>
        <div className="sb-player__title">
          <span className="sb-muted">Level {level.n}</span> {level.title}
        </div>
        <div className="sb-segs" aria-label={`Step ${idx + 1} of ${steps.length}`}>
          {steps.map((s, i) => (
            <span key={s.id} className={i < idx || (i === idx && phase !== 'work') ? 'on' : i === idx ? 'now' : ''} />
          ))}
        </div>
      </div>

      <Workspace
        sb={sb}
        value={editor}
        onChange={setEditor}
        onRun={runText}
        showEditor={step.kind === 'sql' || step.kind === 'boss'}
        above={card}
        resetLabel="Restart level"
      />

      {phase === 'done' && (
        <div className={`sb-win ${right ? '' : 'is-miss'}`} role="status">
          <div className="sb-win__inner">
            <div>
              <p className="sb-win__title">
                {right ? WINS[(idx + level.n) % WINS.length] : 'Not quite, but now you know.'}
                {gain > 0 && (
                  <span className="sb-xp">
                    <Zap size={14} fill="currentColor" /> +{gain} XP
                  </span>
                )}
              </p>
              {doneText && <p className="sb-win__text">{doneText}</p>}
            </div>
            <button type="button" className="bt-btn bt-btn--md" onClick={next} autoFocus>
              {idx + 1 < steps.length ? 'Continue' : 'Finish level'}
              <span className="bt-btn__badge" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}

      {phase === 'level' && (
        <div className="sb-modal" role="dialog" aria-modal="true" aria-label="Level complete">
          <div className="sb-modal__card sb-levelup">
            <div className="sb-burst" aria-hidden="true">
              {Array.from({ length: 12 }, (_, i) => (
                <i key={i} style={{ ['--a' as string]: `${i * 30}deg` }} />
              ))}
            </div>
            <p className="bt-eyebrow">Level {level.n} done</p>
            <h2>
              {level.title}
              <span className="bt-stop">.</span>
            </h2>
            <div className="sb-stars sb-stars--big" aria-label={`${stars} of 3 stars`}>
              {[1, 2, 3].map(i => (
                <Star key={i} size={34} className={i <= stars ? 'on' : ''} fill={i <= stars ? 'currentColor' : 'none'} style={{ animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>
            <p className="sb-levelup__xp">
              <Zap size={16} fill="currentColor" /> +{earned} XP
            </p>
            {stars < 3 && <p className="sb-muted">Three stars means no "Show me". Replay it any time.</p>}
            <div className="sb-levelup__actions">
              {nextLevel ? (
                <button type="button" className="bt-btn" onClick={() => onOpen(nextLevel.id)}>
                  Next: {nextLevel.title}
                  <span className="bt-btn__badge" aria-hidden="true">→</span>
                </button>
              ) : (
                <button type="button" className="bt-btn" onClick={onExit}>
                  Back to the map
                  <span className="bt-btn__badge" aria-hidden="true">→</span>
                </button>
              )}
              {nextLevel && (
                <button type="button" className="bt-btn bt-btn--tertiary" onClick={onExit}>
                  Map
                  <span className="bt-btn__badge" aria-hidden="true">←</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
