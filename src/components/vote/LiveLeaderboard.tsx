import { useState } from 'react';
import { ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { overallAverage, type Team, type VoteRecord } from '../../lib/voteTypes';

interface LiveLeaderboardProps {
  teams: Team[];
  votes: VoteRecord[];
}

type SortKey = 'order' | 'overall' | 'votes' | 'clarity' | 'networkEffect' | 'businessModel' | 'risk';
type SortDir = 'asc' | 'desc';

interface Row {
  team:    Team;
  count:   number;
  overall: number;
  clarity: number;
  networkEffect: number;
  businessModel: number;
  risk:    number;
}

function fmt(n: number) {
  return n > 0 ? n.toFixed(1) : '—';
}

export default function LiveLeaderboard({ teams, votes }: LiveLeaderboardProps) {
  const [sortKey, setSortKey] = useState<SortKey>('order');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const rows: Row[] = teams.map((team) => {
    const teamVotes = votes.filter((v) => v.teamId === team.id);
    const count = teamVotes.length;
    const avg = (key: 'clarity' | 'networkEffect' | 'businessModel' | 'risk') =>
      count === 0 ? 0 : teamVotes.reduce((s, v) => s + v.ratings[key], 0) / count;
    return {
      team,
      count,
      clarity: avg('clarity'),
      networkEffect: avg('networkEffect'),
      businessModel: avg('businessModel'),
      risk: avg('risk'),
      overall: count === 0 ? 0 : teamVotes.reduce((s, v) => s + overallAverage(v.ratings), 0) / count,
    };
  });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir(key === 'order' ? 'asc' : 'desc'); }
  }

  const sorted = [...rows].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'order') cmp = a.team.order - b.team.order;
    else if (sortKey === 'votes') cmp = a.count - b.count;
    else cmp = a[sortKey] - b[sortKey];
    return sortDir === 'asc' ? cmp : -cmp;
  });

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronDown size={12} style={{ opacity: 0.35 }} />;
    return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  }

  const columns: { k: 'clarity' | 'networkEffect' | 'businessModel' | 'risk'; label: string }[] = [
    { k: 'clarity',       label: 'Clarity' },
    { k: 'networkEffect', label: 'Network' },
    { k: 'businessModel', label: 'Business' },
    { k: 'risk',          label: 'Risk' },
  ];

  if (teams.length === 0) {
    return <div className="vote-empty">Add teams to see the leaderboard.</div>;
  }

  return (
    <div className="vote-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="vote-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('order')}>
                <span className="inline-flex items-center gap-1">Team <SortIcon k="order" /></span>
              </th>
              {columns.map(({ k, label }) => (
                <th key={k} className="text-center" onClick={() => toggleSort(k)}>
                  <span className="inline-flex items-center gap-1">{label} <SortIcon k={k} /></span>
                </th>
              ))}
              <th className="text-center" onClick={() => toggleSort('overall')}>
                <span className="inline-flex items-center gap-1">Overall <SortIcon k="overall" /></span>
              </th>
              <th className="text-center" onClick={() => toggleSort('votes')}>
                <span className="inline-flex items-center gap-1">Votes <SortIcon k="votes" /></span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const isTop = sortKey === 'overall' && sortDir === 'desc' && i === 0 && row.count > 0;
              return (
                <tr key={row.team.id}>
                  <td>
                    <span className="inline-flex items-center gap-1.5 font-semibold">
                      {isTop && <Trophy size={13} style={{ color: 'var(--gold-strong)' }} />}
                      {row.team.name}
                    </span>
                  </td>
                  {columns.map(({ k }) => (
                    <td key={k} className="text-center" style={{ color: 'var(--paper-dim)' }}>{fmt(row[k])}</td>
                  ))}
                  <td className="text-center">
                    <span className="vote-badge">{fmt(row.overall)}</span>
                  </td>
                  <td className="text-center" style={{ color: 'var(--paper-dim)' }}>{row.count}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
