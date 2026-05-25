import { useEffect, useRef, useState } from 'react';
import {
  doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp,
} from 'firebase/firestore';
import {
  BookOpen, Trophy, Send, RotateCcw, CheckCircle2, XCircle,
  ChevronUp, ChevronDown, Lock, Clock, Award, Share2,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { StudentProfile } from '../../lib/types';
import {
  SQL_EXAM_QUESTIONS, SQL_EXAM_CATEGORIES, SQL_EXAM_TITLE,
  SQL_EXAM_PASS_PERCENTAGE, SQL_EXAM_MAX_ATTEMPTS,
  SQL_EXAM_DURATION_MINUTES, SQL_EXAM_COLLECTION,
  SQL_EXAM_CERTIFICATES_COLLECTION,
} from '../../lib/sqlExamData';
import SQLExamCertificate from './SQLExamCertificate';

interface Props {
  studentProfile: StudentProfile | null;
}

type Phase = 'loading' | 'intro' | 'taking' | 'result' | 'certificate' | 'exhausted';

const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

interface AttemptRecord {
  score: number;
  total: number;
  percentage: number;
  completedAt: Date;
  certificateId?: string;
}

function generateCertId(uid: string): string {
  return `YOOSQL-${uid.slice(0, 6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function SQLBasicExam({ studentProfile }: Props) {
  const { user } = useAuth();

  const [phase, setPhase] = useState<Phase>('loading');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [pastAttempts, setPastAttempts] = useState<AttemptRecord[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(SQL_EXAM_CATEGORIES.map((c) => [c, true]))
  );
  const [timeLeft, setTimeLeft] = useState(SQL_EXAM_DURATION_MINUTES * 60);
  const [certId, setCertId] = useState<string | null>(null);
  const [showCert, setShowCert] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = SQL_EXAM_QUESTIONS.length;
  const answered = Object.keys(answers).length;
  const progressPct = Math.round((answered / total) * 100);
  const attemptCount = pastAttempts.length;
  const bestPct = pastAttempts.length > 0
    ? Math.max(...pastAttempts.map((a) => a.percentage))
    : 0;
  const existingCertId = pastAttempts.find((a) => a.certificateId)?.certificateId ?? null;

  // Load existing attempts
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, SQL_EXAM_COLLECTION, user.uid));
        if (snap.exists()) {
          const data = snap.data();
          const attempts: AttemptRecord[] = (data.attempts ?? []).map((a: any) => ({
            ...a,
            completedAt: a.completedAt?.toDate?.() ?? new Date(),
          }));
          setPastAttempts(attempts);
          const existCert = attempts.find((a) => a.certificateId)?.certificateId ?? null;
          setCertId(existCert);
          if (attempts.length >= SQL_EXAM_MAX_ATTEMPTS) {
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

  // Countdown timer when taking
  useEffect(() => {
    if (phase !== 'taking') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setTimeLeft(SQL_EXAM_DURATION_MINUTES * 60);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  function selectAnswer(questionId: string, choiceIdx: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceIdx }));
  }

  function toggleCategory(cat: string) {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  async function handleSubmit() {
    if (!user) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitting(true);

    const correct = SQL_EXAM_QUESTIONS.filter((q) => answers[q.id] === q.correct).length;
    const pct = Math.round((correct / total) * 100);
    setScore(correct);

    const passed = pct >= SQL_EXAM_PASS_PERCENTAGE;
    const newCertId = passed && !existingCertId ? generateCertId(user.uid) : null;
    const newAttempt: AttemptRecord = {
      score: correct, total, percentage: pct, completedAt: new Date(),
      ...(newCertId ? { certificateId: newCertId } : {}),
    };
    const updatedAttempts = [...pastAttempts, newAttempt];
    const newBest = Math.max(bestPct, pct);

    try {
      const ref = doc(db, SQL_EXAM_COLLECTION, user.uid);
      if (attemptCount === 0) {
        await setDoc(ref, {
          studentUid: user.uid,
          studentName: studentProfile?.fullName ?? user.email ?? 'Unknown',
          studentDisplayId: studentProfile?.studentId ?? '',
          studentSection: studentProfile?.section ?? '',
          studentCampus: studentProfile?.campus ?? '',
          attempts: [{
            score: correct, total, percentage: pct,
            completedAt: new Date(),
            ...(newCertId ? { certificateId: newCertId } : {}),
          }],
          bestPercentage: pct,
          passed,
          certificateId: newCertId ?? null,
          attemptCount: 1,
          firstAttemptAt: serverTimestamp(),
          lastAttemptAt: serverTimestamp(),
        });
      } else {
        await updateDoc(ref, {
          attempts: arrayUnion({
            score: correct, total, percentage: pct,
            completedAt: new Date(),
            ...(newCertId ? { certificateId: newCertId } : {}),
          }),
          bestPercentage: newBest,
          passed: newBest >= SQL_EXAM_PASS_PERCENTAGE,
          ...(newCertId ? { certificateId: newCertId } : {}),
          attemptCount: updatedAttempts.length,
          lastAttemptAt: serverTimestamp(),
        });
      }

      // Write public certificate document (readable without auth for shareable link)
      if (newCertId) {
        await setDoc(doc(db, SQL_EXAM_CERTIFICATES_COLLECTION, newCertId), {
          certId: newCertId,
          studentName: studentProfile?.fullName ?? user.email ?? 'Unknown',
          studentDisplayId: studentProfile?.studentId ?? '',
          campus: studentProfile?.campus ?? '',
          score: correct,
          total,
          percentage: pct,
          issuedAt: serverTimestamp(),
        });
        // Also save certId to student profile for quick lookup
        await setDoc(doc(db, 'students', user.uid), { sqlExamCertificateId: newCertId }, { merge: true });
        setCertId(newCertId);
      }
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
    setExpandedCategories(Object.fromEntries(SQL_EXAM_CATEGORIES.map((c) => [c, true])));
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

  // ── Certificate modal overlay ─────────────────────────────────────────────
  if (showCert && certId && studentProfile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <SQLExamCertificate
            certId={certId}
            studentName={studentProfile.fullName}
            studentDisplayId={studentProfile.studentId}
            score={score || pastAttempts.find((a) => a.certificateId)?.score || 0}
            total={total}
            percentage={score ? Math.round((score / total) * 100) : (pastAttempts.find((a) => a.certificateId)?.percentage ?? 0)}
            issuedAt={pastAttempts.find((a) => a.certificateId)?.completedAt ?? new Date()}
            onClose={() => setShowCert(false)}
          />
        </div>
      </div>
    );
  }

  // ── Exhausted ─────────────────────────────────────────────────────────────
  if (phase === 'exhausted') {
    const best = pastAttempts.reduce((b, a) => (a.percentage > b.percentage ? a : b), pastAttempts[0]);
    const passed = best.percentage >= SQL_EXAM_PASS_PERCENTAGE;
    return (
      <div className="space-y-4">
        {passed && existingCertId && studentProfile && (
          <CertificateBanner certId={existingCertId} onView={() => setShowCert(true)} />
        )}
        <div className="rounded-2xl p-5 border text-center"
          style={{
            background: passed
              ? 'linear-gradient(135deg,rgba(209,250,229,0.9),rgba(167,243,208,0.7))'
              : 'linear-gradient(135deg,rgba(254,226,226,0.9),rgba(254,202,202,0.7))',
            borderColor: passed ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)',
          }}
        >
          <Lock size={28} style={{ color: passed ? '#059669' : '#dc2626', margin: '0 auto 8px' }} />
          <p className="text-lg font-bold" style={{ color: passed ? '#065f46' : '#991b1b' }}>
            {SQL_EXAM_MAX_ATTEMPTS} attempts used
          </p>
          <p className="text-sm mt-1" style={{ color: passed ? '#047857' : '#b91c1c' }}>
            Best score: <strong>{best.percentage}%</strong> ({best.score}/{best.total})
          </p>
          <p className="text-xs mt-2" style={{ color: '#6b7280' }}>
            {passed
              ? 'You have passed and earned the SQL Fundamentals Certificate!'
              : `Need ${SQL_EXAM_PASS_PERCENTAGE}%+ to earn the certificate.`}
          </p>
        </div>
        <AttemptHistory attempts={pastAttempts} />
      </div>
    );
  }

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    const attemptsLeft = SQL_EXAM_MAX_ATTEMPTS - attemptCount;
    return (
      <div className="space-y-4">
        {existingCertId && studentProfile && (
          <CertificateBanner certId={existingCertId} onView={() => setShowCert(true)} />
        )}
        {pastAttempts.length > 0 && <AttemptHistory attempts={pastAttempts} />}

        <div className="rounded-2xl p-5 border"
          style={{
            background: 'linear-gradient(135deg,rgba(238,242,255,0.95),rgba(224,231,255,0.85))',
            borderColor: 'rgba(99,102,241,0.25)',
          }}
        >
          <div className="flex items-start gap-3">
            <BookOpen size={22} style={{ color: '#4f46e5', flexShrink: 0, marginTop: 2 }} />
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: '#312e81' }}>{SQL_EXAM_TITLE}</p>
              <p className="text-xs mt-1 leading-5" style={{ color: '#4338ca' }}>
                {total} multiple-choice questions across {SQL_EXAM_CATEGORIES.length} topic areas.
                Score <strong>{SQL_EXAM_PASS_PERCENTAGE}%+</strong> to earn your LinkedIn-shareable certificate.
                You have <strong>{SQL_EXAM_DURATION_MINUTES} minutes</strong>.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {SQL_EXAM_CATEGORIES.map((cat) => (
                  <span key={cat} className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                    style={{ background: 'rgba(129,140,248,0.2)', color: '#4338ca' }}>
                    {cat}
                  </span>
                ))}
              </div>
              {/* What you'll earn */}
              <div className="mt-4 rounded-xl p-3 flex items-start gap-2"
                style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.35)' }}>
                <Award size={16} style={{ color: '#b45309', flexShrink: 0, marginTop: 1 }} />
                <p className="text-xs" style={{ color: '#92400e' }}>
                  Passing earns a <strong>verifiable SQL Fundamentals Certificate</strong> you can
                  share directly on LinkedIn — complete with a public verification link.
                </p>
              </div>
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                <button onClick={() => setPhase('taking')} className="btn-primary text-sm px-5 py-2">
                  {attemptCount === 0 ? 'Start Exam' : `Retake (Attempt ${attemptCount + 1}/${SQL_EXAM_MAX_ATTEMPTS})`}
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
    const passed = pct >= SQL_EXAM_PASS_PERCENTAGE;
    const attemptsLeft = SQL_EXAM_MAX_ATTEMPTS - pastAttempts.length;

    return (
      <div className="space-y-5">
        {/* Certificate earned banner */}
        {passed && certId && studentProfile && (
          <CertificateBanner certId={certId} onView={() => setShowCert(true)} />
        )}

        {/* Score card */}
        <div className="rounded-2xl p-6 border text-center"
          style={{
            background: passed
              ? 'linear-gradient(135deg,rgba(209,250,229,0.9),rgba(167,243,208,0.7))'
              : 'linear-gradient(135deg,rgba(254,226,226,0.9),rgba(254,202,202,0.7))',
            borderColor: passed ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)',
          }}
        >
          <Trophy size={36} style={{ color: passed ? '#059669' : '#dc2626', margin: '0 auto 8px' }} />
          <p className="text-3xl font-extrabold" style={{ color: passed ? '#065f46' : '#991b1b' }}>
            {score} / {total}
          </p>
          <p className="text-lg font-semibold mt-1" style={{ color: passed ? '#047857' : '#b91c1c' }}>
            {pct}% — {passed ? 'Passed! Certificate earned.' : `Need ${SQL_EXAM_PASS_PERCENTAGE}%+ to earn the certificate.`}
          </p>

          {/* Category breakdown */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-left">
            {SQL_EXAM_CATEGORIES.map((cat) => {
              const qs = SQL_EXAM_QUESTIONS.filter((q) => q.category === cat);
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
          {attemptsLeft > 0 && !passed && (
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
            {SQL_EXAM_QUESTIONS.map((q, idx) => {
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
                      <p className="text-sm font-medium whitespace-pre-line" style={{ color: '#1e1b4b' }}>{q.question}</p>
                      <div className="mt-2 space-y-1">
                        {q.choices.map((choice, ci) => {
                          const isSelected = ci === selected;
                          const isAnswer = ci === q.correct;
                          let bg = 'transparent';
                          let color = '#4b5563';
                          if (isAnswer) { bg = 'rgba(209,250,229,0.8)'; color = '#065f46'; }
                          else if (isSelected && !isCorrect) { bg = 'rgba(254,202,202,0.8)'; color = '#991b1b'; }
                          return (
                            <div key={ci} className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-2"
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

  // ── Taking ────────────────────────────────────────────────────────────────
  const unanswered = total - answered;
  const timerWarning = timeLeft < 300; // < 5 min

  return (
    <div className="space-y-5">
      {/* Sticky progress + timer bar */}
      <div className="rounded-2xl p-4 border sticky top-0 z-10"
        style={{
          background: 'rgba(238,242,255,0.97)',
          borderColor: timerWarning ? 'rgba(239,68,68,0.35)' : 'rgba(99,102,241,0.2)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold" style={{ color: '#4338ca' }}>
            {answered} of {total} answered · Attempt {attemptCount + 1}/{SQL_EXAM_MAX_ATTEMPTS}
          </p>
          <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              background: timerWarning ? 'rgba(239,68,68,0.12)' : 'rgba(129,140,248,0.15)',
              color: timerWarning ? '#dc2626' : '#4338ca',
            }}>
            <Clock size={12} /> {formatTime(timeLeft)}
          </span>
        </div>
        <div className="w-full rounded-full h-2" style={{ background: 'rgba(129,140,248,0.25)' }}>
          <div className="h-2 rounded-full transition-all"
            style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg,#818cf8,#4f46e5)' }} />
        </div>
      </div>

      {/* Questions by category */}
      {SQL_EXAM_CATEGORIES.map((cat) => {
        const qs = SQL_EXAM_QUESTIONS.filter((q) => q.category === cat);
        const catAnswered = qs.filter((q) => answers[q.id] !== undefined).length;
        const isOpen = expandedCategories[cat];
        return (
          <div key={cat} className="rounded-2xl border overflow-hidden"
            style={{ borderColor: 'rgba(99,102,241,0.18)' }}>
            <button onClick={() => toggleCategory(cat)}
              className="w-full flex items-center justify-between px-4 py-3"
              style={{ background: 'linear-gradient(135deg,rgba(238,242,255,0.9),rgba(224,231,255,0.8))' }}
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
                  const globalIdx = SQL_EXAM_QUESTIONS.indexOf(q);
                  const selected = answers[q.id] ?? -1;
                  return (
                    <div key={q.id} className="p-4" style={{ background: 'rgba(255,255,255,0.6)' }}>
                      <p className="text-xs font-semibold mb-2" style={{ color: '#9ca3af' }}>
                        Question {globalIdx + 1}
                      </p>
                      <p className="text-sm font-medium leading-6 whitespace-pre-line" style={{ color: '#1e1b4b' }}>{q.question}</p>
                      <div className="mt-3 space-y-2">
                        {q.choices.map((choice, ci) => {
                          const isSelected = ci === selected;
                          return (
                            <button key={ci} onClick={() => selectAnswer(q.id, ci)}
                              className="w-full text-left text-sm rounded-xl px-3 py-2.5 border transition-all flex items-start gap-2"
                              style={{
                                borderColor: isSelected ? '#6366f1' : 'rgba(99,102,241,0.18)',
                                background: isSelected
                                  ? 'linear-gradient(135deg,rgba(224,231,255,0.95),rgba(199,210,254,0.8))'
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
          background: 'linear-gradient(135deg,rgba(238,242,255,0.95),rgba(224,231,255,0.85))',
          borderColor: 'rgba(99,102,241,0.2)',
        }}
      >
        {unanswered > 0 && (
          <p className="text-xs mb-3"
            style={{ color: '#92400e', background: 'rgba(254,243,199,0.8)', borderRadius: 8, padding: '6px 10px' }}>
            {unanswered} unanswered question{unanswered > 1 ? 's' : ''} — will count as incorrect.
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
            <><Send size={16} /> Submit Exam</>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CertificateBanner({ certId, onView }: { certId: string; onView: () => void }) {
  return (
    <div className="rounded-2xl px-5 py-4 border flex items-center gap-4"
      style={{
        background: 'linear-gradient(135deg,rgba(251,191,36,0.15),rgba(245,158,11,0.08))',
        borderColor: 'rgba(251,191,36,0.4)',
      }}
    >
      <Award size={28} style={{ color: '#b45309', flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold" style={{ color: '#92400e' }}>
          SQL Fundamentals Certificate Earned!
        </p>
        <p className="text-xs mt-0.5" style={{ color: '#b45309' }}>
          Share it on LinkedIn to showcase your SQL skills.
        </p>
      </div>
      <button onClick={onView}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl shrink-0"
        style={{ background: '#b45309', color: '#fff' }}>
        <Share2 size={13} /> View & Share
      </button>
    </div>
  );
}

function AttemptHistory({ attempts }: { attempts: AttemptRecord[] }) {
  if (attempts.length === 0) return null;
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(99,102,241,0.15)' }}>
      <div className="px-4 py-3"
        style={{ background: 'linear-gradient(135deg,rgba(238,242,255,0.9),rgba(224,231,255,0.8))' }}>
        <p className="text-xs font-bold" style={{ color: '#312e81' }}>Your Previous Attempts</p>
      </div>
      <div className="divide-y" style={{ borderColor: 'rgba(99,102,241,0.08)' }}>
        {attempts.map((a, i) => {
          const passed = a.percentage >= SQL_EXAM_PASS_PERCENTAGE;
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
