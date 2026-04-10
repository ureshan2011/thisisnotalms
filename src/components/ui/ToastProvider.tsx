import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, 'id'> & { durationMs?: number }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_STYLES: Record<ToastType, {
  bg: string;
  border: string;
  iconBg: string;
  icon: ReactNode;
  titleColor: string;
  descColor: string;
}> = {
  success: {
    bg:         'rgba(255,255,255,0.95)',
    border:     'rgba(16,185,129,0.20)',
    iconBg:     'linear-gradient(135deg, #10b981, #2dd4bf)',
    icon:       <CheckCircle2 size={15} color="white" />,
    titleColor: '#065f46',
    descColor:  '#6ee7b7',
  },
  error: {
    bg:         'rgba(255,255,255,0.95)',
    border:     'rgba(239,68,68,0.20)',
    iconBg:     'linear-gradient(135deg, #ef4444, #f97316)',
    icon:       <AlertCircle size={15} color="white" />,
    titleColor: '#7f1d1d',
    descColor:  '#fca5a5',
  },
  info: {
    bg:         'rgba(255,255,255,0.95)',
    border:     'rgba(124,58,237,0.20)',
    iconBg:     'linear-gradient(135deg, #7c3aed, #a78bfa)',
    icon:       <Info size={15} color="white" />,
    titleColor: '#1e1b4b',
    descColor:  '#c4b5fd',
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<ToastItem, 'id'> & { durationMs?: number }) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const { durationMs = 3500, ...content } = toast;
    setToasts(prev => [...prev, { id, ...content }]);
    window.setTimeout(() => dismiss(id), durationMs);
  }, [dismiss]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed z-[100] pointer-events-none bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[360px]">
        <div className="space-y-2">
          {toasts.map(toast => {
            const s = TOAST_STYLES[toast.type];
            return (
              <div
                key={toast.id}
                className="pointer-events-auto animate-toastIn"
                role="status"
                aria-live="polite"
                style={{
                  background: s.bg,
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius: '20px',
                  border: `1px solid ${s.border}`,
                  boxShadow: '0 16px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',
                  padding: '14px 16px',
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Icon bubble */}
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                    style={{ background: s.iconBg }}
                  >
                    {s.icon}
                  </div>
                  {/* Text */}
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-sm font-bold leading-5" style={{ color: s.titleColor }}>
                      {toast.title}
                    </p>
                    {toast.description && (
                      <p className="text-xs mt-0.5 font-medium" style={{ color: s.descColor }}>
                        {toast.description}
                      </p>
                    )}
                  </div>
                  {/* Dismiss */}
                  <button
                    type="button"
                    onClick={() => dismiss(toast.id)}
                    className="rounded-xl p-1.5 transition-colors flex-shrink-0 mt-0.5"
                    style={{ color: '#d1d5db' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.05)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                    aria-label="Dismiss"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
