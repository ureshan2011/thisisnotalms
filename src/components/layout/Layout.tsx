import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, CalendarCheck, LogOut,
  User, ClipboardList, History, Menu, X,
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
    { to: '/student/attendance', icon: <CalendarCheck size={18} />, label: 'Submit Attendance' },
    { to: '/student/history',    icon: <History size={18} />,       label: 'My History' },
  ];

  const lecturerLinks: NavItem[] = [
    { to: '/lecturer/dashboard',  icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/lecturer/students',   icon: <Users size={18} />,           label: 'Students' },
    { to: '/lecturer/attendance', icon: <CalendarCheck size={18} />,   label: 'Attendance' },
  ];

  const links = role === 'lecturer' ? lecturerLinks : studentLinks;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2.5">
          <BrandMark className="h-8 w-8" />
          <span className="text-white font-bold text-lg tracking-tight">YooBees</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Role badge */}
      <div className="px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          {role === 'lecturer' ? 'Lecturer' : 'Student'}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.email?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-300 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-link w-full">
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-slate-900 h-full">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-60 h-full bg-slate-900 flex flex-col">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="text-slate-600 hover:text-slate-900">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <BrandMark className="h-6 w-6" />
            <span className="font-bold text-slate-800">YooBees</span>
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

/* Convenience wrapper used by every protected page */
export function PageHeader({ title, subtitle, actions }: {
  title:     string;
  subtitle?: string;
  actions?:  React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">{children}</h2>;
}

export function ClipboardIcon() {
  return <ClipboardList size={18} />;
}
