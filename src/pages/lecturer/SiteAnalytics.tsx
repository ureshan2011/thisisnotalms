import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Layout, { PageHeader } from '../../components/layout/Layout';
import { BarChart2, LogIn, Users, RefreshCw } from 'lucide-react';

interface UserLoginData {
  uid: string;
  email: string;
  role: string;
  loginCount: number;
}

const ROLE_LABELS: Record<string, string> = {
  student: 'Student',
  lecturer: 'Lecturer',
  teachingAssistant: 'Teaching Assistant',
};

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  lecturer:          { bg: 'rgba(124,58,237,0.12)', text: '#6d28d9' },
  teachingAssistant: { bg: 'rgba(16,185,129,0.12)', text: '#065f46' },
  student:           { bg: 'rgba(59,130,246,0.12)', text: '#1e40af' },
};

export default function SiteAnalytics() {
  const [users, setUsers] = useState<UserLoginData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'loginCount' | 'role' | 'email'>('loginCount');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const load = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, 'users'));
    const data: UserLoginData[] = snap.docs.map(d => ({
      uid: d.id,
      email: d.data().email || '',
      role: d.data().role || '',
      loginCount: d.data().loginCount ?? 0,
    }));
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = users
    .filter(u => roleFilter === 'all' || u.role === roleFilter)
    .sort((a, b) => {
      if (sortBy === 'loginCount') return b.loginCount - a.loginCount;
      if (sortBy === 'role') return a.role.localeCompare(b.role);
      return a.email.localeCompare(b.email);
    });

  const totalLogins  = users.reduce((s, u) => s + u.loginCount, 0);
  const activeUsers  = users.filter(u => u.loginCount > 0).length;
  const maxCount     = Math.max(...users.map(u => u.loginCount), 1);

  const statCard = (icon: React.ReactNode, label: string, value: string | number) => (
    <div
      className="rounded-2xl p-5 flex items-center gap-4"
      style={{
        background: 'rgba(255,255,255,0.85)',
        border: '1px solid rgba(139,92,246,0.10)',
        boxShadow: '0 2px 12px rgba(124,106,247,0.07)',
      }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(124,58,237,0.10)' }}>
        <span className="text-brand-600">{icon}</span>
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );

  return (
    <Layout>
      <PageHeader
        title="Site Analytics"
        subtitle="Login visit counts per user — one count per browser session"
        actions={
          <button
            onClick={load}
            disabled={loading}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCard(<Users size={18} />, 'Total Users', users.length)}
        {statCard(<LogIn size={18} />, 'Total Visits', totalLogins)}
        {statCard(<BarChart2 size={18} />, 'Active Users', activeUsers)}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select
          className="input-field text-sm py-1.5 px-3 rounded-xl"
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
        >
          <option value="all">All roles</option>
          <option value="lecturer">Lecturers</option>
          <option value="teachingAssistant">Teaching Assistants</option>
          <option value="student">Students</option>
        </select>
        <select
          className="input-field text-sm py-1.5 px-3 rounded-xl"
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
        >
          <option value="loginCount">Sort: Most visits</option>
          <option value="role">Sort: Role</option>
          <option value="email">Sort: Email</option>
        </select>
        <span className="text-xs text-gray-400 ml-1">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.85)',
          border: '1px solid rgba(139,92,246,0.10)',
          boxShadow: '0 2px 16px rgba(124,106,247,0.07)',
        }}
      >
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No users found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(139,92,246,0.08)' }}>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Role</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Visits</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-40">Activity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => {
                const colors = ROLE_COLORS[u.role] ?? { bg: 'rgba(107,114,128,0.10)', text: '#374151' };
                const barPct = maxCount > 0 ? (u.loginCount / maxCount) * 100 : 0;
                return (
                  <tr
                    key={u.uid}
                    style={{ borderBottom: '1px solid rgba(139,92,246,0.05)' }}
                    className="hover:bg-brand-50/30 transition-colors"
                  >
                    <td className="px-6 py-3 text-gray-300 font-mono text-xs">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-700 max-w-xs truncate">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: colors.bg, color: colors.text }}
                      >
                        {ROLE_LABELS[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-gray-800 tabular-nums">
                      {u.loginCount}
                    </td>
                    <td className="px-6 py-3">
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(139,92,246,0.08)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${barPct}%`,
                            background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Each visit counts as one login — refreshing the same tab does not re-count.
      </p>
    </Layout>
  );
}
