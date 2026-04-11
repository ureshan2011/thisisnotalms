import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { Filter, ListChecks } from 'lucide-react';
import Layout, { PageHeader } from '../../components/layout/Layout';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useFeatureTracking } from '../../lib/useFeatureTracking';

interface EventLogRecord {
  id: string;
  type: string;
  description: string;
  actorRole?: string;
  actorEmail?: string;
  feature?: string;
  durationSeconds?: number;
  createdAt: Date;
}

export default function EventLog() {
  const { role } = useAuth();
  useFeatureTracking('Event Log');
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<EventLogRecord[]>([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [textFilter, setTextFilter] = useState('');
  const isLecturer = role === 'lecturer';

  useEffect(() => {
    (async () => {
      const snap = await getDocs(query(collection(db, 'eventLogs'), orderBy('createdAt', 'desc')));
      setLogs(snap.docs.map(d => {
        const r = d.data() as Record<string, unknown>;
        return {
          id: d.id,
          type: (r.type as string) || 'unknown',
          description: (r.description as string) || 'No description',
          actorRole: (r.actorRole as string) || '',
          actorEmail: (r.actorEmail as string) || '',
          feature: (r.feature as string) || '',
          durationSeconds: (r.durationSeconds as number) || 0,
          createdAt: (r.createdAt as Timestamp)?.toDate?.() ?? new Date(),
        };
      }));
      setLoading(false);
    })();
  }, []);

  const eventTypes = useMemo(() => [...new Set(logs.map(l => l.type))].sort(), [logs]);

  const filtered = useMemo(() => logs.filter((log) => {
    const byType = !typeFilter || log.type === typeFilter;
    const byRole = !roleFilter || log.actorRole === roleFilter;
    const byText = !textFilter || `${log.description} ${log.actorEmail} ${log.feature}`.toLowerCase().includes(textFilter.toLowerCase());
    return byType && byRole && byText;
  }), [logs, roleFilter, textFilter, typeFilter]);

  if (loading) return <Layout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></Layout>;

  return (
    <Layout>
      <PageHeader
        title="Event Log"
        subtitle="Track student actions, TA account creation, attendance activity, login duration, and feature usage."
      />

      {isLecturer && (
        <div className="p-4 mb-5 rounded-3xl flex flex-col sm:flex-row gap-3" style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(139,92,246,0.10)' }}>
          <select className="input-field sm:w-60" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All event types</option>
            {eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <select className="input-field sm:w-52" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All roles</option>
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
            <option value="teachingAssistant">Teaching Assistant</option>
          </select>
          <input
            className="input-field flex-1"
            placeholder="Search by description, email, or feature"
            value={textFilter}
            onChange={(e) => setTextFilter(e.target.value)}
          />
          {(typeFilter || roleFilter || textFilter) && (
            <button className="btn-ghost" onClick={() => { setTypeFilter(''); setRoleFilter(''); setTextFilter(''); }}>
              <Filter size={14} /> Clear
            </button>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl" style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid rgba(139,92,246,0.10)' }}>
        {filtered.length === 0 ? (
          <div className="p-14 text-center text-sm text-gray-500 flex flex-col items-center gap-2">
            <ListChecks size={20} />
            No events found for current filters.
          </div>
        ) : (
          filtered.map(log => (
            <div key={log.id} className="px-5 py-3 border-b border-violet-100/70 last:border-b-0">
              <p className="text-sm font-semibold text-gray-800">{log.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {log.createdAt.toLocaleString()} • {log.actorRole || 'unknown role'} • {log.actorEmail || 'unknown email'}
                {log.durationSeconds ? ` • login duration ${Math.round(log.durationSeconds / 60)} min` : ''}
                {log.feature ? ` • feature: ${log.feature}` : ''}
              </p>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
