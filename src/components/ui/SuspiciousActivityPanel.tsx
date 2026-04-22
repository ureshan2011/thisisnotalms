import { useState } from 'react';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import type { SuspiciousFlag } from '../../lib/suspiciousActivity';

export default function SuspiciousActivityPanel({ flags }: { flags: SuspiciousFlag[] }) {
  const [open, setOpen] = useState(false);
  if (flags.length === 0) return null;

  const highCount = flags.filter(f => f.severity === 'high').length;
  const isRed = highCount > 0;
  const accent = isRed ? '#dc2626' : '#d97706';
  const accentBg = isRed ? 'rgba(239,68,68,0.10)' : 'rgba(245,158,11,0.10)';
  const border = isRed ? 'rgba(239,68,68,0.22)' : 'rgba(245,158,11,0.22)';

  return (
    <div
      className="rounded-3xl overflow-hidden mb-6 animate-fadeIn"
      style={{ border: `1px solid ${border}`, boxShadow: `0 2px 16px ${isRed ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.06)'}` }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        style={{
          background: isRed
            ? 'linear-gradient(135deg,rgba(239,68,68,0.06),rgba(249,115,22,0.04))'
            : 'linear-gradient(135deg,rgba(245,158,11,0.06),rgba(249,115,22,0.04))',
          borderBottom: open ? `1px solid ${border}` : 'none',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: accentBg }}>
            <AlertTriangle size={16} style={{ color: accent }} />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: '#1e1b4b' }}>Security — Suspicious Patterns Detected</p>
            <p className="text-xs font-medium" style={{ color: '#6b7280' }}>
              {highCount > 0 && `${highCount} high`}{highCount > 0 && flags.length - highCount > 0 && ', '}
              {flags.length - highCount > 0 && `${flags.length - highCount} medium`}
              {' '}pattern{flags.length !== 1 ? 's' : ''} · not visible to students
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: accent, color: 'white' }}>
            {flags.length}
          </span>
          <ChevronDown size={16} style={{ color: '#9ca3af', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
      </button>

      {open && (
        <div className="p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.97)' }}>
          {flags.map(flag => {
            const hi = flag.severity === 'high';
            return (
              <div
                key={flag.id}
                className="flex gap-3 p-4 rounded-2xl"
                style={{
                  background: hi ? 'rgba(239,68,68,0.05)' : 'rgba(245,158,11,0.05)',
                  border: `1px solid ${hi ? 'rgba(239,68,68,0.14)' : 'rgba(245,158,11,0.14)'}`,
                }}
              >
                <AlertTriangle size={15} style={{ color: hi ? '#dc2626' : '#d97706', flexShrink: 0, marginTop: 2 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: hi ? 'rgba(239,68,68,0.14)' : 'rgba(245,158,11,0.14)', color: hi ? '#dc2626' : '#d97706' }}>
                      {flag.severity.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed' }}>
                      {flag.type === 'shared_ip' ? 'Shared IP' : flag.type === 'location_outlier' ? 'Location Outlier' : 'Rapid Submission'}
                    </span>
                    {flag.checkpointLabel && (
                      <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>{flag.checkpointLabel}</span>
                    )}
                  </div>
                  <p className="text-xs font-medium leading-relaxed mb-2" style={{ color: '#374151' }}>{flag.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {flag.affectedStudents.map(s => (
                      <span key={s.uid} className="px-2.5 py-1 rounded-xl text-xs font-semibold"
                        style={{ background: 'rgba(0,0,0,0.04)', color: '#1e1b4b' }}>
                        {s.name} <code className="font-mono" style={{ color: '#8b7fa6' }}>{s.displayId}</code>
                      </span>
                    ))}
                  </div>
                  {flag.ipAddress && (
                    <p className="text-xs mt-1.5 font-mono" style={{ color: '#9ca3af' }}>IP: {flag.ipAddress}</p>
                  )}
                </div>
              </div>
            );
          })}
          <p className="text-xs pt-1" style={{ color: '#c4b5fd' }}>
            Shared IPs may reflect campus Wi-Fi — cross-reference with GPS data. Only lecturers and TAs see this.
          </p>
        </div>
      )}
    </div>
  );
}
