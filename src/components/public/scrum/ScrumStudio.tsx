import { Canvas } from '@react-three/fiber';
import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ErrorInfo, type ReactNode } from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { Studio, makeSim, type Sim } from './StudioScene';
import MilestoneTimeline from './MilestoneTimeline';
import {
  PHASES, TOTAL, VANTAGE,
  deriveWorld, infoFor, narrationFor, phaseAt,
  type SelectableId,
} from './timeline';
import '../../../styles/scrum-studio.css';

// ─── The Scrum studio: a 3D diorama the reader can drive ──────────────────
// MBI804 · Lesson 3. Six miniatures build a parcel drone through three
// one-week Sprints. The scene is in StudioScene.tsx and the facts in
// timeline.ts; this file is the DOM around them — the caption over the
// stage, the transport bar, the side panel and the milestone timeline.
//
// Reading and watching at once is the hard part for a student, so three
// things line up on the same "beat": the caption on the stage says what is
// happening, the matching step lights up in the side panel, and a
// spotlight in the scene marks where to look. Guided mode (on by default)
// pauses at the end of every milestone until the reader presses Continue.
//
// The clock lives in a ref, not React state, so nothing re-renders sixty
// times a second. The HUD is told the time eight times a second.

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
            acceleration. The side panel and timeline still work, the roles, artefacts and events are written out
            below, and Lesson 2 has the clickable Scrum framework diagram.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

export default function ScrumStudio() {
  const sim = useRef<Sim>(makeSim());
  const stageRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [guided, setGuided] = useState(true);
  const [held, setHeld] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<SelectableId | null>(null);
  const started = useRef(false);

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
  const onHold = useCallback((i: number) => { setHeld(i); setPlaying(false); }, []);

  const release = () => {
    const s = sim.current;
    if (s.held !== null) s.holdDone = s.held;
    s.held = null;
    setHeld(null);
  };
  const jump = (to: number) => {
    const s = sim.current;
    s.t = ((to % TOTAL) + TOTAL) % TOTAL;
    s.userUntil = 0;
    s.held = null;
    s.holdDone = -1;
    s.world = deriveWorld(s.t);
    setHeld(null);
    setT(s.t);
  };
  const play = () => { release(); sim.current.playing = true; setPlaying(true); };
  const togglePlay = () => {
    if (sim.current.playing) { sim.current.playing = false; setPlaying(false); }
    else play();
  };
  const setSpd = (s: number) => { sim.current.speed = s; setSpeed(s); };
  const setGuide = (on: boolean) => { sim.current.guided = on; setGuided(on); if (!on && sim.current.held !== null) play(); };
  const stepPhase = (dir: 1 | -1) => {
    const i = phaseAt(sim.current.t).index;
    const next = PHASES[(i + dir + PHASES.length) % PHASES.length];
    jump(next.start + 0.01);
  };

  const world = useMemo(() => deriveWorld(t), [t]);
  const ph = world.phase;
  const narration = narrationFor(world);
  const info = selected ? infoFor(selected) : null;
  const beat = world.beat;
  const nextPhase = held !== null ? PHASES[(held + 1) % PHASES.length] : null;

  const status = ph.sprint === 0 || ph.key === 'shipped'
    ? ph.label
    : ph.key === 'refine'
      ? `Sprint ${ph.sprint} · day 3 · Backlog Refinement`
      : ph.day
        ? `Sprint ${ph.sprint} · day ${ph.day} of 5 · ${ph.key === 'daily' ? 'Daily Scrum' : 'the work'}`
        : `Sprint ${ph.sprint} · ${ph.key === 'planning' ? 'Sprint Planning' : ph.key === 'review' ? 'Sprint Review' : 'Retrospective'}`;

  return (
    <div className="sst">
      <div className="sst__stage" ref={stageRef}>
        <div className="sst__view">
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
                <Studio sim={sim} onSelect={setSelected} selected={selected} onTick={onTick} onHold={onHold} />
              </Suspense>
            </Canvas>
          </SceneBoundary>

          <div className="sst__status"><b>{status}</b></div>
          <div className="sst__hint">drag to orbit · scroll to zoom · click anything</div>

          <div className="sst__transport">
            <button type="button" className="sst__tbtn sst__tbtn--quiet" onClick={() => stepPhase(-1)} aria-label="Previous step">
              <SkipBack size={15} />
            </button>
            <button type="button" className="sst__tbtn" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: 2 }} />}
            </button>
            <button type="button" className="sst__tbtn sst__tbtn--quiet" onClick={() => stepPhase(1)} aria-label="Next step">
              <SkipForward size={15} />
            </button>
            <div className="sst__speed" role="group" aria-label="Playback speed">
              {[0.5, 1, 2, 4].map(s => (
                <button key={s} type="button" aria-pressed={speed === s} onClick={() => setSpd(s)}>{s === 0.5 ? '½' : s}×</button>
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

        {/* What is happening right now — or, when paused for reading, what comes next. */}
        {nextPhase ? (
          <div className="sst__caption sst__caption--held" role="status">
            <div>
              <span className="sst__capk">Paused so you can read the panel</span>
              <span className="sst__capt">Next up: <b>{nextPhase.label}</b></span>
            </div>
            <button type="button" className="bt-btn bt-btn--sm" onClick={play}>
              Continue
              <span className="bt-btn__badge" aria-hidden="true">→</span>
            </button>
          </div>
        ) : (
          <div className="sst__caption" aria-live="polite">
            <span className="sst__capk">
              Now · step {world.beatIndex + 1} of {world.beats.length}
            </span>
            <span className="sst__capt"><b>{beat.tag}.</b> {beat.text}</span>
          </div>
        )}
      </div>

      <aside className="sst__panel">
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
            <div className="sst__now">
              <p className="sst__nowlbl">What happens here</p>
              <ol className="sst__beats">
                {world.beats.map((b, i) => {
                  const state = i < world.beatIndex ? 'done' : i === world.beatIndex ? 'now' : 'next';
                  return (
                    <li key={i} data-state={state}>
                      <button type="button" onClick={() => jump(ph.start + b.at * ph.dur + 0.01)} aria-current={state === 'now' ? 'step' : undefined}>
                        <span className="sst__beatn bt-tnum">{state === 'done' ? '✓' : i + 1}</span>
                        <span><b>{b.tag}.</b> {b.text}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
            <ul className="sst__facts">
              <li><b>Who</b><span>{narration.who}</span></li>
              <li><b>Timebox</b><span>{narration.timebox}</span></li>
              <li><b>Output</b><span>{narration.output}</span></li>
            </ul>
            <p>{narration.body}</p>
          </>
        )}
      </aside>

      <MilestoneTimeline t={t} onJump={jump} guided={guided} onGuided={setGuide} />
    </div>
  );
}
