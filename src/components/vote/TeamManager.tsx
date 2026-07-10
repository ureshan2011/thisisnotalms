import { useState } from 'react';
import {
  addDoc, collection, deleteDoc, doc, serverTimestamp, setDoc, updateDoc, writeBatch,
} from 'firebase/firestore';
import { ArrowDown, ArrowUp, Pencil, Plus, Radio, Trash2, X, Check } from 'lucide-react';
import { db } from '../../lib/firebase';
import { VOTE_COLLECTIONS, type Team } from '../../lib/voteTypes';

interface TeamManagerProps {
  teams:          Team[];
  currentTeamId:  string | null;
}

export default function TeamManager({ teams, currentTeamId }: TeamManagerProps) {
  const [newTeamName, setNewTeamName] = useState('');
  const [adding, setAdding]           = useState(false);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  async function addTeam() {
    const name = newTeamName.trim();
    if (!name) return;
    setAdding(true);
    try {
      const order = teams.length > 0 ? Math.max(...teams.map((t) => t.order)) + 1 : 0;
      await addDoc(collection(db, VOTE_COLLECTIONS.teams), { name, order, createdAt: serverTimestamp() });
      setNewTeamName('');
    } finally {
      setAdding(false);
    }
  }

  async function saveEdit(teamId: string) {
    const name = editingName.trim();
    if (name) await updateDoc(doc(db, VOTE_COLLECTIONS.teams, teamId), { name });
    setEditingId(null);
  }

  async function removeTeam(team: Team) {
    if (!window.confirm(`Remove "${team.name}"? Existing votes for this team stay in the export but the team disappears from the student list.`)) return;
    await deleteDoc(doc(db, VOTE_COLLECTIONS.teams, team.id));
    if (currentTeamId === team.id) {
      await setDoc(doc(db, VOTE_COLLECTIONS.liveState, 'current'), { currentTeamId: null }, { merge: true });
    }
  }

  async function moveTeam(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= teams.length) return;
    const a = teams[index];
    const b = teams[target];
    const batch = writeBatch(db);
    batch.update(doc(db, VOTE_COLLECTIONS.teams, a.id), { order: b.order });
    batch.update(doc(db, VOTE_COLLECTIONS.teams, b.id), { order: a.order });
    await batch.commit();
  }

  async function togglePresenting(team: Team) {
    const nextId = currentTeamId === team.id ? null : team.id;
    await setDoc(doc(db, VOTE_COLLECTIONS.liveState, 'current'), { currentTeamId: nextId }, { merge: true });
  }

  return (
    <div className="space-y-4">
      {/* Add team */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addTeam(); }}
          placeholder="New team name…"
          className="input-field flex-1"
        />
        <button onClick={addTeam} disabled={adding || !newTeamName.trim()} className="btn-primary !px-4">
          <Plus size={15} /> Add
        </button>
      </div>

      {/* Team list */}
      {teams.length === 0 ? (
        <div className="rounded-2xl py-8 text-center" style={{ background: 'rgba(124,58,237,0.04)', border: '1px dashed rgba(124,58,237,0.20)' }}>
          <p className="text-sm font-medium" style={{ color: '#9ca3af' }}>No teams yet — add one above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {teams.map((team, i) => {
            const isPresenting = currentTeamId === team.id;
            const isEditing = editingId === team.id;
            return (
              <div
                key={team.id}
                className="flex items-center gap-2 rounded-2xl px-3 py-2.5"
                style={{
                  background: isPresenting ? 'linear-gradient(135deg, rgba(124,58,237,0.10), rgba(167,139,250,0.06))' : 'rgba(255,255,255,0.7)',
                  border: isPresenting ? '1px solid rgba(124,58,237,0.30)' : '1px solid rgba(124,58,237,0.10)',
                }}
              >
                {/* Reorder */}
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button onClick={() => moveTeam(i, -1)} disabled={i === 0} className="btn-ghost !p-1 disabled:opacity-25">
                    <ArrowUp size={13} />
                  </button>
                  <button onClick={() => moveTeam(i, 1)} disabled={i === teams.length - 1} className="btn-ghost !p-1 disabled:opacity-25">
                    <ArrowDown size={13} />
                  </button>
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <input
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(team.id); if (e.key === 'Escape') setEditingId(null); }}
                      className="input-field !py-1.5 text-sm"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold truncate" style={{ color: '#1e1b4b' }}>{team.name}</p>
                      {isPresenting && <Radio size={12} className="pulse-ring flex-shrink-0" style={{ color: '#7c3aed' }} />}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {isEditing ? (
                    <>
                      <button onClick={() => saveEdit(team.id)} className="btn-ghost !p-1.5" aria-label="Save">
                        <Check size={14} style={{ color: '#059669' }} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="btn-ghost !p-1.5" aria-label="Cancel">
                        <X size={14} style={{ color: '#9ca3af' }} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => togglePresenting(team)}
                        className={isPresenting ? 'btn-primary !px-3 !py-1.5 !text-xs' : 'btn-secondary !px-3 !py-1.5 !text-xs'}
                      >
                        {isPresenting ? 'Presenting' : 'Set live'}
                      </button>
                      <button onClick={() => { setEditingId(team.id); setEditingName(team.name); }} className="btn-ghost !p-1.5" aria-label="Edit">
                        <Pencil size={13} style={{ color: '#9ca3af' }} />
                      </button>
                      <button onClick={() => removeTeam(team)} className="btn-ghost !p-1.5" aria-label="Remove">
                        <Trash2 size={13} style={{ color: '#f87171' }} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
