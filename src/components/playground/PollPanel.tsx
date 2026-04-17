import { useEffect, useState } from 'react';
import {
  collection, addDoc, updateDoc, doc,
  onSnapshot, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { BarChart2, Plus, ThumbsUp, ThumbsDown } from 'lucide-react';
import { db } from '../../lib/firebase';
import type { Poll } from '../../lib/playgroundTypes';

function firestoreToPoll(id: string, data: Record<string, unknown>): Poll {
  return {
    id,
    question:  (data.question as string) ?? '',
    createdAt: (data.createdAt as Timestamp)?.toDate?.() ?? new Date(),
    votes:     (data.votes as Record<string, boolean>) ?? {},
  };
}

/* ─────────────────────────────────────────────────────────
   Shared hook: subscribe to polls for a session
   ───────────────────────────────────────────────────────── */
function usePolls(sessionId: string) {
  const [polls, setPolls] = useState<Poll[]>([]);
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'sessions', sessionId, 'polls'),
      (snap) => {
        const list = snap.docs
          .map((d) => firestoreToPoll(d.id, d.data() as Record<string, unknown>))
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        setPolls(list);
      }
    );
    return unsub;
  }, [sessionId]);
  return polls;
}

/* ─────────────────────────────────────────────────────────
   Lecturer poll panel
   ───────────────────────────────────────────────────────── */
interface LecturerPollProps {
  sessionId: string;
}

export function LecturerPollPanel({ sessionId }: LecturerPollProps) {
  const polls   = usePolls(sessionId);
  const [question, setQuestion] = useState('');
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const activePoll = polls.length > 0 ? polls[polls.length - 1] : null;

  const createPoll = async () => {
    if (!question.trim()) return;
    setCreating(true);
    try {
      await addDoc(collection(db, 'sessions', sessionId, 'polls'), {
        question: question.trim(),
        createdAt: serverTimestamp(),
        votes: {},
      });
      setQuestion('');
      setShowForm(false);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="card p-5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
        >
          <BarChart2 size={15} color="white" />
        </div>
        <h3 className="font-bold text-sm text-gray-800">Understanding Poll</h3>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="ml-auto btn-secondary !px-3 !py-1.5 !text-xs"
        >
          <Plus size={12} /> New Poll
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div
          className="mb-4 p-3 rounded-2xl animate-fadeIn"
          style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.12)' }}
        >
          <label className="label">Question (optional label)</label>
          <input
            className="input-field mb-2"
            placeholder="e.g. Do you understand this concept?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') createPoll(); }}
          />
          <div className="flex gap-2">
            <button
              className="btn-primary !px-4 !py-2 !text-xs"
              disabled={creating}
              onClick={createPoll}
            >
              {creating ? 'Launching…' : 'Launch Poll'}
            </button>
            <button
              className="btn-secondary !px-4 !py-2 !text-xs"
              onClick={() => { setShowForm(false); setQuestion(''); }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active poll results */}
      {activePoll ? (
        <PollResults poll={activePoll} />
      ) : (
        <div
          className="rounded-2xl flex flex-col items-center justify-center py-8 text-center mb-4"
          style={{ background: 'rgba(124,58,237,0.04)', border: '1px dashed rgba(124,58,237,0.20)' }}
        >
          <BarChart2 size={24} style={{ color: '#c4b5fd' }} />
          <p className="text-sm text-gray-400 mt-2 font-medium">No active poll</p>
          <p className="text-xs text-gray-400 mt-1">Launch a poll to collect student responses</p>
        </div>
      )}

      {/* Timeline */}
      {polls.length > 0 && <PollTimeline polls={polls} />}
    </div>
  );
}

function PollResults({ poll }: { poll: Poll }) {
  const votes     = Object.values(poll.votes);
  const total     = votes.length;
  const upCount   = votes.filter(Boolean).length;
  const downCount = total - upCount;
  const upPct     = total === 0 ? 0 : Math.round((upCount / total) * 100);
  const downPct   = total === 0 ? 0 : 100 - upPct;

  return (
    <div
      className="rounded-2xl p-4 mb-4"
      style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.10)' }}
    >
      {poll.question && (
        <p className="text-sm font-semibold text-gray-700 mb-3 leading-snug">"{poll.question}"</p>
      )}

      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-gray-500">{total} response{total !== 1 ? 's' : ''}</span>
      </div>

      {/* Up bar */}
      <div className="flex items-center gap-2 mb-2">
        <ThumbsUp size={14} className="text-emerald-500 flex-shrink-0" />
        <div className="flex-1 progress-track">
          <div
            className="progress-fill"
            style={{ width: `${upPct}%`, background: 'linear-gradient(90deg,#34d399,#10b981)', transition: 'width 0.6s ease' }}
          />
        </div>
        <span className="text-sm font-bold w-10 text-right" style={{ color: '#059669' }}>{upPct}%</span>
        <span className="text-xs text-gray-400 w-6 text-right">{upCount}</span>
      </div>

      {/* Down bar */}
      <div className="flex items-center gap-2">
        <ThumbsDown size={14} className="text-rose-500 flex-shrink-0" />
        <div className="flex-1 progress-track">
          <div
            className="progress-fill"
            style={{ width: `${downPct}%`, background: 'linear-gradient(90deg,#fb7185,#ef4444)', transition: 'width 0.6s ease' }}
          />
        </div>
        <span className="text-sm font-bold w-10 text-right" style={{ color: '#e11d48' }}>{downPct}%</span>
        <span className="text-xs text-gray-400 w-6 text-right">{downCount}</span>
      </div>
    </div>
  );
}

