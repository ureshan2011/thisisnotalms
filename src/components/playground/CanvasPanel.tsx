import { useCallback, useEffect, useRef, useState } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import {
  Pencil, Eraser, Type, Trash2, ChevronDown, ChevronUp,
  Minus, Plus,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import type { CanvasSnapshot } from '../../lib/playgroundTypes';

const CANVAS_W = 1600;
const CANVAS_H = 900;
const COLORS = ['#1e1b4b', '#7c3aed', '#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#ffffff'];
type Tool = 'pen' | 'eraser' | 'text';

/* ── coordinate helper ────────────────────────────────── */
function getPos(
  e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement,
): { x: number; y: number } {
  const rect   = canvas.getBoundingClientRect();
  const scaleX = CANVAS_W / rect.width;
  const scaleY = CANVAS_H / rect.height;
  if ('touches' in e.nativeEvent) {
    const t = (e as React.TouchEvent).touches[0] ?? (e as React.TouchEvent).changedTouches[0];
    return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
  }
  const m = e as React.MouseEvent;
  return { x: (m.clientX - rect.left) * scaleX, y: (m.clientY - rect.top) * scaleY };
}

/* ─────────────────────────────────────────────────────────
   Lecturer drawing canvas
   ───────────────────────────────────────────────────────── */
interface LecturerCanvasProps {
  sessionId: string;
  userId: string;
}

export function LecturerCanvas({ sessionId, userId }: LecturerCanvasProps) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const drawing     = useRef(false);
  const lastPos     = useRef<{ x: number; y: number } | null>(null);
  const [expanded,  setExpanded]  = useState(false);
  const [tool,      setTool]      = useState<Tool>('pen');
  const [color,     setColor]     = useState('#1e1b4b');
  const [penSize,   setPenSize]   = useState(4);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saving,    setSaving]    = useState(false);

  // Text overlay state
  const [textPos,   setTextPos]   = useState<{ cssX: number; cssY: number; canX: number; canY: number } | null>(null);
  const [textVal,   setTextVal]   = useState('');

  // Initialise white canvas background on first mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }, []);

  const syncCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSaving(true);
    try {
      const data = canvas.toDataURL('image/png');
      await setDoc(doc(db, 'sessions', sessionId, 'canvas', 'snapshot'), {
        data,
        updatedAt: serverTimestamp(),
        updatedBy: userId,
      });
      setLastSaved(new Date());
    } finally {
      setSaving(false);
    }
  }, [sessionId, userId]);

  /* ── drawing handlers ── */
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (tool === 'text') return;
    e.preventDefault();
    const canvas = canvasRef.current!;
    drawing.current = true;
    const pos = getPos(e, canvas);
    lastPos.current = pos;
    const ctx = canvas.getContext('2d')!;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, (tool === 'eraser' ? penSize * 3 : penSize) / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.fill();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!drawing.current || tool === 'text') return;
    e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    const pos    = getPos(e, canvas);
    if (!lastPos.current) { lastPos.current = pos; return; }
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth   = tool === 'eraser' ? penSize * 3 : penSize;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => {
    if (!drawing.current) return;
    drawing.current  = false;
    lastPos.current  = null;
    syncCanvas();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== 'text') return;
    const canvas = canvasRef.current!;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    setTextPos({
      cssX: e.clientX - rect.left,
      cssY: e.clientY - rect.top,
      canX: (e.clientX - rect.left) * scaleX,
      canY: (e.clientY - rect.top)  * scaleY,
    });
    setTextVal('');
  };

  const commitText = () => {
    if (!textPos || !textVal.trim()) { setTextPos(null); return; }
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.font      = `${penSize * 6 + 8}px Inter, sans-serif`;
    ctx.fillStyle = color;
    ctx.fillText(textVal.trim(), textPos.canX, textPos.canY);
    setTextPos(null);
    setTextVal('');
    syncCanvas();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    syncCanvas();
  };

  return (
    <div className="card overflow-hidden animate-fadeIn">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 transition-all"
        style={{ borderBottom: expanded ? '1px solid rgba(139,92,246,0.10)' : 'none' }}
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ec4899, #7c3aed)' }}
          >
            <Pencil size={14} color="white" />
          </div>
          <span className="font-bold text-sm text-gray-800">Lecturer Canvas</span>
          {saving && (
            <span className="text-xs text-brand-500 animate-pulse ml-1">Syncing…</span>
          )}
        </div>
        {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      {expanded && (
        <div className="p-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {/* Tools */}
            {([['pen', <Pencil size={13} />], ['eraser', <Eraser size={13} />], ['text', <Type size={13} />]] as const).map(([t, icon]) => (
              <button
                key={t}
                onClick={() => setTool(t)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: tool === t ? 'linear-gradient(135deg,#7c3aed,#a78bfa)' : 'rgba(139,92,246,0.08)',
                  color: tool === t ? '#fff' : '#7c3aed',
                }}
              >
                {icon} {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}

            {/* Size */}
            <div className="flex items-center gap-1 ml-1">
              <button onClick={() => setPenSize((s) => Math.max(1, s - 1))} className="btn-ghost p-1"><Minus size={12} /></button>
              <span className="text-xs font-semibold w-4 text-center text-gray-600">{penSize}</span>
              <button onClick={() => setPenSize((s) => Math.min(20, s + 1))} className="btn-ghost p-1"><Plus size={12} /></button>
            </div>

            {/* Colors */}
            <div className="flex items-center gap-1 ml-1">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-5 h-5 rounded-full transition-transform hover:scale-110"
                  style={{
                    background: c,
                    border: color === c ? '2px solid #7c3aed' : '1px solid rgba(0,0,0,0.15)',
                    transform: color === c ? 'scale(1.25)' : undefined,
                  }}
                />
              ))}
            </div>

            {/* Clear */}
            <button onClick={clearCanvas} className="btn-ghost ml-auto p-1.5" title="Clear canvas">
              <Trash2 size={14} />
            </button>
          </div>

          {/* Canvas container */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(139,92,246,0.15)' }}
          >
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="block w-full touch-none"
              style={{ cursor: tool === 'text' ? 'text' : tool === 'eraser' ? 'cell' : 'crosshair', background: '#fff' }}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
              onClick={handleCanvasClick}
            />

            {/* Text input overlay */}
            {textPos && (
              <div
                className="absolute"
                style={{ left: textPos.cssX, top: textPos.cssY, transform: 'translate(0, -50%)' }}
              >
                <input
                  autoFocus
                  value={textVal}
                  onChange={(e) => setTextVal(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') commitText(); if (e.key === 'Escape') setTextPos(null); }}
                  onBlur={commitText}
                  className="px-2 py-1 text-sm font-medium rounded border outline-none shadow-lg"
                  style={{
                    color,
                    fontSize: penSize * 6 + 8,
                    background: 'rgba(255,255,255,0.92)',
                    border: '1px solid rgba(124,58,237,0.4)',
                    minWidth: 80,
                  }}
                  placeholder="Type here…"
                />
              </div>
            )}
          </div>

          {/* Last saved */}
          {lastSaved && (
            <p className="text-xs text-gray-400 mt-2 text-right">
              Last synced: {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Student read-only canvas mirror
   ───────────────────────────────────────────────────────── */
interface StudentCanvasProps {
  sessionId: string;
}

export function StudentCanvas({ sessionId }: StudentCanvasProps) {
  const [snapshot, setSnapshot] = useState<CanvasSnapshot | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'sessions', sessionId, 'canvas', 'snapshot'),
      (snap) => {
        if (!snap.exists()) { setSnapshot(null); return; }
        const d = snap.data();
        setSnapshot({
          data:      d.data      ?? '',
          updatedAt: (d.updatedAt as Timestamp)?.toDate?.() ?? new Date(),
          updatedBy: d.updatedBy ?? '',
        });
      }
    );
    return unsub;
  }, [sessionId]);

  if (!snapshot || !snapshot.data) {
    return (
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ec4899, #7c3aed)' }}
          >
            <Pencil size={14} color="white" />
          </div>
          <h3 className="font-bold text-sm text-gray-800">Lecturer's Canvas</h3>
        </div>
        <div
          className="rounded-2xl flex flex-col items-center justify-center py-12 text-center"
          style={{ background: 'rgba(124,58,237,0.04)', border: '1px dashed rgba(124,58,237,0.20)' }}
        >
          <Pencil size={28} style={{ color: '#c4b5fd' }} />
          <p className="text-sm text-gray-400 mt-3 font-medium">Canvas is empty</p>
          <p className="text-xs text-gray-400 mt-1">The lecturer hasn't drawn anything yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5 animate-fadeIn">
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #ec4899, #7c3aed)' }}
        >
          <Pencil size={14} color="white" />
        </div>
        <h3 className="font-bold text-sm text-gray-800">Lecturer's Canvas</h3>
        <span
          className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(52,211,153,0.12)', color: '#059669' }}
        >
          Live
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(139,92,246,0.12)' }}>
        <img
          src={snapshot.data}
          alt="Lecturer canvas"
          className="w-full block"
          style={{ aspectRatio: '16/9', objectFit: 'contain', background: '#fff' }}
        />
      </div>

      <p className="text-xs text-gray-400 mt-2 text-right">
        Last updated: {snapshot.updatedAt.toLocaleTimeString()}
      </p>
    </div>
  );
}
