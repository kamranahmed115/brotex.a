import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, Video, VideoOff, Cpu, ArrowRight, Activity, Clock,
} from 'lucide-react';
import {
  useApp, useCamerasForSelected, useAlertsForSelected, useSelectedStores,
} from '@/store/AppContext';
import { ALERT_TYPE_META, PRIORITY_META, STATUS_META } from '@/types';
import type { Alert } from '@/types';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PriorityBadge, StatusBadge, CameraStatusBadge, AIBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CameraFrame } from '@/components/cameras/CameraFrame';
import { timeAgo, classNames } from '@/lib/format';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent: 'danger' | 'success' | 'warning' | 'steel';
  onClick?: () => void;
}

function StatCard({ label, value, sub, icon, accent, onClick }: StatCardProps) {
  const accents = {
    danger: 'text-danger-400 bg-danger-500/10 border-danger-500/20',
    success: 'text-success-400 bg-success-500/10 border-success-500/20',
    warning: 'text-warning-400 bg-warning-500/10 border-warning-500/20',
    steel: 'text-steel-400 bg-steel-600/10 border-steel-600/20',
  };
  return (
    <Card className={classNames(onClick && 'cursor-pointer hover:border-ink-600 transition-colors')} onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className={classNames('w-9 h-9 rounded-lg border flex items-center justify-center', accents[accent])}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
      <div className="text-xs font-medium text-ink-400 mt-1 uppercase tracking-wide">{label}</div>
      {sub && <div className="text-xs text-ink-500 mt-0.5">{sub}</div>}
    </Card>
  );
}

