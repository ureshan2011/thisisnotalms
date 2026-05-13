import { useState } from 'react';
import { X, Clock, Zap } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { SqlRaceChallenge } from '../../lib/sqlRaceTypes';

interface Props {
  challenge: SqlRaceChallenge;
  onClose: () => void;
}

const TIME_OPTIONS: { label: string; value: number | null }[] = [
  { label: 'No limit', value: null },
  { label: '2 min', value: 2 },
  { label: '3 min', value: 3 },
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
];

export default function ActivateChallengeModal({ challenge, onClose }: Props) {
  const [selectedTime, setSelectedTime] = useState<number | null>(5);
  const [saving, setSaving] = useState(false);

  const handleActivate = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'sqlRaceChallenges', challenge.id), {
        status: 'active',
        closedAt: null,
        activatedAt: serverTimestamp(),
        timeLimit: selectedTime ?? null,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="card w-full max-w-sm p-0 overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ background: 'linear-gradient(135deg, #0f0a1e 0%, #1e1b4b 100%)' }}
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ background: 'rgba(251,191,36,0.15)' }}>
              <Zap size={15} className="text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">Activate Challenge</p>
              <p className="text-white font-semibold text-sm truncate max-w-[200px]">{challenge.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* Time limit picker */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <Clock size={13} className="text-brand-500" />
              <label className="section-label">Set a time limit for students</label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TIME_OPTIONS.map(opt => (
                <button
                  key={String(opt.value)}
                  onClick={() => setSelectedTime(opt.value)}
                  className="py-2.5 text-sm font-semibold rounded-xl transition-all"
                  style={
                    selectedTime === opt.value
                      ? { background: '#7c3aed', color: 'white', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }
                      : { background: 'rgba(124,58,237,0.06)', color: '#6b7280', border: '1px solid rgba(124,58,237,0.12)' }
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {selectedTime !== null && (
              <p className="text-xs text-gray-400 mt-2">
                Students will have <span className="font-semibold text-brand-600">{selectedTime} minute{selectedTime !== 1 ? 's' : ''}</span> to submit their answer once this challenge goes live. The editor locks when time runs out.
              </p>
            )}
            {selectedTime === null && (
              <p className="text-xs text-gray-400 mt-2">
                Students can submit at any time until you manually close this challenge.
              </p>
            )}
          </div>

          {/* Confirm */}
          <button
            onClick={handleActivate}
            disabled={saving}
            className="btn-primary w-full justify-center py-2.5 text-sm disabled:opacity-50"
          >
            {saving ? 'Activating…' : '🚦 Go! Activate Challenge'}
          </button>
        </div>
      </div>
    </div>
  );
}
