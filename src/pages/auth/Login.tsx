import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Sparkles, Mail, KeyRound, ChevronDown } from 'lucide-react';
import BrandMark from '../../components/ui/BrandMark';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/ToastProvider';
import { QUOTE_ITEMS, FADE_MS, HOLD_MS } from '../../lib/quotes';

const SIGNIN_EMAIL_KEY = 'yoobees_signin_email';

// ─── Shared quote cycling hook ───────────────────────────────────────────────
function useQuoteCycle() {
  const [index,   setIndex]   = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % QUOTE_ITEMS.length);
        setVisible(true);
      }, FADE_MS);
    }, HOLD_MS);
    return () => clearInterval(timer);
  }, []);

  return { item: QUOTE_ITEMS[index], index, visible };
}

// ─── Progress dots ───────────────────────────────────────────────────────────
function ProgressDots({ index, light = false }: { index: number; light?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
      {QUOTE_ITEMS.map((_, i) => (
        <div key={i} style={{
          width: i === index ? 18 : 5, height: 5, borderRadius: 3,
          background: i === index
            ? (light ? 'rgba(255,255,255,0.95)' : '#7c3aed')
            : (light ? 'rgba(255,255,255,0.3)' : 'rgba(139,92,246,0.22)'),
          transition: 'width 0.3s ease, background 0.3s ease',
        }} />
      ))}
    </div>
  );
}

// ─── Desktop: full-height left quote panel ───────────────────────────────────
function DesktopQuotePanel({ item, visible, index }: {
  item: typeof QUOTE_ITEMS[0];
  visible: boolean;
  index: number;
}) {
  return (
    <aside style={{
      display: 'none',
      background: 'linear-gradient(145deg, #1e1b4b 0%, #3730a3 40%, #5b21b6 75%, #7c3aed 100%)',
      position: 'relative',
      overflow: 'hidden',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '3rem',
    }}
    // Tailwind can't be used for `display` on the server, so we override via className
    className="hidden lg:flex lg:w-[46%] xl:w-5/12"
    >
      {/* Background decorative circles */}
      <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-8%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '42%', left: '60%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,181,253,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Top: Brand */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <BrandMark className="h-5 w-5 text-white" />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', letterSpacing: '-0.01em' }}>YooBees</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Student Platform</div>
          </div>
        </div>
      </div>

      {/* Middle: Quote */}
      <div style={{
        position: 'relative', zIndex: 1,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
        flex: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        paddingBlock: '3rem',
      }}>
        {item.type === 'quote' ? (
          <div style={{
            fontSize: '5.5rem', lineHeight: 1,
            color: 'rgba(255,255,255,0.15)',
            fontFamily: 'Georgia, serif',
            marginBottom: '-1rem',
            userSelect: 'none',
          }}>&ldquo;</div>
        ) : (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.22)',
            borderRadius: 100, padding: '0.35rem 0.9rem',
            marginBottom: '1.25rem', width: 'fit-content',
            fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)',
            letterSpacing: '0.07em', textTransform: 'uppercase',
          }}>
            ★&nbsp; Important Reminder
          </div>
        )}

        <p style={{
          fontSize: item.text.length > 120 ? '1.15rem' : '1.4rem',
          fontWeight: item.type === 'reminder' ? 600 : 400,
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.93)',
          marginBottom: '1.75rem',
          fontStyle: item.type === 'quote' ? 'italic' : 'normal',
        }}>
          {item.text}
        </p>

        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
            — {item.author}
          </div>
          {item.label && (
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginTop: '0.2rem' }}>
              {item.label}
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Progress dots */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <ProgressDots index={index} light />
      </div>
    </aside>
  );
}

