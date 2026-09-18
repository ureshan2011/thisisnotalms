import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { LESSON_ACCESS_PASSWORD, LESSON_ACCESS_STORAGE_KEY } from '../../config/lessonAccess';

// Route prefixes that are already behind Firebase auth (or are functional
// utility links like QR attendance / certificate verification) — the lesson
// password popup does not apply to these.
//
// The four course home pages (/mbi800, /mbi802, /mbi804, /mbi806b) are here
// for the same reason as the public lesson pages they index: they are the
// link handed to somebody deciding whether to take the course, so a password
// box is the wrong first thing to meet. They list every lesson either way and
// mark which ones need the code, so nothing gated is reachable through them.
const EXCLUDED_PREFIXES = [
  '/login',
  '/register',
  '/student',
  '/lecturer',
  '/attend',
  '/certificate',
  '/intro-to-dbms',
  '/intro-to-business-analytics',
  '/intro-to-sisp',
  '/intro-to-project-management',
  '/power-bi-setup',
  '/predicting-with-data',
  '/mbi800',
  '/mbi802',
  '/mbi804',
  '/mbi806b',
];

function requiresGate(pathname: string): boolean {
  return !EXCLUDED_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isUnlocked(): boolean {
  try {
    return sessionStorage.getItem(LESSON_ACCESS_STORAGE_KEY) === LESSON_ACCESS_PASSWORD;
  } catch {
    return false;
  }
}

interface LessonPasswordGateProps {
  children: ReactNode;
}

export default function LessonPasswordGate({ children }: LessonPasswordGateProps) {
  const location = useLocation();
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const gated = requiresGate(location.pathname) && !unlocked;

  useEffect(() => {
    if (gated) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [gated]);

  if (!gated) return <>{children}</>;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (input === LESSON_ACCESS_PASSWORD) {
      try { sessionStorage.setItem(LESSON_ACCESS_STORAGE_KEY, input); } catch { /* ignore */ }
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1526 40%, #0a0e1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          position: 'relative',
          maxWidth: '420px',
          width: '100%',
          background: 'rgba(15, 20, 40, 0.85)',
          border: '1px solid rgba(99,102,241,0.18)',
          borderRadius: '20px',
          padding: '44px 36px',
          textAlign: 'center',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 0 0 1px rgba(99,102,241,0.08), 0 32px 64px rgba(0,0,0,0.6)',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            margin: '0 auto 20px',
            borderRadius: '16px',
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Lock size={24} color="#a5b4fc" />
        </div>

        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          This lesson is locked
        </h1>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: '#94a3b8', marginBottom: '24px' }}>
          Enter the access code shared by your lecturer to continue.
        </p>

        <input
          type="password"
          autoFocus
          value={input}
          onChange={e => { setInput(e.target.value); setError(false); }}
          placeholder="Access code"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px 14px',
            borderRadius: '12px',
            border: `1px solid ${error ? 'rgba(248,113,113,0.6)' : 'rgba(99,102,241,0.25)'}`,
            background: 'rgba(255,255,255,0.04)',
            color: '#e2e8f0',
            fontSize: '0.95rem',
            outline: 'none',
            marginBottom: error ? '10px' : '18px',
          }}
        />

        {error && (
          <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '18px', marginTop: 0 }}>
            That code isn't right — please try again.
          </p>
        )}

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(90deg, #7c3aed, #6366f1)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          Unlock
        </button>
      </form>
    </div>
  );
}
