import { useState, type FormEvent } from 'react';
import {
  askToPersist, merge, newProfile, normaliseId, normaliseName, pullProfile, sheetEnabled, validId, validName, type Profile,
} from '../../lib/sqlSandbox/progress';

// Asked once per device. After that the browser remembers.

export default function IdGate({ onReady }: { onReady: (p: Profile) => void }) {
  const [rawName, setRawName] = useState('');
  const [raw, setRaw] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const id = normaliseId(raw);
  const name = normaliseName(rawName);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validName(name)) {
      setMsg('Type your first name, so your TA knows who you are.');
      return;
    }
    if (!validId(id)) {
      setMsg("That doesn't look like a student ID. Letters and numbers only, at least 3.");
      return;
    }
    setBusy(true);
    setMsg(null);
    askToPersist();
    let p = newProfile(id, name);
    if (sheetEnabled()) {
      try {
        const remote = await pullProfile(id);
        if (remote) p = { ...merge(remote, p), name };
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
        <label htmlFor="sname" className="sb-gate__label">
          Your first name
        </label>
        <input
          id="sname"
          className="sb-gate__input sb-gate__input--name"
          value={rawName}
          onChange={e => setRawName(e.target.value)}
          autoComplete="given-name"
          autoCapitalize="words"
          spellCheck={false}
          placeholder="e.g. Ana"
          maxLength={30}
          autoFocus
        />
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
        />
        <button type="submit" className="bt-btn" disabled={busy || id.length < 3 || !name}>
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

/** For students who signed in before names were asked for. Shown once. */
export function NameGate({ id, onName }: { id: string; onName: (name: string) => void }) {
  const [raw, setRaw] = useState('');
  const name = normaliseName(raw);
  return (
    <div className="sb-gate">
      <form
        className="sb-gate__card"
        onSubmit={e => {
          e.preventDefault();
          if (validName(name)) onName(name);
        }}
      >
        <p className="bt-eyebrow">One quick thing</p>
        <h1>
          What&apos;s your first name<span className="bt-stop">?</span>
        </h1>
        <p className="sb-gate__lede">So your TA can find you in class. Your progress for {id} is safe.</p>
        <input
          className="sb-gate__input sb-gate__input--name"
          value={raw}
          onChange={e => setRaw(e.target.value)}
          autoComplete="given-name"
          autoCapitalize="words"
          placeholder="e.g. Ana"
          maxLength={30}
          aria-label="Your first name"
          autoFocus
        />
        <button type="submit" className="bt-btn" disabled={!validName(name)}>
          Carry on
          <span className="bt-btn__badge" aria-hidden="true">→</span>
        </button>
      </form>
    </div>
  );
}
