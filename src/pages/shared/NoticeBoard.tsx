import { useEffect, useState } from 'react';
import {
  collection, query, orderBy, limit,
  getDocs, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp,
} from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { Pin, Pencil, Trash2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/ToastProvider';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/ui/Modal';
import type { Notice } from '../../lib/types';

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCards() {
  return (
    <>
      {[0, 1, 2].map(i => (
        <div key={i} className="card p-5 mb-4">
          <div className="skeleton h-4 w-24 rounded mb-3" />
          <div className="skeleton h-5 w-3/4 rounded mb-2" />
          <div className="skeleton h-4 w-full rounded mb-1" />
          <div className="skeleton h-4 w-2/3 rounded" />
        </div>
      ))}
    </>
  );
}

// ── Category badge ─────────────────────────────────────────────────────────────
const CATEGORY_META: Record<Notice['category'], { label: string; cls: string }> = {
  general:       { label: 'General',              cls: 'badge-purple' },
  urgent:        { label: '🔴 Urgent',            cls: 'badge-rose'   },
  auckland:      { label: 'Auckland Campus',       cls: 'badge-sky'    },
  christchurch:  { label: 'Christchurch Campus',  cls: 'badge-slate'  },
};

// ── Notice card ───────────────────────────────────────────────────────────────
function NoticeCard({
  notice, isStaff, confirmDel,
  onEdit, onDeleteClick, onDeleteConfirm, onDeleteCancel,
}: {
  notice: Notice;
  isStaff: boolean;
  confirmDel: string | null;
  onEdit: () => void;
  onDeleteClick: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[notice.category];
  const bodyTruncated = notice.body.length > 300 && !expanded;
  const bodyText = bodyTruncated ? notice.body.slice(0, 300) + '…' : notice.body;
  const isConfirming = confirmDel === notice.id;

  let timeAgo = '';
  try {
    timeAgo = formatDistanceToNow(notice.createdAt.toDate(), { addSuffix: true });
  } catch {
    timeAgo = '';
  }

  return (
    <div
      className="card p-5 mb-4"
      style={{
        borderLeft: notice.category === 'urgent'
          ? '4px solid #f43f5e'
          : '4px solid transparent',
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`badge ${meta.cls}`}>{meta.label}</span>
          {notice.pinned && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600">
              <Pin size={11} /> Pinned
            </span>
          )}
        </div>
        {isStaff && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {isConfirming ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-red-500 font-medium">Delete?</span>
                <button
                  onClick={onDeleteConfirm}
                  className="text-xs px-2 py-0.5 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={onDeleteCancel}
                  className="text-xs px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition-colors"
                >
                  No
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onEdit}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-all"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={onDeleteClick}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Title */}
      <p className="font-bold text-gray-800 text-[15px] mb-1.5 leading-snug">{notice.title}</p>

      {/* Body */}
      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{bodyText}</p>
      {notice.body.length > 300 && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="text-xs text-brand-600 font-semibold mt-1 hover:underline"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {/* Footer */}
      <div className="flex items-center gap-1 mt-3 pt-3" style={{ borderTop: '1px solid rgba(139,92,246,0.08)' }}>
        <span className="text-xs text-gray-400">
          Posted by <span className="font-medium text-gray-500">{notice.authorName}</span>
          {timeAgo ? ` · ${timeAgo}` : ''}
        </span>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const defaultForm = { title: '', body: '', category: 'general' as Notice['category'], pinned: false };

export default function NoticeBoard() {
  const { user, role } = useAuth();
  const { showToast } = useToast();
  const isStaff = role === 'lecturer' || role === 'teachingAssistant';

  const [notices,    setNotices]    = useState<Notice[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editing,    setEditing]    = useState<Notice | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form,       setForm]       = useState(defaultForm);

  async function load() {
    const snap = await getDocs(
      query(collection(db, 'notices'), orderBy('createdAt', 'desc'), limit(30))
    );
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Notice));
    data.sort((a, b) => Number(b.pinned) - Number(a.pinned));
    setNotices(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(defaultForm);
    setModalOpen(true);
  }

  function openEdit(n: Notice) {
    setEditing(n);
    setForm({ title: n.title, body: n.body, category: n.category, pinned: n.pinned });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setForm(defaultForm);
  }

  async function handleSubmit() {
    if (!form.title.trim() || !form.body.trim() || !user) return;
    setSubmitting(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'notices', editing.id), {
          ...form,
          updatedAt: serverTimestamp(),
        });
        showToast({ type: 'success', title: 'Notice updated' });
      } else {
        await addDoc(collection(db, 'notices'), {
          ...form,
          authorUid:  user.uid,
          authorName: user.displayName || user.email || 'Staff',
          createdAt:  serverTimestamp(),
        });
        showToast({ type: 'success', title: 'Notice posted' });
      }
      closeModal();
      setLoading(true);
      await load();
    } catch {
      showToast({ type: 'error', title: 'Something went wrong', description: 'Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, 'notices', id));
    setConfirmDel(null);
    showToast({ type: 'success', title: 'Notice deleted' });
    setLoading(true);
    await load();
  }

  const charCount = form.body.length;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
          <div className="animate-fadeIn">
            <h1 className="page-title">Notice Board</h1>
            <p className="page-subtitle">Important announcements from your faculty</p>
          </div>
          {isStaff && (
            <button
              className="btn-primary sm:flex-shrink-0 justify-center sm:justify-start"
              onClick={openCreate}
            >
              + Post Notice
            </button>
          )}
        </div>

        {/* Content */}
        {loading && <SkeletonCards />}

        {!loading && notices.length === 0 && (
          <div className="card p-10 text-center">
            <p className="text-gray-400 text-sm">No notices yet.</p>
            {isStaff && (
              <p className="text-xs text-gray-300 mt-1">Post the first notice using the button above.</p>
            )}
          </div>
        )}

        {!loading && notices.map(n => (
          <NoticeCard
            key={n.id}
            notice={n}
            isStaff={isStaff}
            confirmDel={confirmDel}
            onEdit={() => openEdit(n)}
            onDeleteClick={() => setConfirmDel(n.id)}
            onDeleteConfirm={() => handleDelete(n.id)}
            onDeleteCancel={() => setConfirmDel(null)}
          />
        ))}
      </div>

      {/* Create / Edit modal */}
      {isStaff && (
        <Modal
          open={modalOpen}
          onClose={closeModal}
          title={editing ? 'Edit Notice' : 'Post a Notice'}
          maxWidth="md"
        >
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                className="input-field w-full"
                placeholder="e.g. Weekend class update…"
                maxLength={120}
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                className="input-field w-full resize-none"
                rows={4}
                maxLength={1000}
                placeholder="Write your announcement here…"
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              />
              <p className="text-right text-xs text-gray-400 mt-0.5">{charCount}/1000</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
              <select
                className="input-field w-full"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as Notice['category'] }))}
              >
                <option value="general">General</option>
                <option value="urgent">Urgent</option>
                <option value="auckland">Auckland Campus</option>
                <option value="christchurch">Christchurch Campus</option>
              </select>
            </div>

            {/* Pinned */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 accent-brand-600"
                checked={form.pinned}
                onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))}
              />
              <span className="text-sm text-gray-700">Pin this notice to the top</span>
            </label>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-1">
              <button className="btn-ghost" onClick={closeModal} disabled={submitting}>
                Cancel
              </button>
              <button
                className="btn-primary"
                disabled={!form.title.trim() || !form.body.trim() || submitting}
                onClick={handleSubmit}
              >
                {submitting ? 'Saving…' : editing ? 'Save Changes' : 'Post Notice'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