export function OverviewPage() {
  const navigate = useNavigate();
  const cameras = useCamerasForSelected();
  const alerts = useAlertsForSelected();
  const stores = useSelectedStores();
  const { cameras: allCameras } = useApp();

  const activeAlerts = alerts.filter(a => a.status === 'new' || a.status === 'needs_review');
  const onlineCameras = cameras.filter(c => c.status === 'online');
  const offlineCameras = cameras.filter(c => c.status === 'offline');
  const aiCameras = cameras.filter(c => c.aiEnabled && c.status === 'online');
  const recentAlerts = [...alerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
  const recentIncidents = alerts.filter(a => a.status === 'resolved' || a.status === 'acknowledged').slice(0, 4);

  const cameraHealthCameras = cameras.slice(0, 8);

  function cameraName(camId: string) {
    const c = allCameras.find(c => c.id === camId);
    return c ? c.name : 'Unknown';
  }
  function cameraLocation(camId: string) {
    const c = allCameras.find(c => c.id === camId);
    return c ? c.location : '';
  }
  function storeShortName(storeId: string) {
    const s = stores.find(s => s.id === storeId);
    return s?.shortName ?? '';
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-white">Overview</h1>
        <p className="text-sm text-ink-400 mt-0.5">
          {stores.length === 1 ? stores[0].name : `${stores.length} stores`} — Real-time security status
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Alerts"
          value={activeAlerts.length}
          sub={alerts.filter(a => a.status === 'new').length + ' new'}
          icon={<AlertTriangle size={18} />}
          accent="danger"
          onClick={() => navigate('/alerts')}
        />
        <StatCard
          label="Cameras Online"
          value={`${onlineCameras.length} / ${cameras.length}`}
          icon={<Video size={18} />}
          accent="success"
        />
        <StatCard
          label="Cameras Offline"
          value={offlineCameras.length}
          icon={<VideoOff size={18} />}
          accent="warning"
        />
        <StatCard
          label="AI Active"
          value={aiCameras.length}
          sub={`${cameras.filter(c => c.aiEnabled).length} AI-enabled total`}
          icon={<Cpu size={18} />}
          accent="steel"
          onClick={() => navigate('/cameras')}
        />
      </div>

      {/* Active alerts + Camera health */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Active alerts — spans 2 */}
        <Card noPadding className="xl:col-span-2">
          <CardHeader
            title="Active Alerts"
            subtitle="Most recent alerts requiring attention"
            icon={<AlertTriangle size={16} />}
            action={<Button variant="ghost" size="sm" onClick={() => navigate('/alerts')}>View all <ArrowRight size={14} /></Button>}
            className="px-5 pt-5"
          />
          {recentAlerts.length === 0 ? (
            <EmptyState icon="alerts" title="No active alerts" message="No active security alerts right now." />
          ) : (
            <div className="divide-y divide-ink-700">
              {recentAlerts.map((alert: Alert) => {
                const meta = ALERT_TYPE_META[alert.type];
                return (
                  <button
                    key={alert.id}
                    onClick={() => navigate(`/alerts/${alert.id}`)}
                    className="w-full flex items-center gap-4 px-5 py-3 hover:bg-ink-800/50 transition-colors text-left group"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-12 rounded-md overflow-hidden bg-ink-800 border border-ink-700 flex-shrink-0 relative">
                      <CameraFrame cameraName={cameraName(alert.cameraId)} location={cameraLocation(alert.cameraId)} online showLabel={false} scanline={false} className="!rounded-none !border-0 w-full h-full" aspect="square" />
                      <div className="absolute bottom-0.5 right-0.5 text-[8px] text-white/80 bg-black/60 rounded px-1">{alert.clipDurationSec}s</div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-ink-100 truncate">{meta.shortLabel}</span>
                        {alert.priority === 'critical' && (
                          <span className="text-[10px] font-bold text-danger-300 bg-danger-500/15 border border-danger-500/30 rounded px-1.5 py-0.5">CRITICAL</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-ink-400">
                        <span>{cameraName(alert.cameraId)}</span>
                        <span className="text-ink-600">·</span>
                        <span>{storeShortName(alert.storeId)}</span>
                        <span className="text-ink-600">·</span>
                        <span>{timeAgo(alert.timestamp)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="hidden sm:block text-right">
                        <div className="text-xs font-medium text-steel-300">{alert.confidence}%</div>
                        <div className="text-[10px] text-ink-500">confidence</div>
                      </div>
                      <StatusBadge status={alert.status} size="sm" />
                      <ArrowRight size={15} className="text-ink-500 group-hover:text-ink-200 transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        {/* Camera health */}
        <Card noPadding>
          <CardHeader
            title="Camera Health"
            subtitle={`${onlineCameras.length} of ${cameras.length} online`}
            icon={<Video size={16} />}
            action={<Button variant="ghost" size="sm" onClick={() => navigate('/cameras')}>All <ArrowRight size={14} /></Button>}
            className="px-5 pt-5"
          />
          <div className="divide-y divide-ink-700 max-h-[420px] overflow-y-auto">
            {cameraHealthCameras.map(cam => (
              <div key={cam.id} className="flex items-center justify-between gap-3 px-5 py-2.5 hover:bg-ink-800/40 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={classNames('w-2 h-2 rounded-full flex-shrink-0', cam.status === 'online' ? 'bg-success-400' : 'bg-ink-500')} />
                  <div className="min-w-0">
                    <div className="text-sm text-ink-100 truncate">{cam.name}</div>
                    <div className="text-xs text-ink-400 truncate">{cam.location}</div>
                  </div>
                </div>
                <CameraStatusBadge status={cam.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent incidents */}
      <Card noPadding>
        <CardHeader
          title="Recent Incidents"
          subtitle="Recently acknowledged & resolved alerts"
          icon={<Activity size={16} />}
          action={<Button variant="ghost" size="sm" onClick={() => navigate('/alerts/history')}>History <ArrowRight size={14} /></Button>}
          className="px-5 pt-5"
        />
        {recentIncidents.length === 0 ? (
          <EmptyState icon="incidents" title="No incidents found" message="No incidents found for the selected filters." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink-700">
            {recentIncidents.map(alert => {
              const meta = ALERT_TYPE_META[alert.type];
              return (
                <button
                  key={alert.id}
                  onClick={() => navigate(`/alerts/${alert.id}`)}
                  className="bg-ink-850 p-4 hover:bg-ink-800 transition-colors text-left group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <StatusBadge status={alert.status} size="sm" />
                    <span className="flex items-center gap-1 text-[11px] text-ink-500">
                      <Clock size={12} />
                      {timeAgo(alert.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-ink-100 mb-1 truncate">{meta.shortLabel}</div>
                  <div className="text-xs text-ink-400 truncate">{cameraName(alert.cameraId)} — {storeShortName(alert.storeId)}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <PriorityBadge priority={alert.priority} size="sm" />
                    <span className="text-xs text-steel-300">{alert.confidence}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