// ─── Mobile: compact quote card (shown below the login form) ─────────────────
function MobileQuoteCard({ item, visible, index }: {
  item: typeof QUOTE_ITEMS[0];
  visible: boolean;
  index: number;
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.82)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(139,92,246,0.14)',
      borderRadius: 20,
      padding: '1.25rem 1.5rem',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(8px)',
      transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
      minHeight: 120,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        {item.type === 'reminder' ? (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: 100, padding: '0.2rem 0.65rem',
            fontSize: '0.65rem', fontWeight: 700, color: '#7c3aed',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            ★ Reminder
          </span>
        ) : (
          <span style={{
            fontSize: '2.5rem', lineHeight: 1,
            color: 'rgba(139,92,246,0.2)',
            fontFamily: 'Georgia, serif',
            userSelect: 'none',
          }}>&ldquo;</span>
        )}
        <ProgressDots index={index} />
      </div>

      <p style={{
        fontSize: '0.875rem',
        fontWeight: item.type === 'reminder' ? 600 : 500,
        lineHeight: 1.6,
        color: '#1e1b4b',
        fontStyle: item.type === 'quote' ? 'italic' : 'normal',
        marginBottom: '0.75rem',
      }}>
        {item.text}
      </p>

      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7c3aed' }}>
        — {item.author}
        {item.label && (
          <span style={{ fontWeight: 400, color: '#a78bfa', marginLeft: '0.3rem' }}>
            · {item.label}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main Login component ─────────────────────────────────────────────────────
export default function Login() {
  const { login, role, resetPassword, sendLoginLink, isSignInLink, completeSignInWithLink } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const nextPath  = new URLSearchParams(location.search).get('next');

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [sending,  setSending]  = useState<'reset' | 'link' | null>(null);
  const [sent,     setSent]     = useState<'reset' | 'link' | null>(null);
  const { showToast } = useToast();

  const { item, index, visible } = useQuoteCycle();

  // Handle sign-in link callback (when user clicks the email link)
  useEffect(() => {
    if (!isSignInLink(window.location.href)) return;
    const savedEmail  = localStorage.getItem(SIGNIN_EMAIL_KEY) || '';
    const emailToUse  = savedEmail || window.prompt(
      'Please enter your email address to complete sign-in:'
    );
    if (!emailToUse) return;
    completeSignInWithLink(emailToUse, window.location.href)
      .then(() => {
        window.history.replaceState(null, '', window.location.pathname);
        showToast({ type: 'success', title: 'Signed in!', description: 'Welcome back.' });
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
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Desktop: left quote panel ─────────────────────────────── */}
      <DesktopQuotePanel item={item} visible={visible} index={index} />

      {/* ── Form panel (right on desktop, full width on mobile) ──── */}
      <main
        className="flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #fdf4ff 40%, #f0f9ff 100%)' }}
      >
        {/* Animated background orbs */}
        <div className="auth-orb-1" />
        <div className="auth-orb-2" />
        <div className="auth-orb-3" />

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(139,92,246,0.15) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="w-full max-w-sm relative z-10">

          {/* Logo: visible on mobile only — desktop has it in the left panel */}
          <div className="flex flex-col items-center mb-8 lg:hidden animate-slideUp">
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

          {/* Desktop: subtle welcome heading above the card */}
          <div className="hidden lg:block mb-5 text-center animate-fadeIn">
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#a78bfa' }}>
              Welcome back
            </p>
          </div>

          {/* ── Login card ──────────────────────────────────────────── */}
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
                <h2 className="text-lg font-bold tracking-tight" style={{ color: '#1e1b4b' }}>Sign in</h2>
                <p className="text-xs font-medium" style={{ color: '#9ca3af' }}>Enter your credentials below</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#c4b5fd' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@university.edu"
                    className="input-field pl-9"
                  />
                </div>
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

            {/* ── "Can't sign in?" section ─────────────────────────── */}
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
                  {/* Option 1 – sign-in link */}
                  <div className="rounded-2xl p-4"
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
                            We sent a one-click sign-in link to <strong>{email}</strong>. Click it and you'll be signed in instantly — no password needed.
                          </p>
                          <p className="text-[11px] text-emerald-500 mt-1.5 font-medium">📁 Not in inbox? Check your <strong>spam / junk</strong> folder.</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg,#7c3aed,#a78bfa)' }}>
                            <Mail size={11} color="white" />
                          </div>
                          <p className="text-sm font-bold" style={{ color: '#1e1b4b' }}>
                            Email me a sign-in link
                            <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ background: 'rgba(124,58,237,0.10)', color: '#7c3aed' }}>RECOMMENDED</span>
                          </p>
                        </div>
                        <p className="text-xs mb-2.5" style={{ color: '#6b7280' }}>
                          No password needed. Enter your email above, click below and we'll email you a one-click link to get straight in.
                        </p>
                        <button type="button" onClick={handleSignInLink} disabled={sending !== null}
                          className="btn-primary !px-4 !py-2 !text-xs w-full justify-center">
                          {sending === 'link' ? 'Sending…' : 'Send me a sign-in link'}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Option 2 – password reset */}
                  <div className="rounded-2xl p-4"
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
                          <p className="text-[11px] text-amber-500 mt-1.5 font-medium">📁 Not there? Check <strong>spam / junk</strong>. It can take a minute or two.</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)' }}>
                            <KeyRound size={11} color="white" />
                          </div>
                          <p className="text-sm font-bold" style={{ color: '#1e1b4b' }}>Reset my password</p>
                        </div>
                        <p className="text-xs mb-2.5" style={{ color: '#6b7280' }}>
                          Enter your email above and we'll send a link to create a new password.
                        </p>
                        <button type="button" onClick={handleResetEmail} disabled={sending !== null}
                          className="btn-secondary !px-4 !py-2 !text-xs w-full justify-center">
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
          {/* ── end login card ── */}

          {/* Mobile: compact rotating quote shown below the card */}
          <div className="lg:hidden mt-5 animate-fadeIn">
            <MobileQuoteCard item={item} visible={visible} index={index} />
          </div>

        </div>
      </main>
    </div>
  );
}

// ─── Error helpers (unchanged) ────────────────────────────────────────────────
function friendlyResetError(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: string }).code;
    if (code === 'auth/invalid-email')    return 'Please enter a valid email address.';
    if (code === 'auth/user-not-found')   return 'No account was found for that email.';
    if (code === 'auth/too-many-requests') return 'Too many attempts. Please wait and try again.';
  }
  return 'Unable to send email right now. Please try again.';
}

function friendlyLinkError(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: string }).code;
    if (code === 'auth/invalid-action-code') return 'This sign-in link has expired or already been used.';
    if (code === 'auth/invalid-email')        return 'Email mismatch. Please enter the same email you used to request the link.';
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
