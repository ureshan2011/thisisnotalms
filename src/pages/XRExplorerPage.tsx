import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type XRMode = 'ar' | 'vr' | 'mr';
type SimScene = 'none' | 'ar-marker' | 'vr-room' | 'mr-workspace';

interface FloatingObject {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  label: string;
  vx: number;
  vy: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const XR_TABS: { id: XRMode; label: string; emoji: string; color: string; gradient: string }[] = [
  {
    id: 'ar',
    label: 'Augmented Reality',
    emoji: '📱',
    color: '#06b6d4',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'vr',
    label: 'Virtual Reality',
    emoji: '🥽',
    color: '#8b5cf6',
    gradient: 'from-violet-500 to-purple-700',
  },
  {
    id: 'mr',
    label: 'Mixed Reality',
    emoji: '🌐',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-700',
  },
];

const AR_OBJECTS = [
  { emoji: '🦕', label: 'Dinosaur', color: '#f59e0b' },
  { emoji: '🚀', label: 'Rocket', color: '#6366f1' },
  { emoji: '🏛️', label: 'Monument', color: '#ec4899' },
  { emoji: '🌊', label: 'Ocean wave', color: '#06b6d4' },
];

const VR_WORLDS = [
  { name: 'Deep Ocean', bg: 'from-blue-950 via-blue-800 to-cyan-700', emoji: '🌊', objects: ['🐠', '🐙', '🦈', '🐚', '🪸'] },
  { name: 'Outer Space', bg: 'from-slate-950 via-indigo-950 to-purple-900', emoji: '🌌', objects: ['⭐', '🪐', '🌙', '☄️', '🛸'] },
  { name: 'Ancient Rome', bg: 'from-amber-900 via-orange-800 to-yellow-700', emoji: '🏛️', objects: ['🗽', '⚔️', '🏺', '🎭', '🦁'] },
];

const MR_TASKS = [
  { id: 'annotate', label: 'Annotate a blueprint', icon: '📐', done: false },
  { id: 'measure', label: 'Measure wall dimensions', icon: '📏', done: false },
  { id: 'place',   label: 'Place virtual furniture', icon: '🛋️', done: false },
  { id: 'collab',  label: 'Invite remote colleague', icon: '👥', done: false },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated particles that fill a canvas element */
function ParticleCanvas({ color }: { color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = color + 'aa';
        ctx.fill();
      });
      // draw connecting lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = color + Math.floor((1 - dist / 80) * 60).toString(16).padStart(2, '0');
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [color]);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/** AR camera-view simulation */
function ARSimulation() {
  const [placed, setPlaced] = useState<{ obj: typeof AR_OBJECTS[0]; x: number; y: number; scale: number }[]>([]);
  const [selected, setSelected] = useState(0);
  const [scanning, setScanning] = useState(true);
  const [scanLine, setScanLine] = useState(0);
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scanning) return;
    const t = setInterval(() => setScanLine(p => (p + 2) % 100), 16);
    return () => clearInterval(t);
  }, [scanning]);

  const placeObject = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!viewRef.current) return;
    const rect = viewRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    setScanning(false);
    setPlaced(prev => [...prev, { obj: AR_OBJECTS[selected], x, y, scale: 0.8 + Math.random() * 0.6 }]);
  };

  const reset = () => { setPlaced([]); setScanning(true); setScanLine(0); };

  return (
    <div className="space-y-4">
      <p className="text-slate-300 text-sm">
        Select an object, then <strong className="text-cyan-400">click anywhere in the camera view</strong> to place it into the real world.
      </p>

      {/* Object picker */}
      <div className="flex gap-3 flex-wrap">
        {AR_OBJECTS.map((obj, i) => (
          <button
            key={obj.label}
            onClick={() => setSelected(i)}
            className={`px-4 py-2 rounded-xl border transition-all duration-200 text-sm font-medium flex items-center gap-2 ${
              selected === i
                ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300 shadow-lg shadow-cyan-500/20'
                : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/30'
            }`}
          >
            <span className="text-xl">{obj.emoji}</span>
            {obj.label}
          </button>
        ))}
      </div>

      {/* Camera viewport */}
      <div
        ref={viewRef}
        onClick={placeObject}
        className="relative w-full h-64 rounded-2xl overflow-hidden cursor-crosshair border border-cyan-500/30 select-none"
        style={{ background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' }}
      >
        {/* Camera grain overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: '150px',
        }} />

        {/* Grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Scan line */}
        {scanning && (
          <div
            className="absolute left-0 right-0 h-0.5 bg-cyan-400 opacity-80 transition-none pointer-events-none"
            style={{ top: `${scanLine}%`, boxShadow: '0 0 8px #06b6d4, 0 0 24px #06b6d422' }}
          />
        )}

        {/* Corner brackets */}
        {[['top-3 left-3', 'border-t border-l'],['top-3 right-3','border-t border-r'],
          ['bottom-3 left-3','border-b border-l'],['bottom-3 right-3','border-b border-r']].map(([pos, bdr], i) => (
          <div key={i} className={`absolute ${pos} w-5 h-5 ${bdr} border-cyan-400 border-2 rounded-sm opacity-70`} />
        ))}

        {/* Placed objects */}
        {placed.map((p, i) => (
          <div
            key={i}
            className="absolute pointer-events-none animate-[scale-in_0.3s_ease-out]"
            style={{ left: `${p.x}%`, top: `${p.y}%`, transform: `translate(-50%, -50%) scale(${p.scale})` }}
          >
            <div className="relative">
              <span className="text-4xl drop-shadow-lg" style={{ filter: `drop-shadow(0 0 8px ${p.obj.color})` }}>{p.obj.emoji}</span>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap px-2 py-0.5 rounded-full"
                style={{ background: p.obj.color + '33', color: p.obj.color, border: `1px solid ${p.obj.color}55` }}>
                {p.obj.label}
              </div>
              {/* Shadow on floor */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full opacity-40"
                style={{ background: p.obj.color, filter: 'blur(4px)' }} />
            </div>
          </div>
        ))}

        {scanning && placed.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-cyan-400/60 text-sm font-medium tracking-widest uppercase animate-pulse">Scanning surface…</p>
          </div>
        )}

        {/* HUD elements */}
        <div className="absolute top-3 right-14 text-cyan-400 text-xs font-mono opacity-70">CAM</div>
        <div className="absolute bottom-3 left-3 text-cyan-400 text-xs font-mono opacity-60">AR MODE • LIVE</div>
        <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      </div>

      <div className="flex gap-3">
        <button onClick={reset}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition">
          Reset scene
        </button>
        <p className="text-slate-500 text-xs self-center">{placed.length} object{placed.length !== 1 ? 's' : ''} placed</p>
      </div>
    </div>
  );
}

/** VR world simulation */
function VRSimulation() {
  const [worldIdx, setWorldIdx] = useState(0);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotStart, setRotStart] = useState({ x: 0, y: 0 });
  const world = VR_WORLDS[worldIdx];
  const [floaters, setFloaters] = useState<FloatingObject[]>([]);

  useEffect(() => {
    setFloaters(world.objects.map((emoji, i) => ({
      id: i, emoji,
      x: 20 + (i * 15) % 70, y: 20 + (i * 18) % 60,
      vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.1,
    } as unknown as FloatingObject & { emoji: string })));
  }, [worldIdx]);

  useEffect(() => {
    const id = setInterval(() => {
      setFloaters(prev => prev.map(f => {
        let nx = f.x + f.vx, ny = f.y + f.vy;
        if (nx < 5 || nx > 88) { f.vx *= -1; nx = f.x; }
        if (ny < 5 || ny > 80) { f.vy *= -1; ny = f.y; }
        return { ...f, x: nx, y: ny };
      }));
    }, 50);
    return () => clearInterval(id);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setRotStart({ ...rotation });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotation({ x: rotStart.x + dy * 0.3, y: rotStart.y + dx * 0.3 });
  };

  return (
    <div className="space-y-4">
      <p className="text-slate-300 text-sm">
        Choose a virtual world, then <strong className="text-violet-400">drag to look around</strong> in 360°.
      </p>

      {/* World selector */}
      <div className="flex gap-3 flex-wrap">
        {VR_WORLDS.map((w, i) => (
          <button key={w.name} onClick={() => setWorldIdx(i)}
            className={`px-4 py-2 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all ${
              worldIdx === i
                ? 'border-violet-400 bg-violet-400/20 text-violet-300 shadow-lg shadow-violet-500/20'
                : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/30'
            }`}>
            <span>{w.emoji}</span> {w.name}
          </button>
        ))}
      </div>

      {/* VR viewport */}
      <div
        className={`relative w-full h-64 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none border border-violet-500/30 bg-gradient-to-br ${world.bg}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
      >
        {/* Parallax sky layers */}
        <div className="absolute inset-0 opacity-30"
          style={{ transform: `translate(${rotation.y * 0.5}px, ${rotation.x * 0.3}px)` }}>
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white/20"
              style={{
                width: `${2 + (i * 7) % 8}px`, height: `${2 + (i * 7) % 8}px`,
                left: `${(i * 23) % 110 - 5}%`, top: `${(i * 17) % 90}%`,
                opacity: 0.3 + (i % 4) * 0.15,
              }} />
          ))}
        </div>

        {/* Floating world objects */}
        {floaters.map((f: any) => (
          <div key={f.id} className="absolute text-3xl pointer-events-none"
            style={{
              left: `${f.x + rotation.y * 0.08}%`,
              top: `${f.y + rotation.x * 0.05}%`,
              transform: 'translate(-50%,-50%)',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
              transition: 'left 0.05s linear, top 0.05s linear',
            }}>
            {f.emoji}
          </div>
        ))}

        {/* VR lens split line */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-black/40" />

        {/* Fisheye vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)' }} />

        {/* Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-6 h-6">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/40" />
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/40" />
            <div className="absolute inset-1 rounded-full border border-white/30" />
          </div>
        </div>

        <div className="absolute top-3 left-3 text-violet-300 text-xs font-mono opacity-70">VR HEADSET VIEW</div>
        <div className="absolute bottom-3 left-3 text-xs text-white/50 font-medium">{world.name}</div>
        <div className="absolute bottom-3 right-3 text-xs text-white/40 font-mono">
          {rotation.x.toFixed(0)}° / {rotation.y.toFixed(0)}°
        </div>
      </div>

      <p className="text-slate-500 text-xs">In real VR, head movement replaces mouse drag. The headset tracks rotation 360° in all directions.</p>
    </div>
  );
}

/** MR task-overlay simulation */
function MRSimulation() {
  const [tasks, setTasks] = useState(MR_TASKS.map(t => ({ ...t })));
  const [hologramVisible, setHologramVisible] = useState(true);
  const [opacity, setOpacity] = useState(70);
  const [activePin, setActivePin] = useState<number | null>(null);
  const [pins, setPins] = useState<{ x: number; y: number; label: string }[]>([]);
  const viewRef = useRef<HTMLDivElement>(null);

  const done = tasks.filter(t => t.done).length;

  const toggleTask = (id: string) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const addPin = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!viewRef.current) return;
    const rect = viewRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const labels = ['Measure here', 'Note: load-bearing', 'Wiring route', 'Window placement'];
    setPins(prev => [...prev, { x, y, label: labels[prev.length % labels.length] }]);
  };

  return (
    <div className="space-y-4">
      <p className="text-slate-300 text-sm">
        Mixed Reality blends holograms with the physical world.{' '}
        <strong className="text-emerald-400">Click the room view to pin annotations</strong>. Toggle the hologram overlay.
      </p>

      {/* Room view */}
      <div ref={viewRef} onClick={addPin}
        className="relative w-full h-64 rounded-2xl overflow-hidden cursor-crosshair border border-emerald-500/30 select-none"
        style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)' }}>

        {/* "Real" room illustration */}
        <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 400 256" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* floor */}
          <polygon points="0,200 400,200 340,256 60,256" fill="#ffffff08" stroke="#ffffff15" strokeWidth="1" />
          {/* left wall */}
          <polygon points="0,60 0,200 60,256 60,110" fill="#ffffff06" stroke="#ffffff12" strokeWidth="1" />
          {/* right wall */}
          <polygon points="400,60 400,200 340,256 340,110" fill="#ffffff04" stroke="#ffffff10" strokeWidth="1" />
          {/* ceiling */}
          <polygon points="0,60 400,60 340,110 60,110" fill="#ffffff05" stroke="#ffffff18" strokeWidth="1" />
          {/* door */}
          <rect x="160" y="140" width="80" height="60" fill="#ffffff06" stroke="#ffffff20" strokeWidth="1" />
          <circle cx="230" cy="172" r="3" fill="#ffffff30" />
          {/* window */}
          <rect x="50" y="80" width="70" height="50" fill="#06b6d415" stroke="#06b6d440" strokeWidth="1.5" />
          <line x1="85" y1="80" x2="85" y2="130" stroke="#06b6d430" strokeWidth="1" />
        </svg>

        {/* Hologram overlay */}
        {hologramVisible && (
          <div className="absolute inset-0 pointer-events-none" style={{ opacity: opacity / 100 }}>
            {/* blueprint grid */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 256" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="bpgrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#10b98133" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#bpgrid)" />
              {/* dimension lines */}
              <line x1="60" y1="240" x2="340" y2="240" stroke="#10b981" strokeWidth="1" opacity="0.6" />
              <text x="200" y="252" textAnchor="middle" fill="#10b981" fontSize="10" opacity="0.7">8.4 m</text>
              <line x1="20" y1="60" x2="20" y2="200" stroke="#10b981" strokeWidth="1" opacity="0.6" />
              <text x="12" y="135" textAnchor="middle" fill="#10b981" fontSize="10" opacity="0.7" transform="rotate(-90,12,135)">3.2 m</text>
              {/* sofa outline */}
              <rect x="140" y="180" width="120" height="30" rx="4" fill="#10b98118" stroke="#10b98166" strokeWidth="1.5" strokeDasharray="4,3" />
              <text x="200" y="199" textAnchor="middle" fill="#10b981" fontSize="9" opacity="0.9">Sofa</text>
              {/* table outline */}
              <rect x="170" y="155" width="60" height="25" rx="3" fill="#06b6d415" stroke="#06b6d455" strokeWidth="1.5" strokeDasharray="4,3" />
              <text x="200" y="172" textAnchor="middle" fill="#06b6d4" fontSize="9" opacity="0.9">Table</text>
            </svg>
          </div>
        )}

        {/* Pins */}
        {pins.map((pin, i) => (
          <div key={i} className="absolute pointer-events-none"
            style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -100%)' }}>
            <div className="relative flex flex-col items-center">
              <div className="px-2 py-1 rounded-lg text-xs font-medium text-white whitespace-nowrap mb-1"
                style={{ background: '#10b98199', border: '1px solid #10b981', backdropFilter: 'blur(4px)' }}>
                {pin.label}
              </div>
              <div className="w-0.5 h-3 bg-emerald-400" />
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute bottom-0" />
              <div className="w-2 h-2 rounded-full bg-emerald-500 absolute bottom-0" />
            </div>
          </div>
        ))}

        <div className="absolute top-3 left-3 text-emerald-400 text-xs font-mono opacity-70">MR PASSTHROUGH • LIVE</div>
        <div className="absolute bottom-3 right-3 text-xs text-white/40">{pins.length} annotation{pins.length !== 1 ? 's' : ''}</div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <div onClick={() => setHologramVisible(v => !v)}
            className={`w-10 h-5 rounded-full transition-colors ${hologramVisible ? 'bg-emerald-500' : 'bg-white/20'}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${hologramVisible ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
          Hologram overlay
        </label>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span>Opacity</span>
          <input type="range" min={10} max={100} value={opacity}
            onChange={e => setOpacity(+e.target.value)}
            className="w-24 accent-emerald-500" />
          <span className="font-mono text-emerald-400 w-8">{opacity}%</span>
        </div>
        <button onClick={() => setPins([])} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs hover:bg-white/10">
          Clear pins
        </button>
      </div>

      {/* Task list */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">MR Workflow tasks — {done}/{tasks.length} complete</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {tasks.map(t => (
            <button key={t.id} onClick={() => toggleTask(t.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                t.done ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
              }`}>
              <span className="text-xl">{t.icon}</span>
              <span className="text-sm font-medium flex-1">{t.label}</span>
              <span>{t.done ? '✅' : '⬜'}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Comparison table ─────────────────────────────────────────────────────────
function ComparisonTable() {
  const rows = [
    { aspect: 'Real world visible?',      ar: '✅ Yes',       vr: '❌ Blocked',   mr: '✅ Yes' },
    { aspect: 'Digital objects present?', ar: '✅ Overlaid',  vr: '✅ Everything', mr: '✅ Anchored' },
    { aspect: 'Interaction with real?',   ar: '⚠️ Limited',  vr: '❌ None',      mr: '✅ Full' },
    { aspect: 'Typical device',           ar: '📱 Phone/Glasses', vr: '🥽 Headset', mr: '🥽 Smart Glasses' },
    { aspect: 'Examples',                 ar: 'Pokémon GO, IKEA Place', vr: 'Meta Quest, PlayStation VR', mr: 'Microsoft HoloLens, Magic Leap' },
    { aspect: 'Immersion level',          ar: '⬜⬜⬛⬛⬛', vr: '⬛⬛⬛⬛⬛', mr: '⬜⬛⬛⬛⬛' },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left px-4 py-3 text-slate-400 font-medium w-40">Aspect</th>
            <th className="px-4 py-3 text-cyan-400 font-semibold">AR</th>
            <th className="px-4 py-3 text-violet-400 font-semibold">VR</th>
            <th className="px-4 py-3 text-emerald-400 font-semibold">MR</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.aspect} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
              <td className="px-4 py-3 text-slate-400 font-medium">{r.aspect}</td>
              <td className="px-4 py-3 text-center text-slate-300">{r.ar}</td>
              <td className="px-4 py-3 text-center text-slate-300">{r.vr}</td>
              <td className="px-4 py-3 text-center text-slate-300">{r.mr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Reality Spectrum slider ──────────────────────────────────────────────────
function RealitySpectrum() {
  const [pos, setPos] = useState(50);

  const getLabel = () => {
    if (pos < 20) return { name: 'Physical Reality', color: '#94a3b8', desc: 'Entirely the real world — no digital content at all.' };
    if (pos < 40) return { name: 'Augmented Reality', color: '#06b6d4', desc: 'Digital overlays on top of the real world. You can still see and interact with your surroundings.' };
    if (pos < 60) return { name: 'Mixed Reality', color: '#10b981', desc: 'Digital objects are spatially anchored and interact with real surfaces. Hard to tell apart.' };
    if (pos < 80) return { name: 'Augmented Virtuality', color: '#8b5cf6', desc: 'Mostly virtual, but real-world elements are captured and blended in.' };
    return { name: 'Virtual Reality', color: '#7c3aed', desc: 'Fully synthetic environment. The real world is completely replaced.' };
  };

  const info = getLabel();

  return (
    <div className="space-y-5 py-2">
      <p className="text-slate-300 text-sm">
        Paul Milgram's <strong className="text-white">Reality-Virtuality Continuum</strong> (1994) maps all mixed-reality technologies on a spectrum between the fully real and fully virtual.
      </p>

      {/* Spectrum bar */}
      <div className="space-y-3">
        <div className="flex justify-between text-xs text-slate-500 font-medium">
          <span>Real World</span>
          <span>Virtual World</span>
        </div>
        <div className="relative h-8 rounded-full overflow-hidden"
          style={{ background: 'linear-gradient(to right, #94a3b8, #06b6d4, #10b981, #8b5cf6, #7c3aed)' }}>
          <input
            type="range" min={0} max={100} value={pos}
            onChange={e => setPos(+e.target.value)}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          />
          <div className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-xl border-2 border-white pointer-events-none transition-all"
            style={{ left: `calc(${pos}% - 12px)` }} />
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>Physical</span><span>AR</span><span>MR</span><span>AV</span><span>VR</span>
        </div>
      </div>

      {/* Info card */}
      <div className="rounded-2xl p-4 border transition-all duration-300"
        style={{ background: info.color + '15', borderColor: info.color + '40' }}>
        <p className="font-semibold text-base mb-1" style={{ color: info.color }}>{info.name}</p>
        <p className="text-slate-300 text-sm">{info.desc}</p>
      </div>
    </div>
  );
}

// ─── Use-case cards ───────────────────────────────────────────────────────────
const USE_CASES = [
  { emoji: '🏥', title: 'Medicine', body: 'Surgeons use AR to overlay patient scans during operations. VR trains doctors in risk-free simulated scenarios.', tags: ['AR', 'VR'] },
  { emoji: '🏗️', title: 'Architecture', body: 'Clients walk through buildings before they are built, using VR walkthroughs and MR overlays on physical blueprints.', tags: ['VR', 'MR'] },
  { emoji: '🎓', title: 'Education', body: 'Students dissect virtual frogs, tour ancient Rome, and explore the solar system without leaving the classroom.', tags: ['AR', 'VR', 'MR'] },
  { emoji: '🛒', title: 'Retail', body: 'AR lets shoppers try on clothes virtually or place furniture in their room before purchasing.', tags: ['AR'] },
  { emoji: '🏭', title: 'Manufacturing', body: 'MR headsets guide technicians step-by-step through complex assembly with holographic instructions overlaid on parts.', tags: ['MR'] },
  { emoji: '🎮', title: 'Entertainment', body: 'Fully immersive VR games and AR mobile experiences like Pokémon GO redefined interactive entertainment.', tags: ['AR', 'VR'] },
];

const TAG_COLORS: Record<string, string> = {
  AR: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  VR: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
  MR: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
};

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function XRExplorerPage() {
  const [activeTab, setActiveTab] = useState<XRMode>('ar');
  const [scene, setScene] = useState<SimScene>('none');
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizIdx, setQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const quiz = [
    { q: 'You can see the real world through a VR headset.', a: false, explanation: 'VR replaces your entire field of view with a synthetic environment.' },
    { q: 'AR stands for "Augmented Reality".', a: true, explanation: 'AR (Augmented Reality) overlays digital content onto the real world.' },
    { q: 'Mixed Reality is simply a marketing name for VR.', a: false, explanation: 'MR is a distinct category where digital objects interact with real-world surfaces spatially.' },
    { q: 'Pokémon GO is an example of an AR application.', a: true, explanation: 'It overlays virtual creatures onto your real environment using your phone camera.' },
    { q: 'In MR, digital holograms can appear to sit on a real table.', a: true, explanation: 'MR anchors virtual objects to real surfaces — they respond to real-world geometry.' },
  ];

  const handleQuiz = (answer: boolean) => {
    if (quizAnswer !== null) return;
    const correct = answer === quiz[quizIdx].a;
    setQuizAnswer(answer ? 1 : 0);
    if (correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (quizIdx + 1 >= quiz.length) { setQuizDone(true); return; }
    setQuizIdx(i => i + 1);
    setQuizAnswer(null);
  };

  const resetQuiz = () => { setQuizIdx(0); setScore(0); setQuizAnswer(null); setQuizDone(false); };

  const activeColor = XR_TABS.find(t => t.id === activeTab)!.color;
  const activeGradient = XR_TABS.find(t => t.id === activeTab)!.gradient;

  return (
    <div className="min-h-screen text-white" style={{ background: '#060914' }}>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Animated gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: '#06b6d4', transform: `translate(${scrollY * 0.1}px, ${-scrollY * 0.05}px)` }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl"
            style={{ background: '#8b5cf6', transform: `translate(${-scrollY * 0.08}px, ${scrollY * 0.04}px)` }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-10 blur-2xl"
            style={{ background: '#10b981', transform: `translate(-50%, -50%) translate(${scrollY * 0.05}px, ${scrollY * 0.03}px)` }} />
          <ParticleCanvas color="#8b5cf6" />
        </div>

        {/* Brand */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-slate-400 mb-8 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Dr. Yasas Sri Wickramasinghe · Interactive Learning
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6">
            <span className="block text-white">Explore</span>
            <span className="block"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              AR · VR · MR
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Dive into the Extended Reality spectrum with interactive simulations, hands-on activities, and real-world use cases — no headset required.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#learn" className="px-8 py-3.5 rounded-2xl font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', boxShadow: '0 0 40px #8b5cf640' }}>
              Start Exploring
            </a>
            <a href="#quiz" className="px-8 py-3.5 rounded-2xl font-semibold text-slate-300 border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-200">
              Take the Quiz
            </a>
          </div>

          {/* XR badges */}
          <div className="flex gap-6 justify-center mt-12 flex-wrap">
            {XR_TABS.map(t => (
              <div key={t.id} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur text-sm font-medium"
                style={{ color: t.color }}>
                <span className="text-xl">{t.emoji}</span>
                {t.label}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600 text-xs">
          <span>Scroll to explore</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-slate-600 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── WHAT IS XR ───────────────────────────────────────────────────────── */}
      <section id="learn" className="relative px-4 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm text-slate-500 uppercase tracking-widest mb-3">Foundation</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What is Extended Reality?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Extended Reality (XR) is the umbrella term for all technologies that blend real and virtual worlds — from a simple phone overlay to a fully immersive headset experience.
          </p>
        </div>

        {/* Reality spectrum */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 mb-10">
          <h3 className="text-lg font-semibold text-white mb-4">The Reality–Virtuality Continuum</h3>
          <RealitySpectrum />
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {XR_TABS.map(tab => (
            <div key={tab.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: tab.color + '20', border: `1px solid ${tab.color}40` }}>
                {tab.emoji}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{tab.label}</h3>
              {tab.id === 'ar' && <p className="text-slate-400 text-sm leading-relaxed">Augments your real-world view with digital information. Your surroundings remain fully visible and interactive while virtual objects are overlaid on top.</p>}
              {tab.id === 'vr' && <p className="text-slate-400 text-sm leading-relaxed">Replaces your entire field of view with a computer-generated environment. You are fully immersed in a virtual world, disconnected from physical surroundings.</p>}
              {tab.id === 'mr' && <p className="text-slate-400 text-sm leading-relaxed">Blends digital content with the physical world so they coexist and interact. Virtual objects are spatially anchored to real surfaces and respond to real-world geometry.</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ── INTERACTIVE SIMULATIONS ──────────────────────────────────────────── */}
      <section className="px-4 py-20" style={{ background: '#0a0f1e' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm text-slate-500 uppercase tracking-widest mb-3">Hands-on</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Interactive Simulations</h2>
            <p className="text-slate-400">Experience AR, VR, and MR directly in your browser — no app download required.</p>
          </div>

          {/* Tab bar */}
          <div className="flex gap-2 flex-wrap mb-8 p-1.5 rounded-2xl bg-white/5 border border-white/10 w-fit mx-auto">
            {XR_TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id ? 'text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
                style={activeTab === tab.id ? { background: `linear-gradient(135deg, ${XR_TABS.find(t=>t.id===tab.id)!.color}33, ${XR_TABS.find(t=>t.id===tab.id)!.color}55)`, boxShadow: `0 4px 20px ${XR_TABS.find(t=>t.id===tab.id)!.color}30` } : {}}>
                <span className="text-lg">{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Simulation panel */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 transition-all duration-300"
            style={{ borderColor: activeColor + '30' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: activeColor + '20', border: `1px solid ${activeColor}40` }}>
                {XR_TABS.find(t => t.id === activeTab)!.emoji}
              </div>
              <div>
                <h3 className="font-bold text-white">{XR_TABS.find(t => t.id === activeTab)!.label} Simulator</h3>
                <p className="text-xs text-slate-500">Interactive browser demo</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full"
                style={{ background: activeColor + '15', color: activeColor }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: activeColor }} />
                LIVE
              </div>
            </div>

            {activeTab === 'ar' && <ARSimulation />}
            {activeTab === 'vr' && <VRSimulation />}
            {activeTab === 'mr' && <MRSimulation />}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ─────────────────────────────────────────────────── */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm text-slate-500 uppercase tracking-widest mb-3">At a glance</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">AR vs VR vs MR</h2>
          <p className="text-slate-400">A quick comparison of how the three technologies differ.</p>
        </div>
        <ComparisonTable />
      </section>

      {/* ── USE CASES ────────────────────────────────────────────────────────── */}
      <section className="px-4 py-20" style={{ background: '#0a0f1e' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm text-slate-500 uppercase tracking-widest mb-3">Real-world applications</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Where XR is used today</h2>
            <p className="text-slate-400">Extended Reality is transforming industries across the globe.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {USE_CASES.map(u => (
              <div key={u.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{u.emoji}</div>
                <h3 className="text-lg font-bold text-white mb-2">{u.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{u.body}</p>
                <div className="flex gap-2 flex-wrap">
                  {u.tags.map(tag => (
                    <span key={tag} className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${TAG_COLORS[tag]}`}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUIZ ─────────────────────────────────────────────────────────────── */}
      <section id="quiz" className="px-4 py-20 max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm text-slate-500 uppercase tracking-widest mb-3">Test yourself</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Quick Knowledge Check</h2>
          <p className="text-slate-400">Five true/false questions to test what you've learned.</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          {!quizDone ? (
            <>
              {/* Progress */}
              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span>Question {quizIdx + 1} of {quiz.length}</span>
                <span>Score: {score}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 mb-8 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${((quizIdx) / quiz.length) * 100}%`, background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)' }} />
              </div>

              <p className="text-xl font-semibold text-white mb-8 leading-snug">{quiz[quizIdx].q}</p>

              <div className="flex gap-4">
                {[true, false].map(opt => {
                  const answered = quizAnswer !== null;
                  const isCorrect = opt === quiz[quizIdx].a;
                  const wasChosen = (opt ? 1 : 0) === quizAnswer;
                  let cls = 'flex-1 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 border ';
                  if (!answered) cls += 'border-white/15 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-white/30 cursor-pointer';
                  else if (isCorrect) cls += 'border-emerald-500 bg-emerald-500/20 text-emerald-300 cursor-default';
                  else if (wasChosen) cls += 'border-rose-500 bg-rose-500/20 text-rose-300 cursor-default';
                  else cls += 'border-white/5 bg-white/[0.02] text-slate-600 cursor-default';

                  return (
                    <button key={String(opt)} onClick={() => handleQuiz(opt)} className={cls}>
                      {opt ? '✅ True' : '❌ False'}
                    </button>
                  );
                })}
              </div>

              {quizAnswer !== null && (
                <div className="mt-6 p-4 rounded-2xl border border-white/10 bg-white/5 space-y-3">
                  <p className={`font-semibold ${quizAnswer === (quiz[quizIdx].a ? 1 : 0) ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {quizAnswer === (quiz[quizIdx].a ? 1 : 0) ? '🎉 Correct!' : '❌ Incorrect'}
                  </p>
                  <p className="text-slate-300 text-sm">{quiz[quizIdx].explanation}</p>
                  <button onClick={nextQuestion}
                    className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}>
                    {quizIdx + 1 < quiz.length ? 'Next question →' : 'See results'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 space-y-6">
              <div className="text-7xl">{score >= 4 ? '🏆' : score >= 3 ? '🎯' : '📚'}</div>
              <div>
                <p className="text-4xl font-black text-white mb-2">{score} / {quiz.length}</p>
                <p className="text-slate-400">
                  {score === 5 ? 'Perfect score! You have mastered AR, VR, and MR.' :
                   score >= 3 ? 'Great work! Review the simulations above to fill any gaps.' :
                   'Good start — head back to the simulations and give it another try!'}
                </p>
              </div>
              <button onClick={resetQuiz}
                className="px-8 py-3 rounded-2xl font-semibold text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}>
                Try again
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10 px-4 text-center" style={{ background: '#060914' }}>
        <p className="text-slate-500 text-sm">
          Designed and curated by{' '}
          <span className="text-slate-300 font-semibold">Dr. Yasas Sri Wickramasinghe</span>
          {' '}· Extended Reality Learning Module
        </p>
        <p className="text-slate-700 text-xs mt-2">Interactive simulations run entirely in your browser — no data is collected or stored.</p>
      </footer>
    </div>
  );
}
