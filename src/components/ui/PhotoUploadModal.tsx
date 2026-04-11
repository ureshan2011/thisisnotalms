import { useState, useRef, useCallback } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Camera, Upload, X, Check, AlertCircle, Image } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { logEvent } from '../../lib/eventLog';

interface PhotoUploadModalProps {
  currentPhotoURL?: string;
  onClose: () => void;
  onUploaded: (url: string) => void;
  skipable?: boolean;
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #7c3aed, #a78bfa)',
  'linear-gradient(135deg, #0ea5e9, #38bdf8)',
  'linear-gradient(135deg, #10b981, #34d399)',
  'linear-gradient(135deg, #f59e0b, #fbbf24)',
  'linear-gradient(135deg, #ef4444, #f87171)',
  'linear-gradient(135deg, #ec4899, #f472b6)',
];

export function avatarGradient(uid: string): string {
  let hash = 0;
  for (let i = 0; i < uid.length; i++) hash = uid.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

/**
 * Resize + center-crop the image to a square using canvas,
 * then return a JPEG data URL (~15–40 KB) safe to store in Firestore.
 */
function resizeToDataURL(file: File, size = 300, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      canvas.width  = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }

      // Center-crop to square before scaling
      const side = Math.min(img.width, img.height);
      const sx   = (img.width  - side) / 2;
      const sy   = (img.height - side) / 2;
      ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);

      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Could not load image')); };
    img.src = objectUrl;
  });
}

