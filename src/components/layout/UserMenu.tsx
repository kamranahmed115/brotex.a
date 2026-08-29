import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, UserCircle, LogOut, Settings } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { RoleBadge } from '@/components/ui/Badge';
import { classNames } from '@/lib/format';

export function UserMenu() {
  const { user, logout } = useApp();
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

  if (!user) return null;

  const initials = user.name.split(' ').map(n => n[0]).slice(0, 2).join('');

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="User menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-ink-800 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-steel-600 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
          {initials}
        </div>
        <div className="hidden md:block text-left min-w-0">
          <div className="text-sm font-medium text-ink-100 truncate max-w-[120px]">{user.name}</div>
          <div className="text-xs text-ink-400 capitalize">{user.role}</div>
        </div>
        <ChevronDown size={15} className={classNames('text-ink-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-56 surface-raised shadow-card-lg py-1.5 animate-slide-up">
          <div className="px-3 py-2.5 border-b border-ink-700">
            <div className="text-sm font-medium text-ink-100">{user.name}</div>
            <div className="text-xs text-ink-400 truncate">{user.email}</div>
            <div className="mt-1.5"><RoleBadge role={user.role} /></div>
          </div>
          <button
            onClick={() => { setOpen(false); navigate('/settings'); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink-300 hover:text-ink-100 hover:bg-ink-800 transition-colors"
          >
            <Settings size={16} />
            Settings
          </button>
          <button
            onClick={() => { setOpen(false); logout(); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-danger-300 hover:bg-danger-500/10 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
