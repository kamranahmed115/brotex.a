import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { ALERT_TYPE_META } from '@/types';
import { timeAgo } from '@/lib/format';
import { classNames } from '@/lib/format';

export function NotificationCenter() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const unread = notifications.filter(n => !n.read).length;

  function handleClick(alertId: string, notifId: string) {
    markNotificationRead(notifId);
    setOpen(false);
    navigate(`/alerts/${alertId}`);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
        className="relative rounded-lg p-2 text-ink-300 hover:text-ink-100 hover:bg-ink-800 transition-colors"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 text-[10px] font-bold text-white bg-danger-600 rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border-2 border-ink-900">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-80 surface-raised shadow-card-lg animate-slide-up overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-ink-700">
            <span className="text-sm font-semibold text-ink-100">Notifications</span>
            {unread > 0 && (
              <button onClick={markAllNotificationsRead} className="flex items-center gap-1 text-xs text-steel-400 hover:text-steel-300 transition-colors">
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-ink-400">No notifications</div>
            ) : (
              notifications.map(n => {
                const meta = ALERT_TYPE_META[n.type];
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n.alertId, n.id)}
                    className={classNames(
                      'w-full flex items-start gap-3 px-4 py-3 text-left border-b border-ink-700/50 transition-colors hover:bg-ink-800/60',
                      !n.read && 'bg-steel-700/10',
                    )}
                  >
                    <span className={classNames('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', n.read ? 'bg-ink-600' : 'bg-danger-400 animate-pulse-dot')} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-ink-100 truncate">{meta.shortLabel}</div>
                      <div className="text-xs text-ink-400 truncate">{n.cameraName} — {n.storeShortName}</div>
                      <div className="text-[11px] text-ink-500 mt-0.5">{timeAgo(n.timestamp)}</div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
