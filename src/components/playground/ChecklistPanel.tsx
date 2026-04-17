import { useEffect, useState } from 'react';
import {
  collection, addDoc, setDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp, Timestamp, query, orderBy,
} from 'firebase/firestore';
import {
  CheckSquare, Plus, Check, X, Download,
  GripVertical,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import type { ChecklistItem, ChecklistCompletion } from '../../lib/playgroundTypes';

function toItem(id: string, data: Record<string, unknown>): ChecklistItem {
  return {
    id,
    label:     (data.label as string) ?? '',
    order:     (data.order as number) ?? 0,
    createdAt: (data.createdAt as Timestamp)?.toDate?.() ?? new Date(),
  };
}

function toCompletion(id: string, data: Record<string, unknown>): ChecklistCompletion {
  return {
    id,
    itemId:      (data.itemId as string)   ?? '',
    userId:      (data.userId as string)   ?? '',
    userName:    (data.userName as string) ?? 'Student',
    completedAt: (data.completedAt as Timestamp)?.toDate?.() ?? new Date(),
  };
}

/* ── shared hooks ── */
function useItems(sessionId: string) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'sessions', sessionId, 'checklistItems'), orderBy('order')),
      (snap) => setItems(snap.docs.map((d) => toItem(d.id, d.data() as Record<string, unknown>)))
    );
    return unsub;
  }, [sessionId]);
  return items;
}

function useCompletions(sessionId: string) {
  const [completions, setCompletions] = useState<ChecklistCompletion[]>([]);
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'sessions', sessionId, 'checklistCompletions'),
      (snap) => setCompletions(snap.docs.map((d) => toCompletion(d.id, d.data() as Record<string, unknown>)))
    );
    return unsub;
  }, [sessionId]);
  return completions;
}

/* ─────────────────────────────────────────────────────────
   Lecturer checklist panel
   ───────────────────────────────────────────────────────── */
interface LecturerChecklistProps {
  sessionId: string;
}

