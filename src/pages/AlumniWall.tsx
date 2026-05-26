import { useEffect, useState } from 'react';
import {
  collection, doc, getDoc, getDocs, limit, orderBy, query,
  serverTimestamp, setDoc, where,
} from 'firebase/firestore';
import { Users, Linkedin, Copy, Check, ShieldCheck, Award, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { ALL_BADGES } from '../lib/badgeData';

const PLATFORM_URL = 'https://ureshan2011.github.io/YooBees/';

interface AlumniEntry {
  uid: string;
  studentName: string;
  studentDisplayId: string;
  intake: string;
  linkedInUrl?: string;
  message?: string;
  earnedBadgeCount: number;
  hasSqlCert: boolean;
  joinedAt: Date;
}

function buildSharePost(intake: string, earnedBadgeCount: number, hasSqlCert: boolean): string {
  const certLine = hasSqlCert ? '\nIncluding a verified SQL Fundamentals Certificate.' : '';
  return `Just added my profile to the YooBees Alumni Wall.\n\n${intake} at Yoobee College of Creative Innovation.\n\nEarned ${earnedBadgeCount} of ${ALL_BADGES.length} badges on the platform built by Dr. Yasas Sri Wickramasinghe.${certLine}\n\n${PLATFORM_URL}\n\nTag: @Dr. Yasas Sri Wickramasinghe (https://nz.linkedin.com/in/yasassri)\n@Yoobee College of Creative Innovation (https://nz.linkedin.com/school/yoobeecollegeofcreativeinnovation/)\n\n#YooBees #Yoobee #technology #MBI #studentfeedback #successstories #SQL #DatabaseManagement`;
}

async function computeBadgeData(
  user: { uid: string },
  studentProfile: { sqlExamCertificateId?: string; erMcqBadge?: boolean; [k: string]: any },
): Promise<{ earnedBadgeCount: number; hasSqlCert: boolean }> {
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
  return { earnedBadgeCount: earned.size, hasSqlCert: !!studentProfile.sqlExamCertificateId };
}

export default function AlumniWall() {
  const { user, role, studentProfile } = useAuth();
  const [entries, setEntries] = useState<AlumniEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [myEntry, setMyEntry] = useState<AlumniEntry | null>(null);

  const [joining, setJoining] = useState(false);
  const [joinIntake, setJoinIntake] = useState('');
  const [joinLinkedIn, setJoinLinkedIn] = useState('');
  const [joinMessage, setJoinMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const [copiedPost, setCopiedPost] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, 'alumni'), orderBy('joinedAt', 'desc')),
        );
        const all: AlumniEntry[] = snap.docs.map((d) => ({
          uid: d.id,
          ...(d.data() as Omit<AlumniEntry, 'uid' | 'joinedAt'>),
          joinedAt: d.data().joinedAt?.toDate?.() ?? new Date(),
        }));
        setEntries(all);
        if (user) setMyEntry(all.find((a) => a.uid === user.uid) ?? null);
      } catch { /* no data */ }
      setLoading(false);
    })();
  }, [user]);

  async function handleJoin() {
    if (!user || !studentProfile || !joinIntake.trim()) return;
    setSaving(true);
    try {
      const { earnedBadgeCount, hasSqlCert } = await computeBadgeData(user, studentProfile);
      const entry = {
        uid: user.uid,
        studentName: studentProfile.fullName ?? user.email ?? '',
        studentDisplayId: studentProfile.studentId ?? '',
        intake: joinIntake.trim(),
        ...(joinLinkedIn.trim() ? { linkedInUrl: joinLinkedIn.trim() } : {}),
        ...(joinMessage.trim() ? { message: joinMessage.trim() } : {}),
        earnedBadgeCount,
        hasSqlCert,
        isPublic: true,
        joinedAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'alumni', user.uid), entry);
      const newEntry: AlumniEntry = { ...entry, joinedAt: new Date() };
      setMyEntry(newEntry);
      setEntries((prev) => [newEntry, ...prev.filter((a) => a.uid !== user.uid)]);
      setJoining(false);
    } catch { /* fail silently */ }
    setSaving(false);
  }

  function copyPost() {
    if (!myEntry) return;
    const text = buildSharePost(myEntry.intake, myEntry.earnedBadgeCount, myEntry.hasSqlCert);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedPost(true);
      setTimeout(() => setCopiedPost(false), 2500);
    });
  }

  function shareLinkedIn() {
    if (!myEntry) return;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(PLATFORM_URL)}`,
      '_blank', 'noopener,noreferrer,width=600,height=600',
    );
    const text = buildSharePost(myEntry.intake, myEntry.earnedBadgeCount, myEntry.hasSqlCert);
    navigator.clipboard.writeText(text).catch(() => {});
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold" style={{ color: '#1e1b4b' }}>Alumni Wall</h1>
            <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
              Students and graduates of YooBees at Yoobee College of Creative Innovation.
            </p>
          </div>
          {role === 'student' && user && !myEntry && !joining && (
            <button
              onClick={() => setJoining(true)}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl flex-shrink-0"
              style={{ background: 'rgba(99,102,241,0.08)', color: '#4338ca', border: '1px solid rgba(99,102,241,0.2)' }}>
              <Plus size={14} /> Add My Profile
            </button>
          )}
        </div>

        {/* Join form */}
        {joining && !myEntry && (
          <div className="rounded-2xl border p-5 space-y-4"
            style={{ background: 'rgba(238,242,255,0.7)', borderColor: 'rgba(99,102,241,0.2)' }}>
            <p className="text-sm font-bold" style={{ color: '#312e81' }}>Add your profile to the Alumni Wall</p>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>
                Intake / Programme <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 2024 Semester 1 · Graduate Diploma IT"
                value={joinIntake}
                maxLength={80}
                onChange={(e) => setJoinIntake(e.target.value)}
                className="input-field w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>
                LinkedIn URL <span style={{ color: '#9ca3af' }}>(optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://nz.linkedin.com/in/yourname"
                value={joinLinkedIn}
                onChange={(e) => setJoinLinkedIn(e.target.value)}
                className="input-field w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>
                One-line quote <span style={{ color: '#9ca3af' }}>(optional, max 150 chars)</span>
              </label>
              <input
                type="text"
                placeholder="What did you take away from this course?"
                value={joinMessage}
                maxLength={150}
                onChange={(e) => setJoinMessage(e.target.value)}
                className="input-field w-full text-sm"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleJoin}
                disabled={!joinIntake.trim() || saving}
                className="btn-primary flex items-center gap-2 px-5 py-2 text-sm">
                {saving
                  ? <><div className="w-4 h-4 rounded-full border-2 animate-spin"
                      style={{ borderColor: '#fff3', borderTopColor: '#fff' }} /> Saving…</>
                  : 'Add to Wall'}
              </button>
              <button
                onClick={() => setJoining(false)}
                className="px-4 py-2 text-sm rounded-xl"
                style={{ color: '#6b7280', background: 'rgba(107,114,128,0.08)' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* My-entry share banner */}
        {myEntry && (
          <div className="rounded-2xl border p-4 flex items-center justify-between gap-4 flex-wrap"
            style={{ background: 'rgba(209,250,229,0.3)', borderColor: 'rgba(22,163,74,0.2)' }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#15803d' }}>You're on the Alumni Wall!</p>
              <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>Share your profile on LinkedIn to celebrate.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={shareLinkedIn}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                style={{ background: '#0a66c2' }}>
                <Linkedin size={12} /> Share
              </button>
              <button onClick={copyPost}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border"
                style={{ borderColor: 'rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)', color: '#4338ca' }}>
                {copiedPost ? <Check size={12} /> : <Copy size={12} />}
                {copiedPost ? 'Copied' : 'Copy Post'}
              </button>
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(99,102,241,0.2)', borderTopColor: '#6366f1' }} />
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl border p-8 text-center"
            style={{ background: 'rgba(249,250,251,0.8)', borderColor: 'rgba(209,213,219,0.5)' }}>
            <Users size={28} style={{ color: '#d1d5db', margin: '0 auto 10px' }} />
            <p className="text-sm" style={{ color: '#9ca3af' }}>
              No profiles yet — be the first to add yours!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {entries.map((entry) => (
              <AlumniCard key={entry.uid} entry={entry} isMe={entry.uid === user?.uid} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

function AlumniCard({ entry, isMe }: { entry: AlumniEntry; isMe: boolean }) {
  return (
    <div className="rounded-2xl border p-4 space-y-3"
      style={{
        background: isMe ? 'rgba(238,242,255,0.6)' : 'rgba(255,255,255,0.9)',
        borderColor: isMe ? 'rgba(99,102,241,0.25)' : 'rgba(209,213,219,0.5)',
      }}>
      {/* Name */}
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold" style={{ color: '#1e1b4b' }}>
            {entry.studentName || entry.studentDisplayId}
          </p>
          {isMe && (
            <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(99,102,241,0.1)', color: '#4338ca' }}>
              you
            </span>
          )}
        </div>
        {entry.studentDisplayId && (
          <p className="text-xs" style={{ color: '#9ca3af' }}>{entry.studentDisplayId}</p>
        )}
      </div>

      {/* Intake */}
      <span className="inline-block text-xs font-medium px-2 py-1 rounded-lg"
        style={{ background: 'rgba(107,114,128,0.07)', color: '#374151' }}>
        {entry.intake}
      </span>

      {/* Quote */}
      {entry.message && (
        <p className="text-xs leading-relaxed" style={{ color: '#6b7280', fontStyle: 'italic' }}>
          "{entry.message}"
        </p>
      )}

      {/* Badges + cert pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {entry.earnedBadgeCount > 0 && (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(180,83,9,0.08)', color: '#b45309', border: '1px solid rgba(180,83,9,0.15)' }}>
            <Award size={11} /> {entry.earnedBadgeCount} badge{entry.earnedBadgeCount !== 1 ? 's' : ''}
          </span>
        )}
        {entry.hasSqlCert && (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(22,163,74,0.08)', color: '#15803d', border: '1px solid rgba(22,163,74,0.15)' }}>
            <ShieldCheck size={11} /> SQL Certified
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t"
        style={{ borderColor: 'rgba(209,213,219,0.4)' }}>
        <p className="text-xs" style={{ color: '#d1d5db' }}>
          {format(entry.joinedAt, 'MMM yyyy')}
        </p>
        {entry.linkedInUrl && (
          <a
            href={entry.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg"
            style={{ background: 'rgba(10,102,194,0.08)', color: '#0a66c2' }}>
            <Linkedin size={11} /> LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}
