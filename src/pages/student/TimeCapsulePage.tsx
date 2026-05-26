import { useEffect, useState } from 'react';
import {
  collection, doc, getDoc, getDocs, limit, orderBy, query,
  serverTimestamp, setDoc, Timestamp, where,
} from 'firebase/firestore';
import { Lock, Unlock, Clock, Linkedin, Copy, Check, CalendarDays } from 'lucide-react';
import { addWeeks, format, formatDistanceToNow, isPast } from 'date-fns';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import { ALL_BADGES } from '../../lib/badgeData';
import type { BadgeDefinition } from '../../lib/badgeData';

const PLATFORM_URL = 'https://ureshan2011.github.io/YooBees/';

interface Capsule {
  message: string;
  writtenAt: Date;
  unlocksAt: Date;
}

function buildSharePost(message: string, earnedBadges: BadgeDefinition[]): string {
  const badgeLines = earnedBadges.length > 0
    ? earnedBadges.map((b) => `  — ${b.name}`).join('\n')
    : '  — Still working on it!';
  return `At the start of semester, I wrote a message to my future self on YooBees.\n\nWhat I wrote:\n"${message}"\n\nWhat I actually achieved this semester:\n${badgeLines}\n\nLearned alongside amazing classmates on the platform built by Dr. Yasas Sri Wickramasinghe at Yoobee College of Creative Innovation.\n\n${PLATFORM_URL}\n\nTag: @Dr. Yasas Sri Wickramasinghe (https://nz.linkedin.com/in/yasassri)\n@Yoobee College of Creative Innovation (https://nz.linkedin.com/school/yoobeecollegeofcreativeinnovation/)\n\n#YooBees #Yoobee #technology #MBI #studentfeedback #successstories #SQL #DatabaseManagement`;
}

async function loadEarnedBadges(
  user: { uid: string },
  studentProfile: { sqlExamCertificateId?: string; erMcqBadge?: boolean; [k: string]: any },
): Promise<Set<string>> {
  const earned = new Set<string>();
  if (studentProfile.sqlExamCertificateId) earned.add('sql-cert');
  try {
    const snap = await getDoc(doc(db, 'erMcqResults', user.uid));
    if (snap.exists()) {
      if ((snap.data().bestPercentage ?? 0) >= 50) earned.add('er-diagrams');
      if (snap.data().badgeEarned || studentProfile.erMcqBadge) earned.add('er-distinction');
    }
  } catch { /* skip */ }
  try {
    const snap = await getDoc(doc(db, 'agileScrumMcqResults', user.uid));
    if (snap.exists()) {
      if ((snap.data().bestPercentage ?? 0) >= 50) earned.add('agile-practitioner');
      if (snap.data().badgeEarned || studentProfile.agileScrumMcqBadge) earned.add('agile-distinction');
    }
  } catch { /* skip */ }
  try {
    const snaps = await getDocs(query(
      collection(db, 'mbi802QuizResults'),
      where('studentUid', '==', user.uid),
      orderBy('percentage', 'desc'),
      limit(1),
    ));
    if (!snaps.empty && (snaps.docs[0].data().percentage ?? 0) >= 60) earned.add('dbms-scholar');
  } catch { /* skip */ }
  try {
    const snaps = await getDocs(query(
      collection(db, 'sqlRaceSubmissions'),
      where('studentUid', '==', user.uid),
      where('isCorrect', '==', true),
      limit(1),
    ));
    if (!snaps.empty) earned.add('sql-racer');
  } catch { /* skip */ }
  try {
    const snap = await getDoc(doc(db, 'eloRatings', user.uid));
    if (snap.exists()) {
      if ((snap.data().rating ?? 0) >= 1300) earned.add('arena-warrior');
      if ((snap.data().bestDuelStreak ?? snap.data().duelStreak ?? 0) >= 5) earned.add('streak-master');
    }
  } catch { /* skip */ }
  try {
    const snaps = await getDocs(query(
      collection(db, 'attendanceRecords'),
      where('studentUid', '==', user.uid),
      limit(8),
    ));
    if (snaps.size >= 8) earned.add('dedicated');
  } catch { /* skip */ }
  return earned;
}

