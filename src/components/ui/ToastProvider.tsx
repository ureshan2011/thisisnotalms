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

const styles: Record<ToastType, { wrapper: string; icon: ReactNode }> = {
  success: {
    wrapper: 'border-emerald-200 bg-emerald-50/95 text-emerald-900',
    icon: <CheckCircle2 size={18} className="text-emerald-600" />,
  },
  error: {
    wrapper: 'border-red-200 bg-red-50/95 text-red-900',
    icon: <AlertCircle size={18} className="text-red-600" />,
  },
  info: {
    wrapper: 'border-sky-200 bg-sky-50/95 text-sky-900',
    icon: <Info size={18} className="text-sky-600" />,
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<ToastItem, 'id'> & { durationMs?: number }) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const { durationMs = 3200, ...content } = toast;
    setToasts(prev => [...prev, { id, ...content }]);
    window.setTimeout(() => dismiss(id), durationMs);
  }, [dismiss]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed z-[100] pointer-events-none bottom-3 left-3 right-3 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[360px]">
        <div className="space-y-2">
          {toasts.map(toast => {
            const tone = styles[toast.type];
            return (
              <div
                key={toast.id}
                className={`pointer-events-auto rounded-2xl border backdrop-blur-md shadow-lg px-4 py-3 animate-toastIn ${tone.wrapper}`}
                role="status"
                aria-live="polite"
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">{tone.icon}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-5">{toast.title}</p>
                    {toast.description && (
                      <p className="text-xs mt-0.5 opacity-80 leading-5">{toast.description}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => dismiss(toast.id)}
                    className="rounded-md p-1 hover:bg-black/5 transition-colors"
                    aria-label="Dismiss notification"
                  >
                    <X size={14} />
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
