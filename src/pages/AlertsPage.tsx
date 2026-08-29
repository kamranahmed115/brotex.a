import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellAlert, ChevronRight, FileClock, AlertCircle } from 'lucide-react';
import { useApp, useAlertsForSelected, useStoresForSelection } from '@/store/AppContext';
import { ALERT_TYPE_META, STATUS_META } from '@/types';
import type { Alert, AlertStatus } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { AlertFilters, defaultFilters, filterAlerts, type AlertFilterState } from '@/components/alerts/AlertFilters';
import { CameraFrame } from '@/components/cameras/CameraFrame';
import { timeAgo, formatTime, formatDate, classNames } from '@/lib/format';

interface AlertsPageProps {
  initialFilter?: 'needs_review' | 'history';
}

export function AlertsPage({ initialFilter }: AlertsPageProps) {
  const navigate = useNavigate();
  const alerts = useAlertsForSelected();
  const stores = useStoresForSelection();
  const { cameras } = useApp();

  const [filters, setFilters] = useState<AlertFilterState>(() => {
    if (initialFilter === 'needs_review') return { ...defaultFilters, status: 'needs_review' };
    if (initialFilter === 'history') return { ...defaultFilters, status: 'resolved' };
    return { ...defaultFilters };
  });
  const [statusChip, setStatusChip] = useState<string>(initialFilter === 'needs_review' ? 'needs_review' : initialFilter === 'history' ? 'resolved' : 'all');

  const pageTitle = initialFilter === 'needs_review' ? 'Needs Review' : initialFilter === 'history' ? 'Alert History' : 'Alerts';
  const pageIcon = initialFilter === 'needs_review' ? <AlertCircle size={20} /> : initialFilter === 'history' ? <FileClock size={20} /> : <BellAlert size={20} />;

  const filtered = useMemo(() => {
    let result = filterAlerts(alerts, filters, cameras, stores);
    if (statusChip !== 'all') {
      result = result.filter(a => a.status === (statusChip as AlertStatus));
    }
    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [alerts, filters, cameras, stores, statusChip]);

  function cameraInfo(camId: string) {
    const c = cameras.find(c => c.id === camId);
    return c ? { name: c.name, location: c.location } : { name: 'Unknown', location: '' };
  }
  function storeName(storeId: string) {
    return stores.find(s => s.id === storeId)?.shortName ?? '';
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-ink-800 border border-ink-700 flex items-center justify-center text-ink-300">
            {pageIcon}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{pageTitle}</h1>
            <p className="text-sm text-ink-400">{filtered.length} alert{filtered.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <AlertFilters
          filters={filters}
          onChange={setFilters}
          showStatusChips={!initialFilter}
          onStatusChip={setStatusChip}
          activeStatusChip={statusChip}
        />
      </Card>

      {/* Table — desktop */}
      <Card noPadding className="hidden md:block overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon="alerts" title="No alerts found" message="No alerts match the selected filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-700 bg-ink-900/50">
                  <th className="text-left text-[11px] font-semibold text-ink-400 uppercase tracking-wide px-4 py-2.5">Alert</th>
                  <th className="text-left text-[11px] font-semibold text-ink-400 uppercase tracking-wide px-4 py-2.5">Camera</th>
                  <th className="text-left text-[11px] font-semibold text-ink-400 uppercase tracking-wide px-4 py-2.5">Store</th>
                  <th className="text-left text-[11px] font-semibold text-ink-400 uppercase tracking-wide px-4 py-2.5">Time</th>
                  <th className="text-left text-[11px] font-semibold text-ink-400 uppercase tracking-wide px-4 py-2.5">Confidence</th>
                  <th className="text-left text-[11px] font-semibold text-ink-400 uppercase tracking-wide px-4 py-2.5">Priority</th>
                  <th className="text-left text-[11px] font-semibold text-ink-400 uppercase tracking-wide px-4 py-2.5">Status</th>
                  <th className="w-8 px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-700/60">
                {filtered.map((alert: Alert) => {
                  const meta = ALERT_TYPE_META[alert.type];
                  const cam = cameraInfo(alert.cameraId);
                  return (
                    <tr
                      key={alert.id}
                      onClick={() => navigate(`/alerts/${alert.id}`)}
                      className="hover:bg-ink-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-9 rounded overflow-hidden bg-ink-800 border border-ink-700 flex-shrink-0 relative">
                            <CameraFrame cameraName={cam.name} location={cam.location} online showLabel={false} scanline={false} className="!rounded-none !border-0 w-full h-full" aspect="square" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-ink-100 truncate">{meta.shortLabel}</div>
                            <div className="text-xs text-ink-500 truncate">{meta.label}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-ink-200">{cam.name}</div>
                        <div className="text-xs text-ink-500">{cam.location}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-300">{storeName(alert.storeId)}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-ink-200">{formatTime(alert.timestamp)}</div>
                        <div className="text-xs text-ink-500">{formatDate(alert.timestamp)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 rounded-full bg-ink-700 overflow-hidden">
                            <div className={classNames('h-full rounded-full', alert.confidence >= 90 ? 'bg-danger-400' : alert.confidence >= 80 ? 'bg-warning-400' : 'bg-steel-400')} style={{ width: `${alert.confidence}%` }} />
                          </div>
                          <span className="text-xs text-ink-300">{alert.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><PriorityBadge priority={alert.priority} size="sm" /></td>
                      <td className="px-4 py-3"><StatusBadge status={alert.status} size="sm" /></td>
                      <td className="px-4 py-3">
                        <ChevronRight size={16} className="text-ink-600 group-hover:text-ink-300 transition-colors" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Cards — mobile */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <Card><EmptyState icon="alerts" title="No alerts found" message="No alerts match the selected filters." /></Card>
        ) : (
          filtered.map(alert => {
            const meta = ALERT_TYPE_META[alert.type];
            const cam = cameraInfo(alert.cameraId);
            return (
              <Card key={alert.id} noPadding className="overflow-hidden cursor-pointer hover:border-ink-600 transition-colors" onClick={() => navigate(`/alerts/${alert.id}`)}>
                <div className="flex gap-3 p-3">
                  <div className="w-20 h-16 rounded overflow-hidden bg-ink-800 border border-ink-700 flex-shrink-0 relative">
                    <CameraFrame cameraName={cam.name} location={cam.location} online showLabel={false} scanline={false} className="!rounded-none !border-0 w-full h-full" aspect="square" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink-100 truncate">{meta.shortLabel}</div>
                    <div className="text-xs text-ink-400 truncate">{cam.name} — {storeName(alert.storeId)}</div>
                    <div className="text-xs text-ink-500 mt-0.5">{timeAgo(alert.timestamp)}</div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <StatusBadge status={alert.status} size="sm" />
                      <PriorityBadge priority={alert.priority} size="sm" />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
