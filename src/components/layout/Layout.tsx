import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, CalendarCheck, LogOut,
  User, History, Menu, X, ChevronRight, ClipboardList,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import BrandMark from '../ui/BrandMark';

interface NavItem {
  to:    string;
  icon:  React.ReactNode;
  label: string;
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const studentLinks: NavItem[] = [
    { to: '/student/profile',    icon: <User size={18} />,          label: 'My Profile' },
    { to: '/student/attendance', icon: <CalendarCheck size={18} />, label: 'Attendance' },
    { to: '/student/history',    icon: <History size={18} />,       label: 'My History' },
  ];

  const lecturerLinks: NavItem[] = [
    { to: '/lecturer/dashboard',  icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/lecturer/students',   icon: <Users size={18} />,           label: 'Students' },
    { to: '/lecturer/attendance', icon: <CalendarCheck size={18} />,   label: 'Attendance' },
  ];

  const links = role === 'lecturer' ? lecturerLinks : studentLinks;
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
          {role === 'lecturer' ? 'Lecturer' : 'Student'}
        </span>
      </div>

      {/* Divider */}
      <div className="divider mx-5 !mt-0 !mb-4" />

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 relative z-10">
        <p className="section-label px-3 mb-2">Menu</p>
        {links.map(({ to, icon, label }) => (
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
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex-shrink-0 text-brand-400" />
          </NavLink>
        ))}
      </nav>

      {/* Bottom: User + Logout */}
      <div className="px-4 py-4 relative z-10">
        <div className="divider !mb-4" />
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl mb-1"
          style={{
            background: 'linear-gradient(135deg, rgba(245,243,255,0.8) 0%, rgba(237,233,254,0.6) 100%)',
            border: '1px solid rgba(139,92,246,0.10)',
          }}
        >
          <div className="avatar w-8 h-8 text-xs flex-shrink-0">{initials}</div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-800 truncate">{user?.email?.split('@')[0]}</p>
            <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-page)' }}>
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
        <SidebarContent />
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
            <SidebarContent onClose={() => setMobileOpen(false)} />
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
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl p-1.5 shadow">
              <BrandMark className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-800 tracking-tight">YooBees</span>
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
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
  return <ClipboardList size={18} />;
}
