import { useEffect, useState } from 'react';
import {
  addDoc, collection, getDocs, onSnapshot, orderBy,
  query, serverTimestamp, where,
} from 'firebase/firestore';
import { Heart, Send, Copy, Check, Linkedin, Sparkles, Search } from 'lucide-react';
import { format } from 'date-fns';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import { KUDOS_CATEGORIES, type KudosCategoryId } from '../../lib/badgeData';
import { getCachedStudents, setCachedStudents } from '../../lib/studentsCache';
import type { StudentProfile } from '../../lib/types';

interface KudosRecord {
  id: string;
  fromUid: string;
  fromName: string;
  toUid: string;
  toName: string;
  category: KudosCategoryId;
  message: string;
  createdAt: Date;
}

const PLATFORM_URL = 'https://ureshan2011.github.io/YooBees/';

function buildSharePost(fromName: string, category: KudosCategoryId): string {
  const cat = KUDOS_CATEGORIES.find((c) => c.id === category);
  return `My classmate ${fromName} gave me a kudos on YooBees — recognised as "${cat?.label}".\n\nGreat to learn alongside people like this on the platform built by Dr. Yasas Sri Wickramasinghe at Yoobee College.\n\n${PLATFORM_URL}\n\nTag: @Dr. Yasas Sri Wickramasinghe (https://nz.linkedin.com/in/yasassri)\n@Yoobee College of Creative Innovation (https://nz.linkedin.com/school/yoobeecollegeofcreativeinnovation/)\n\n#YooBees #Yoobee #technology #MBI #studentfeedback #successstories`;
}

