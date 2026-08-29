import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-react';
import { classNames } from '@/lib/format';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastData {
  id: number;
  type: ToastType;
  message: string;
}

let toastId = 0;
const listeners = new Set<(toast: ToastData) => void>();

export function toast(type: ToastType, message: string) {
  const t: ToastData = { id: ++toastId, type, message };
  listeners.forEach(l => l(t));
}

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colorMap = {
  success: 'text-success-400 border-success-500/30 bg-success-500/5',
  error: 'text-danger-400 border-danger-500/30 bg-danger-500/5',
  warning: 'text-warning-400 border-warning-500/30 bg-warning-500/5',
  info: 'text-steel-400 border-steel-600/30 bg-steel-600/5',
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const listener = (t: ToastData) => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 4000);
    };
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 max-w-sm">
      {toasts.map(t => {
        const Icon = iconMap[t.type];
        return (
          <div
            key={t.id}
            className={classNames(
              'flex items-start gap-3 rounded-xl border shadow-card-lg px-4 py-3 animate-slide-in-right bg-ink-850',
              colorMap[t.type],
            )}
          >
            <Icon size={18} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm text-ink-100 flex-1">{t.message}</p>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="text-ink-400 hover:text-ink-100 flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
