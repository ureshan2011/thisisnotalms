import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
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
    if (password.length < 6)  {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl">
              <BrandMark className="h-14 w-14" />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">YooBees</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
          <h2 className="text-white text-xl font-bold mb-1">Create account</h2>
          <p className="text-slate-300 text-sm mb-6">Join your class on YooBees</p>


          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role toggle */}
            <div className="flex rounded-xl overflow-hidden border border-white/20 bg-white/5">
              {(['student', 'lecturer'] as UserRole[]).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 text-sm font-medium transition-all ${
                    role === r
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder={role === 'student' ? 'you@yoobeestudent.ac.nz' : 'you@university.edu'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
              {role === 'student' && (
                <p className="mt-1 text-xs text-slate-300">Use your college email ending in @yoobeestudent.ac.nz.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="min. 6 characters"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1.5">Confirm password</label>
              <input
                type={showPw ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
            </div>

            {role === 'lecturer' && (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1.5">Lecturer registration code</label>
                <input
                  type="text"
                  value={lecturerCode}
                  onChange={e => setLecturerCode(e.target.value.toUpperCase())}
                  required
                  placeholder="Ask your administrator"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent font-mono tracking-widest"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all duration-150 text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={16} />
                  Create account
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-300 hover:text-white font-medium transition-colors">
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
