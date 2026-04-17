/**
 * PastSessionView — read-only snapshot of a finished session's data.
 * Used in both the lecturer history panel and the student past-sessions list.
 *
 * Props:
 *   sessionId  — the expired session's Firestore id
 *   userId     — if provided, highlights that student's own checklist completions
 *   isStaff    — shows aggregate completion counts (vs individual status)
 */
import { useEffect, useState } from 'react';
import {
  collection, onSnapshot, Timestamp,
  query, orderBy,
} from 'firebase/firestore';
import { BarChart2, CheckSquare, ThumbsDown, ThumbsUp } from 'lucide-react';
import { db } from '../../lib/firebase';
import { StudentCanvas } from './CanvasPanel';
import type { ChecklistCompletion, ChecklistItem, Poll } from '../../lib/playgroundTypes';

/* ── converters ── */
function toPoll(id: string, d: Record<string, unknown>): Poll {
  return {
    id,
    question:  (d.question as string) ?? '',
    createdAt: (d.createdAt as Timestamp)?.toDate?.() ?? new Date(),
    votes:     (d.votes     as Record<string, boolean>) ?? {},
  };
}
function toItem(id: string, d: Record<string, unknown>): ChecklistItem {
  return {
    id,
    label:     (d.label  as string) ?? '',
    order:     (d.order  as number) ?? 0,
    createdAt: (d.createdAt as Timestamp)?.toDate?.() ?? new Date(),
  };
}
function toCompletion(id: string, d: Record<string, unknown>): ChecklistCompletion {
  return {
    id,
    itemId:      (d.itemId   as string) ?? '',
    userId:      (d.userId   as string) ?? '',
    userName:    (d.userName as string) ?? '',
    completedAt: (d.completedAt as Timestamp)?.toDate?.() ?? new Date(),
  };
}

/* ── hooks ── */
function useSessionPolls(sessionId: string) {
  const [polls, setPolls] = useState<Poll[]>([]);
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'sessions', sessionId, 'polls'),
      (snap) =>
        setPolls(
          snap.docs
            .map((d) => toPoll(d.id, d.data() as Record<string, unknown>))
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        )
    );
    return unsub;
  }, [sessionId]);
  return polls;
}

function useSessionChecklist(sessionId: string) {
  const [items,       setItems]       = useState<ChecklistItem[]>([]);
  const [completions, setCompletions] = useState<ChecklistCompletion[]>([]);

  useEffect(() => {
    const u1 = onSnapshot(
      query(collection(db, 'sessions', sessionId, 'checklistItems'), orderBy('order')),
      (snap) => setItems(snap.docs.map((d) => toItem(d.id, d.data() as Record<string, unknown>)))
    );
    const u2 = onSnapshot(
      collection(db, 'sessions', sessionId, 'checklistCompletions'),
      (snap) => setCompletions(snap.docs.map((d) => toCompletion(d.id, d.data() as Record<string, unknown>)))
    );
    return () => { u1(); u2(); };
  }, [sessionId]);

  return { items, completions };
}

