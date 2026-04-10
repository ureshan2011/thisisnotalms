import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';
import BrandMark from '../../components/ui/BrandMark';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/ToastProvider';

export default function Login() {
  const { login, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nextPath = new URLSearchParams(location.search).get('next');

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      setTimeout(() => {
        if (nextPath) { navigate(nextPath); return; }
        const r = role;
        if (r === 'lecturer') navigate('/lecturer/dashboard');
        else navigate('/student/profile');
      }, 100);
    } catch (err: unknown) {
      showToast({ type: 'error', title: 'Sign-in failed', description: friendlyError(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f5f3ff 0%, #fdf4ff 40%, #f0f9ff 100%)',
      }}
    >
      {/* Decorative orbs */}
      <div className="auth-orb-1" />
      <div className="auth-orb-2" />
      <div className="auth-orb-3" />

      {/* Background pattern */}
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
            <div
              className="relative rounded-3xl p-4 shadow-xl"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)' }}
            >
              <BrandMark className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1e1b4b' }}>YooBees</h1>
          <p className="text-sm font-medium mt-0.5" style={{ color: '#a78bfa' }}>Attendance Management</p>
        </div>

        {/* Card */}
        <div
          className="w-full p-8 animate-scaleIn"
          style={{
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '28px',
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: '0 24px 64px rgba(124,106,247,0.14), 0 8px 24px rgba(0,0,0,0.06)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 mb-6">
            <div
              className="rounded-2xl p-2"
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
                <div
                  className="h-4 w-4 rounded-full animate-spin"
                  style={{ border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }}
                />
              ) : (
                <>
                  <LogIn size={16} />
                  Sign in
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider my-5" />

          <p className="text-center text-sm" style={{ color: '#9ca3af' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold transition-colors hover:underline"
              style={{ color: '#7c3aed' }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
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