export default function KudosPage() {
  const { user, studentProfile } = useAuth();
  const [received, setReceived] = useState<KudosRecord[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<KudosCategoryId | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loadingStudents, setLoadingStudents] = useState(true);

  // Load students for recipient picker
  useEffect(() => {
    const cached = getCachedStudents();
    if (cached) {
      setStudents(cached.filter((s) => s.uid !== user?.uid));
      setLoadingStudents(false);
      return;
    }
    getDocs(collection(db, 'students')).then((snap) => {
      const all = snap.docs.map((d) => d.data() as StudentProfile);
      setCachedStudents(all);
      setStudents(all.filter((s) => s.uid !== user?.uid));
      setLoadingStudents(false);
    }).catch(() => setLoadingStudents(false));
  }, [user?.uid]);

  // Live feed of received kudos
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'kudos'),
      where('toUid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setReceived(snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<KudosRecord, 'id' | 'createdAt'>),
        createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
      })));
    });
    return unsub;
  }, [user]);

  const filtered = search.trim()
    ? students.filter((s) =>
        (s.fullName ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (s.studentId ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : students.slice(0, 8);

  async function handleSend() {
    if (!user || !studentProfile || !selectedStudent || !selectedCategory) return;
    setSending(true);
    try {
      await addDoc(collection(db, 'kudos'), {
        fromUid: user.uid,
        fromName: studentProfile.fullName ?? user.email ?? 'Someone',
        toUid: selectedStudent.uid,
        toName: selectedStudent.fullName ?? selectedStudent.studentId ?? '',
        category: selectedCategory,
        message: message.trim(),
        createdAt: serverTimestamp(),
      });
      setSent(true);
      setSelectedStudent(null);
      setSelectedCategory(null);
      setMessage('');
      setSearch('');
      setTimeout(() => setSent(false), 3000);
    } catch { /* silently fail */ }
    setSending(false);
  }

  function copyPost(kudos: KudosRecord) {
    const text = buildSharePost(kudos.fromName, kudos.category);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(kudos.id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  }

  function shareLinkedIn(kudos: KudosRecord) {
    const text = buildSharePost(kudos.fromName, kudos.category);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(PLATFORM_URL)}`, '_blank', 'noopener,noreferrer,width=600,height=600');
    navigator.clipboard.writeText(text).catch(() => {});
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: '#1e1b4b' }}>
            Peer Kudos
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
            Recognise a classmate — earned kudos are shareable on LinkedIn.
          </p>
        </div>

        {/* ── Send Kudos form ──────────────────────────────────── */}
        <div className="rounded-2xl border p-5 space-y-4"
          style={{ background: 'rgba(238,242,255,0.7)', borderColor: 'rgba(99,102,241,0.2)' }}>
          <p className="text-sm font-bold" style={{ color: '#312e81' }}>
            Give kudos to a classmate
          </p>

          {/* Recipient search */}
          <div>
            <p className="text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>Who deserves recognition?</p>
            {selectedStudent ? (
              <div className="flex items-center justify-between rounded-xl px-3 py-2 border"
                style={{ background: 'rgba(99,102,241,0.08)', borderColor: 'rgba(99,102,241,0.3)' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#312e81' }}>{selectedStudent.fullName}</p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>{selectedStudent.studentId}</p>
                </div>
                <button onClick={() => setSelectedStudent(null)}
                  className="text-xs px-2 py-0.5 rounded-lg"
                  style={{ color: '#6b7280', background: 'rgba(107,114,128,0.1)' }}>
                  Change
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }} />
                  <input
                    type="text"
                    placeholder="Search by name or student ID…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field w-full pl-9 text-sm"
                  />
                </div>
                {loadingStudents ? (
                  <p className="text-xs text-center py-2" style={{ color: '#9ca3af' }}>Loading…</p>
                ) : filtered.length === 0 ? (
                  <p className="text-xs text-center py-2" style={{ color: '#9ca3af' }}>No students found</p>
                ) : (
                  <div className="rounded-xl border overflow-hidden max-h-40 overflow-y-auto"
                    style={{ borderColor: 'rgba(99,102,241,0.15)' }}>
                    {filtered.map((s) => (
                      <button key={s.uid}
                        onClick={() => { setSelectedStudent(s); setSearch(''); }}
                        className="w-full text-left flex items-center justify-between px-3 py-2 border-b hover:bg-indigo-50 transition-colors"
                        style={{ borderColor: 'rgba(99,102,241,0.08)', background: 'rgba(255,255,255,0.7)' }}>
                        <p className="text-sm font-medium" style={{ color: '#1e1b4b' }}>{s.fullName || s.studentId}</p>
                        <p className="text-xs" style={{ color: '#9ca3af' }}>{s.studentId}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: '#374151' }}>Recognition type</p>
            <div className="flex flex-wrap gap-2">
              {KUDOS_CATEGORIES.map((cat) => (
                <button key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all"
                  style={{
                    background: selectedCategory === cat.id ? cat.color : 'transparent',
                    color: selectedCategory === cat.id ? '#fff' : cat.color,
                    borderColor: cat.color,
                  }}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional message */}
          <div>
            <p className="text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>
              Add a note <span style={{ color: '#9ca3af' }}>(optional)</span>
            </p>
            <textarea
              rows={2}
              maxLength={200}
              placeholder="What did they do that impressed you?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-field w-full text-sm resize-none"
            />
          </div>

          {/* Submit */}
          {sent ? (
            <div className="rounded-xl px-4 py-3 text-center text-sm font-semibold"
              style={{ background: 'rgba(209,250,229,0.8)', color: '#065f46' }}>
              Kudos sent!
            </div>
          ) : (
            <button
              onClick={handleSend}
              disabled={!selectedStudent || !selectedCategory || sending}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
              {sending
                ? <><div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: '#fff3', borderTopColor: '#fff' }} /> Sending…</>
                : <><Send size={15} /> Send Kudos</>}
            </button>
          )}
        </div>

        {/* ── Received kudos ───────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Heart size={16} style={{ color: '#db2777' }} />
            <p className="text-sm font-bold" style={{ color: '#1e1b4b' }}>
              Kudos you've received
            </p>
            {received.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: 'rgba(219,39,119,0.1)', color: '#db2777' }}>
                {received.length}
              </span>
            )}
          </div>

          {received.length === 0 ? (
            <div className="rounded-2xl border p-6 text-center"
              style={{ background: 'rgba(249,250,251,0.8)', borderColor: 'rgba(209,213,219,0.5)' }}>
              <Sparkles size={24} style={{ color: '#d1d5db', margin: '0 auto 8px' }} />
              <p className="text-sm" style={{ color: '#9ca3af' }}>
                No kudos yet — do great work and they'll appear here!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {received.map((k) => {
                const cat = KUDOS_CATEGORIES.find((c) => c.id === k.category);
                return (
                  <div key={k.id} className="rounded-2xl border p-4 space-y-3"
                    style={{ background: 'rgba(255,255,255,0.8)', borderColor: 'rgba(219,39,119,0.15)' }}>
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">{cat?.emoji ?? '🤝'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold" style={{ color: '#1e1b4b' }}>
                          <span style={{ color: cat?.color ?? '#6b7280' }}>{k.fromName}</span>{' '}
                          called you a{' '}
                          <span className="font-bold" style={{ color: cat?.color ?? '#6b7280' }}>{cat?.label}</span>
                        </p>
                        {k.message && (
                          <p className="text-xs mt-1" style={{ color: '#6b7280' }}>"{k.message}"</p>
                        )}
                        <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
                          {format(k.createdAt, 'dd MMM yyyy')}
                        </p>
                      </div>
                    </div>
                    {/* Share buttons */}
                    <div className="flex gap-2 pt-1 border-t" style={{ borderColor: 'rgba(219,39,119,0.1)' }}>
                      <button onClick={() => shareLinkedIn(k)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                        style={{ background: '#0a66c2' }}>
                        <Linkedin size={12} /> Share
                      </button>
                      <button onClick={() => copyPost(k)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border"
                        style={{ borderColor: 'rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)', color: '#4338ca' }}>
                        {copiedId === k.id ? <Check size={12} /> : <Copy size={12} />}
                        {copiedId === k.id ? 'Copied' : 'Copy Post'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