/* ── Poll result card (read-only) ── */
function PastPollCard({ poll, index }: { poll: Poll; index: number }) {
  const votes     = Object.values(poll.votes);
  const total     = votes.length;
  const upCount   = votes.filter(Boolean).length;
  const downCount = total - upCount;
  const upPct     = total === 0 ? 0 : Math.round((upCount / total) * 100);
  const downPct   = total === 0 ? 0 : 100 - upPct;

  return (
    <div
      className="rounded-2xl p-3 mb-2 last:mb-0"
      style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.08)' }}
    >
      <div className="flex items-start gap-2 mb-2">
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5"
          style={{ background: 'rgba(124,58,237,0.10)', color: '#7c3aed' }}
        >
          #{index + 1}
        </span>
        {poll.question ? (
          <p className="text-xs font-semibold text-gray-700 leading-snug">"{poll.question}"</p>
        ) : (
          <p className="text-xs text-gray-400 italic">No question label</p>
        )}
        <span className="ml-auto text-xs text-gray-400 flex-shrink-0">{total} votes</span>
      </div>

      {total > 0 ? (
        <div className="space-y-1 pl-5">
          <div className="flex items-center gap-2">
            <ThumbsUp size={11} className="text-emerald-500 flex-shrink-0" />
            <div className="flex-1 progress-track">
              <div
                className="progress-fill"
                style={{ width: `${upPct}%`, background: 'linear-gradient(90deg,#34d399,#10b981)' }}
              />
            </div>
            <span className="text-xs font-bold w-8 text-right" style={{ color: '#059669' }}>{upPct}%</span>
            <span className="text-[10px] text-gray-400 w-4 text-right">{upCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThumbsDown size={11} className="text-rose-500 flex-shrink-0" />
            <div className="flex-1 progress-track">
              <div
                className="progress-fill"
                style={{ width: `${downPct}%`, background: 'linear-gradient(90deg,#fb7185,#ef4444)' }}
              />
            </div>
            <span className="text-xs font-bold w-8 text-right" style={{ color: '#e11d48' }}>{downPct}%</span>
            <span className="text-[10px] text-gray-400 w-4 text-right">{downCount}</span>
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-400 pl-5">No responses</p>
      )}
    </div>
  );
}

/* ── Main component ── */
interface Props {
  sessionId: string;
  userId?:   string; // student's own uid — shows personal checklist status
  isStaff?:  boolean;
}

export default function PastSessionView({ sessionId, userId, isStaff = false }: Props) {
  const polls                 = useSessionPolls(sessionId);
  const { items, completions } = useSessionChecklist(sessionId);

  const myDone = (itemId: string) =>
    userId ? completions.some((c) => c.itemId === itemId && c.userId === userId) : false;

  const countDone = (itemId: string) =>
    completions.filter((c) => c.itemId === itemId).length;

  return (
    <div className="space-y-4 pt-4 px-1">
      {/* Canvas snapshot */}
      <StudentCanvas sessionId={sessionId} />

      {/* Poll results */}
      {polls.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)' }}
            >
              <BarChart2 size={13} color="white" />
            </div>
            <h4 className="font-bold text-sm text-gray-700">Poll Results ({polls.length})</h4>
          </div>
          {polls.map((poll, i) => (
            <PastPollCard key={poll.id} poll={poll} index={i} />
          ))}
        </div>
      )}

      {/* Checklist */}
      {items.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#2dd4bf,#3b82f6)' }}
            >
              <CheckSquare size={13} color="white" />
            </div>
            <h4 className="font-bold text-sm text-gray-700">
              Checklist
              {userId && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  (your progress: {items.filter(i => myDone(i.id)).length}/{items.length})
                </span>
              )}
            </h4>
          </div>

          <ul className="space-y-1.5">
            {items.map((item, i) => {
              const done = userId ? myDone(item.id) : false;
              const cnt  = isStaff ? countDone(item.id) : null;
              return (
                <li
                  key={item.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{
                    background: done ? 'rgba(45,212,191,0.08)' : 'rgba(124,58,237,0.03)',
                    border:     done ? '1px solid rgba(45,212,191,0.20)' : '1px solid rgba(124,58,237,0.06)',
                  }}
                >
                  {/* Step number */}
                  <span className="text-[10px] font-bold text-gray-300 w-4 flex-shrink-0">{i + 1}.</span>

                  {/* Checkbox indicator (student view) */}
                  {userId && (
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                      style={{
                        background: done ? 'linear-gradient(135deg,#2dd4bf,#3b82f6)' : 'rgba(255,255,255,0.8)',
                        border:     done ? 'none' : '1.5px solid rgba(139,92,246,0.25)',
                      }}
                    >
                      {done && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  )}

                  <span
                    className="text-xs font-medium flex-1 truncate"
                    style={{ color: done ? '#0d9488' : '#374151' }}
                  >
                    {item.label}
                  </span>

                  {/* Staff: show count */}
                  {cnt !== null && (
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed' }}
                    >
                      {cnt} ✓
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {polls.length === 0 && items.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-4">No poll or checklist data for this session.</p>
      )}
    </div>
  );
}
