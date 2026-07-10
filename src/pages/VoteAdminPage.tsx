import { useState, type FormEvent } from 'react';
import { Download, Lock, Trophy, Users, ListChecks, MessageSquareQuote } from 'lucide-react';
import { useLiveState, useTeams, useVotes } from '../lib/useVoteData';
import { RATING_CRITERIA, overallAverage } from '../lib/voteTypes';
import BrandMark from '../components/ui/BrandMark';
import TeamManager from '../components/vote/TeamManager';
import LiveLeaderboard from '../components/vote/LiveLeaderboard';
import FindingsFeed from '../components/vote/FindingsFeed';

const ADMIN_PASSWORD = 'adminadmin';
const UNLOCK_STORAGE_KEY = 'yoobees_vote_admin_unlocked';

type Tab = 'teams' | 'leaderboard' | 'findings';

function csvEscape(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export default function VoteAdminPage() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(UNLOCK_STORAGE_KEY) === 'true');

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  return <AdminDashboard />;
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(UNLOCK_STORAGE_KEY, 'true');
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <div className="min-h-screen bg-page flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl p-7" style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(124,58,237,0.15)', boxShadow: '0 4px 24px rgba(124,58,237,0.10)' }}>
        <div className="flex flex-col items-center mb-5">
          <div className="rounded-2xl p-2.5 mb-3" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)' }}>
            <Lock size={20} color="white" />
          </div>
          <h1 className="text-lg font-bold" style={{ color: '#1e1b4b' }}>Admin Dashboard</h1>
          <p className="text-xs font-medium mt-0.5" style={{ color: '#9ca3af' }}>Live Vote — Platform Strategy</p>
        </div>

        <label className="label">Password</label>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          className={`input-field mb-2 ${error ? 'ring-2 ring-red-400' : ''}`}
        />
        {error && <p className="text-xs font-semibold mb-3" style={{ color: '#dc2626' }}>Incorrect password</p>}

        <button type="submit" className="btn-primary w-full justify-center py-2.5 mt-2">Unlock</button>
      </form>
    </div>
  );
}

function AdminDashboard() {
  const { teams }          = useTeams();
  const { votes }          = useVotes();
  const { currentTeamId }  = useLiveState();
  const [tab, setTab]      = useState<Tab>('teams');

  const participantCount = new Set(votes.map((v) => v.studentId.trim().toLowerCase())).size;

  function exportCsv() {
    const headers = ['Student ID', 'First Name', 'Team', ...RATING_CRITERIA.map((c) => c.label), 'Overall', 'Most Interesting Finding', 'Updated At'];
    const rows = votes.map((v) => [
      v.studentId,
      v.firstName,
      v.teamName,
      ...RATING_CRITERIA.map((c) => String(v.ratings[c.key])),
      overallAverage(v.ratings).toFixed(2),
      v.mostInterestingFinding,
      v.updatedAt.toISOString(),
    ].map((val) => csvEscape(String(val))));
    const csv = [headers.map(csvEscape).join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presentation-votes.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'teams',       label: 'Team Manager',    icon: <ListChecks size={14} /> },
    { key: 'leaderboard', label: 'Leaderboard',      icon: <Trophy size={14} /> },
    { key: 'findings',    label: 'Findings',         icon: <MessageSquareQuote size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-page px-4 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl p-2" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)' }}>
              <BrandMark className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight" style={{ color: '#1e1b4b' }}>Live Vote — Admin</h1>
              <p className="text-xs font-medium" style={{ color: '#9ca3af' }}>Platform strategy presentations</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: 'rgba(124,58,237,0.08)' }}>
              <Users size={13} style={{ color: '#7c3aed' }} />
              <span className="text-xs font-bold" style={{ color: '#5b21b6' }}>{participantCount} student{participantCount !== 1 ? 's' : ''} voted</span>
            </div>
            <button onClick={exportCsv} className="btn-secondary !px-3 !py-1.5 !text-xs">
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
              style={{
                background: tab === t.key ? 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)' : 'rgba(255,255,255,0.7)',
                color: tab === t.key ? '#fff' : '#6b7280',
                border: tab === t.key ? 'none' : '1px solid rgba(124,58,237,0.12)',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          {tab === 'teams' && <TeamManager teams={teams} currentTeamId={currentTeamId} />}
          {tab === 'leaderboard' && <LiveLeaderboard teams={teams} votes={votes} />}
          {tab === 'findings' && <FindingsFeed teams={teams} votes={votes} />}
        </div>
      </div>
    </div>
  );
}
