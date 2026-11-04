import { useState, type FormEvent } from 'react';
import { askToPersist, merge, newProfile, normaliseId, pullProfile, sheetEnabled, validId, type Profile } from '../../lib/sqlSandbox/progress';

// Asked once per device. After that the browser remembers.

export default function IdGate({ onReady }: { onReady: (p: Profile) => void }) {
  const [raw, setRaw] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const id = normaliseId(raw);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validId(id)) {
      setMsg('That doesn\'t look like a student ID. Letters and numbers only, at least 3.');
      return;
    }
    setBusy(true);
    setMsg(null);
    askToPersist();
    let p = newProfile(id);
    if (sheetEnabled()) {
      try {
        const remote = await pullProfile(id);
        if (remote) p = merge(remote, p);
      } catch {
        setMsg('Could not reach the class sheet. Starting here; it will catch up when you are back online.');
      }
    }
    setBusy(false);
    onReady(p);
  };

  return (
    <div className="sb-gate">
      <form className="sb-gate__card" onSubmit={submit}>
        <p className="bt-eyebrow">MBI802 · SQL Sandbox</p>
        <h1>
          Learn SQL by doing it<span className="bt-stop">.</span>
        </h1>
        <p className="sb-gate__lede">Real SQL, right here in your browser. Nothing to install, works on your phone.</p>
        <label htmlFor="sid" className="sb-gate__label">
          Your student ID
        </label>
        <input
          id="sid"
          className="sb-gate__input"
          value={raw}
          onChange={e => setRaw(e.target.value)}
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="e.g. 2025123"
          autoFocus
        />
        <button type="submit" className="bt-btn" disabled={busy || id.length < 3}>
          {busy ? 'Checking…' : 'Start'}
          <span className="bt-btn__badge" aria-hidden="true">→</span>
        </button>
        {msg && <p className="sb-gate__msg">{msg}</p>}
        <p className="sb-gate__small">
          You only type this once on each device.
          {sheetEnabled() ? ' New phone or laptop? Type the same ID and your progress comes back.' : ''}
        </p>
      </form>
    </div>
  );
}
