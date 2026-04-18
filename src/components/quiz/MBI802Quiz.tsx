import { useState } from 'react';
import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import {
  CheckCircle2,
  XCircle,
  ChevronUp,
  ChevronDown,
  BookOpen,
  Trophy,
  RotateCcw,
  Send,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { StudentProfile } from '../../lib/types';
import {
  QUIZ_QUESTIONS,
  QUIZ_CATEGORIES,
  MBI802_QUIZ_ID,
  MBI802_QUIZ_TITLE,
  MBI802_QUIZ_PASS_PERCENTAGE,
} from '../../lib/mbi802QuizData';

interface Props {
  studentProfile: StudentProfile | null;
}

type QuizPhase = 'intro' | 'taking' | 'result';

const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

export default function MBI802Quiz({ studentProfile }: Props) {
  const { user } = useAuth();

  const [phase, setPhase] = useState<QuizPhase>('intro');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(QUIZ_CATEGORIES.map((c) => [c, true]))
  );

  const answered = Object.keys(answers).length;
  const total = QUIZ_QUESTIONS.length;
  const progressPct = Math.round((answered / total) * 100);

  function selectAnswer(questionId: string, choiceIdx: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceIdx }));
  }

  function toggleCategory(cat: string) {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    const correct = QUIZ_QUESTIONS.filter(
      (q) => answers[q.id] === q.correct
    ).length;
    setScore(correct);

    try {
      await addDoc(collection(db, 'mbi802QuizResults'), {
        quizId: MBI802_QUIZ_ID,
        studentUid: user?.uid ?? '',
        studentName: studentProfile?.fullName ?? user?.email ?? 'Unknown',
        studentDisplayId: studentProfile?.studentId ?? '',
        studentSection: studentProfile?.section ?? '',
        studentCampus: studentProfile?.campus ?? '',
        score: correct,
        total,
        percentage: Math.round((correct / total) * 100),
        completedAt: serverTimestamp(),
      });
    } catch {
      // silently continue — result still shown locally
    }

    setPhase('result');
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleRetake() {
    setAnswers({});
    setScore(0);
    setShowReview(false);
    setExpandedCategories(Object.fromEntries(QUIZ_CATEGORIES.map((c) => [c, true])));
    setPhase('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Intro screen ─────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="space-y-4">
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: 'linear-gradient(135deg, rgba(245,243,255,0.95), rgba(237,233,254,0.85))',
            borderColor: 'rgba(139,92,246,0.25)',
          }}
        >
          <div className="flex items-start gap-3">
            <BookOpen size={22} style={{ color: '#7c3aed', flexShrink: 0, marginTop: 2 }} />
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: '#4c1d95' }}>
                {MBI802_QUIZ_TITLE}
              </p>
              <p className="text-xs mt-1 leading-5" style={{ color: '#5b21b6' }}>
                {total} multiple-choice questions across four topic areas. No time limit — take your
                time and think carefully. You may retake as many times as you like.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {QUIZ_CATEGORIES.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                    style={{ background: 'rgba(167,139,250,0.2)', color: '#6d28d9' }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setPhase('taking')}
                className="btn-primary mt-4 text-sm px-5 py-2"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Result screen ────────────────────────────────────────────────────────────
  if (phase === 'result') {
    const pct = Math.round((score / total) * 100);
    const passed = pct >= MBI802_QUIZ_PASS_PERCENTAGE;

    return (
      <div className="space-y-5">
        {/* Score card */}
        <div
          className="rounded-2xl p-6 border text-center"
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
            {pct}% — {passed ? 'Great work!' : 'Keep studying!'}
          </p>

          {/* Category breakdown */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-left">
            {QUIZ_CATEGORIES.map((cat) => {
              const qs = QUIZ_QUESTIONS.filter((q) => q.category === cat);
              const catCorrect = qs.filter((q) => answers[q.id] === q.correct).length;
              const catPct = Math.round((catCorrect / qs.length) * 100);
              return (
                <div
                  key={cat}
                  className="rounded-xl px-3 py-2"
                  style={{ background: 'rgba(255,255,255,0.55)' }}
                >
                  <p className="text-xs font-semibold" style={{ color: '#374151' }}>{cat}</p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: '#1e1b4b' }}>
                    {catCorrect}/{qs.length}{' '}
                    <span className="text-xs font-normal" style={{ color: '#6b7280' }}>
                      ({catPct}%)
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setShowReview((v) => !v)}
            className="btn-secondary text-sm px-4 py-2 flex items-center gap-1.5"
          >
            {showReview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showReview ? 'Hide Review' : 'Review Answers'}
          </button>
          <button
            onClick={handleRetake}
            className="btn-secondary text-sm px-4 py-2 flex items-center gap-1.5"
          >
            <RotateCcw size={16} /> Retake Quiz
          </button>
        </div>

        {/* Answer review */}
        {showReview && (
          <div className="space-y-4">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const selected = answers[q.id] ?? -1;
              const isCorrect = selected === q.correct;
              return (
                <div
                  key={q.id}
                  className="rounded-2xl p-4 border"
                  style={{
                    background: isCorrect
                      ? 'rgba(209,250,229,0.5)'
                      : 'rgba(254,226,226,0.5)',
                    borderColor: isCorrect
                      ? 'rgba(16,185,129,0.2)'
                      : 'rgba(239,68,68,0.2)',
                  }}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0, marginTop: 2 }} />
                    ) : (
                      <XCircle size={18} style={{ color: '#dc2626', flexShrink: 0, marginTop: 2 }} />
                    )}
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
                            <div
                              key={ci}
                              className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-2"
                              style={{ background: bg, color }}
                            >
                              <span className="font-bold">{CHOICE_LABELS[ci]}.</span> {choice}
                              {isAnswer && (
                                <CheckCircle2 size={13} style={{ marginLeft: 'auto', color: '#059669' }} />
                              )}
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

  // ── Quiz taking screen ───────────────────────────────────────────────────────
  const unanswered = total - answered;

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div
        className="rounded-2xl p-4 border sticky top-0 z-10"
        style={{
          background: 'rgba(245,243,255,0.97)',
          borderColor: 'rgba(139,92,246,0.2)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold" style={{ color: '#5b21b6' }}>
            {answered} of {total} answered
          </p>
          <p className="text-xs font-semibold" style={{ color: '#5b21b6' }}>
            {progressPct}%
          </p>
        </div>
        <div className="w-full rounded-full h-2" style={{ background: 'rgba(167,139,250,0.25)' }}>
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #8b5cf6, #6d28d9)' }}
          />
        </div>
      </div>

      {/* Questions grouped by category */}
      {QUIZ_CATEGORIES.map((cat) => {
        const qs = QUIZ_QUESTIONS.filter((q) => q.category === cat);
        const catAnswered = qs.filter((q) => answers[q.id] !== undefined).length;
        const isOpen = expandedCategories[cat];
        return (
          <div key={cat} className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(139,92,246,0.18)' }}>
            <button
              onClick={() => toggleCategory(cat)}
              className="w-full flex items-center justify-between px-4 py-3"
              style={{ background: 'linear-gradient(135deg, rgba(245,243,255,0.9), rgba(237,233,254,0.8))' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: '#4c1d95' }}>{cat}</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: catAnswered === qs.length ? 'rgba(209,250,229,0.8)' : 'rgba(167,139,250,0.2)',
                    color: catAnswered === qs.length ? '#065f46' : '#6d28d9',
                  }}
                >
                  {catAnswered}/{qs.length}
                </span>
              </div>
              {isOpen ? (
                <ChevronUp size={16} style={{ color: '#7c3aed' }} />
              ) : (
                <ChevronDown size={16} style={{ color: '#7c3aed' }} />
              )}
            </button>

            {isOpen && (
              <div className="divide-y" style={{ borderColor: 'rgba(139,92,246,0.1)' }}>
                {qs.map((q, localIdx) => {
                  const globalIdx = QUIZ_QUESTIONS.indexOf(q);
                  const selected = answers[q.id] ?? -1;
                  return (
                    <div key={q.id} className="p-4" style={{ background: 'rgba(255,255,255,0.6)' }}>
                      <p className="text-xs font-semibold mb-2" style={{ color: '#9ca3af' }}>
                        Question {globalIdx + 1}
                        {localIdx + 1 !== globalIdx + 1 ? '' : ''}
                      </p>
                      <p className="text-sm font-medium leading-6" style={{ color: '#1e1b4b' }}>
                        {q.question}
                      </p>
                      <div className="mt-3 space-y-2">
                        {q.choices.map((choice, ci) => {
                          const isSelected = ci === selected;
                          return (
                            <button
                              key={ci}
                              onClick={() => selectAnswer(q.id, ci)}
                              className="w-full text-left text-sm rounded-xl px-3 py-2.5 border transition-all flex items-start gap-2"
                              style={{
                                borderColor: isSelected ? '#7c3aed' : 'rgba(139,92,246,0.18)',
                                background: isSelected
                                  ? 'linear-gradient(135deg, rgba(237,233,254,0.95), rgba(221,214,254,0.8))'
                                  : 'rgba(255,255,255,0.5)',
                                color: isSelected ? '#4c1d95' : '#374151',
                                fontWeight: isSelected ? 600 : 400,
                              }}
                            >
                              <span
                                className="flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center mt-0.5"
                                style={{
                                  background: isSelected ? '#7c3aed' : 'rgba(139,92,246,0.12)',
                                  color: isSelected ? '#fff' : '#7c3aed',
                                }}
                              >
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
      <div
        className="rounded-2xl p-4 border"
        style={{
          background: 'linear-gradient(135deg, rgba(245,243,255,0.95), rgba(237,233,254,0.85))',
          borderColor: 'rgba(139,92,246,0.2)',
        }}
      >
        {unanswered > 0 && (
          <p className="text-xs mb-3" style={{ color: '#92400e', background: 'rgba(254,243,199,0.8)', borderRadius: 8, padding: '6px 10px' }}>
            You have {unanswered} unanswered question{unanswered > 1 ? 's' : ''}. You can still submit, but unanswered questions will count as incorrect.
          </p>
        )}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3"
        >
          {submitting ? (
            <>
              <div
                className="w-4 h-4 rounded-full border-2 animate-spin"
                style={{ borderColor: '#fff3', borderTopColor: '#fff' }}
              />
              Submitting…
            </>
          ) : (
            <>
              <Send size={16} /> Submit Quiz
            </>
          )}
        </button>
      </div>
    </div>
  );
}