export function LecturerChecklistPanel({ sessionId }: LecturerChecklistProps) {
  const items       = useItems(sessionId);
  const completions = useCompletions(sessionId);

  const [newLabel,    setNewLabel]    = useState('');
  const [adding,      setAdding]      = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const addItem = async () => {
    if (!newLabel.trim()) return;
    setAdding(true);
    try {
      const order = items.length > 0 ? Math.max(...items.map((i) => i.order)) + 1 : 0;
      await addDoc(collection(db, 'sessions', sessionId, 'checklistItems'), {
        label:     newLabel.trim(),
        order,
        createdAt: serverTimestamp(),
      });
      setNewLabel('');
    } finally {
      setAdding(false);
    }
  };

  const removeItem = async (itemId: string) => {
    await deleteDoc(doc(db, 'sessions', sessionId, 'checklistItems', itemId));
  };

  // Count distinct students (from completions)
  const allStudents = [...new Map(
    completions.map((c) => [c.userId, { userId: c.userId, userName: c.userName }])
  ).values()];

  const completedBy = (itemId: string) =>
    completions.filter((c) => c.itemId === itemId).length;

  const studentCount = allStudents.length || 1; // avoid div by 0

  const exportCSV = () => {
    const header = ['Student', ...items.map((i) => i.label)].join(',');
    const rows   = allStudents.map((s) => {
      const cols = items.map((item) =>
        completions.some((c) => c.itemId === item.id && c.userId === s.userId) ? '✓' : ''
      );
      return [s.userName, ...cols].map((c) => `"${c}"`).join(',');
    });
    const csv  = [header, ...rows].join('\n');
    const url  = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a    = Object.assign(document.createElement('a'), { href: url, download: `checklist-${sessionId}.csv` });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card p-5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #2dd4bf, #3b82f6)' }}
        >
          <CheckSquare size={15} color="white" />
        </div>
        <h3 className="font-bold text-sm text-gray-800">Progress Checklist</h3>
        <div className="ml-auto flex gap-1.5">
          {allStudents.length > 0 && (
            <>
              <button
                className="btn-ghost !px-2.5 !py-1.5 !text-xs"
                onClick={() => setShowSummary((v) => !v)}
              >
                {showSummary ? 'List' : 'Summary'}
              </button>
              <button
                className="btn-secondary !px-2.5 !py-1.5 !text-xs"
                onClick={exportCSV}
                title="Export CSV"
              >
                <Download size={11} /> CSV
              </button>
            </>
          )}
        </div>
      </div>

      {/* Add item form */}
      <div className="flex gap-2 mb-4">
        <input
          className="input-field flex-1 !py-2 !text-sm"
          placeholder="Add checklist step…"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addItem(); }}
        />
        <button
          className="btn-primary !px-3 !py-2"
          onClick={addItem}
          disabled={adding || !newLabel.trim()}
        >
          <Plus size={15} />
        </button>
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div
          className="rounded-2xl flex flex-col items-center py-8 text-center"
          style={{ background: 'rgba(124,58,237,0.04)', border: '1px dashed rgba(124,58,237,0.20)' }}
        >
          <CheckSquare size={24} style={{ color: '#c4b5fd' }} />
          <p className="text-sm text-gray-400 mt-2 font-medium">No items yet</p>
          <p className="text-xs text-gray-400 mt-1">Add steps students should complete</p>
        </div>
      ) : showSummary ? (
        /* Summary grid view */
        <SummaryGrid items={items} students={allStudents} completions={completions} />
      ) : (
        /* Item list with progress bars */
        <ul className="space-y-2">
          {items.map((item, i) => {
            const count = completedBy(item.id);
            const pct   = Math.round((count / studentCount) * 100);
            return (
              <li
                key={item.id}
                className="rounded-2xl p-3 transition-all"
                style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.08)' }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <GripVertical size={12} className="text-gray-300 flex-shrink-0" />
                  <span className="text-xs font-bold text-gray-400 flex-shrink-0 w-4">{i + 1}.</span>
                  <span className="text-sm font-medium text-gray-700 flex-1 truncate">{item.label}</span>
                  <span className="text-xs font-semibold flex-shrink-0" style={{ color: '#7c3aed' }}>
                    {count}/{allStudents.length}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <X size={12} />
                  </button>
                </div>
                {/* Progress bar */}
                <div className="ml-8 progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${pct}%`,
                      background: pct === 100
                        ? 'linear-gradient(90deg,#34d399,#10b981)'
                        : 'linear-gradient(90deg,#7c3aed,#a78bfa)',
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
                <p className="ml-8 text-[10px] text-gray-400 mt-1">{pct}% complete</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function SummaryGrid({
  items,
  students,
  completions,
}: {
  items:       ChecklistItem[];
  students:    { userId: string; userName: string }[];
  completions: ChecklistCompletion[];
}) {
  if (students.length === 0) {
    return <p className="text-xs text-gray-400 text-center py-4">No completions yet</p>;
  }

  const done = (userId: string, itemId: string) =>
    completions.some((c) => c.userId === userId && c.itemId === itemId);

  return (
    <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid rgba(124,58,237,0.10)' }}>
      <table className="w-full text-xs min-w-[360px]">
        <thead>
          <tr style={{ background: 'rgba(124,58,237,0.06)' }}>
            <th className="px-3 py-2 text-left font-bold text-gray-600 sticky left-0" style={{ background: 'rgba(245,243,255,0.9)' }}>
              Student
            </th>
            {items.map((item, i) => (
              <th key={item.id} className="px-2 py-2 text-center font-semibold text-gray-500" title={item.label}>
                {i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((s, ri) => (
            <tr
              key={s.userId}
              style={{ background: ri % 2 === 0 ? 'transparent' : 'rgba(124,58,237,0.02)' }}
            >
              <td className="px-3 py-2 font-medium text-gray-700 truncate max-w-[120px] sticky left-0" style={{ background: ri % 2 === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(245,243,255,0.9)' }}>
                {s.userName}
              </td>
              {items.map((item) => (
                <td key={item.id} className="px-2 py-2 text-center">
                  {done(s.userId, item.id) ? (
                    <Check size={13} className="mx-auto" style={{ color: '#10b981' }} />
                  ) : (
                    <span className="text-gray-200">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Student checklist panel
   ───────────────────────────────────────────────────────── */
interface StudentChecklistProps {
  sessionId: string;
  userId: string;
  userName: string;
}

export function StudentChecklistPanel({ sessionId, userId, userName }: StudentChecklistProps) {
  const items       = useItems(sessionId);
  const completions = useCompletions(sessionId);
  const [toggling,  setToggling] = useState<string | null>(null);

  const isCompleted = (itemId: string) =>
    completions.some((c) => c.itemId === itemId && c.userId === userId);

  const toggle = async (item: ChecklistItem) => {
    setToggling(item.id);
    const compId = `${item.id}_${userId}`;
    const ref    = doc(db, 'sessions', sessionId, 'checklistCompletions', compId);
    try {
      if (isCompleted(item.id)) {
        await deleteDoc(ref);
      } else {
        await setDoc(ref, {
          itemId:      item.id,
          userId,
          userName,
          completedAt: serverTimestamp(),
        });
      }
    } finally {
      setToggling(null);
    }
  };

  const completedCount = items.filter((i) => isCompleted(i.id)).length;

  return (
    <div className="card p-5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #2dd4bf, #3b82f6)' }}
        >
          <CheckSquare size={15} color="white" />
        </div>
        <h3 className="font-bold text-sm text-gray-800">Progress Checklist</h3>
        {items.length > 0 && (
          <span
            className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(45,212,191,0.12)', color: '#0d9488' }}
          >
            {completedCount}/{items.length} done
          </span>
        )}
      </div>

      {/* Overall progress */}
      {items.length > 0 && (
        <div className="mb-4">
          <div className="progress-track !h-2.5">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100)}%`,
                background: 'linear-gradient(90deg,#2dd4bf,#3b82f6)',
              }}
            />
          </div>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 ? (
        <div
          className="rounded-2xl flex flex-col items-center py-8 text-center"
          style={{ background: 'rgba(124,58,237,0.04)', border: '1px dashed rgba(124,58,237,0.20)' }}
        >
          <CheckSquare size={24} style={{ color: '#c4b5fd' }} />
          <p className="text-sm text-gray-400 mt-2 font-medium">No checklist yet</p>
          <p className="text-xs text-gray-400 mt-1">Your lecturer will add steps</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => {
            const done    = isCompleted(item.id);
            const loading = toggling === item.id;
            return (
              <li key={item.id}>
                <button
                  disabled={loading}
                  onClick={() => toggle(item)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all"
                  style={{
                    background: done ? 'rgba(45,212,191,0.08)' : 'rgba(124,58,237,0.04)',
                    border:     done ? '1px solid rgba(45,212,191,0.25)' : '1px solid rgba(124,58,237,0.08)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {/* Checkbox */}
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      background: done ? 'linear-gradient(135deg,#2dd4bf,#3b82f6)' : 'rgba(255,255,255,0.8)',
                      border:     done ? 'none' : '2px solid rgba(139,92,246,0.25)',
                    }}
                  >
                    {done && <Check size={11} color="white" strokeWidth={3} />}
                  </div>

                  {/* Step number */}
                  <span className="text-xs font-bold text-gray-300 flex-shrink-0 w-4">{i + 1}.</span>

                  {/* Label */}
                  <span
                    className="text-sm font-medium flex-1 transition-all duration-200"
                    style={{ color: done ? '#0d9488' : '#374151', textDecoration: done ? 'line-through' : 'none' }}
                  >
                    {item.label}
                  </span>

                  {done && (
                    <Check size={14} className="flex-shrink-0" style={{ color: '#0d9488' }} />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