export default function PhotoUploadModal({
  currentPhotoURL,
  onClose,
  onUploaded,
  skipable = true,
}: PhotoUploadModalProps) {
  const { user } = useAuth();
  const [preview,     setPreview]     = useState<string | null>(currentPhotoURL ?? null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [saving,      setSaving]      = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [statusMsg,   setStatusMsg]   = useState('');
  const [dragOver,    setDragOver]    = useState(false);
  const [error,       setError]       = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP, etc.)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10 MB.');
      return;
    }
    setError('');
    setPendingFile(file);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleSave = async () => {
    if (!pendingFile || !user) return;
    setSaving(true);
    setError('');
    setProgress(10);
    setStatusMsg('Processing image…');

    try {
      // Resize + compress entirely in the browser — no Storage needed
      const dataURL = await resizeToDataURL(pendingFile);
      setProgress(60);
      setStatusMsg('Saving to profile…');

      await setDoc(
        doc(db, 'students', user.uid),
        { photoURL: dataURL, updatedAt: serverTimestamp() },
        { merge: true },
      );
      await logEvent({
        type: 'student_photo_uploaded',
        description: `${user.email || 'Student'} uploaded a new profile photo.`,
        actorUid: user.uid,
        actorEmail: user.email,
        actorRole: 'student',
        targetUid: user.uid,
      }).catch(() => undefined);

      setProgress(100);
      onUploaded(dataURL);
    } catch (err: unknown) {
      setError(String((err as Error)?.message ?? 'Save failed. Please try again.'));
      setSaving(false);
      setProgress(0);
      setStatusMsg('');
    }
  };

  const initials = (user?.email?.[0] ?? '?').toUpperCase();

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(15, 10, 40, 0.55)', backdropFilter: 'blur(12px)' }}
        onClick={skipable && !saving ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md animate-scaleIn"
        style={{
          background: 'rgba(255,255,255,0.99)',
          borderRadius: '28px',
          border: '1px solid rgba(139,92,246,0.18)',
          boxShadow: '0 40px 100px rgba(124,106,247,0.28), 0 8px 32px rgba(0,0,0,0.10)',
          padding: '28px',
        }}
      >
        {/* Decorative top bar */}
        <div
          className="absolute top-0 left-8 right-8 h-0.5 rounded-b-full"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa, #06b6d4)' }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="rounded-2xl p-2.5 shadow-sm"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.14), rgba(167,139,250,0.08))' }}
            >
              <Camera size={20} style={{ color: '#7c3aed' }} />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight" style={{ color: '#1e1b4b' }}>
                {currentPhotoURL ? 'Update your photo' : 'Add your photo'}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                Helps classmates and lecturers recognise you
              </p>
            </div>
          </div>
          {skipable && (
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 transition-all"
              style={{ color: '#9ca3af' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Current avatar preview */}
        {!pendingFile && (
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full overflow-hidden shadow-lg flex items-center justify-center text-white text-3xl font-bold animate-photoPopIn"
                style={{
                  background: preview ? 'transparent' : (user ? avatarGradient(user.uid) : AVATAR_GRADIENTS[0]),
                  border: '3px solid rgba(139,92,246,0.20)',
                  boxShadow: '0 8px 28px rgba(124,58,237,0.20)',
                }}
              >
                {preview
                  ? <img src={preview} alt="Current photo" className="w-full h-full object-cover" />
                  : initials}
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-md cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}
                onClick={() => inputRef.current?.click()}
              >
                <Image size={14} color="white" />
              </div>
            </div>
          </div>
        )}

        {/* Drop zone */}
        <div
          className={`relative rounded-2xl overflow-hidden mb-4 cursor-pointer transition-all duration-200 ${dragOver ? 'drag-over-pulse' : ''}`}
          style={{
            border: dragOver
              ? '2px dashed #7c3aed'
              : pendingFile
                ? '2px solid rgba(124,58,237,0.30)'
                : '2px dashed rgba(139,92,246,0.28)',
            background: dragOver
              ? 'rgba(124,58,237,0.04)'
              : pendingFile
                ? 'transparent'
                : 'rgba(245,243,255,0.55)',
            minHeight: pendingFile ? 'auto' : '140px',
          }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !pendingFile && inputRef.current?.click()}
        >
          {pendingFile && preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-72 object-cover rounded-2xl"
                style={{ display: 'block' }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-16 rounded-b-2xl"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}
              />
              <button
                className="absolute top-2.5 right-2.5 rounded-full p-1.5 transition-all"
                style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}
                onClick={e => {
                  e.stopPropagation();
                  setPendingFile(null);
                  setPreview(currentPhotoURL ?? null);
                }}
              >
                <X size={14} style={{ color: '#374151' }} />
              </button>
              <button
                className="absolute bottom-2.5 right-2.5 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-lg"
                style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', color: '#7c3aed' }}
                onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
              >
                Change photo
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-3 px-4">
              <div
                className="rounded-2xl p-3.5"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(167,139,250,0.08))' }}
              >
                <Upload size={24} style={{ color: '#7c3aed' }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold" style={{ color: '#1e1b4b' }}>
                  {dragOver ? 'Drop it here!' : 'Drop your photo here'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                  or click to browse · JPG, PNG, WebP · max 10 MB
                </p>
              </div>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = '';
          }}
        />

        {/* Error */}
        {error && (
          <div
            className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}
          >
            <AlertCircle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
            <p className="text-xs font-medium" style={{ color: '#dc2626' }}>{error}</p>
          </div>
        )}

        {/* Progress */}
        {saving && (
          <div className="mb-4">
            <div className="flex justify-between text-xs font-semibold mb-1.5" style={{ color: '#7c3aed' }}>
              <span>{statusMsg}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(139,92,246,0.12)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #7c3aed, #a78bfa, #06b6d4)',
                }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2.5 mt-1">
          {pendingFile && !saving ? (
            <button className="btn-primary flex-1 justify-center" onClick={handleSave}>
              <Check size={16} />
              Save photo
            </button>
          ) : !saving ? (
            <button
              className="flex-1 justify-center text-sm font-semibold py-2.5 rounded-xl transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.10), rgba(167,139,250,0.08))',
                color: '#7c3aed',
                border: '1px solid rgba(139,92,246,0.20)',
              }}
              onClick={() => inputRef.current?.click()}
            >
              <span className="flex items-center justify-center gap-2">
                <Upload size={15} />
                Choose a photo
              </span>
            </button>
          ) : null}

          {skipable && !saving && (
            <button className="btn-ghost px-4" onClick={onClose} style={{ color: '#9ca3af' }}>
              {pendingFile ? 'Cancel' : 'Skip for now'}
            </button>
          )}
        </div>

        {!skipable && !saving && (
          <p className="text-center text-xs mt-3" style={{ color: '#c4b5fd' }}>
            You can always update your photo later from your profile
          </p>
        )}
      </div>
    </div>
  );
}
