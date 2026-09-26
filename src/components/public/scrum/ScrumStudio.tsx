import { Canvas } from '@react-three/fiber';
import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ErrorInfo, type ReactNode } from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { Studio, makeSim, type Sim } from './StudioScene';
import {
  PHASES, SPRINTS, TOTAL, VANTAGE,
  deriveWorld, infoFor, narrationFor, phaseAt,
  type Phase, type SelectableId,
} from './timeline';
import '../../../styles/scrum-studio.css';

// ─── The Scrum studio: a 3D diorama the reader can drive ──────────────────
// MBI804 · Lesson 3. Six miniatures build a parcel drone through three
// one-week Sprints. The scene is in StudioScene.tsx and the facts in
// timeline.ts; this file is the DOM around them — the transport bar, the
// timeline of chips, and the panel that narrates whatever is happening or
// explains whatever was clicked.
//
// The clock lives in a ref, not React state, so nothing re-renders sixty
// times a second. The HUD is told the time eight times a second, which is
// all a progress bar and a status line need.

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err: Error, info: ErrorInfo) { console.error('Scrum studio could not start', err, info); }
  render() {
    if (this.state.failed) {
      return (
        <div className="sst__fallback">
          <p>
            This browser could not start the 3D studio — usually WebGL is switched off, or the device has no graphics
            acceleration. The roles, artefacts and events are all written out below the studio, and Lesson 2 has the
            clickable Scrum framework diagram.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

/** The chips: one for each phase, except the ten daily/work phases of a
 *  Sprint, which collapse to five day chips that jump to the Daily Scrum. */
function chipGroups(): { label: string; live: (ph: Phase) => boolean; chips: { label: string; t: number; day?: boolean; active: (ph: Phase) => boolean }[] }[] {
  const groups: ReturnType<typeof chipGroups> = [];
  const pre = PHASES.filter(p => p.sprint === 0);
  groups.push({
    label: 'Start',
    live: ph => ph.sprint === 0,
    chips: pre.map(p => ({ label: p.label, t: p.start, active: ph => ph === p })),
  });
  for (let s = 1; s <= SPRINTS; s++) {
    const own = PHASES.filter(p => p.sprint === s);
    const chips: ReturnType<typeof chipGroups>[number]['chips'] = [];
    for (const p of own) {
      if (p.key === 'daily') chips.push({ label: `Day ${p.day}`, t: p.start, day: true, active: ph => ph.sprint === s && ph.day === p.day });
      else if (p.key === 'work') continue;
      else chips.push({ label: p.key === 'planning' ? 'Planning' : p.key === 'review' ? 'Review' : 'Retro', t: p.start, active: ph => ph === p });
    }
    groups.push({ label: `Sprint ${s}`, live: ph => ph.sprint === s, chips });
  }
  const last = PHASES[PHASES.length - 1];
  groups.push({ label: 'End', live: ph => ph === last, chips: [{ label: last.label, t: last.start, active: ph => ph === last }] });
  return groups;
}

export default function ScrumStudio() {
  const sim = useRef<Sim>(makeSim());
  const stageRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<SelectableId | null>(null);
  const started = useRef(false);
  const groups = useMemo(chipGroups, []);

  // Render only while the studio is on screen, and start it the first time
  // it scrolls into view — unless the reader has asked for less motion.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setVisible(true); return; }
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting);
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (!still) { sim.current.playing = true; setPlaying(true); }
      }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onTick = useCallback((tt: number) => setT(tt), []);

  const jump = (to: number) => {
    sim.current.t = ((to % TOTAL) + TOTAL) % TOTAL;
    sim.current.userUntil = 0;
    sim.current.world = deriveWorld(sim.current.t);
    setT(sim.current.t);
  };
  const togglePlay = () => {
    sim.current.playing = !sim.current.playing;
    setPlaying(sim.current.playing);
  };
  const setSpd = (s: number) => { sim.current.speed = s; setSpeed(s); };
  const stepPhase = (dir: 1 | -1) => {
    const ph = phaseAt(sim.current.t);
    const i = PHASES.indexOf(ph);
    const next = PHASES[(i + dir + PHASES.length) % PHASES.length];
    jump(next.start + 0.01);
  };

  const world = useMemo(() => deriveWorld(t), [t]);
  const ph = world.phase;
  const narration = narrationFor(world);
  const info = selected ? infoFor(selected) : null;

  const status = ph.sprint === 0 || ph.key === 'shipped'
    ? ph.label
    : ph.day
      ? `Sprint ${ph.sprint} · day ${ph.day} of 5 · ${ph.key === 'daily' ? 'Daily Scrum' : 'the work'}`
      : `Sprint ${ph.sprint} · ${ph.key === 'planning' ? 'Planning' : ph.key === 'review' ? 'Review' : 'Retrospective'}`;

  return (
    <div className="sst">
      <div className="sst__stage" ref={stageRef}>
        <SceneBoundary>
          <Canvas
            shadows
            dpr={[1, 1.6]}
            camera={{ fov: 38, near: 0.1, far: 80, position: VANTAGE.intro }}
            frameloop={visible ? 'always' : 'never'}
            onPointerMissed={() => setSelected(null)}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <Suspense fallback={null}>
              <Studio sim={sim} onSelect={setSelected} selected={selected} onTick={onTick} />
            </Suspense>
          </Canvas>
        </SceneBoundary>

        <div className="sst__status" aria-live="polite">
          <b>{status}</b>
        </div>
        <div className="sst__hint">drag to orbit · scroll to zoom · click anything</div>

        <div className="sst__transport">
          <button type="button" className="sst__tbtn sst__tbtn--quiet" onClick={() => stepPhase(-1)} aria-label="Previous event">
            <SkipBack size={15} />
          </button>
          <button type="button" className="sst__tbtn" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: 2 }} />}
          </button>
          <button type="button" className="sst__tbtn sst__tbtn--quiet" onClick={() => stepPhase(1)} aria-label="Next event">
            <SkipForward size={15} />
          </button>
          <div className="sst__speed" role="group" aria-label="Playback speed">
            {[1, 2, 4].map(s => (
              <button key={s} type="button" aria-pressed={speed === s} onClick={() => setSpd(s)}>{s}×</button>
            ))}
          </div>
          <input
            className="sst__scrub"
            type="range"
            min={0}
            max={Math.floor(TOTAL * 10)}
            value={Math.floor(t * 10)}
            onChange={e => jump(Number(e.target.value) / 10)}
            aria-label="Scrub through the three Sprints"
          />
          <span className="sst__clock bt-tnum">{fmt(t)} / {fmt(TOTAL)}</span>
        </div>
      </div>

      <aside className="sst__panel" aria-live="polite">
        {info ? (
          <>
            <p className="bt-eyebrow">{info.eyebrow}</p>
            <h3>{info.title}</h3>
            <ul className="sst__facts">
              {info.lines.map(([k, v]) => <li key={k}><b>{k}</b><span>{v}</span></li>)}
            </ul>
            <p>{info.body}</p>
            <div className="sst__trap"><b>The trap</b>{info.trap}</div>
            <button type="button" className="bt-btn bt-btn--sm bt-btn--tertiary sst__back" onClick={() => setSelected(null)}>
              Back to the narration
              <span className="bt-btn__badge" aria-hidden="true">←</span>
            </button>
          </>
        ) : (
          <>
            <p className="bt-eyebrow">{narration.eyebrow}</p>
            <h3>{narration.title}</h3>
            <ul className="sst__facts">
              <li><b>Who</b><span>{narration.who}</span></li>
              <li><b>Timebox</b><span>{narration.timebox}</span></li>
              <li><b>Output</b><span>{narration.output}</span></li>
            </ul>
            <p>{narration.body}</p>
            <div className="sst__watch"><b>Watch for</b>{narration.watch}</div>
          </>
        )}
      </aside>

      <div className="sst__timeline" role="navigation" aria-label="Jump to an event">
        {groups.map(g => (
          <div key={g.label} className={`sst__group${g.live(ph) ? ' sst__group--live' : ''}`}>
            <span className="sst__glabel">{g.label}</span>
            {g.chips.map(c => (
              <button
                key={c.label}
                type="button"
                className={`sst__chip${c.day ? ' sst__chip--day' : ''}`}
                aria-current={c.active(ph) ? 'step' : undefined}
                onClick={() => jump(c.t + 0.01)}
              >
                {c.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
