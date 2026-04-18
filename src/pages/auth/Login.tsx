import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Sparkles, Mail, KeyRound, ChevronDown } from 'lucide-react';
import BrandMark from '../../components/ui/BrandMark';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/ToastProvider';

const SIGNIN_EMAIL_KEY = 'yoobees_signin_email';

export default function Login() {
  const { login, role, resetPassword, sendLoginLink, isSignInLink, completeSignInWithLink } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nextPath = new URLSearchParams(location.search).get('next');

  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [helpOpen,  setHelpOpen]  = useState(false);
  const [sending,   setSending]   = useState<'reset' | 'link' | null>(null);
  const [sent,      setSent]      = useState<'reset' | 'link' | null>(null);
  const { showToast } = useToast();

  // Handle sign-in link callback (when user clicks the email link)
  useEffect(() => {
    if (!isSignInLink(window.location.href)) return;
    const savedEmail = localStorage.getItem(SIGNIN_EMAIL_KEY) || '';
    const emailToUse = savedEmail || window.prompt(
      'Please enter your email address to complete sign-in:'
    );
    if (!emailToUse) return;
    completeSignInWithLink(emailToUse, window.location.href)
      .then(() => {
        window.history.replaceState(null, '', window.location.pathname);
        showToast({ type: 'success', title: 'Signed in!', description: 'Welcome back.' });
        // navigation handled by onAuthStateChanged + useEffect below
      })
      .catch((err: unknown) => {
        showToast({ type: 'error', title: 'Sign-in link failed', description: friendlyLinkError(err) });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      setTimeout(() => {
        if (nextPath) { navigate(nextPath); return; }
        const r = role;
        if (r === 'lecturer' || r === 'teachingAssistant') navigate('/lecturer/dashboard');
        else navigate('/student/profile');
      }, 100);
    } catch (err: unknown) {
      showToast({ type: 'error', title: 'Sign-in failed', description: friendlyError(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleResetEmail = async () => {
    if (!email.trim()) {
      showToast({ type: 'info', title: 'Enter your email first', description: 'Type your account email above, then try again.' });
      return;
    }
    setSending('reset');
    try {
      await resetPassword(email.trim());
      setSent('reset');
    } catch (err: unknown) {
      showToast({ type: 'error', title: 'Could not send reset email', description: friendlyResetError(err) });
    } finally {
      setSending(null);
    }
  };

  const handleSignInLink = async () => {
    if (!email.trim()) {
      showToast({ type: 'info', title: 'Enter your email first', description: 'Type your account email above, then try again.' });
      return;
    }
    setSending('link');
    try {
      await sendLoginLink(email.trim());
      setSent('link');
    } catch (err: unknown) {
      showToast({ type: 'error', title: 'Could not send sign-in link', description: friendlyResetError(err) });
    } finally {
      setSending(null);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #fdf4ff 40%, #f0f9ff 100%)' }}
    >
      <div className="auth-orb-1" />
      <div className="auth-orb-2" />
      <div className="auth-orb-3" />

      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139,92,246,0.15) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="w-full max-w-sm relative z-10 animate-slideUp">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-brand-400/25 rounded-3xl blur-xl animate-pulse" />
            <div className="relative rounded-3xl p-4 shadow-xl"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)' }}
            >
              <BrandMark className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1e1b4b' }}>YooBees</h1>
          <div className="mt-0.5 flex items-center gap-2">
            <p className="text-sm font-medium" style={{ color: '#a78bfa' }}>Student Support System</p>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider"
              style={{ background: 'rgba(124,58,237,0.12)', color: '#6d28d9', border: '1px solid rgba(124,58,237,0.18)' }}
            >BETA</span>
          </div>
        </div>

        {/* Card */}
        <div className="w-full p-8 animate-scaleIn"
          style={{
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '28px',
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: '0 24px 64px rgba(124,106,247,0.14), 0 8px 24px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex items-center gap-2.5 mb-6">
            <div className="rounded-2xl p-2"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.10) 0%, rgba(167,139,250,0.08) 100%)' }}
            >
              <Sparkles size={16} style={{ color: '#7c3aed' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight" style={{ color: '#1e1b4b' }}>Welcome back</h2>
              <p className="text-xs font-medium" style={{ color: '#9ca3af' }}>Sign in to continue</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@university.edu"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2 py-3"
            >
              {loading ? (
                <div className="h-4 w-4 rounded-full animate-spin"
                  style={{ border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }}
                />
              ) : (
                <><LogIn size={16} />Sign in</>
              )}
            </button>
          </form>

          {/* ── "Need help?" section ── */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => { setHelpOpen(v => !v); setSent(null); }}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-sm font-semibold transition-colors"
              style={{ color: helpOpen ? '#7c3aed' : '#9ca3af' }}
            >
              Can't sign in?
              <ChevronDown size={14} style={{ transform: helpOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {helpOpen && (
              <div className="mt-2 space-y-2 animate-fadeIn">
                {/* Option 1 – sign-in link (recommended) */}
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: sent === 'link' ? 'rgba(52,211,153,0.06)' : 'rgba(124,58,237,0.04)',
                    border: `1px solid ${sent === 'link' ? 'rgba(52,211,153,0.25)' : 'rgba(124,58,237,0.12)'}`,
                  }}
                >
                  {sent === 'link' ? (
                    <div className="flex items-start gap-2">
                      <span className="text-lg flex-shrink-0">✅</span>
                      <div>
                        <p className="text-sm font-bold text-emerald-700">Check your inbox!</p>
                        <p className="text-xs text-emerald-600 mt-0.5">
                          We sent a one-click sign-in link to <strong>{email}</strong>.
                          Click it and you'll be signed in instantly — no password needed.
                        </p>
                        <p className="text-[11px] text-emerald-500 mt-1.5 font-medium">
                          📁 Not in inbox? Check your <strong>spam / junk</strong> folder.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,#7c3aed,#a78bfa)' }}
                        >
                          <Mail size={11} color="white" />
                        </div>
                        <p className="text-sm font-bold" style={{ color: '#1e1b4b' }}>
                          Email me a sign-in link
                          <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: 'rgba(124,58,237,0.10)', color: '#7c3aed' }}
                          >RECOMMENDED</span>
                        </p>
                      </div>
                      <p className="text-xs mb-2.5" style={{ color: '#6b7280' }}>
                        No password needed. Enter your email above, click below and we'll email you a one-click link to get straight in.
                      </p>
                      <button
                        type="button"
                        onClick={handleSignInLink}
                        disabled={sending !== null}
                        className="btn-primary !px-4 !py-2 !text-xs w-full justify-center"
                      >
                        {sending === 'link' ? 'Sending…' : 'Send me a sign-in link'}
                      </button>
                    </>
                  )}
                </div>

                {/* Option 2 – password reset */}
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: sent === 'reset' ? 'rgba(245,158,11,0.05)' : 'rgba(124,58,237,0.03)',
                    border: `1px solid ${sent === 'reset' ? 'rgba(245,158,11,0.20)' : 'rgba(124,58,237,0.08)'}`,
                  }}
                >
                  {sent === 'reset' ? (
                    <div className="flex items-start gap-2">
                      <span className="text-lg flex-shrink-0">📧</span>
                      <div>
                        <p className="text-sm font-bold text-amber-700">Reset link sent!</p>
                        <p className="text-xs text-amber-600 mt-0.5">
                          Check your inbox at <strong>{email}</strong> for a password reset link.
                        </p>
                        <p className="text-[11px] text-amber-500 mt-1.5 font-medium">
                          📁 Not there? Check <strong>spam / junk</strong>. It can take a minute or two.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)' }}
                        >
                          <KeyRound size={11} color="white" />
                        </div>
                        <p className="text-sm font-bold" style={{ color: '#1e1b4b' }}>
                          Reset my password
                        </p>
                      </div>
                      <p className="text-xs mb-2.5" style={{ color: '#6b7280' }}>
                        Enter your email above and we'll send a link to create a new password.
                      </p>
                      <button
                        type="button"
                        onClick={handleResetEmail}
                        disabled={sending !== null}
                        className="btn-secondary !px-4 !py-2 !text-xs w-full justify-center"
                      >
                        {sending === 'reset' ? 'Sending…' : 'Send password reset link'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="divider my-5" />

          <p className="text-center text-sm" style={{ color: '#9ca3af' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold transition-colors hover:underline" style={{ color: '#7c3aed' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function friendlyResetError(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: string }).code;
    if (code === 'auth/invalid-email') return 'Please enter a valid email address.';
    if (code === 'auth/user-not-found') return 'No account was found for that email.';
    if (code === 'auth/too-many-requests') return 'Too many attempts. Please wait and try again.';
  }
  return 'Unable to send email right now. Please try again.';
}

function friendlyLinkError(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: string }).code;
    if (code === 'auth/invalid-action-code') return 'This sign-in link has expired or already been used.';
    if (code === 'auth/invalid-email') return 'Email mismatch. Please enter the same email you used to request the link.';
  }
  return 'Sign-in link failed. Please request a new one.';
}

function friendlyError(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: string }).code;
    if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential')
      return 'Invalid email or password.';
    if (code === 'auth/too-many-requests')
      return 'Too many attempts. Please wait a moment.';
  }
  return 'Sign-in failed. Please try again.';
}
