import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
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
    .filter((v) => v.wentWell.trim().length > 0 || v.couldImprove.trim().length > 0)
    .filter((v) => teamFilter === 'all' || v.teamId === teamFilter)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return (
    <div className="space-y-3">
      <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)} className="vote-input !w-auto text-sm">
        <option value="all">All teams</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>

      {findings.length === 0 ? (
        <div className="vote-empty">No feedback yet.</div>
      ) : (
        <div className="space-y-2 max-h-[36rem] overflow-y-auto pr-1">
          {findings.map((v) => (
            <div key={v.id} className="vote-card p-4">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
                <span className="vote-badge">{v.teamName}</span>
                {v.platform && (
                  <span className="text-xs font-semibold" style={{ color: 'var(--paper)' }}>on {v.platform}</span>
                )}
                <span className="text-xs" style={{ color: 'var(--paper-dim)' }}>· {v.firstName} · {v.studentId} · {fmt(v.updatedAt)}</span>
              </div>

              {v.wentWell && (
                <div className="flex items-start gap-2 mb-2">
                  <ThumbsUp size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--gold-strong)' }} />
                  <p className="text-sm leading-snug" style={{ color: 'var(--paper)' }}>{v.wentWell}</p>
                </div>
              )}
              {v.couldImprove && (
                <div className="flex items-start gap-2">
                  <ThumbsDown size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--danger)' }} />
                  <p className="text-sm leading-snug" style={{ color: 'var(--paper-dim)' }}>{v.couldImprove}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
