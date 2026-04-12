import { useEffect, useState } from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import {
  LayoutDashboard, Users, CalendarCheck, LogOut,
  User, History, Menu, X, ChevronRight, BookOpen,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import BrandMark from '../ui/BrandMark';
import PhotoUploadModal, { avatarGradient } from '../ui/PhotoUploadModal';
import { db } from '../../lib/firebase';

interface NavItem {
  to:    string;
  icon:  React.ReactNode;
  label: string;
  isNew?: boolean;
}

function SidebarContent({
  onClose,
  photoURL,
  onOpenPhotoModal,
  canViewMBI802Resources,
  showNewBadge,
}: {
  onClose?: () => void;
  photoURL?: string | null;
  onOpenPhotoModal?: () => void;
  canViewMBI802Resources: boolean;
  showNewBadge: boolean;
}) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const studentLinks: NavItem[] = [
    { to: '/student/dashboard',  icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/student/profile',    icon: <User size={18} />,            label: 'My Profile' },
    { to: '/student/attendance', icon: <CalendarCheck size={18} />,   label: 'Attendance' },
    { to: '/student/history',    icon: <History size={18} />,         label: 'My History' },
    ...(canViewMBI802Resources
      ? [{ to: '/student/mbi802-resources', icon: <BookOpen size={18} />, label: 'MBI802 Resources', isNew: showNewBadge }]
      : []),
  ];

  const lecturerLinks: NavItem[] = [
    { to: '/lecturer/dashboard',  icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/lecturer/students',   icon: <Users size={18} />,           label: 'Students' },
    { to: '/lecturer/attendance', icon: <CalendarCheck size={18} />,   label: 'Attendance' },
    { to: '/lecturer/mbi802-resources', icon: <BookOpen size={18} />,  label: 'MBI802 Resources', isNew: showNewBadge },
  ];

  const links = role === 'student' ? studentLinks : lecturerLinks;
  const initials = user?.email?.[0]?.toUpperCase() ?? '?';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="sidebar-orb w-48 h-48 bg-brand-200/30 -top-16 -right-16" />
      <div className="sidebar-orb w-32 h-32 bg-violet-200/20 bottom-32 -left-10" />

      {/* Logo */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4 relative z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-400/30 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300" />
            <div className="relative bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl p-2 shadow-lg">
              <BrandMark className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <span className="text-gray-800 font-bold text-base tracking-tight leading-none block">YooBees</span>
            <span className="text-brand-500 text-[10px] font-semibold uppercase tracking-widest">Attendance</span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl p-1.5 transition-all lg:hidden"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Role pill */}
      <div className="px-5 pb-4 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.10) 0%, rgba(139,92,246,0.06) 100%)',
            color: '#7c3aed',
            border: '1px solid rgba(139,92,246,0.15)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          {role === 'student' ? 'Student' : role === 'teachingAssistant' ? 'Teaching Assistant' : 'Lecturer'}
        </span>
      </div>

      {/* Divider */}
      <div className="divider mx-5 !mt-0 !mb-4" />

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 relative z-10">
        <p className="section-label px-3 mb-2">Menu</p>
        {links.map(({ to, icon, label, isNew }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="flex-shrink-0">{icon}</span>
            <span className="flex-1">{label}</span>
            {isNew && (
              <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full" style={{ color: '#be185d', background: 'rgba(244,114,182,0.18)' }}>
                New
              </span>
            )}
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex-shrink-0 text-brand-400" />
          </NavLink>
        ))}
      </nav>

      {/* Bottom: User + Logout */}
      <div className="px-4 py-4 relative z-10">
        <div className="divider !mb-4" />
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-2xl mb-1 cursor-pointer group"
          style={{
            background: 'linear-gradient(135deg, rgba(245,243,255,0.8) 0%, rgba(237,233,254,0.6) 100%)',
            border: '1px solid rgba(139,92,246,0.10)',
            transition: 'all 0.2s ease',
          }}
          onClick={role === 'student' && onOpenPhotoModal ? onOpenPhotoModal : undefined}
          title={role === 'student' ? 'Update profile photo' : undefined}
        >
          {/* Avatar: photo or initials */}
          <div
            className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
            style={{
              background: photoURL ? 'transparent' : (user ? avatarGradient(user.uid) : 'linear-gradient(135deg, #7c3aed, #a78bfa)'),
              border: '2px solid rgba(139,92,246,0.25)',
              boxShadow: '0 2px 8px rgba(124,58,237,0.15)',
            }}
          >
            {photoURL
              ? <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
              : initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-800 truncate">{user?.email?.split('@')[0]}</p>
            <p className="text-[10px] text-gray-400 truncate">
              {role === 'student' ? (photoURL ? 'Photo uploaded ✓' : 'Tap to add photo') : user?.email}
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-link w-full mt-1 text-red-400 hover:text-red-600 hover:bg-red-50">
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, role } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [intakePromptOpen, setIntakePromptOpen] = useState(false);
  const [photoPromptOpen, setPhotoPromptOpen] = useState(false);
  const [currentPhotoURL, setCurrentPhotoURL] = useState<string | null>(null);
  const [canViewMBI802Resources, setCanViewMBI802Resources] = useState(role !== 'student');
  const [intake, setIntake] = useState<'2511' | '2604' | ''>('');
  const [showMBI802NewBadge, setShowMBI802NewBadge] = useState(false);
  const [savingIntake, setSavingIntake] = useState(false);

  useEffect(() => {
    if (!user || role !== 'student') return;
    (async () => {
      const snap = await getDoc(doc(db, 'students', user.uid));
      if (!snap.exists()) return;
      const data = snap.data() as { intake?: string; photoURL?: string; subjects?: string[] };

      // Load current photo
      if (data.photoURL) setCurrentPhotoURL(data.photoURL);
      setCanViewMBI802Resources((data.subjects || []).includes('MBI802'));

      // Show intake prompt if missing
      if (!data.intake) { setIntakePromptOpen(true); return; }

      // Show photo prompt if profile exists but no photo uploaded yet
      if (!data.photoURL) setPhotoPromptOpen(true);
    })();
  }, [user, role]);


  useEffect(() => {
    if (role !== 'student') setCanViewMBI802Resources(true);
  }, [role]);


  useEffect(() => {
    if (!user) return;
    const key = `mbi802_resources_seen_${user.uid}`;
    const seen = localStorage.getItem(key) === '1';
    setShowMBI802NewBadge(!seen);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const onResourcesPage =
      location.pathname === '/student/mbi802-resources' ||
      location.pathname === '/lecturer/mbi802-resources';
    if (!onResourcesPage || !showMBI802NewBadge) return;

    const key = `mbi802_resources_seen_${user.uid}`;
    localStorage.setItem(key, '1');
    setShowMBI802NewBadge(false);
  }, [location.pathname, showMBI802NewBadge, user]);

  const saveIntake = async () => {
    if (!user || !intake) return;
    setSavingIntake(true);
    const subjects = intake === '2511' ? ['MBI804'] : ['MBI800', 'MBI802'];
    setCanViewMBI802Resources(subjects.includes('MBI802'));
    await setDoc(doc(db, 'students', user.uid), {
      intake,
      subjects,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    setSavingIntake(false);
    setIntakePromptOpen(false);
    // Show photo prompt right after intake is set
    setPhotoPromptOpen(true);
  };

  const handlePhotoUploaded = (url: string) => {
    setCurrentPhotoURL(url);
    setPhotoPromptOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-page)' }}>

      {/* Intake prompt */}
      {intakePromptOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0" style={{ background: 'rgba(30, 27, 75, 0.35)', backdropFilter: 'blur(8px)' }} />
          <div
            className="relative w-full max-w-md rounded-3xl p-6"
            style={{ background: 'rgba(255,255,255,0.98)', border: '1px solid rgba(139,92,246,0.12)', boxShadow: '0 24px 64px rgba(124,106,247,0.18)' }}
          >
            <h3 className="font-bold text-lg mb-1" style={{ color: '#1e1b4b' }}>Select your intake</h3>
            <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
              Please select your intake once to continue. Your subjects will be auto-assigned.
            </p>
            <select
              className="input-field w-full"
              value={intake}
              onChange={(e) => setIntake(e.target.value as '2511' | '2604' | '')}
            >
              <option value="">Select intake…</option>
              <option value="2511">2511 (MBI804)</option>
              <option value="2604">2604 (MBI800, MBI802)</option>
            </select>
            <button
              className="btn-primary w-full justify-center mt-4"
              disabled={!intake || savingIntake}
              onClick={saveIntake}
            >
              {savingIntake ? 'Saving…' : 'Save intake'}
            </button>
          </div>
        </div>
      )}

      {/* Photo upload prompt — shown once per login until uploaded */}
      {photoPromptOpen && !intakePromptOpen && (
        <PhotoUploadModal
          currentPhotoURL={currentPhotoURL ?? undefined}
          onClose={() => setPhotoPromptOpen(false)}
          onUploaded={handlePhotoUploaded}
          skipable
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 flex-shrink-0 h-full relative"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(139, 92, 246, 0.10)',
          boxShadow: '4px 0 24px rgba(124,106,247,0.05)',
        }}
      >
        <SidebarContent
          photoURL={currentPhotoURL}
          onOpenPhotoModal={() => setPhotoPromptOpen(true)}
          canViewMBI802Resources={canViewMBI802Resources}
          showNewBadge={showMBI802NewBadge}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden animate-fadeIn">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="relative w-64 h-full flex flex-col animate-scaleIn"
            style={{
              background: 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '8px 0 40px rgba(124,106,247,0.15)',
            }}
          >
            <SidebarContent
              onClose={() => setMobileOpen(false)}
              photoURL={currentPhotoURL}
              onOpenPhotoModal={() => { setMobileOpen(false); setPhotoPromptOpen(true); }}
              canViewMBI802Resources={canViewMBI802Resources}
          showNewBadge={showMBI802NewBadge}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <header
          className="lg:hidden flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.90)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(139,92,246,0.08)',
            boxShadow: '0 2px 12px rgba(124,106,247,0.06)',
          }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl p-1.5 transition-all"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2.5 flex-1">
            <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl p-1.5 shadow">
              <BrandMark className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-800 tracking-tight">YooBees</span>
          </div>
          {/* Mobile photo avatar */}
          {role === 'student' && (
            <button
              onClick={() => setPhotoPromptOpen(true)}
              className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{
                background: currentPhotoURL
                  ? 'transparent'
                  : (user ? avatarGradient(user.uid) : 'linear-gradient(135deg, #7c3aed, #a78bfa)'),
                border: '2px solid rgba(139,92,246,0.25)',
              }}
            >
              {currentPhotoURL
                ? <img src={currentPhotoURL} alt="Profile" className="w-full h-full object-cover" />
                : (user?.email?.[0]?.toUpperCase() ?? '?')}
            </button>
          )}
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
        <footer
          className="px-4 sm:px-6 lg:px-8 py-3 text-center text-xs flex-shrink-0"
          style={{
            color: '#6b7280',
            borderTop: '1px solid rgba(139,92,246,0.10)',
            background: 'rgba(255,255,255,0.72)',
          }}
        >
          © {new Date().getFullYear()} All Rights Reserved • Created by{' '}
          <a
            href="https://www.instagram.com/yasassri.me/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-brand-600 hover:text-brand-700 underline underline-offset-2"
          >
            @yasassri.me
          </a>
        </footer>
      </div>
    </div>
  );
}

/* ── Page Header ── */
export function PageHeader({ title, subtitle, actions }: {
  title:     string;
  subtitle?: string;
  actions?:  React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      <div className="animate-fadeIn">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0 animate-fadeIn" style={{ animationDelay: '0.05s' }}>
          {actions}
        </div>
      )}
    </div>
  );
}

/* ── Section Label ── */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="section-label">{children}</h2>;
}

export function ClipboardIcon() {
  return <CalendarCheck size={18} />;
}
