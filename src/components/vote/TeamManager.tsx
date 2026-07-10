import { useState } from 'react';
import {
  addDoc, collection, deleteDoc, doc, serverTimestamp, setDoc, updateDoc, writeBatch,
} from 'firebase/firestore';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, X, Check } from 'lucide-react';
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
          className="vote-input flex-1"
        />
        <button onClick={addTeam} disabled={adding || !newTeamName.trim()} className="vote-btn-primary !px-4">
          <Plus size={15} /> Add
        </button>
      </div>

      {/* Team list */}
      {teams.length === 0 ? (
        <div className="vote-empty">No teams yet — add one above.</div>
      ) : (
        <div className="space-y-2">
          {teams.map((team, i) => {
            const isPresenting = currentTeamId === team.id;
            const isEditing = editingId === team.id;
            return (
              <div
                key={team.id}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5"
                style={{
                  background: isPresenting ? 'var(--gold-wash)' : 'var(--ink-raised-2)',
                  border: `1px solid ${isPresenting ? 'var(--gold-border)' : 'var(--ink-line)'}`,
                }}
              >
                {/* Reorder */}
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button onClick={() => moveTeam(i, -1)} disabled={i === 0} className="vote-btn-ghost !p-1 disabled:opacity-25">
                    <ArrowUp size={13} />
                  </button>
                  <button onClick={() => moveTeam(i, 1)} disabled={i === teams.length - 1} className="vote-btn-ghost !p-1 disabled:opacity-25">
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
                      className="vote-input !py-1.5 text-sm"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--paper)' }}>{team.name}</p>
                      {isPresenting && <span className="vote-live-dot" />}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {isEditing ? (
                    <>
                      <button onClick={() => saveEdit(team.id)} className="vote-btn-ghost !p-1.5" aria-label="Save">
                        <Check size={14} style={{ color: 'var(--gold-strong)' }} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="vote-btn-ghost !p-1.5" aria-label="Cancel">
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => togglePresenting(team)}
                        className={isPresenting ? 'vote-btn-primary !px-3 !py-1.5 !text-xs' : 'vote-btn-secondary !px-3 !py-1.5 !text-xs'}
                      >
                        {isPresenting ? 'Presenting' : 'Set live'}
                      </button>
                      <button onClick={() => { setEditingId(team.id); setEditingName(team.name); }} className="vote-btn-ghost !p-1.5" aria-label="Edit">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => removeTeam(team)} className="vote-btn-ghost !p-1.5" aria-label="Remove">
                        <Trash2 size={13} style={{ color: 'var(--danger)' }} />
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
