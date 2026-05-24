import { useState, useEffect } from 'react';
import {
  collection, doc, getDocs, onSnapshot, setDoc, serverTimestamp,
  query, where, orderBy, limit,
} from 'firebase/firestore';
import {
  Swords, Trophy, Users, CheckCircle2, XCircle,
  Plus, BarChart2, Clock, Shuffle, BookOpen, ChevronDown, ChevronUp, History,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  DUEL_QUESTIONS, DIFFICULTY_CONFIG, TOPIC_CONFIG,
  type DuelQuestion, type DuelResponse,
  ER_QUESTIONS, SQL_QUESTIONS,
} from '../../lib/duelData';

const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Pacific/Auckland' });

const CHOICE_LABELS = ['A', 'B', 'C', 'D'] as const;

function fmtTime(ms: number) {
  const s = Math.floor(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
}

// ── Question preview card ─────────────────────────────────────────────────────
function QuestionPreview({ q }: { q: DuelQuestion }) {
  const [expanded, setExpanded] = useState(false);
  const topicCfg = TOPIC_CONFIG[q.topic];
  const diffCfg  = DIFFICULTY_CONFIG[q.difficulty];

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: 'rgba(139,92,246,0.2)' }}
    >
      <button
        className="w-full px-4 py-3 flex items-start gap-3 text-left"
        style={{ background: 'rgba(245,243,255,0.8)' }}
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: topicCfg.bg, color: topicCfg.color }}>
              {topicCfg.label}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: diffCfg.bg, color: diffCfg.color }}>
              {diffCfg.label} · {q.points}pts
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(209,213,219,0.5)', color: '#6b7280' }}>
              {q.category}
            </span>
          </div>
          <p className="text-sm font-medium leading-5 line-clamp-2" style={{ color: '#1e1b4b' }}>
            {q.question.split('\n')[0]}
          </p>
        </div>
        <div className="flex-shrink-0 mt-0.5">
          {expanded
            ? <ChevronUp size={16} style={{ color: '#7c3aed' }} />
            : <ChevronDown size={16} style={{ color: '#7c3aed' }} />
          }
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3" style={{ background: 'rgba(255,255,255,0.6)' }}>
          <div className="pt-2 space-y-1.5">
            {q.choices.map((c, i) => (
              <div
                key={i}
                className="text-xs rounded-xl px-3 py-2 flex items-start gap-2"
                style={{
                  background: i === q.correct ? 'rgba(209,250,229,0.8)' : 'rgba(243,244,246,0.8)',
                  color: i === q.correct ? '#065f46' : '#4b5563',
                }}
              >
                <span className="font-bold flex-shrink-0">{CHOICE_LABELS[i]}.</span>
                <span>{c}</span>
                {i === q.correct && (
                  <CheckCircle2 size={13} style={{ color: '#059669', marginLeft: 'auto', flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
          <div
            className="rounded-xl px-3 py-2"
            style={{ background: 'rgba(245,243,255,0.8)', border: '1px solid rgba(139,92,246,0.15)' }}
          >
            <p className="text-xs font-semibold mb-0.5" style={{ color: '#7c3aed' }}>Explanation</p>
            <p className="text-xs leading-5" style={{ color: '#4b5563' }}>{q.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LecturerDailyDuelPage() {
  const { user } = useAuth();
  const dateKey = today();

  const [todayChallenge, setTodayChallenge]   = useState<DuelQuestion | null>(null);
  const [challengeLoading, setChallengeLoading] = useState(true);
  const [responses, setResponses]             = useState<DuelResponse[]>([]);
  const [posting, setPosting]                 = useState(false);
  const [tab, setTab]                         = useState<'post' | 'bank'>('post');
  const [usedIds, setUsedIds]                 = useState<Set<string>>(new Set());

  // form state for posting
  const [filterTopic, setFilterTopic]   = useState<'all' | 'er' | 'sql'>('all');
  const [filterDiff, setFilterDiff]     = useState<'all' | 'medium' | 'hard' | 'fiendish'>('all');
  const [filterUsed, setFilterUsed]     = useState<'all' | 'unused'>('unused');
  const [selectedQId, setSelectedQId]   = useState<string>('');

  // ── Load all previously used question IDs ─────────────────────────────────
  useEffect(() => {
    getDocs(collection(db, 'duelChallenges')).then(snap => {
      const ids = new Set<string>();
      snap.forEach(d => {
        const qId = d.data().questionId as string | undefined;
        if (qId) ids.add(qId);
      });
      setUsedIds(ids);
    }).catch(() => undefined);
  }, []);

  // ── subscriptions ──────────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'duelChallenges', dateKey), snap => {
      if (snap.exists()) {
        const data = snap.data();
        setTodayChallenge(data.question as DuelQuestion);
        // Also mark today's question as used immediately
        if (data.questionId) {
          setUsedIds(prev => new Set([...prev, data.questionId as string]));
        }
      } else {
        setTodayChallenge(null);
      }
      setChallengeLoading(false);
    });
    return unsub;
  }, [dateKey]);

  useEffect(() => {
    const q = query(
      collection(db, 'duelResponses'),
      where('challengeDate', '==', dateKey),
      orderBy('submittedAt', 'asc'),
      limit(300)
    );
    const unsub = onSnapshot(q, snap => {
      setResponses(snap.docs.map(d => ({ ...d.data(), id: d.id } as DuelResponse)));
    });
    return unsub;
  }, [dateKey]);

  // ── post challenge ─────────────────────────────────────────────────────────
  async function postChallenge(q: DuelQuestion) {
    if (!user || posting) return;
    setPosting(true);
    try {
      await setDoc(doc(db, 'duelChallenges', dateKey), {
        questionId:  q.id,
        question:    q,
        date:        dateKey,
        postedAt:    serverTimestamp(),
        postedByUid: user.uid,
        isActive:    true,
      });
    } catch (e) {
      console.error(e);
    }
    setPosting(false);
  }

  function pickRandom() {
    // Prefer questions that haven't been used yet
    const unused = DUEL_QUESTIONS.filter(q => !usedIds.has(q.id));
    const pool   = unused.length > 0 ? unused : DUEL_QUESTIONS;
    const r      = pool[Math.floor(Math.random() * pool.length)];
    setSelectedQId(r.id);
  }

  // ── derived ────────────────────────────────────────────────────────────────
  const filteredQuestions = DUEL_QUESTIONS.filter(q => {
    if (filterTopic !== 'all' && q.topic !== filterTopic) return false;
    if (filterDiff  !== 'all' && q.difficulty !== filterDiff) return false;
    if (filterUsed  === 'unused' && usedIds.has(q.id)) return false;
    return true;
  });

  const selectedQ = DUEL_QUESTIONS.find(q => q.id === selectedQId) ?? null;

  const correctCount  = responses.filter(r => r.isCorrect).length;
  const voteCounts    = todayChallenge
    ? [0, 1, 2, 3].map(i => responses.filter(r => r.selectedChoice === i).length)
    : [0, 0, 0, 0];
  const totalVotes    = responses.length;

  const leaderboard = [...responses]
    .sort((a, b) => {
      if (b.isCorrect !== a.isCorrect) return (b.isCorrect ? 1 : 0) - (a.isCorrect ? 1 : 0);
      return a.responseTimeMs - b.responseTimeMs;
    })
    .slice(0, 15);

  // section breakdown
  const sectionMap: Record<string, { total: number; correct: number }> = {};
  for (const r of responses) {
    const key = r.studentSection || 'Unknown';
    if (!sectionMap[key]) sectionMap[key] = { total: 0, correct: 0 };
    sectionMap[key].total++;
    if (r.isCorrect) sectionMap[key].correct++;
  }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <Layout>
      <PageHeader
        title="Daily Duel — Manager"
        subtitle="MBI802 · Post today's Brain Duel challenge"
      />

      {challengeLoading ? (
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl">

          {/* ── Today's status ─────────────────────────────────────────── */}
          {todayChallenge ? (
            <div
              className="rounded-2xl p-5 border"
              style={{
                background: 'linear-gradient(135deg, rgba(209,250,229,0.6), rgba(167,243,208,0.4))',
                borderColor: 'rgba(16,185,129,0.3)',
              }}
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} style={{ color: '#059669', flexShrink: 0, marginTop: 2 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: '#065f46' }}>
                    Today's challenge is live!
                  </p>
                  <p className="text-xs mt-0.5 leading-5" style={{ color: '#047857' }}>
                    <span className="font-semibold">{totalVotes}</span> students have answered ·{' '}
                    <span className="font-semibold">
                      {totalVotes > 0 ? Math.round((correctCount / totalVotes) * 100) : 0}%
                    </span> correct
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: TOPIC_CONFIG[todayChallenge.topic].bg, color: TOPIC_CONFIG[todayChallenge.topic].color }}>
                    {TOPIC_CONFIG[todayChallenge.topic].label}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: DIFFICULTY_CONFIG[todayChallenge.difficulty].bg, color: DIFFICULTY_CONFIG[todayChallenge.difficulty].color }}>
                    {DIFFICULTY_CONFIG[todayChallenge.difficulty].label}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl p-5 border"
              style={{
                background: 'linear-gradient(135deg, rgba(254,243,199,0.7), rgba(253,230,138,0.4))',
                borderColor: 'rgba(245,158,11,0.3)',
              }}
            >
              <div className="flex items-center gap-3">
                <Swords size={20} style={{ color: '#b45309', flexShrink: 0 }} />
                <p className="text-sm font-bold" style={{ color: '#92400e' }}>
                  No challenge posted yet for today ({dateKey}). Students are waiting!
                </p>
              </div>
            </div>
          )}

          {/* ── Tabs ───────────────────────────────────────────────────── */}
          <div className="flex gap-1 p-1 rounded-2xl w-fit"
            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
            {(['post', 'bank'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: tab === t ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'transparent',
                  color: tab === t ? '#fff' : '#7c3aed',
                }}
              >
                {t === 'post' ? (
                  <span className="flex items-center gap-1.5"><Plus size={14} />Post Challenge</span>
                ) : (
                  <span className="flex items-center gap-1.5"><BookOpen size={14} />Question Bank</span>
                )}
              </button>
            ))}
          </div>

          {/* ── Post tab ───────────────────────────────────────────────── */}
          {tab === 'post' && (
            <div className="grid lg:grid-cols-2 gap-5">

              {/* Selector */}
              <div
                className="rounded-2xl p-5 space-y-4 border"
                style={{
                  background: 'linear-gradient(135deg, rgba(245,243,255,0.95), rgba(237,233,254,0.8))',
                  borderColor: 'rgba(139,92,246,0.2)',
                }}
              >
                <p className="text-sm font-bold" style={{ color: '#4c1d95' }}>Select Today's Question</p>

                {/* Filters */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold block mb-1" style={{ color: '#5b21b6' }}>Topic</label>
                    <select
                      className="input-field w-full text-sm"
                      value={filterTopic}
                      onChange={e => setFilterTopic(e.target.value as typeof filterTopic)}
                    >
                      <option value="all">All Topics</option>
                      <option value="er">ER Diagram</option>
                      <option value="sql">SQL</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1" style={{ color: '#5b21b6' }}>Difficulty</label>
                    <select
                      className="input-field w-full text-sm"
                      value={filterDiff}
                      onChange={e => setFilterDiff(e.target.value as typeof filterDiff)}
                    >
                      <option value="all">All Levels</option>
                      <option value="medium">Medium (10pts)</option>
                      <option value="hard">Hard (15pts)</option>
                      <option value="fiendish">Fiendish (20pts)</option>
                    </select>
                  </div>
                </div>

                {/* Used filter toggle */}
                <div className="flex items-center gap-2">
                  {(['unused', 'all'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setFilterUsed(v)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        background: filterUsed === v ? 'linear-gradient(135deg,#7c3aed,#6d28d9)' : 'rgba(139,92,246,0.08)',
                        color: filterUsed === v ? '#fff' : '#7c3aed',
                        border: '1px solid',
                        borderColor: filterUsed === v ? 'transparent' : 'rgba(139,92,246,0.2)',
                      }}
                    >
                      {v === 'unused' ? <><CheckCircle2 size={11} /> Fresh only</> : <><History size={11} /> Show all</>}
                    </button>
                  ))}
                  <span className="text-xs ml-auto" style={{ color: '#9ca3af' }}>
                    {DUEL_QUESTIONS.length - usedIds.size} unused of {DUEL_QUESTIONS.length}
                  </span>
                </div>

                {/* Question picker */}
                <div>
                  <label className="text-xs font-semibold block mb-1" style={{ color: '#5b21b6' }}>
                    Question ({filteredQuestions.length} available)
                  </label>
                  <select
                    className="input-field w-full text-sm"
                    value={selectedQId}
                    onChange={e => setSelectedQId(e.target.value)}
                  >
                    <option value="">— Pick a question —</option>
                    {filteredQuestions.map(q => (
                      <option key={q.id} value={q.id}>
                        {usedIds.has(q.id) ? '✓ ' : ''}[{q.topic.toUpperCase()}] {q.category} · {DIFFICULTY_CONFIG[q.difficulty].label} ·{' '}
                        {q.question.split('\n')[0].substring(0, 50)}…
                      </option>
                    ))}
                  </select>
                </div>

                {/* Random pick */}
                <button
                  onClick={pickRandom}
                  className="btn-secondary w-full text-sm flex items-center justify-center gap-1.5"
                >
                  <Shuffle size={14} />
                  Pick Random (prefers fresh)
                </button>

                {/* Post button */}
                <button
                  onClick={() => selectedQ && postChallenge(selectedQ)}
                  disabled={!selectedQ || posting || !!todayChallenge}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
                  style={todayChallenge ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  {posting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 animate-spin"
                        style={{ borderColor: '#fff3', borderTopColor: '#fff' }} />
                      Posting…
                    </>
                  ) : todayChallenge ? (
                    <>
                      <CheckCircle2 size={16} />
                      Already Posted Today
                    </>
                  ) : (
                    <>
                      <Swords size={16} />
                      Post Challenge
                    </>
                  )}
                </button>
              </div>

              {/* Preview */}
              <div className="space-y-4">
                {selectedQ ? (
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: '#6b7280' }}>Preview</p>
                    <QuestionPreview q={selectedQ} />
                  </div>
                ) : todayChallenge ? (
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: '#6b7280' }}>Active Challenge</p>
                    <QuestionPreview q={todayChallenge} />
                  </div>
                ) : (
                  <div
                    className="rounded-2xl p-8 border text-center h-full flex flex-col items-center justify-center"
                    style={{ borderColor: 'rgba(139,92,246,0.15)', background: 'rgba(245,243,255,0.4)', minHeight: 220 }}
                  >
                    <Swords size={32} style={{ color: '#c4b5fd', marginBottom: 12 }} />
                    <p className="text-sm" style={{ color: '#9ca3af' }}>
                      Select a question to preview it here
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Bank tab ───────────────────────────────────────────────── */}
          {tab === 'bank' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: TOPIC_CONFIG.er.bg, color: TOPIC_CONFIG.er.color }}>
                  {ER_QUESTIONS.length} ER Questions
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: TOPIC_CONFIG.sql.bg, color: TOPIC_CONFIG.sql.color }}>
                  {SQL_QUESTIONS.length} SQL Questions
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                  {DUEL_QUESTIONS.length} Total
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full ml-auto"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                  <History size={10} className="inline mr-1" />
                  {usedIds.size} used · {DUEL_QUESTIONS.length - usedIds.size} fresh
                </span>
              </div>
              {DUEL_QUESTIONS.map(q => {
                const wasUsed = usedIds.has(q.id);
                const isTodayQ = q.id === todayChallenge?.id;
                return (
                  <div key={q.id} className="relative" style={{ opacity: wasUsed && !isTodayQ ? 0.72 : 1 }}>
                    <QuestionPreview q={q} />
                    {/* Used badge */}
                    {wasUsed && (
                      <span
                        className="absolute top-3 right-[76px] text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: isTodayQ ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.12)',
                          color: isTodayQ ? '#059669' : '#ef4444',
                          border: `1px solid ${isTodayQ ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.25)'}`,
                        }}
                      >
                        {isTodayQ ? '● Today' : '✓ Used'}
                      </span>
                    )}
                    <button
                      className="absolute top-3 right-9 text-xs font-semibold px-2.5 py-1 rounded-full transition-all"
                      style={{
                        background: wasUsed ? 'rgba(239,68,68,0.08)' : 'rgba(124,58,237,0.12)',
                        color: wasUsed ? '#ef4444' : '#7c3aed',
                      }}
                      onClick={() => { setSelectedQId(q.id); setTab('post'); }}
                    >
                      Use This
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Live Stats (shown when challenge is active) ──────────── */}
          {todayChallenge && totalVotes > 0 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <BarChart2 size={18} style={{ color: '#7c3aed' }} />
                <h2 className="text-base font-bold" style={{ color: '#1e1b4b' }}>Live Results</h2>
                <span className="text-xs px-2 py-0.5 rounded-full ml-1"
                  style={{ background: 'rgba(16,185,129,0.12)', color: '#059669' }}>
                  Live
                </span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Participated', value: totalVotes, color: '#7c3aed' },
                  { label: 'Got It Right', value: `${Math.round((correctCount / totalVotes) * 100)}%`, color: '#10b981' },
                  { label: 'Got It Wrong', value: totalVotes - correctCount, color: '#ef4444' },
                  { label: 'Top Points', value: `${todayChallenge.points}`, color: '#f59e0b' },
                ].map(s => (
                  <div
                    key={s.label}
                    className="rounded-2xl p-4 text-center border"
                    style={{ background: 'rgba(245,243,255,0.9)', borderColor: 'rgba(139,92,246,0.15)' }}
                  >
                    <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Vote distribution */}
              <div
                className="rounded-2xl p-5 border space-y-3"
                style={{ borderColor: 'rgba(139,92,246,0.15)', background: 'rgba(245,243,255,0.7)' }}
              >
                <p className="text-sm font-bold" style={{ color: '#4c1d95' }}>Answer Distribution</p>
                {todayChallenge.choices.map((choice, i) => {
                  const pct = totalVotes > 0 ? Math.round((voteCounts[i] / totalVotes) * 100) : 0;
                  const isCorrect = i === todayChallenge.correct;
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5" style={{ color: isCorrect ? '#059669' : '#6b7280' }}>
                          <span className="font-bold">{CHOICE_LABELS[i]}.</span>
                          <span className="truncate max-w-[240px]">{choice}</span>
                          {isCorrect && <CheckCircle2 size={12} style={{ color: '#10b981', flexShrink: 0 }} />}
                        </span>
                        <span className="font-bold flex-shrink-0 ml-2"
                          style={{ color: isCorrect ? '#059669' : '#374151' }}>
                          {voteCounts[i]} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden"
                        style={{ background: 'rgba(139,92,246,0.1)' }}>
                        <div
                          className="h-2 rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: isCorrect ? '#10b981' : '#a78bfa',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Section breakdown */}
              {Object.keys(sectionMap).length > 1 && (
                <div
                  className="rounded-2xl p-5 border"
                  style={{ borderColor: 'rgba(139,92,246,0.15)', background: 'rgba(245,243,255,0.7)' }}
                >
                  <p className="text-sm font-bold mb-3" style={{ color: '#4c1d95' }}>By Section</p>
                  <div className="space-y-2">
                    {Object.entries(sectionMap).map(([sect, data]) => (
                      <div key={sect} className="flex items-center gap-3">
                        <span className="text-xs font-semibold w-20 flex-shrink-0" style={{ color: '#374151' }}>
                          {sect}
                        </span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden"
                          style={{ background: 'rgba(139,92,246,0.1)' }}>
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${Math.round((data.correct / data.total) * 100)}%`,
                              background: 'linear-gradient(90deg, #8b5cf6, #6d28d9)',
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold w-16 text-right flex-shrink-0" style={{ color: '#6b7280' }}>
                          {data.correct}/{data.total} ({Math.round((data.correct / data.total) * 100)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Leaderboard */}
              <div
                className="rounded-2xl overflow-hidden border"
                style={{ borderColor: 'rgba(139,92,246,0.18)' }}
              >
                <div
                  className="px-5 py-3 flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, rgba(245,243,255,0.95), rgba(237,233,254,0.8))' }}
                >
                  <Trophy size={16} style={{ color: '#7c3aed' }} />
                  <span className="text-sm font-bold" style={{ color: '#4c1d95' }}>
                    Leaderboard — Top 15
                  </span>
                  <span className="text-xs ml-auto" style={{ color: '#6b7280' }}>
                    Correct answers ranked by speed
                  </span>
                </div>
                <div className="divide-y" style={{ borderColor: 'rgba(139,92,246,0.08)' }}>
                  {leaderboard.map((r, idx) => {
                    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
                    return (
                      <div
                        key={r.id ?? idx}
                        className="px-5 py-2.5 flex items-center gap-3"
                        style={{ background: idx < 3 ? 'rgba(245,243,255,0.4)' : 'rgba(255,255,255,0.5)' }}
                      >
                        <span className="text-sm w-7 flex-shrink-0 text-center">{medal}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium truncate block" style={{ color: '#1e1b4b' }}>
                            {r.studentName}
                          </span>
                          <span className="text-xs" style={{ color: '#6b7280' }}>
                            {r.studentSection || '—'} · {r.studentCampus || '—'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {r.isCorrect
                            ? <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                            : <XCircle size={14} style={{ color: '#ef4444' }} />
                          }
                          <div className="flex items-center gap-1" style={{ color: '#6b7280' }}>
                            <Clock size={12} />
                            <span className="text-xs font-mono">{fmtTime(r.responseTimeMs)}</span>
                          </div>
                          <span
                            className="text-xs font-bold w-10 text-right"
                            style={{ color: r.isCorrect ? '#059669' : '#9ca3af' }}
                          >
                            {r.isCorrect ? `+${r.pointsEarned}` : '0'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {leaderboard.length === 0 && (
                    <div className="px-5 py-8 text-center">
                      <Users size={24} style={{ color: '#d1d5db', margin: '0 auto 8px' }} />
                      <p className="text-sm" style={{ color: '#9ca3af' }}>
                        No responses yet — students are still answering
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
