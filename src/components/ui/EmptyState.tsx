import type { ReactNode } from 'react';
import { Inbox, CameraOff, SearchX, ShieldAlert, ZapOff } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'alerts' | 'cameras' | 'incidents' | 'roi' | 'search' | 'error' | 'generic';
  title: string;
  message: string;
  action?: ReactNode;
}

const icons = {
  alerts: ShieldAlert,
  cameras: CameraOff,
  incidents: Inbox,
  roi: SearchX,
  search: SearchX,
  error: ZapOff,
  generic: Inbox,
};

export function EmptyState({ icon = 'generic', title, message, action }: EmptyStateProps) {
  const Icon = icons[icon];
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-12 h-12 rounded-xl bg-ink-800 border border-ink-700 flex items-center justify-center mb-4 text-ink-500">
        <Icon size={24} />
      </div>
      <h3 className="text-sm font-semibold text-ink-200 mb-1">{title}</h3>
      <p className="text-sm text-ink-400 max-w-sm mb-4">{message}</p>
      {action}
    </div>
  );
}

export function ErrorState({ title, message, onRetry }: { title: string; message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-12 h-12 rounded-xl bg-danger-500/10 border border-danger-500/20 flex items-center justify-center mb-4 text-danger-300">
        <ZapOff size={24} />
      </div>
      <h3 className="text-sm font-semibold text-ink-200 mb-1">{title}</h3>
      <p className="text-sm text-ink-400 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary">Try Again</button>
      )}
    </div>
  );
}
