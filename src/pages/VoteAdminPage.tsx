import { useState, type FormEvent } from 'react';
import { Download, Lock, Trophy, Users, ListChecks, MessageSquareQuote } from 'lucide-react';
import { useLiveState, useTeams, useVotes } from '../lib/useVoteData';
import { RATING_CRITERIA, overallAverage } from '../lib/voteTypes';
import '../styles/voteTheme.css';
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
    <div className="vote-theme flex items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="vote-card w-full max-w-sm p-7">
        <div className="flex flex-col items-center mb-5 text-center">
          <div className="rounded-lg p-2.5 mb-3" style={{ background: 'var(--gold-wash)', border: '1px solid var(--gold-border)' }}>
            <Lock size={18} style={{ color: 'var(--gold-strong)' }} />
          </div>
          <p className="vote-eyebrow mb-1">Live Vote</p>
          <h1 className="vote-marquee text-2xl">Admin</h1>
        </div>

        <label className="vote-label">Password</label>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          className={`vote-input mb-2 ${error ? 'vote-error' : ''}`}
        />
        {error && <p className="vote-error-text mb-3">Incorrect password</p>}

        <button type="submit" className="vote-btn-primary w-full py-2.5 mt-2">Unlock</button>
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
    const headers = ['Student ID', 'First Name', 'Team', 'Platform', ...RATING_CRITERIA.map((c) => c.label), 'Overall', 'What Went Well', 'What Could Improve', 'Updated At'];
    const rows = votes.map((v) => [
      v.studentId,
      v.firstName,
      v.teamName,
      v.platform,
      ...RATING_CRITERIA.map((c) => String(v.ratings[c.key])),
      overallAverage(v.ratings).toFixed(2),
      v.wentWell,
      v.couldImprove,
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
    <div className="vote-theme px-4 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <p className="vote-eyebrow mb-1">Live Vote</p>
            <h1 className="vote-marquee text-3xl">Admin</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: 'var(--ink-raised-2)', border: '1px solid var(--ink-line)' }}>
              <Users size={13} style={{ color: 'var(--gold-strong)' }} />
              <span className="text-xs font-bold" style={{ color: 'var(--paper)' }}>{participantCount} student{participantCount !== 1 ? 's' : ''} voted</span>
            </div>
            <button onClick={exportCsv} className="vote-btn-secondary !text-xs">
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-5 mb-5 overflow-x-auto" style={{ borderBottom: '1px solid var(--ink-line)' }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`vote-tab flex items-center gap-1.5 ${tab === t.key ? 'active' : ''}`}
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
