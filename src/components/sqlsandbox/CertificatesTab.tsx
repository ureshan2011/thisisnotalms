import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Check, Lock } from 'lucide-react';
import { CHALLENGES } from '../../lib/sqlSandbox/challenges';
import { LEVELS } from '../../lib/sqlSandbox/levels';
import { CERT_TITLES, sheetEnabled, type CertLevel } from '../../lib/sqlSandbox/progress';
import type { ProfileApi } from './useProfile';

// Where a student sees how close each certificate is, and claims it. The name
// is typed here, in full, because it is printed on the certificate and cannot
// be changed afterwards: that is what makes the certificate worth checking.

const hasTwoWords = (n: string) => n.trim().split(/\s+/).filter(Boolean).length >= 2;

export default function CertificatesTab({ api }: { api: ProfileApi }) {
  const profile = api.profile!;
  const nav = useNavigate();
  const levelsDone = LEVELS.filter(l => profile.levels[l.id]).length;
  const solved = CHALLENGES.filter(c => profile.challenges[c.id]?.solved).length;

  const cards: { kind: CertLevel; need: string; have: number; total: number; hint: string }[] = [
    { kind: 'basic', need: 'Finish all 8 levels', have: levelsDone, total: LEVELS.length, hint: 'The Learn tab' },
    { kind: 'advanced', need: 'Solve all 8 challenges', have: solved, total: CHALLENGES.length, hint: 'The Challenges tab' },
  ];

  return (
    <div className="sb-certs">
      <div className="sb-map__intro">
        <h2>
          Certificates<span className="bt-stop">.</span>
        </h2>
        <p>Finish the work, get a certificate you can put on LinkedIn. Anyone can check it is real.</p>
      </div>
      <div className="sb-certgrid">
        {cards.map(c => (
          <CertCard key={c.kind} {...c} api={api} defaultName={profile.name ?? ''} onOpen={id => nav(`/sql-certificate/${id}`)} />
        ))}
      </div>
    </div>
  );
}

function CertCard({
  kind, need, have, total, hint, api, defaultName, onOpen,
}: {
  kind: CertLevel;
  need: string;
  have: number;
  total: number;
  hint: string;
  api: ProfileApi;
  defaultName: string;
  onOpen: (id: string) => void;
}) {
  const issued = api.profile?.certs?.[kind];
  const ready = have >= total;
  const [name, setName] = useState(defaultName);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const claim = async () => {
    if (!hasTwoWords(name)) {
      setErr('Type your full name, first and last, as you want it printed.');
      return;
    }
    setBusy(true);
    setErr(null);
    const r = await api.claimCert(kind, name.trim());
    setBusy(false);
    if (r.ok) onOpen(r.cert.id);
    else setErr(r.error);
  };

  return (
    <div className={`sb-card sb-certcard ${issued ? 'is-done' : ready ? 'is-ready' : ''}`}>
      <div className="sb-certcard__icon" aria-hidden="true">
        {issued ? <Check size={22} strokeWidth={3} /> : ready ? <Award size={22} /> : <Lock size={20} />}
      </div>
      <div className="sb-certcard__body">
        <h3>{CERT_TITLES[kind]}</h3>
        <p className="sb-muted">
          {need} · {Math.min(have, total)} of {total} · {hint}
        </p>
        <div className="sb-meter" aria-hidden="true">
          <span style={{ width: `${Math.min(100, (have / total) * 100)}%` }} />
        </div>

        {issued && (
          <div className="sb-certcard__act">
            <p>
              Issued to <strong>{issued.name}</strong>
            </p>
            <button type="button" className="bt-btn bt-btn--md" onClick={() => onOpen(issued.id)}>
              View certificate
              <span className="bt-btn__badge" aria-hidden="true">→</span>
            </button>
          </div>
        )}

        {!issued && ready && !sheetEnabled() && <p className="sb-nudge">Certificates need the class sheet, which is not connected yet.</p>}

        {!issued && ready && sheetEnabled() && (
          <div className="sb-certcard__act">
            <label className="sb-certcard__label" htmlFor={`cn-${kind}`}>
              Your full name, as printed
            </label>
            <input
              id={`cn-${kind}`}
              className="sb-certcard__input"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
              placeholder="e.g. Ana Perera"
              maxLength={60}
            />
            <p className="sb-muted">Check the spelling. It can&apos;t be changed after you get the certificate.</p>
            <button type="button" className="bt-btn" onClick={() => void claim()} disabled={busy || !name.trim()}>
              {busy ? 'Issuing…' : 'Get my certificate'}
              <span className="bt-btn__badge" aria-hidden="true">→</span>
            </button>
            {err && <p className="sb-nudge">{err}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
