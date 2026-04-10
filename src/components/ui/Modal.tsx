import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open:      boolean;
  onClose:   () => void;
  title:     string;
  children:  React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg';
}

const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' };

export default function Modal({ open, onClose, title, children, maxWidth = 'md' }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fadeIn"
        style={{ background: 'rgba(30, 27, 75, 0.35)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full ${widths[maxWidth]} animate-scaleIn`}
        style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(139,92,246,0.12)',
          boxShadow: '0 24px 64px rgba(124,106,247,0.18), 0 8px 24px rgba(0,0,0,0.08)',
        }}
      >
        {/* Top accent */}
        <div
          className="absolute top-0 left-8 right-8 h-0.5 rounded-b-full"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid rgba(139,92,246,0.08)' }}
        >
          <h3 className="font-bold text-gray-800 text-base tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-brand-600 transition-all p-1.5 rounded-xl hover:bg-brand-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
