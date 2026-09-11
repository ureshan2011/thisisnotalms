import { useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Users, Check, RotateCcw } from 'lucide-react';
import {
  BACKGROUND_OPTIONS, MOOD_OPTIONS, backgroundInfo, moodInfo,
  submitIcebreakerPin, useIcebreakerPins,
  type BackgroundKey, type MoodKey,
} from '../../lib/day1Icebreaker';

const STORAGE_KEY = 'day1_icebreaker_pin';

function pinIcon(color: string, emoji: string) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:32px;height:32px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      background:${color};
      border:2px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
      display:flex;align-items:center;justify-content:center;
    "><span style="transform:rotate(45deg);font-size:15px;line-height:1;">${emoji}</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 30],
    popupAnchor: [0, -30],
  });
}

function ClickToPlace({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e: LeafletMouseEvent) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

function LiveMap({ pins, draft }: {
  pins: ReturnType<typeof useIcebreakerPins>['pins'];
  draft?: { pin: { lat: number; lng: number } | null; onPick: (lat: number, lng: number) => void };
}) {
  const worldBounds: [[number, number], [number, number]] = [[-85, -180], [85, 180]];

  return (
    <div className="h-72 sm:h-80 w-full overflow-hidden border" style={{ borderColor: 'rgba(0,0,0,0.12)' }}>
      <MapContainer
        center={[15, 10]}
        zoom={2}
        minZoom={2}
        maxBounds={worldBounds}
        maxBoundsViscosity={1}
        className="h-full w-full"
        style={{ background: '#eef2ff' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap
        />
        {draft && <ClickToPlace onPick={draft.onPick} />}
        {draft?.pin && (
          <Marker position={[draft.pin.lat, draft.pin.lng]} icon={pinIcon('#111827', '📍')} />
        )}
        {pins.map(p => {
          const bg = backgroundInfo(p.background);
          return (
            <Marker key={p.id} position={[p.lat, p.lng]} icon={pinIcon(bg.color, bg.emoji)}>
              <Popup>
                <div style={{ fontFamily: 'inherit', minWidth: 160 }}>
                  <strong>{p.name}</strong> {moodInfo(p.mood).emoji}
                  <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>{p.placeLabel || 'Somewhere out there 🌍'}</div>
                  <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>{bg.emoji} {bg.label}</div>
                  {p.detail && <div style={{ marginTop: 4, fontSize: 13 }}>{p.detail}</div>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default function ClassMapIcebreaker() {
  const { pins, loading, unavailable } = useIcebreakerPins();
  const [submittedLocal, setSubmittedLocal] = useState(() => {
    try { return !!localStorage.getItem(STORAGE_KEY); } catch { return false; }
  });

  const [name, setName] = useState('');
  const [background, setBackground] = useState<BackgroundKey | null>(null);
  const [mood, setMood] = useState<MoodKey | null>(null);
  const [detail, setDetail] = useState('');
  const [placeLabel, setPlaceLabel] = useState('');
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const moodTally = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of pins) counts[p.mood] = (counts[p.mood] ?? 0) + 1;
    return MOOD_OPTIONS.map(m => ({ ...m, count: counts[m.key] ?? 0 }));
  }, [pins]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Tell us what to call you, first name's fine."); return; }
    if (!background) { setError('Pick the option closest to your background.'); return; }
    if (!mood) { setError('Pick a mood, there are no wrong answers here.'); return; }
    if (!pin) { setError('Click anywhere on the map to drop your pin.'); return; }

    setError('');
    setSaving(true);
    try {
      await submitIcebreakerPin({
        name: name.trim().slice(0, 40),
        background,
        detail: detail.trim().slice(0, 140),
        mood,
        lat: pin.lat,
        lng: pin.lng,
        placeLabel: placeLabel.trim().slice(0, 60),
      });
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
      setSubmittedLocal(true);
    } catch {
      setError("That didn't save. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  function resetLocal() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setSubmittedLocal(false);
    setName(''); setBackground(null); setMood(null); setDetail(''); setPlaceLabel(''); setPin(null);
  }

  return (
    <div className="border border-black/[0.08]">
      <div className="p-5 sm:p-7">
        {unavailable && (
          <div className="mb-5 px-4 py-3 text-sm border border-[#f0c675] bg-[#fef3c7]" style={{ color: '#92400e' }}>
            The live map could not connect just now. You can still read the rest of the page.
          </div>
        )}

        {!unavailable && (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,340px)_1fr] gap-5">
            {/* ── Form / confirmation ── */}
            <div>
              {submittedLocal ? (
                <div className="p-5 border" style={{ background: 'rgba(5,150,105,0.05)', borderColor: 'rgba(5,150,105,0.3)' }}>
                  <div className="flex items-center gap-2 font-semibold" style={{ color: '#065f46' }}>
                    <Check size={16} /> You're on the map!
                  </div>
                  <p className="mt-2 text-sm" style={{ color: '#065f46' }}>
                    Find your pin and say hi to whoever landed nearest you.
                  </p>
                  <button
                    onClick={resetLocal}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                    style={{ color: '#6b7280' }}
                  >
                    <RotateCcw size={12} /> Not you? Let someone else add a pin
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>What should we call you?</label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="First name or nickname"
                      maxLength={40}
                      className="mt-1.5 w-full px-3.5 py-2.5 text-sm outline-none border"
                      style={{ borderColor: 'rgba(0,0,0,0.15)' }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>Where are you right now?</label>
                    <input
                      value={placeLabel}
                      onChange={e => setPlaceLabel(e.target.value)}
                      placeholder="e.g. Auckland, NZ, or 'my kitchen table'"
                      maxLength={60}
                      className="mt-1.5 w-full px-3.5 py-2.5 text-sm outline-none border"
                      style={{ borderColor: 'rgba(0,0,0,0.15)' }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>Your background</label>
                    <div className="mt-1.5 grid grid-cols-2 gap-2">
                      {BACKGROUND_OPTIONS.map(b => (
                        <button
                          type="button"
                          key={b.key}
                          onClick={() => setBackground(b.key)}
                          className="text-left px-3 py-2 text-xs font-medium border transition-colors"
                          style={{
                            background: background === b.key ? b.color + '18' : '#fff',
                            borderColor: background === b.key ? b.color : 'rgba(0,0,0,0.15)',
                            color: background === b.key ? b.color : '#374151',
                          }}
                        >
                          {b.emoji} {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
                      One line about you <span className="normal-case font-normal">(optional, what you do or did)</span>
                    </label>
                    <input
                      value={detail}
                      onChange={e => setDetail(e.target.value)}
                      placeholder="e.g. Marketing analyst, three years in retail"
                      maxLength={140}
                      className="mt-1.5 w-full px-3.5 py-2.5 text-sm outline-none border"
                      style={{ borderColor: 'rgba(0,0,0,0.15)' }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>How are you feeling about databases today?</label>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {MOOD_OPTIONS.map(m => (
                        <button
                          type="button"
                          key={m.key}
                          onClick={() => setMood(m.key)}
                          className="px-3 py-1.5 text-xs font-medium border transition-colors"
                          style={{
                            background: mood === m.key ? '#111827' : '#fff',
                            borderColor: mood === m.key ? '#111827' : 'rgba(0,0,0,0.15)',
                            color: mood === m.key ? '#fff' : '#374151',
                          }}
                        >
                          {m.emoji} {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs" style={{ color: pin ? '#059669' : '#9ca3af' }}>
                    {pin ? 'Pin placed. Click the map again to move it.' : 'Click anywhere on the map to drop your pin.'}
                  </p>

                  {error && <p className="text-xs" style={{ color: '#dc2626' }}>{error}</p>}

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full px-5 py-3 text-sm font-semibold border border-transparent disabled:opacity-70"
                    style={{ background: '#111827', color: '#fff' }}
                  >
                    {saving ? 'Adding you to the map…' : "I'm in, add my pin"}
                  </button>
                </form>
              )}
            </div>

            {/* ── Map + tally ── */}
            <div>
              <LiveMap
                pins={pins}
                draft={submittedLocal ? undefined : {
                  pin,
                  onPick: (lat, lng) => { setPin({ lat, lng }); setError(''); },
                }}
              />
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs" style={{ color: '#6b7280' }}>
                <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: '#111827' }}>
                  <Users size={12} /> {loading ? 'Loading…' : `${pins.length} on the map`}
                </span>
                {moodTally.map(m => (
                  <span key={m.key}>{m.emoji} {m.count}</span>
                ))}
              </div>

              {pins.length > 0 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
                  {pins.map(p => {
                    const bg = backgroundInfo(p.background);
                    return (
                      <div
                        key={p.id}
                        className="flex-none px-3 py-2 text-xs border-l-2"
                        style={{ borderColor: bg.color, minWidth: 150, maxWidth: 190 }}
                      >
                        <div className="font-semibold flex items-center gap-1" style={{ color: '#111827' }}>
                          {p.name} <span>{moodInfo(p.mood).emoji}</span>
                        </div>
                        <div style={{ color: '#6b7280' }}>{p.placeLabel || 'Somewhere out there'}</div>
                        <div className="mt-0.5" style={{ color: bg.color }}>{bg.emoji} {bg.label}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
