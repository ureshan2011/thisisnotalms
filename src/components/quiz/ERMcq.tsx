import { useEffect, useState } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import {
  BookOpen, Trophy, Send, RotateCcw, CheckCircle2, XCircle,
  ChevronUp, ChevronDown, Lock, Star,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { StudentProfile } from '../../lib/types';
import {
  ER_MCQ_QUESTIONS,
  ER_MCQ_CATEGORIES,
  ER_MCQ_QUIZ_TITLE,
  ER_MCQ_PASS_PERCENTAGE,
  ER_MCQ_DISTINCTION_PERCENTAGE,
  ER_MCQ_MAX_ATTEMPTS,
  ER_MCQ_COLLECTION,
} from '../../lib/erMcqData';

interface Props {
  studentProfile: StudentProfile | null;
  onPassStatusChange?: (passed: boolean) => void;
}

type Phase = 'loading' | 'intro' | 'taking' | 'result' | 'exhausted';

const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

interface AttemptRecord {
  score: number;
  total: number;
  percentage: number;
  completedAt: Date;
}

export default function ERMcq({ studentProfile, onPassStatusChange }: Props) {
  const { user } = useAuth();

  const [phase, setPhase] = useState<Phase>('loading');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [pastAttempts, setPastAttempts] = useState<AttemptRecord[]>([]);
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(ER_MCQ_CATEGORIES.map((c) => [c, true]))
  );

  const total = ER_MCQ_QUESTIONS.length;
  const answered = Object.keys(answers).length;
  const progressPct = Math.round((answered / total) * 100);
  const attemptCount = pastAttempts.length;
  const bestPct = pastAttempts.length > 0
    ? Math.max(...pastAttempts.map((a) => a.percentage))
    : 0;

  // Load existing attempts on mount
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, ER_MCQ_COLLECTION, user.uid));
        if (snap.exists()) {
          const data = snap.data();
          const attempts: AttemptRecord[] = (data.attempts ?? []).map((a: any) => ({
            ...a,
            completedAt: a.completedAt?.toDate?.() ?? new Date(),
          }));
          setPastAttempts(attempts);
          setBadgeEarned(data.badgeEarned ?? false);
          const passed = (data.bestPercentage ?? 0) > ER_MCQ_PASS_PERCENTAGE;
          onPassStatusChange?.(passed);
          if (attempts.length >= ER_MCQ_MAX_ATTEMPTS) {
            setPhase('exhausted');
          } else {
            setPhase('intro');
          }
        } else {
          setPhase('intro');
        }
      } catch {
        setPhase('intro');
      }
    })();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  function selectAnswer(questionId: string, choiceIdx: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceIdx }));
  }

  function toggleCategory(cat: string) {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  async function handleSubmit() {
    if (!user) return;
    setSubmitting(true);

    const correct = ER_MCQ_QUESTIONS.filter((q) => answers[q.id] === q.correct).length;
    const pct = Math.round((correct / total) * 100);
    setScore(correct);

    const isFirstAttempt = attemptCount === 0;
    const earnedBadge = isFirstAttempt && pct >= ER_MCQ_DISTINCTION_PERCENTAGE;
    const newAttempt = { score: correct, total, percentage: pct, completedAt: new Date() };
    const updatedAttempts = [...pastAttempts, newAttempt];
    const newBest = Math.max(bestPct, pct);
    const passed = newBest > ER_MCQ_PASS_PERCENTAGE;

    try {
      const ref = doc(db, ER_MCQ_COLLECTION, user.uid);
      if (attemptCount === 0) {
        // First attempt — create document
        await setDoc(ref, {
          studentUid: user.uid,
          studentName: studentProfile?.fullName ?? user.email ?? 'Unknown',
          studentDisplayId: studentProfile?.studentId ?? '',
          studentSection: studentProfile?.section ?? '',
          studentCampus: studentProfile?.campus ?? '',
          attempts: [{ score: correct, total, percentage: pct, completedAt: new Date() }],
          bestPercentage: pct,
          badgeEarned: earnedBadge,
          passed,
          attemptCount: 1,
          firstAttemptAt: serverTimestamp(),
          lastAttemptAt: serverTimestamp(),
        });
      } else {
        // Subsequent attempt — merge
        await updateDoc(ref, {
          attempts: arrayUnion({ score: correct, total, percentage: pct, completedAt: new Date() }),
          bestPercentage: newBest,
          passed,
          attemptCount: updatedAttempts.length,
          lastAttemptAt: serverTimestamp(),
        });
      }

      // Write badge to student profile so sidebar/list can display it cheaply
      if (earnedBadge) {
        await setDoc(
          doc(db, 'students', user.uid),
          { erMcqBadge: true },
          { merge: true }
        );
        setBadgeEarned(true);
      }

      onPassStatusChange?.(passed);
    } catch {
      // silently continue — score still shown locally
    }

    setPastAttempts(updatedAttempts);
    setPhase('result');
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleRetake() {
    setAnswers({});
    setScore(0);
    setShowReview(false);
    setExpandedCategories(Object.fromEntries(ER_MCQ_CATEGORIES.map((c) => [c, true])));
    setPhase('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 rounded-full border-2 animate-spin"
          style={{ borderColor: 'rgba(99,102,241,0.2)', borderTopColor: '#6366f1' }} />
      </div>
    );
  }

  // ── Exhausted (max attempts reached) ─────────────────────────────────────
  if (phase === 'exhausted') {
    const best = pastAttempts.reduce((b, a) => (a.percentage > b.percentage ? a : b), pastAttempts[0]);
    const passed = best.percentage > ER_MCQ_PASS_PERCENTAGE;
    return (
      <div className="space-y-4">
        <div className="rounded-2xl p-5 border text-center"
          style={{
            background: passed
              ? 'linear-gradient(135deg, rgba(209,250,229,0.9), rgba(167,243,208,0.7))'
              : 'linear-gradient(135deg, rgba(254,226,226,0.9), rgba(254,202,202,0.7))',
            borderColor: passed ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)',
          }}
        >
          {badgeEarned && (
            <div className="flex justify-center mb-3">
              <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(251,191,36,0.2)', color: '#b45309', border: '1px solid rgba(251,191,36,0.4)' }}>
                <Star size={14} className="fill-amber-500 text-amber-500 stroke-0" /> ER Distinction Badge Earned
              </span>
            </div>
          )}
          <Lock size={28} style={{ color: passed ? '#059669' : '#dc2626', margin: '0 auto 8px' }} />
          <p className="text-lg font-bold" style={{ color: passed ? '#065f46' : '#991b1b' }}>
            {ER_MCQ_MAX_ATTEMPTS} attempts used
          </p>
          <p className="text-sm mt-1" style={{ color: passed ? '#047857' : '#b91c1c' }}>
            Best score: <strong>{best.percentage}%</strong> ({best.score}/{best.total})
          </p>
          <p className="text-xs mt-2" style={{ color: '#6b7280' }}>
            {passed
              ? 'You have passed this checkpoint. The remaining lessons are unlocked.'
              : `You need more than ${ER_MCQ_PASS_PERCENTAGE}% to unlock the next lessons.`}
          </p>
        </div>

        <AttemptHistory attempts={pastAttempts} />
      </div>
    );
  }

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    const attemptsLeft = ER_MCQ_MAX_ATTEMPTS - attemptCount;
    return (
      <div className="space-y-4">
        {badgeEarned && (
          <div className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.35)' }}>
            <Star size={16} className="fill-amber-500 text-amber-500 stroke-0 shrink-0" />
            <p className="text-xs font-semibold" style={{ color: '#b45309' }}>
              You earned the ER Distinction Badge on your first attempt!
            </p>
          </div>
        )}

        {pastAttempts.length > 0 && (
          <AttemptHistory attempts={pastAttempts} />
        )}

        <div className="rounded-2xl p-5 border"
          style={{
            background: 'linear-gradient(135deg, rgba(238,242,255,0.95), rgba(224,231,255,0.85))',
            borderColor: 'rgba(99,102,241,0.25)',
          }}
        >
          <div className="flex items-start gap-3">
            <BookOpen size={22} style={{ color: '#4f46e5', flexShrink: 0, marginTop: 2 }} />
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: '#312e81' }}>{ER_MCQ_QUIZ_TITLE}</p>
              <p className="text-xs mt-1 leading-5" style={{ color: '#4338ca' }}>
                {total} multiple-choice questions across {ER_MCQ_CATEGORIES.length} topic areas.
                Score above {ER_MCQ_PASS_PERCENTAGE}% to unlock the remaining lessons.
                Score {ER_MCQ_DISTINCTION_PERCENTAGE}%+ on your <strong>first attempt</strong> to earn a special badge.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {ER_MCQ_CATEGORIES.map((cat) => (
                  <span key={cat}
                    className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                    style={{ background: 'rgba(129,140,248,0.2)', color: '#4338ca' }}>
                    {cat}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                <button onClick={() => setPhase('taking')} className="btn-primary text-sm px-5 py-2">
                  {attemptCount === 0 ? 'Start Quiz' : `Retake (Attempt ${attemptCount + 1}/${ER_MCQ_MAX_ATTEMPTS})`}
                </button>
                <span className="text-xs" style={{ color: '#6b7280' }}>
                  {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Result ────────────────────────────────────────────────────────────────
  if (phase === 'result') {
    const pct = Math.round((score / total) * 100);
    const passed = pct > ER_MCQ_PASS_PERCENTAGE;
    const earnedBadgeThisAttempt = attemptCount === 1 && pct >= ER_MCQ_DISTINCTION_PERCENTAGE;
    const attemptsLeft = ER_MCQ_MAX_ATTEMPTS - pastAttempts.length;

    return (
      <div className="space-y-5">
        {/* Badge celebration */}
        {earnedBadgeThisAttempt && (
          <div className="rounded-2xl px-5 py-4 text-center border"
            style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.08))', borderColor: 'rgba(251,191,36,0.4)' }}>
            <Star size={32} className="fill-amber-500 text-amber-500 stroke-0 mx-auto mb-2" />
            <p className="text-sm font-bold" style={{ color: '#92400e' }}>ER Distinction Badge Earned!</p>
            <p className="text-xs mt-1" style={{ color: '#b45309' }}>
              You scored {pct}% on your first attempt — outstanding! A badge has been added to your profile.
            </p>
          </div>
        )}

        {/* Score card */}
        <div className="rounded-2xl p-6 border text-center"
          style={{
            background: passed
              ? 'linear-gradient(135deg, rgba(209,250,229,0.9), rgba(167,243,208,0.7))'
              : 'linear-gradient(135deg, rgba(254,226,226,0.9), rgba(254,202,202,0.7))',
            borderColor: passed ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)',
          }}
        >
          <Trophy size={36} style={{ color: passed ? '#059669' : '#dc2626', margin: '0 auto 8px' }} />
          <p className="text-3xl font-extrabold" style={{ color: passed ? '#065f46' : '#991b1b' }}>
            {score} / {total}
          </p>
          <p className="text-lg font-semibold mt-1" style={{ color: passed ? '#047857' : '#b91c1c' }}>
            {pct}% — {passed ? 'Passed! Next lessons unlocked.' : `Need >${ER_MCQ_PASS_PERCENTAGE}% to unlock next lessons.`}
          </p>

          {/* Category breakdown */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
            {ER_MCQ_CATEGORIES.map((cat) => {
              const qs = ER_MCQ_QUESTIONS.filter((q) => q.category === cat);
              const catCorrect = qs.filter((q) => answers[q.id] === q.correct).length;
              const catPct = Math.round((catCorrect / qs.length) * 100);
              return (
                <div key={cat} className="rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.55)' }}>
                  <p className="text-xs font-semibold" style={{ color: '#374151' }}>{cat}</p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: '#1e1b4b' }}>
                    {catCorrect}/{qs.length}{' '}
                    <span className="text-xs font-normal" style={{ color: '#6b7280' }}>({catPct}%)</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => setShowReview((v) => !v)}
            className="btn-secondary text-sm px-4 py-2 flex items-center gap-1.5">
            {showReview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showReview ? 'Hide Review' : 'Review Answers'}
          </button>
          {attemptsLeft > 0 && (
            <button onClick={handleRetake}
              className="btn-secondary text-sm px-4 py-2 flex items-center gap-1.5">
              <RotateCcw size={16} />
              Retake ({attemptsLeft} left)
            </button>
          )}
        </div>

        {/* Answer review */}
        {showReview && (
          <div className="space-y-4">
            {ER_MCQ_QUESTIONS.map((q, idx) => {
              const selected = answers[q.id] ?? -1;
              const isCorrect = selected === q.correct;
              return (
                <div key={q.id} className="rounded-2xl p-4 border"
                  style={{
                    background: isCorrect ? 'rgba(209,250,229,0.5)' : 'rgba(254,226,226,0.5)',
                    borderColor: isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                  }}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect
                      ? <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0, marginTop: 2 }} />
                      : <XCircle size={18} style={{ color: '#dc2626', flexShrink: 0, marginTop: 2 }} />}
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#6b7280' }}>
                        Q{idx + 1} · {q.category}
                      </p>
                      <p className="text-sm font-medium" style={{ color: '#1e1b4b' }}>{q.question}</p>
                      <div className="mt-2 space-y-1">
                        {q.choices.map((choice, ci) => {
                          const isSelected = ci === selected;
                          const isAnswer = ci === q.correct;
                          let bg = 'transparent';
                          let color = '#4b5563';
                          if (isAnswer) { bg = 'rgba(209,250,229,0.8)'; color = '#065f46'; }
                          else if (isSelected && !isCorrect) { bg = 'rgba(254,202,202,0.8)'; color = '#991b1b'; }
                          return (
                            <div key={ci}
                              className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-2"
                              style={{ background: bg, color }}>
                              <span className="font-bold">{CHOICE_LABELS[ci]}.</span> {choice}
                              {isAnswer && <CheckCircle2 size={13} style={{ marginLeft: 'auto', color: '#059669' }} />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── Quiz taking ───────────────────────────────────────────────────────────
  const unanswered = total - answered;

  return (
    <div className="space-y-5">
      {/* Sticky progress bar */}
      <div className="rounded-2xl p-4 border sticky top-0 z-10"
        style={{
          background: 'rgba(238,242,255,0.97)',
          borderColor: 'rgba(99,102,241,0.2)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold" style={{ color: '#4338ca' }}>
            {answered} of {total} answered · Attempt {attemptCount + 1}/{ER_MCQ_MAX_ATTEMPTS}
          </p>
          <p className="text-xs font-semibold" style={{ color: '#4338ca' }}>{progressPct}%</p>
        </div>
        <div className="w-full rounded-full h-2" style={{ background: 'rgba(129,140,248,0.25)' }}>
          <div className="h-2 rounded-full transition-all"
            style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #818cf8, #4f46e5)' }} />
        </div>
      </div>

      {/* Questions by category */}
      {ER_MCQ_CATEGORIES.map((cat) => {
        const qs = ER_MCQ_QUESTIONS.filter((q) => q.category === cat);
        const catAnswered = qs.filter((q) => answers[q.id] !== undefined).length;
        const isOpen = expandedCategories[cat];
        return (
          <div key={cat} className="rounded-2xl border overflow-hidden"
            style={{ borderColor: 'rgba(99,102,241,0.18)' }}>
            <button onClick={() => toggleCategory(cat)}
              className="w-full flex items-center justify-between px-4 py-3"
              style={{ background: 'linear-gradient(135deg, rgba(238,242,255,0.9), rgba(224,231,255,0.8))' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: '#312e81' }}>{cat}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: catAnswered === qs.length ? 'rgba(209,250,229,0.8)' : 'rgba(129,140,248,0.2)',
                    color: catAnswered === qs.length ? '#065f46' : '#4338ca',
                  }}>
                  {catAnswered}/{qs.length}
                </span>
              </div>
              {isOpen ? <ChevronUp size={16} style={{ color: '#6366f1' }} /> : <ChevronDown size={16} style={{ color: '#6366f1' }} />}
            </button>

            {isOpen && (
              <div className="divide-y" style={{ borderColor: 'rgba(99,102,241,0.1)' }}>
                {qs.map((q) => {
                  const globalIdx = ER_MCQ_QUESTIONS.indexOf(q);
                  const selected = answers[q.id] ?? -1;
                  return (
                    <div key={q.id} className="p-4" style={{ background: 'rgba(255,255,255,0.6)' }}>
                      <p className="text-xs font-semibold mb-2" style={{ color: '#9ca3af' }}>
                        Question {globalIdx + 1}
                      </p>
                      <p className="text-sm font-medium leading-6" style={{ color: '#1e1b4b' }}>{q.question}</p>
                      <div className="mt-3 space-y-2">
                        {q.choices.map((choice, ci) => {
                          const isSelected = ci === selected;
                          return (
                            <button key={ci} onClick={() => selectAnswer(q.id, ci)}
                              className="w-full text-left text-sm rounded-xl px-3 py-2.5 border transition-all flex items-start gap-2"
                              style={{
                                borderColor: isSelected ? '#6366f1' : 'rgba(99,102,241,0.18)',
                                background: isSelected
                                  ? 'linear-gradient(135deg, rgba(224,231,255,0.95), rgba(199,210,254,0.8))'
                                  : 'rgba(255,255,255,0.5)',
                                color: isSelected ? '#312e81' : '#374151',
                                fontWeight: isSelected ? 600 : 400,
                              }}
                            >
                              <span className="flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center mt-0.5"
                                style={{
                                  background: isSelected ? '#6366f1' : 'rgba(99,102,241,0.12)',
                                  color: isSelected ? '#fff' : '#6366f1',
                                }}>
                                {CHOICE_LABELS[ci]}
                              </span>
                              <span className="leading-5">{choice}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Submit */}
      <div className="rounded-2xl p-4 border"
        style={{
          background: 'linear-gradient(135deg, rgba(238,242,255,0.95), rgba(224,231,255,0.85))',
          borderColor: 'rgba(99,102,241,0.2)',
        }}
      >
        {unanswered > 0 && (
          <p className="text-xs mb-3"
            style={{ color: '#92400e', background: 'rgba(254,243,199,0.8)', borderRadius: 8, padding: '6px 10px' }}>
            {unanswered} unanswered question{unanswered > 1 ? 's' : ''} — these will count as incorrect.
          </p>
        )}
        <button onClick={handleSubmit} disabled={submitting}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3">
          {submitting ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 animate-spin"
                style={{ borderColor: '#fff3', borderTopColor: '#fff' }} />
              Submitting…
            </>
          ) : (
            <><Send size={16} /> Submit Quiz</>
          )}
        </button>
      </div>
    </div>
  );
}

function AttemptHistory({ attempts }: { attempts: AttemptRecord[] }) {
  if (attempts.length === 0) return null;
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(99,102,241,0.15)' }}>
      <div className="px-4 py-3"
        style={{ background: 'linear-gradient(135deg, rgba(238,242,255,0.9), rgba(224,231,255,0.8))' }}>
        <p className="text-xs font-bold" style={{ color: '#312e81' }}>Your Previous Attempts</p>
      </div>
      <div className="divide-y" style={{ borderColor: 'rgba(99,102,241,0.08)' }}>
        {attempts.map((a, i) => {
          const passed = a.percentage > ER_MCQ_PASS_PERCENTAGE;
          return (
            <div key={i} className="flex items-center justify-between px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.6)' }}>
              <p className="text-xs font-semibold" style={{ color: '#6b7280' }}>Attempt {i + 1}</p>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{
                  background: passed ? 'rgba(209,250,229,0.8)' : 'rgba(254,226,226,0.8)',
                  color: passed ? '#065f46' : '#991b1b',
                }}>
                {a.score}/{a.total} ({a.percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
