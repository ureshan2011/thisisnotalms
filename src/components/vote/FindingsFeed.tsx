import { useState } from 'react';
import { MessageSquareQuote } from 'lucide-react';
import type { Team, VoteRecord } from '../../lib/voteTypes';

interface FindingsFeedProps {
  teams: Team[];
  votes: VoteRecord[];
}

function fmt(d: Date) {
  return d.toLocaleString('en-NZ', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function FindingsFeed({ teams, votes }: FindingsFeedProps) {
  const [teamFilter, setTeamFilter] = useState('all');

  const findings = votes
    .filter((v) => v.mostInterestingFinding.trim().length > 0)
    .filter((v) => teamFilter === 'all' || v.teamId === teamFilter)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return (
    <div className="space-y-3">
      <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)} className="input-field !w-auto text-sm">
        <option value="all">All teams</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>

      {findings.length === 0 ? (
        <div className="rounded-2xl py-8 text-center" style={{ background: 'rgba(124,58,237,0.04)', border: '1px dashed rgba(124,58,237,0.20)' }}>
          <p className="text-sm font-medium" style={{ color: '#9ca3af' }}>No findings yet.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[32rem] overflow-y-auto pr-1">
          {findings.map((v) => (
            <div key={v.id} className="rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(124,58,237,0.10)' }}>
              <div className="flex items-start gap-2.5">
                <MessageSquareQuote size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#a78bfa' }} />
                <p className="text-sm font-medium leading-snug flex-1" style={{ color: '#1e1b4b' }}>{v.mostInterestingFinding}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 ml-[26px] text-xs" style={{ color: '#9ca3af' }}>
                <span className="badge-purple">{v.teamName}</span>
                <span className="font-semibold" style={{ color: '#6b7280' }}>{v.firstName}</span>
                <span>· {v.studentId}</span>
                <span>· {fmt(v.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
