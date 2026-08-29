import type { AlertPriority, AlertStatus, CameraStatus, UserRole, UserStatus, StoreStatus } from '@/types';
import { PRIORITY_META, STATUS_META } from '@/types';
import { classNames } from '@/lib/format';

export function PriorityBadge({ priority, size = 'md' }: { priority: AlertPriority; size?: 'sm' | 'md' }) {
  const meta = PRIORITY_META[priority];
  return (
    <span className={classNames(
      'inline-flex items-center gap-1.5 rounded-md border font-medium',
      size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
      meta.color,
    )}>
      <span className={classNames('w-1.5 h-1.5 rounded-full', meta.dot)} />
      {meta.label}
    </span>
  );
}

export function StatusBadge({ status, size = 'md' }: { status: AlertStatus; size?: 'sm' | 'md' }) {
  const meta = STATUS_META[status];
  return (
    <span className={classNames(
      'inline-flex items-center gap-1.5 rounded-md border font-medium',
      size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
      meta.color,
    )}>
      <span className={classNames('w-1.5 h-1.5 rounded-full', meta.dot)} />
      {meta.label}
    </span>
  );
}

export function CameraStatusBadge({ status }: { status: CameraStatus }) {
  if (status === 'online') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-success-500/30 bg-success-500/10 px-2 py-0.5 text-xs font-medium text-success-200">
        <span className="w-1.5 h-1.5 rounded-full bg-success-400" />
        Online
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-ink-600 bg-ink-700/40 px-2 py-0.5 text-xs font-medium text-ink-300">
      <span className="w-1.5 h-1.5 rounded-full bg-ink-500" />
      Offline
    </span>
  );
}

export function StoreStatusBadge({ status }: { status: StoreStatus }) {
  const map = {
    operational: { label: 'Operational', cls: 'border-success-500/30 bg-success-500/10 text-success-200', dot: 'bg-success-400' },
    degraded: { label: 'Degraded', cls: 'border-warning-500/30 bg-warning-500/10 text-warning-200', dot: 'bg-warning-400' },
    offline: { label: 'Offline', cls: 'border-danger-500/30 bg-danger-500/10 text-danger-200', dot: 'bg-danger-400' },
  };
  const m = map[status];
  return (
    <span className={classNames('inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium', m.cls)}>
      <span className={classNames('w-1.5 h-1.5 rounded-full', m.dot)} />
      {m.label}
    </span>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  const map = {
    owner: 'text-steel-200 bg-steel-600/15 border-steel-600/30',
    manager: 'text-accent-400 bg-accent-600/10 border-accent-600/30',
    staff: 'text-ink-200 bg-ink-700/50 border-ink-600',
  };
  return (
    <span className={classNames('inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize', map[role])}>
      {role}
    </span>
  );
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  if (status === 'active') {
    return <span className="inline-flex items-center rounded-md border border-success-500/30 bg-success-500/10 px-2 py-0.5 text-xs font-medium text-success-200">Active</span>;
  }
  return <span className="inline-flex items-center rounded-md border border-ink-600 bg-ink-700/40 px-2 py-0.5 text-xs font-medium text-ink-300">Disabled</span>;
}

export function AIBadge({ enabled, mode }: { enabled: boolean; mode?: string | null }) {
  if (!enabled) {
    return <span className="inline-flex items-center rounded-md border border-ink-600 bg-ink-700/40 px-2 py-0.5 text-xs font-medium text-ink-400">AI Off</span>;
  }
  const modeLabels: Record<string, string> = {
    shoplifting: 'Shoplifting',
    restricted_access: 'Restricted Access',
    loitering: 'Loitering',
  };
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-steel-600/30 bg-steel-600/10 px-2 py-0.5 text-xs font-medium text-steel-300">
      <span className="w-1.5 h-1.5 rounded-full bg-steel-400" />
      AI: {mode ? modeLabels[mode] : 'Active'}
    </span>
  );
}