function PollTimeline({ polls }: { polls: Poll[] }) {
  if (polls.length === 0) return null;
  return (
    <div>
      <p className="section-label mb-2">Engagement timeline</p>
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {polls.map((poll, i) => {
          const votes   = Object.values(poll.votes);
          const total   = votes.length;
          const upPct   = total === 0 ? 0 : Math.round((votes.filter(Boolean).length / total) * 100);
          const hue     = upPct >= 70 ? '#34d399' : upPct >= 40 ? '#f59e0b' : '#f87171';
          return (
            <div key={poll.id} className="flex flex-col items-center gap-1 flex-shrink-0">
              {/* Connector */}
              {i > 0 && <div className="absolute" />}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                style={{ background: hue }}
                title={poll.question || `Poll ${i + 1}`}
              >
                {upPct}%
              </div>
              <span className="text-[9px] text-gray-400">#{i + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Student poll panel (vote)
   ───────────────────────────────────────────────────────── */
interface StudentPollProps {
  sessionId: string;
  userId: string;
}

export function StudentPollPanel({ sessionId, userId }: StudentPollProps) {
  const polls      = usePolls(sessionId);
  const activePoll = polls.length > 0 ? polls[polls.length - 1] : null;
  const [voting,   setVoting] = useState(false);

  const myVote = activePoll?.votes?.[userId];
  const hasVoted = myVote !== undefined;

  const vote = async (value: boolean) => {
    if (!activePoll) return;
    setVoting(true);
    try {
      await updateDoc(doc(db, 'sessions', sessionId, 'polls', activePoll.id), {
        [`votes.${userId}`]: value,
      });
    } finally {
      setVoting(false);
    }
  };

  if (!activePoll) {
    return (
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
          >
            <BarChart2 size={15} color="white" />
          </div>
          <h3 className="font-bold text-sm text-gray-800">Understanding Check</h3>
        </div>
        <div
          className="rounded-2xl flex flex-col items-center py-8 text-center"
          style={{ background: 'rgba(124,58,237,0.04)', border: '1px dashed rgba(124,58,237,0.20)' }}
        >
          <BarChart2 size={24} style={{ color: '#c4b5fd' }} />
          <p className="text-sm text-gray-400 mt-2 font-medium">No poll yet</p>
          <p className="text-xs text-gray-400 mt-1">Your lecturer will post a question</p>
        </div>
      </div>
    );
  }

  const votes   = Object.values(activePoll.votes);
  const total   = votes.length;
  const upPct   = total === 0 ? 0 : Math.round((votes.filter(Boolean).length / total) * 100);

  return (
    <div className="card p-5 animate-fadeIn">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
        >
          <BarChart2 size={15} color="white" />
        </div>
        <h3 className="font-bold text-sm text-gray-800">Understanding Check</h3>
        <span
          className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(245,158,11,0.12)', color: '#d97706' }}
        >
          {total} voted
        </span>
      </div>

      {activePoll.question && (
        <p className="text-sm font-semibold text-gray-700 mb-4 leading-snug">
          "{activePoll.question}"
        </p>
      )}

      {/* Vote buttons */}
      <div className="flex gap-3 mb-4">
        <button
          disabled={voting}
          onClick={() => vote(true)}
          className="flex-1 flex flex-col items-center justify-center py-5 rounded-2xl font-bold text-2xl transition-all"
          style={{
            background: myVote === true
              ? 'linear-gradient(135deg,#34d399,#10b981)'
              : 'rgba(52,211,153,0.10)',
            color:  myVote === true ? '#fff' : '#059669',
            border: myVote === true ? 'none' : '2px solid rgba(52,211,153,0.30)',
            transform: myVote === true ? 'scale(1.03)' : 'scale(1)',
            boxShadow: myVote === true ? '0 4px 16px rgba(52,211,153,0.35)' : 'none',
            transition: 'all 0.25s ease',
          }}
        >
          👍
          <span className="text-xs font-semibold mt-1 opacity-80">Yes / Got it</span>
        </button>
        <button
          disabled={voting}
          onClick={() => vote(false)}
          className="flex-1 flex flex-col items-center justify-center py-5 rounded-2xl font-bold text-2xl transition-all"
          style={{
            background: myVote === false
              ? 'linear-gradient(135deg,#fb7185,#ef4444)'
              : 'rgba(251,113,133,0.10)',
            color:  myVote === false ? '#fff' : '#e11d48',
            border: myVote === false ? 'none' : '2px solid rgba(251,113,133,0.30)',
            transform: myVote === false ? 'scale(1.03)' : 'scale(1)',
            boxShadow: myVote === false ? '0 4px 16px rgba(251,113,133,0.35)' : 'none',
            transition: 'all 0.25s ease',
          }}
        >
          👎
          <span className="text-xs font-semibold mt-1 opacity-80">No / Help!</span>
        </button>
      </div>

      {/* Live tally (shown after voting) */}
      {hasVoted && total > 0 && (
        <div
          className="rounded-xl px-3 py-2 flex items-center gap-2 animate-fadeIn"
          style={{ background: 'rgba(124,58,237,0.06)' }}
        >
          <span className="text-xs text-gray-500">Class:</span>
          <div className="flex-1 progress-track !h-2">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${upPct}%`, background: 'linear-gradient(90deg,#34d399,#10b981)' }}
            />
          </div>
          <span className="text-xs font-bold text-emerald-600">{upPct}% 👍</span>
        </div>
      )}
    </div>
  );
}