export default function TimeCapsulePage() {
  const { user, studentProfile } = useAuth();
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<'write' | 'sealed' | 'revealed'>('write');

  const [message, setMessage] = useState('');
  const [unlockDate, setUnlockDate] = useState(() => format(addWeeks(new Date(), 12), 'yyyy-MM-dd'));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set());
  const [badgesLoaded, setBadgesLoaded] = useState(false);
  const [postCopied, setPostCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'timeCapsules', user.uid))
      .then((snap) => {
        if (snap.exists()) {
          const d = snap.data();
          const cap: Capsule = {
            message: d.message,
            writtenAt: d.writtenAt?.toDate?.() ?? new Date(),
            unlocksAt: d.unlocksAt?.toDate?.() ?? new Date(),
          };
          setCapsule(cap);
          setPhase(isPast(cap.unlocksAt) ? 'revealed' : 'sealed');
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (phase !== 'revealed' || !user || !studentProfile || badgesLoaded) return;
    loadEarnedBadges(user, studentProfile).then((ids) => {
      setEarnedIds(ids);
      setBadgesLoaded(true);
    });
  }, [phase, user, studentProfile, badgesLoaded]);

  async function handleSave() {
    if (!user || !studentProfile || !message.trim()) return;
    setSaving(true);
    try {
      const unlockTs = Timestamp.fromDate(new Date(unlockDate + 'T00:00:00'));
      await setDoc(doc(db, 'timeCapsules', user.uid), {
        uid: user.uid,
        studentName: studentProfile.fullName ?? '',
        studentDisplayId: studentProfile.studentId ?? '',
        message: message.trim(),
        writtenAt: serverTimestamp(),
        unlocksAt: unlockTs,
      });
      const unlockDateObj = new Date(unlockDate + 'T00:00:00');
      setCapsule({ message: message.trim(), writtenAt: new Date(), unlocksAt: unlockDateObj });
      setSaved(true);
      setPhase(isPast(unlockDateObj) ? 'revealed' : 'sealed');
    } catch { /* fail silently */ }
    setSaving(false);
  }

  const earnedBadges = ALL_BADGES.filter((b) => earnedIds.has(b.id));
  const postText = capsule ? buildSharePost(capsule.message, earnedBadges) : '';

  function copyPost() {
    navigator.clipboard.writeText(postText).then(() => {
      setPostCopied(true);
      setTimeout(() => setPostCopied(false), 2500);
    });
  }
  function shareLinkedIn() {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(PLATFORM_URL)}`,
      '_blank', 'noopener,noreferrer,width=600,height=600',
    );
    navigator.clipboard.writeText(postText).catch(() => {});
  }

  const minUnlock = format(addWeeks(new Date(), 1), 'yyyy-MM-dd');
  const maxUnlock = format(addWeeks(new Date(), 52), 'yyyy-MM-dd');

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: '#1e1b4b' }}>Time Capsule</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
            Write a message to your future self — sealed until the end of semester.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(99,102,241,0.2)', borderTopColor: '#6366f1' }} />
          </div>

        ) : phase === 'write' ? (
          /* ── Write ── */
          <div className="rounded-2xl border p-5 space-y-4"
            style={{ background: 'rgba(238,242,255,0.7)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <div className="flex items-center gap-2">
              <Clock size={16} style={{ color: '#6366f1' }} />
              <p className="text-sm font-bold" style={{ color: '#312e81' }}>Write to your future self</p>
            </div>
            <p className="text-xs" style={{ color: '#6b7280' }}>
              Sealed until your chosen unlock date. At reveal, you can share your message and achievements on LinkedIn.
            </p>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>
                Your message <span style={{ color: '#9ca3af' }}>(max 500 characters)</span>
              </label>
              <textarea
                rows={5}
                maxLength={500}
                placeholder="What do you hope to achieve this semester? What skills are you working toward?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-field w-full text-sm resize-none"
              />
              <p className="text-xs mt-1 text-right" style={{ color: '#9ca3af' }}>{message.length}/500</p>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>
                Unlock date <span style={{ color: '#9ca3af' }}>(default: 12 weeks from today)</span>
              </label>
              <div className="relative">
                <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#9ca3af' }} />
                <input
                  type="date"
                  value={unlockDate}
                  min={minUnlock}
                  max={maxUnlock}
                  onChange={(e) => setUnlockDate(e.target.value)}
                  className="input-field w-full pl-9 text-sm"
                />
              </div>
            </div>

            {saved ? (
              <div className="rounded-xl px-4 py-3 text-center text-sm font-semibold"
                style={{ background: 'rgba(209,250,229,0.8)', color: '#065f46' }}>
                Capsule sealed! Reveals {format(new Date(unlockDate + 'T00:00:00'), 'dd MMM yyyy')}.
              </div>
            ) : (
              <button
                onClick={handleSave}
                disabled={!message.trim() || saving}
                className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
                {saving
                  ? <><div className="w-4 h-4 rounded-full border-2 animate-spin"
                      style={{ borderColor: '#fff3', borderTopColor: '#fff' }} /> Sealing…</>
                  : <><Lock size={15} /> Seal My Capsule</>}
              </button>
            )}
          </div>

        ) : phase === 'sealed' && capsule ? (
          /* ── Sealed ── */
          <div className="rounded-2xl border p-6 text-center space-y-4"
            style={{ background: '#ffffff', borderColor: 'rgba(99,102,241,0.15)' }}>
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)' }}>
                <Lock size={28} style={{ color: '#6366f1' }} />
              </div>
            </div>
            <div>
              <p className="text-base font-bold" style={{ color: '#1e1b4b' }}>Your capsule is sealed</p>
              <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
                Written on {format(capsule.writtenAt, 'dd MMM yyyy')}
              </p>
            </div>
            <div className="rounded-xl px-4 py-3"
              style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)' }}>
              <p className="text-xs font-semibold mb-0.5" style={{ color: '#6366f1' }}>Reveals on</p>
              <p className="text-sm font-bold" style={{ color: '#312e81' }}>
                {format(capsule.unlocksAt, 'EEEE, d MMMM yyyy')}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                {formatDistanceToNow(capsule.unlocksAt, { addSuffix: true })}
              </p>
            </div>
            <p className="text-xs" style={{ color: '#9ca3af' }}>
              Keep working hard — return on the reveal date to see your message and share your achievements.
            </p>
          </div>

        ) : phase === 'revealed' && capsule ? (
          /* ── Revealed ── */
          <div className="space-y-4">
            <div className="rounded-2xl border p-4 flex items-center gap-3"
              style={{ background: 'rgba(209,250,229,0.3)', borderColor: 'rgba(22,163,74,0.2)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)' }}>
                <Unlock size={20} style={{ color: '#16a34a' }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#15803d' }}>Your capsule has been revealed!</p>
                <p className="text-xs" style={{ color: '#6b7280' }}>
                  Written {format(capsule.writtenAt, 'dd MMM yyyy')} · Unlocked {format(capsule.unlocksAt, 'dd MMM yyyy')}
                </p>
              </div>
            </div>

            {/* Original message */}
            <div className="rounded-2xl border p-5 space-y-2"
              style={{ background: '#ffffff', borderColor: 'rgba(99,102,241,0.15)' }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>
                What you wrote to yourself
              </p>
              <p className="text-sm leading-relaxed"
                style={{
                  color: '#374151',
                  fontStyle: 'italic',
                  borderLeft: '2px solid rgba(99,102,241,0.25)',
                  paddingLeft: 12,
                }}>
                "{capsule.message}"
              </p>
            </div>

            {/* Achievements */}
            <div className="rounded-2xl border p-5 space-y-3"
              style={{ background: '#ffffff', borderColor: 'rgba(180,83,9,0.15)' }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>
                What you actually achieved
              </p>
              {!badgesLoaded ? (
                <div className="flex justify-center py-4">
                  <div className="w-5 h-5 rounded-full border-2 animate-spin"
                    style={{ borderColor: '#e5e7eb', borderTopColor: '#374151' }} />
                </div>
              ) : earnedBadges.length === 0 ? (
                <p className="text-sm" style={{ color: '#9ca3af' }}>No badges earned yet — keep going!</p>
              ) : (
                <div className="space-y-1.5">
                  {earnedBadges.map((b) => (
                    <div key={b.id} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: b.color }} />
                      <span className="text-sm font-medium" style={{ color: '#111827' }}>{b.name}</span>
                    </div>
                  ))}
                  <p className="text-xs pt-1" style={{ color: '#9ca3af' }}>
                    {earnedBadges.length} of {ALL_BADGES.length} badges earned
                  </p>
                </div>
              )}
            </div>

            {/* LinkedIn share */}
            {badgesLoaded && (
              <div className="rounded-2xl border overflow-hidden"
                style={{ borderColor: 'rgba(99,102,241,0.15)' }}>
                <div className="flex items-center justify-between px-4 py-3"
                  style={{ background: 'rgba(238,242,255,0.7)', borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
                  <div className="flex items-center gap-2">
                    <Linkedin size={14} style={{ color: '#0a66c2' }} />
                    <span className="text-xs font-semibold" style={{ color: '#374151' }}>Share your journey</span>
                  </div>
                  <button onClick={copyPost}
                    className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg"
                    style={{ color: '#6b7280', background: 'rgba(107,114,128,0.1)' }}>
                    {postCopied ? <Check size={12} style={{ color: '#16a34a' }} /> : <Copy size={12} />}
                    {postCopied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="px-4 py-3" style={{ background: '#ffffff' }}>
                  <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: '#374151' }}>
                    {postText}
                  </p>
                </div>
                <div className="px-4 py-3 flex gap-2"
                  style={{ background: 'rgba(238,242,255,0.4)', borderTop: '1px solid rgba(99,102,241,0.1)' }}>
                  <button onClick={shareLinkedIn}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white"
                    style={{ background: '#0a66c2' }}>
                    <Linkedin size={14} /> Share on LinkedIn
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
