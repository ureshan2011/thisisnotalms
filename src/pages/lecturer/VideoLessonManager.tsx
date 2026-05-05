import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import {
  Film,
  Plus,
  Trash2,
  Video,
  ChevronLeft,
  Loader2,
  Check,
  AlertCircle,
  Pencil,
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/ToastProvider';
import type { VideoClip } from '../../components/slides/VideoGallery';

// ── Static lesson metadata (mirrors CourseResources.tsx) ────────────────────

const COURSE_LESSONS: Record<string, Array<{ id: string; title: string }>> = {
  MBI800: [{ id: 'sisp-lab', title: 'SISP Prompt Engineering Lab' }],
  MBI802: [
    { id: 'setup',         title: 'MySQL Development Environment Setup' },
    { id: 'slides',        title: 'SQL Programming Slides' },
    { id: 'er',            title: 'ER Diagrams Basics' },
    { id: 'er-activities', title: 'ER Diagram Activities' },
    { id: 'er-advanced',   title: 'Advanced ER Concepts' },
    { id: 'er-mcq',        title: 'ER Knowledge Check' },
    { id: 'normalization', title: 'Database Normalization & Functional Dependencies' },
    { id: 'quiz',          title: 'DBMS Knowledge Check' },
  ],
  MBI804: [],
};

const COURSE_ACCENT: Record<string, string> = {
  MBI800: '#0ea5e9',
  MBI802: '#7c3aed',
  MBI804: '#059669',
};

const COLOR_PRESETS = [
  '#7c3aed', '#0ea5e9', '#059669', '#dc2626', '#d97706',
  '#0d7a72', '#2563eb', '#6366f1', '#db2777', '#0891b2',
];

// ── Types ────────────────────────────────────────────────────────────────────

interface VideoLessonDoc {
  docId: string;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  lessonSubtitle: string;
  accentColor: string;
  isCustomLesson: boolean;
  videos: VideoClip[];
}

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

// ── Sub-components ───────────────────────────────────────────────────────────

function InputField({
  label,
  value,
  onChange,
  placeholder,
  required,
  hint,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>
        {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-3 py-2.5 text-sm border outline-none transition-all"
        style={{
          borderColor: 'rgba(139,92,246,0.20)',
          background: 'rgba(255,255,255,0.9)',
          color: '#1e1b4b',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.10)'; }}
        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.20)'; e.currentTarget.style.boxShadow = 'none'; }}
      />
      {hint && <p className="text-[11px] mt-1" style={{ color: '#9ca3af' }}>{hint}</p>}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function VideoLessonManager() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [selectedCourse, setSelectedCourse] = useState('MBI802');
  const [lessonDocs, setLessonDocs]         = useState<VideoLessonDoc[]>([]);
  const [selectedDocId, setSelectedDocId]   = useState<string | null>(null);
  const [loading, setLoading]               = useState(false);
  const [saving, setSaving]                 = useState(false);

  // Create-new-lesson form
  const [showNewLessonForm, setShowNewLessonForm] = useState(false);
  const [newTitle,    setNewTitle]    = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newColor,    setNewColor]    = useState('#7c3aed');

  // Add-video form
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc,  setVideoDesc]  = useState('');
  const [videoUrl,   setVideoUrl]   = useState('');
  const [videoThumb, setVideoThumb] = useState('');
  const [formError,  setFormError]  = useState('');

  const selectedDoc = lessonDocs.find(d => d.docId === selectedDocId) ?? null;

  // ── Fetch lesson docs for the selected course ──────────────────────────────
  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, 'videoLessons'), where('courseId', '==', selectedCourse))
      );
      setLessonDocs(
        snap.docs.map(d => ({ docId: d.id, ...(d.data() as Omit<VideoLessonDoc, 'docId'>) }))
      );
    } finally {
      setLoading(false);
    }
  }, [selectedCourse]);

  useEffect(() => {
    setSelectedDocId(null);
    setShowNewLessonForm(false);
    fetchDocs();
  }, [fetchDocs]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  function docForLesson(lessonId: string) {
    return lessonDocs.find(d => d.lessonId === lessonId) ?? null;
  }

  async function ensureDocAndSelect(lessonId: string, lessonTitle: string) {
    const existing = docForLesson(lessonId);
    if (existing) {
      setSelectedDocId(existing.docId);
      return;
    }
    const docId = `${selectedCourse}_${lessonId}`;
    const data: Omit<VideoLessonDoc, 'docId'> = {
      courseId:       selectedCourse,
      lessonId,
      lessonTitle,
      lessonSubtitle: '',
      accentColor:    COURSE_ACCENT[selectedCourse] ?? '#7c3aed',
      isCustomLesson: false,
      videos:         [],
    };
    await setDoc(doc(db, 'videoLessons', docId), {
      ...data,
      createdBy: user?.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setLessonDocs(prev => [...prev, { docId, ...data }]);
    setSelectedDocId(docId);
  }

  async function handleCreateLesson() {
    if (!newTitle.trim()) return;
    const lessonId = `custom-${generateId()}`;
    const docId    = `${selectedCourse}_${lessonId}`;
    const data: Omit<VideoLessonDoc, 'docId'> = {
      courseId:       selectedCourse,
      lessonId,
      lessonTitle:    newTitle.trim(),
      lessonSubtitle: newSubtitle.trim(),
      accentColor:    newColor,
      isCustomLesson: true,
      videos:         [],
    };
    setSaving(true);
    try {
      await setDoc(doc(db, 'videoLessons', docId), {
        ...data,
        createdBy: user?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setLessonDocs(prev => [...prev, { docId, ...data }]);
      setSelectedDocId(docId);
      setShowNewLessonForm(false);
      setNewTitle('');
      setNewSubtitle('');
      setNewColor('#7c3aed');
      showToast({ type: 'success', title: 'Lesson created', description: `"${data.lessonTitle}" is now live.` });
    } catch {
      showToast({ type: 'error', title: 'Failed to create lesson' });
    } finally {
      setSaving(false);
    }
  }

  async function handleAddVideo() {
    setFormError('');
    if (!videoTitle.trim()) { setFormError('Video title is required.'); return; }
    if (!videoUrl.trim())   { setFormError('Video URL is required.'); return; }
    if (!selectedDocId || !selectedDoc) return;

    const newVideo: VideoClip = {
      title: videoTitle.trim(),
      ...(videoDesc.trim()  && { description:  videoDesc.trim() }),
      url: videoUrl.trim(),
      ...(videoThumb.trim() && { thumbnailUrl: videoThumb.trim() }),
    };

    const updated = [...selectedDoc.videos, newVideo];
    setSaving(true);
    try {
      await setDoc(
        doc(db, 'videoLessons', selectedDocId),
        { videos: updated, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setLessonDocs(prev =>
        prev.map(d => d.docId === selectedDocId ? { ...d, videos: updated } : d)
      );
      setVideoTitle(''); setVideoDesc(''); setVideoUrl(''); setVideoThumb('');
      showToast({ type: 'success', title: 'Video added', description: `"${newVideo.title}" is now visible to students.` });
    } catch {
      showToast({ type: 'error', title: 'Failed to add video' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteVideo(index: number) {
    if (!selectedDocId || !selectedDoc) return;
    const updated = selectedDoc.videos.filter((_, i) => i !== index);
    setSaving(true);
    try {
      await setDoc(
        doc(db, 'videoLessons', selectedDocId),
        { videos: updated, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setLessonDocs(prev =>
        prev.map(d => d.docId === selectedDocId ? { ...d, videos: updated } : d)
      );
      showToast({ type: 'info', title: 'Video removed' });
    } catch {
      showToast({ type: 'error', title: 'Failed to remove video' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteLesson() {
    if (!selectedDocId || !selectedDoc?.isCustomLesson) return;
    if (!window.confirm(`Delete the lesson "${selectedDoc.lessonTitle}"? This cannot be undone.`)) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, 'videoLessons', selectedDocId));
      setLessonDocs(prev => prev.filter(d => d.docId !== selectedDocId));
      setSelectedDocId(null);
      showToast({ type: 'success', title: 'Lesson deleted' });
    } catch {
      showToast({ type: 'error', title: 'Failed to delete lesson' });
    } finally {
      setSaving(false);
    }
  }

  // ── Derived lists ──────────────────────────────────────────────────────────

  const hardcodedLessons = COURSE_LESSONS[selectedCourse] ?? [];
  const customLessons    = lessonDocs.filter(d => d.isCustomLesson);
  const accentColor      = COURSE_ACCENT[selectedCourse] ?? '#7c3aed';

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Layout>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="page-title">Video Lesson Manager</h1>
        <p className="page-subtitle">
          Add video lessons to any course. Changes go live immediately for students.
        </p>
      </div>

      {/* Course selector */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {Object.keys(COURSE_LESSONS).map(courseId => (
          <button
            key={courseId}
            onClick={() => setSelectedCourse(courseId)}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{
              background: selectedCourse === courseId ? COURSE_ACCENT[courseId] : 'rgba(255,255,255,0.85)',
              color:      selectedCourse === courseId ? '#fff' : '#374151',
              border:     selectedCourse === courseId ? 'none' : '1.5px solid rgba(0,0,0,0.08)',
              boxShadow:  selectedCourse === courseId ? `0 4px 16px ${COURSE_ACCENT[courseId]}40` : 'none',
            }}
          >
            {courseId}
          </button>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* ── Left: lesson selector ────────────────────────────────── */}
        <div className="lg:w-72 flex-shrink-0 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest px-1 mb-3" style={{ color: '#9ca3af' }}>
            Lessons
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin" style={{ color: accentColor }} />
            </div>
          ) : (
            <>
              {/* Hardcoded lessons */}
              {hardcodedLessons.map(lesson => {
                const lessonDoc = docForLesson(lesson.id);
                const videoCount = lessonDoc?.videos.length ?? 0;
                const isSelected = selectedDocId === lessonDoc?.docId;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setShowNewLessonForm(false);
                      ensureDocAndSelect(lesson.id, lesson.title);
                    }}
                    className="w-full text-left rounded-2xl px-4 py-3 transition-all flex items-center gap-3"
                    style={{
                      background: isSelected ? accentColor : 'rgba(255,255,255,0.85)',
                      border:     isSelected ? 'none' : '1.5px solid rgba(139,92,246,0.10)',
                      boxShadow:  isSelected ? `0 4px 16px ${accentColor}30` : '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isSelected ? 'rgba(255,255,255,0.20)' : `${accentColor}12`,
                        color:      isSelected ? '#fff' : accentColor,
                      }}
                    >
                      <Video size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: isSelected ? '#fff' : '#1e1b4b' }}>
                        {lesson.title}
                      </p>
                      {videoCount > 0 && (
                        <p className="text-xs mt-0.5" style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : accentColor }}>
                          {videoCount} video{videoCount !== 1 ? 's' : ''} added
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Custom lessons */}
              {customLessons.length > 0 && (
                <p className="text-xs font-bold uppercase tracking-widest px-1 pt-3 pb-1" style={{ color: '#9ca3af' }}>
                  Custom Lessons
                </p>
              )}
              {customLessons.map(lessonDoc => {
                const isSelected = selectedDocId === lessonDoc.docId;
                const color = lessonDoc.accentColor;
                return (
                  <button
                    key={lessonDoc.docId}
                    onClick={() => {
                      setShowNewLessonForm(false);
                      setSelectedDocId(lessonDoc.docId);
                    }}
                    className="w-full text-left rounded-2xl px-4 py-3 transition-all flex items-center gap-3"
                    style={{
                      background: isSelected ? color : 'rgba(255,255,255,0.85)',
                      border:     isSelected ? 'none' : '1.5px solid rgba(139,92,246,0.10)',
                      boxShadow:  isSelected ? `0 4px 16px ${color}30` : '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isSelected ? 'rgba(255,255,255,0.20)' : `${color}12`,
                        color:      isSelected ? '#fff' : color,
                      }}
                    >
                      <Film size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: isSelected ? '#fff' : '#1e1b4b' }}>
                        {lessonDoc.lessonTitle}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : '#9ca3af' }}>
                        {lessonDoc.videos.length} video{lessonDoc.videos.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </button>
                );
              })}

              {/* Create new lesson */}
              {!showNewLessonForm ? (
                <button
                  onClick={() => { setSelectedDocId(null); setShowNewLessonForm(true); }}
                  className="w-full text-left rounded-2xl px-4 py-3 transition-all flex items-center gap-3 mt-1"
                  style={{
                    background: showNewLessonForm ? `${accentColor}12` : 'rgba(255,255,255,0.6)',
                    border:     `1.5px dashed ${accentColor}40`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${accentColor}10`, color: accentColor }}
                  >
                    <Plus size={16} />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: accentColor }}>
                    Create New Lesson
                  </p>
                </button>
              ) : (
                /* New lesson form inside left panel */
                <div
                  className="rounded-2xl p-4 space-y-3 mt-1"
                  style={{
                    background: 'rgba(255,255,255,0.95)',
                    border: `1.5px solid ${accentColor}30`,
                    boxShadow: `0 4px 20px ${accentColor}12`,
                  }}
                >
                  <p className="text-sm font-bold" style={{ color: '#1e1b4b' }}>New Lesson</p>

                  <InputField
                    label="Lesson Title"
                    value={newTitle}
                    onChange={setNewTitle}
                    placeholder="e.g. Advanced SQL Queries"
                    required
                  />
                  <InputField
                    label="Subtitle"
                    value={newSubtitle}
                    onChange={setNewSubtitle}
                    placeholder="Short description (optional)"
                  />

                  {/* Color picker */}
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#374151' }}>
                      Accent Colour
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PRESETS.map(c => (
                        <button
                          key={c}
                          onClick={() => setNewColor(c)}
                          className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                          style={{
                            background:  c,
                            boxShadow:   newColor === c ? `0 0 0 3px white, 0 0 0 5px ${c}` : 'none',
                            transform:   newColor === c ? 'scale(1.15)' : 'scale(1)',
                          }}
                        >
                          {newColor === c && <Check size={12} color="white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleCreateLesson}
                      disabled={!newTitle.trim() || saving}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5"
                      style={{
                        background: newTitle.trim() ? accentColor : 'rgba(209,213,219,0.5)',
                        color:      newTitle.trim() ? '#fff' : '#9ca3af',
                      }}
                    >
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                      Create
                    </button>
                    <button
                      onClick={() => { setShowNewLessonForm(false); setNewTitle(''); setNewSubtitle(''); }}
                      className="px-3 py-2 rounded-xl text-sm font-semibold"
                      style={{ background: 'rgba(0,0,0,0.04)', color: '#6b7280' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Right: video management panel ──────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* No selection state */}
          {!selectedDoc && !showNewLessonForm && (
            <div
              className="rounded-2xl px-6 py-16 text-center"
              style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(139,92,246,0.10)' }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: `${accentColor}12` }}
              >
                <Film size={26} style={{ color: accentColor }} />
              </div>
              <p className="text-sm font-bold" style={{ color: '#1e1b4b' }}>
                Select a lesson
              </p>
              <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
                Choose a lesson on the left to manage its videos, or create a new lesson.
              </p>
            </div>
          )}

          {/* Show "select a lesson first" hint when new lesson form is open */}
          {showNewLessonForm && !selectedDoc && (
            <div
              className="rounded-2xl px-6 py-16 text-center"
              style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(139,92,246,0.10)' }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: `${accentColor}12` }}
              >
                <Plus size={26} style={{ color: accentColor }} />
              </div>
              <p className="text-sm font-bold" style={{ color: '#1e1b4b' }}>
                Fill in the lesson details on the left
              </p>
              <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
                Once the lesson is created you can add videos here.
              </p>
            </div>
          )}

          {/* Lesson management view */}
          {selectedDoc && (
            <div className="space-y-5">
              {/* Lesson header */}
              <div
                className="rounded-2xl px-5 py-4 flex items-center gap-4"
                style={{
                  background: `linear-gradient(135deg, ${selectedDoc.accentColor}10, ${selectedDoc.accentColor}04)`,
                  border: `1.5px solid ${selectedDoc.accentColor}25`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${selectedDoc.accentColor}18`, color: selectedDoc.accentColor }}
                >
                  {selectedDoc.isCustomLesson ? <Film size={20} /> : <Video size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold" style={{ color: '#1e1b4b' }}>
                      {selectedDoc.lessonTitle}
                    </h2>
                    {selectedDoc.isCustomLesson && (
                      <span
                        className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                        style={{ background: `${selectedDoc.accentColor}15`, color: selectedDoc.accentColor }}
                      >
                        Custom
                      </span>
                    )}
                  </div>
                  {selectedDoc.lessonSubtitle && (
                    <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                      {selectedDoc.lessonSubtitle}
                    </p>
                  )}
                </div>
                {selectedDoc.isCustomLesson && (
                  <button
                    onClick={handleDeleteLesson}
                    disabled={saving}
                    className="flex-shrink-0 p-2 rounded-xl transition-all hover:bg-red-50"
                    title="Delete this lesson"
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Existing videos */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.92)',
                  border: '1.5px solid rgba(139,92,246,0.10)',
                }}
              >
                <div
                  className="px-5 py-3 flex items-center gap-2"
                  style={{ borderBottom: '1px solid rgba(139,92,246,0.08)' }}
                >
                  <Film size={15} style={{ color: selectedDoc.accentColor }} />
                  <h3 className="text-sm font-bold" style={{ color: '#1e1b4b' }}>
                    Current Videos
                  </h3>
                  <span
                    className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${selectedDoc.accentColor}12`, color: selectedDoc.accentColor }}
                  >
                    {selectedDoc.videos.length} clip{selectedDoc.videos.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {selectedDoc.videos.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm" style={{ color: '#9ca3af' }}>
                      No videos added yet. Use the form below to add the first one.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: 'rgba(139,92,246,0.06)' }}>
                    {selectedDoc.videos.map((clip, i) => (
                      <div key={i} className="px-5 py-3 flex items-start gap-3">
                        {/* Thumbnail or placeholder */}
                        <div
                          className="w-16 h-10 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center"
                          style={{
                            background: clip.thumbnailUrl ? undefined : `${selectedDoc.accentColor}14`,
                          }}
                        >
                          {clip.thumbnailUrl ? (
                            <img
                              src={clip.thumbnailUrl}
                              alt={clip.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Film size={16} style={{ color: `${selectedDoc.accentColor}60` }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: '#1e1b4b' }}>
                            {clip.title}
                          </p>
                          {clip.description && (
                            <p className="text-xs mt-0.5 truncate" style={{ color: '#6b7280' }}>
                              {clip.description}
                            </p>
                          )}
                          <a
                            href={clip.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-semibold truncate block mt-0.5 hover:underline"
                            style={{ color: selectedDoc.accentColor }}
                          >
                            {clip.url.length > 55 ? clip.url.slice(0, 55) + '…' : clip.url}
                          </a>
                        </div>
                        <button
                          onClick={() => handleDeleteVideo(i)}
                          disabled={saving}
                          className="flex-shrink-0 p-1.5 rounded-lg transition-all hover:bg-red-50"
                          title="Remove this video"
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add video form */}
              <div
                className="rounded-2xl p-5 space-y-4"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  border: `1.5px solid ${selectedDoc.accentColor}25`,
                  boxShadow: `0 4px 24px ${selectedDoc.accentColor}08`,
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${selectedDoc.accentColor}15`, color: selectedDoc.accentColor }}
                  >
                    <Plus size={14} />
                  </div>
                  <h3 className="text-sm font-bold" style={{ color: '#1e1b4b' }}>
                    Add New Video
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Video Title"
                    value={videoTitle}
                    onChange={setVideoTitle}
                    placeholder="e.g. Introduction to 1NF"
                    required
                  />
                  <InputField
                    label="Description"
                    value={videoDesc}
                    onChange={setVideoDesc}
                    placeholder="Brief description (optional)"
                  />
                  <div className="md:col-span-2">
                    <InputField
                      label="Video URL"
                      value={videoUrl}
                      onChange={setVideoUrl}
                      placeholder="https://myacg-my.sharepoint.com/:v:/…"
                      required
                      hint="Paste the SharePoint sharing link. Students will be taken to this URL."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <InputField
                      label="Thumbnail URL"
                      value={videoThumb}
                      onChange={setVideoThumb}
                      placeholder="https://… (optional — shown as preview image)"
                      hint="Public image URL used as a preview thumbnail on the lesson card."
                    />
                  </div>
                </div>

                {formError && (
                  <div
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)' }}
                  >
                    <AlertCircle size={14} style={{ color: '#dc2626', flexShrink: 0 }} />
                    <p className="text-xs font-medium" style={{ color: '#dc2626' }}>{formError}</p>
                  </div>
                )}

                <button
                  onClick={handleAddVideo}
                  disabled={saving}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  style={{
                    background:  selectedDoc.accentColor,
                    color:       '#fff',
                    boxShadow:   `0 4px 16px ${selectedDoc.accentColor}40`,
                    opacity:     saving ? 0.7 : 1,
                  }}
                >
                  {saving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}
                  {saving ? 'Saving…' : 'Add Video'}
                </button>
              </div>

              {/* Info note */}
              <div
                className="rounded-2xl px-4 py-3 flex items-start gap-3"
                style={{
                  background: 'rgba(124,58,237,0.04)',
                  border: '1px solid rgba(124,58,237,0.12)',
                }}
              >
                <Pencil size={14} style={{ color: '#7c3aed', flexShrink: 0, marginTop: 2 }} />
                <p className="text-xs leading-5" style={{ color: '#4b5563' }}>
                  Videos added here are immediately visible to all students in the{' '}
                  <strong>Course Resources</strong> page under this lesson. No page refresh needed.
                  Students see them in the same video gallery style as existing lessons.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
