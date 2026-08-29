import { Search, X, Filter } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import type { SelectOption } from '@/components/ui/Select';
import { useApp, useStoresForSelection } from '@/store/AppContext';
import { ALERT_TYPE_META, PRIORITY_META, STATUS_META } from '@/types';
import type { AlertType, AlertPriority, AlertStatus } from '@/types';
import { classNames } from '@/lib/format';

export interface AlertFilterState {
  search: string;
  storeId: string;
  type: string;
  status: string;
  priority: string;
  cameraId: string;
  date: string;
}

export const defaultFilters: AlertFilterState = {
  search: '',
  storeId: 'all',
  type: 'all',
  status: 'all',
  priority: 'all',
  cameraId: 'all',
  date: '',
};

interface AlertFiltersProps {
  filters: AlertFilterState;
  onChange: (filters: AlertFilterState) => void;
  showStatusChips?: boolean;
  onStatusChip?: (status: string) => void;
  activeStatusChip?: string;
}

export function AlertFilters({ filters, onChange, showStatusChips, onStatusChip, activeStatusChip }: AlertFiltersProps) {
  const { cameras } = useApp();
  const stores = useStoresForSelection();

  const storeOptions: SelectOption[] = [
    { value: 'all', label: 'All Stores' },
    ...stores.map(s => ({ value: s.id, label: s.shortName })),
  ];

  const typeOptions: SelectOption[] = [
    { value: 'all', label: 'All Types' },
    ...Object.values(ALERT_TYPE_META).map(m => ({ value: m.type, label: m.label })),
  ];

  const priorityOptions: SelectOption[] = [
    { value: 'all', label: 'All Priorities' },
    ...Object.entries(PRIORITY_META).map(([k, v]) => ({ value: k, label: v.label })),
  ];

  const statusOptions: SelectOption[] = [
    { value: 'all', label: 'All Statuses' },
    ...Object.entries(STATUS_META).map(([k, v]) => ({ value: k, label: v.label })),
  ];

  const cameraOptions: SelectOption[] = [
    { value: 'all', label: 'All Cameras' },
    ...cameras.map(c => ({ value: c.id, label: `${c.name} — ${c.location}` })),
  ];

  const hasActiveFilters = filters.search || filters.storeId !== 'all' || filters.type !== 'all' ||
    filters.priority !== 'all' || (filters.status !== 'all' && !showStatusChips) || filters.cameraId !== 'all' || filters.date;

  const statusChips = ['all', 'new', 'needs_review', 'acknowledged', 'resolved'];

  return (
    <div className="space-y-3">
      {/* Search + status chips */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={filters.search}
            onChange={e => onChange({ ...filters, search: e.target.value })}
            className="input-base pl-9"
            placeholder="Search alerts..."
          />
        </div>
        {showStatusChips && onStatusChip && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {statusChips.map(s => (
              <button
                key={s}
                onClick={() => onStatusChip(s)}
                className={classNames(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                  activeStatusChip === s
                    ? 'bg-steel-600/20 border-steel-600/40 text-steel-200'
                    : 'bg-ink-850 border-ink-700 text-ink-400 hover:text-ink-200 hover:border-ink-600',
                )}
              >
                {s === 'all' ? 'All' : STATUS_META[s as AlertStatus].label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {!showStatusChips && (
          <Select value={filters.status} onChange={v => onChange({ ...filters, status: v })} options={statusOptions} placeholder="Status" size="sm" />
        )}
        {showStatusChips && (
          <Select value={filters.storeId} onChange={v => onChange({ ...filters, storeId: v })} options={storeOptions} placeholder="Store" size="sm" />
        )}
        {showStatusChips && (
          <Select value={filters.priority} onChange={v => onChange({ ...filters, priority: v })} options={priorityOptions} placeholder="Priority" size="sm" />
        )}
        {!showStatusChips && (
          <Select value={filters.storeId} onChange={v => onChange({ ...filters, storeId: v })} options={storeOptions} placeholder="Store" size="sm" />
        )}
        {!showStatusChips && (
          <Select value={filters.type} onChange={v => onChange({ ...filters, type: v })} options={typeOptions} placeholder="Type" size="sm" />
        )}
        {!showStatusChips && (
          <Select value={filters.priority} onChange={v => onChange({ ...filters, priority: v })} options={priorityOptions} placeholder="Priority" size="sm" />
        )}
        <Select value={filters.cameraId} onChange={v => onChange({ ...filters, cameraId: v })} options={cameraOptions} placeholder="Camera" size="sm" />
        <input
          type="date"
          value={filters.date}
          onChange={e => onChange({ ...filters, date: e.target.value })}
          className="input-base !py-1.5 text-xs"
        />
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-ink-400">
            <Filter size={13} />
            <span>Filters active</span>
          </div>
          <button
            onClick={() => onChange({ ...defaultFilters })}
            className="flex items-center gap-1 text-xs text-steel-400 hover:text-steel-300 transition-colors"
          >
            <X size={13} />
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export function filterAlerts(
  alerts: import('@/types').Alert[],
  filters: AlertFilterState,
  cameras: import('@/types').Camera[],
  stores: import('@/types').Store[],
): import('@/types').Alert[] {
  return alerts.filter(a => {
    if (filters.search) {
      const meta = ALERT_TYPE_META[a.type];
      const cam = cameras.find(c => c.id === a.cameraId);
      const store = stores.find(s => s.id === a.storeId);
      const q = filters.search.toLowerCase();
      const haystack = `${meta.label} ${meta.shortLabel} ${cam?.name} ${cam?.location} ${store?.name} ${a.summary}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.storeId !== 'all' && a.storeId !== filters.storeId) return false;
    if (filters.type !== 'all' && a.type !== filters.type) return false;
    if (filters.priority !== 'all' && a.priority !== filters.priority) return false;
    if (filters.status !== 'all' && a.status !== filters.status) return false;
    if (filters.cameraId !== 'all' && a.cameraId !== filters.cameraId) return false;
    if (filters.date) {
      const alertDate = new Date(a.timestamp).toISOString().slice(0, 10);
      if (alertDate !== filters.date) return false;
    }
    return true;
  });
}
