import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, GraduationCap, BookOpen } from 'lucide-react';
import BrandMark from '../../components/ui/BrandMark';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/ToastProvider';
import type { UserRole } from '../../lib/types';

const LECTURER_CODE = import.meta.env.VITE_LECTURER_CODE ?? 'PROF2024';

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [confirm,      setConfirm]      = useState('');
  const [role,         setRole]         = useState<UserRole>('student');
  const [lecturerCode, setLecturerCode] = useState('');
  const [showPw,       setShowPw]       = useState(false);
  const [loading,      setLoading]      = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      showToast({ type: 'error', title: 'Validation error', description: 'Passwords do not match.' });
      return;
    }
    if (password.length < 6) {
      showToast({ type: 'error', title: 'Validation error', description: 'Password must be at least 6 characters.' });
      return;
    }
    if (role === 'student' && !email.trim().toLowerCase().endsWith('@yoobeestudent.ac.nz')) {
      showToast({ type: 'error', title: 'Validation error', description: 'Student email must end with @yoobeestudent.ac.nz.' });
      return;
    }
    if (role === 'lecturer' && lecturerCode !== LECTURER_CODE) {
      showToast({ type: 'error', title: 'Validation error', description: 'Invalid lecturer registration code.' });
      return;
    }
    setLoading(true);
    try {
      await register(email, password, role);
      navigate(role === 'lecturer' ? '/lecturer/dashboard' : '/student/profile');
    } catch (err: unknown) {
      showToast({ type: 'error', title: 'Registration failed', description: friendlyError(err) });
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
          <div className="mt-0.5 flex items-center gap-2">
            <p className="text-sm font-medium" style={{ color: '#a78bfa' }}>Student Support System</p>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider"
              style={{ background: 'rgba(124,58,237,0.12)', color: '#6d28d9', border: '1px solid rgba(124,58,237,0.18)' }}
            >
              BETA
            </span>
          </div>
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
          <div className="mb-6">
            <h2 className="text-lg font-bold tracking-tight" style={{ color: '#1e1b4b' }}>Create account</h2>
            <p className="text-xs font-medium mt-0.5" style={{ color: '#9ca3af' }}>Join your class on YooBees</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role toggle */}
            <div>
              <label className="label">I am a</label>
              <div
                className="flex rounded-2xl p-1 gap-1"
                style={{
                  background: 'rgba(139,92,246,0.06)',
                  border: '1px solid rgba(139,92,246,0.12)',
                }}
              >
                {([
                  { r: 'student', icon: <BookOpen size={14} />, label: 'Student' },
                  { r: 'lecturer', icon: <GraduationCap size={14} />, label: 'Lecturer' },
                ] as { r: UserRole; icon: React.ReactNode; label: string }[]).map(({ r, icon, label }) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200"
                    style={role === r ? {
                      background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                    } : {
                      color: '#9ca3af',
                    }}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder={role === 'student' ? 'you@yoobeestudent.ac.nz' : 'you@university.edu'}
                className="input-field"
              />
              {role === 'student' && (
                <p className="mt-1.5 text-xs font-medium" style={{ color: '#a78bfa' }}>
                  Use your college email ending @yoobeestudent.ac.nz
                </p>
              )}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Min. 6 characters"
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

            <div>
              <label className="label">Confirm password</label>
              <input
                type={showPw ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                placeholder="Repeat your password"
                className="input-field"
              />
            </div>

            {role === 'lecturer' && (
              <div>
                <label className="label">Lecturer code</label>
                <input
                  type="text"
                  value={lecturerCode}
                  onChange={e => setLecturerCode(e.target.value.toUpperCase())}
                  required
                  placeholder="Ask your administrator"
                  className="input-field code-display tracking-widest"
                />
              </div>
            )}

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
                  <UserPlus size={16} />
                  Create account
                </>
              )}
            </button>
          </form>

          <div className="divider my-5" />

          <p className="text-center text-sm" style={{ color: '#9ca3af' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold transition-colors hover:underline"
              style={{ color: '#7c3aed' }}
            >
              Sign in
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
    if (code === 'auth/email-already-in-use') return 'That email is already registered.';
    if (code === 'auth/invalid-email')        return 'Please enter a valid email address.';
    if (code === 'auth/weak-password')        return 'Password is too weak. Use at least 6 characters.';
  }
  return 'Registration failed. Please try again.';
}
