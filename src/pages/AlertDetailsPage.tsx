import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, AlertCircle, FileCheck, Clock, Video, Cpu,
  Tag, Activity, Camera as CameraIcon, Store as StoreIcon, ChevronRight, Check
} from 'lucide-react';
import { useApp, useAlertById, useCameraById, useStoreById } from '@/store/AppContext';
import { ALERT_TYPE_META, PRIORITY_META } from '@/types';
import type { AlertStatus } from '@/types';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { VideoPlayer } from '@/components/alerts/VideoPlayer';
import { formatDuration, formatDateLong, classNames } from '@/lib/format';
import { toast } from '@/components/ui/Toast';

export function AlertDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const alert = useAlertById(id);
  const camera = useCameraById(alert?.cameraId);
  const store = useStoreById(alert?.storeId);
  const { updateAlertStatus } = useApp();

  if (!alert) {
    return (
      <Card>
        <EmptyState
          icon="search"
          title="Alert not found"
          message="This alert may have been removed or the link is incorrect."
          action={<Button variant="secondary" onClick={() => navigate('/alerts')}>Back to Alerts</Button>}
        />
      </Card>
    );
  }

  const meta = ALERT_TYPE_META[alert.type];

  async function handleStatusChange(newStatus: AlertStatus) {
    await updateAlertStatus(alert!.id, newStatus);
    const labels: Record<AlertStatus, string> = { new: 'marked as new', acknowledged: 'acknowledged', needs_review: 'marked for review', resolved: 'resolved' };
    toast('success', `Alert ${labels[newStatus]}.`);
  }

  const canAcknowledge = alert.status === 'new' || alert.status === 'needs_review';
  const canResolve = alert.status !== 'resolved';
  const canReview = alert.status === 'new';

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Back link */}
      <button
        onClick={() => navigate('/alerts')}
        className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-100 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Alerts
      </button>

      {/* Main Incident Card */}
      <Card noPadding className="border-ink-700 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-ink-950 p-6 border-b border-ink-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={classNames(
              'w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0',
              alert.priority === 'critical' ? 'bg-danger-500/10 border-danger-500/30 text-danger-400'
                : alert.priority === 'high' ? 'bg-warning-500/10 border-warning-500/30 text-warning-400'
                : 'bg-steel-600/10 border-steel-600/30 text-steel-400',
            )}>
              {meta.domain === 'inside' ? <AlertCircle size={24} /> : <Activity size={24} />}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{alert.summary || meta.label}</h1>
              <div className="flex items-center gap-3 mt-2">
                <PriorityBadge priority={alert.priority} />
                <span className="text-ink-600">·</span>
                <StatusBadge status={alert.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-ink-800">
          
          {/* Left: Video Evidence */}
          <div className="lg:col-span-2 p-6 bg-ink-900/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-ink-100 uppercase tracking-wide flex items-center gap-2">
                <Video size={16} className="text-steel-400" /> Video Evidence
              </h2>
            </div>
            <VideoPlayer
              cameraName={camera?.name ?? 'Unknown'}
              location={camera?.location ?? ''}
              durationSec={alert.clipDurationSec}
              confidence={alert.confidence}
            />
          </div>

          {/* Right: Incident Information */}
          <div className="p-6 bg-ink-950">
            <h2 className="text-sm font-bold text-ink-100 uppercase tracking-wide flex items-center gap-2 mb-6">
              <FileCheck size={16} className="text-steel-400" /> Incident Information
            </h2>
            
            <dl className="space-y-4">
              <MetaRow icon={<StoreIcon size={14} />} label="Store" value={store?.name ?? '—'} />
              <MetaRow icon={<CameraIcon size={14} />} label="Camera" value={camera ? camera.name : '—'} subValue={camera?.location} />
              <MetaRow icon={<Clock size={14} />} label="Timestamp" value={formatDateLong(alert.timestamp)} />
              <MetaRow icon={<Cpu size={14} />} label="Confidence" value={`${alert.confidence}%`} />
              <MetaRow icon={<AlertCircle size={14} />} label="Detection Type" value={meta.label} />
              <MetaRow icon={<Activity size={14} />} label="Duration" value={formatDuration(alert.clipDurationSec)} />
              <MetaRow icon={<Tag size={14} />} label="ROI Zone" value="Default Zone" />
            </dl>
          </div>
        </div>

        {/* Footer: Alert Actions */}
        <div className="p-6 bg-ink-900 border-t border-ink-800">
          <h2 className="text-[11px] font-bold text-ink-400 uppercase tracking-wide mb-3">Alert Actions</h2>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button variant="primary" className="w-full sm:w-auto" disabled={!canAcknowledge} onClick={() => handleStatusChange('acknowledged')}>
              <CheckCircle2 size={16} className="mr-2" /> Acknowledge
            </Button>
            <Button variant="secondary" className="w-full sm:w-auto border-success-500/30 text-success-300 hover:bg-success-500/10" disabled={!canResolve} onClick={() => handleStatusChange('resolved')}>
              <Check size={16} className="mr-2" /> Resolve Incident
            </Button>
            <Button variant="ghost" className="w-full sm:w-auto" disabled={!canReview} onClick={() => handleStatusChange('needs_review')}>
              <AlertCircle size={16} className="mr-2" /> Needs Review
            </Button>
          </div>
        </div>
      </Card>

      {/* Incident Timeline */}
      <Card>
        <CardHeader title="Incident Timeline" icon={<Clock size={16} />} />
        <div className="mt-6 ml-2 border-l-2 border-ink-800 pl-6 space-y-6">
          <div className="relative">
            <div className="absolute -left-[31px] bg-ink-900 border-2 border-steel-500 w-4 h-4 rounded-full" />
            <div className="text-xs text-ink-400 mb-1">{formatDateLong(alert.timestamp)}</div>
            <div className="text-sm font-medium text-white">Potential concealment detected</div>
          </div>
          <div className="relative">
            <div className="absolute -left-[31px] bg-ink-900 border-2 border-danger-500 w-4 h-4 rounded-full" />
            <div className="text-xs text-ink-400 mb-1">3 seconds later</div>
            <div className="text-sm font-medium text-white">Alert generated in VORTEX.AI</div>
          </div>
          {alert.status === 'acknowledged' || alert.status === 'resolved' ? (
            <div className="relative">
              <div className="absolute -left-[31px] bg-ink-900 border-2 border-warning-500 w-4 h-4 rounded-full" />
              <div className="text-xs text-ink-400 mb-1">Status changed</div>
              <div className="text-sm font-medium text-white">Alert acknowledged by operator</div>
            </div>
          ) : null}
          {alert.status === 'resolved' ? (
            <div className="relative">
              <div className="absolute -left-[31px] bg-success-500 border-2 border-success-500 w-4 h-4 rounded-full" />
              <div className="text-xs text-ink-400 mb-1">Status changed</div>
              <div className="text-sm font-medium text-white">Alert resolved</div>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

function MetaRow({ icon, label, value, subValue }: { icon: React.ReactNode; label: string; value: string; subValue?: string }) {
  return (
    <div className="flex flex-col gap-1 py-1">
      <dt className="flex items-center gap-2 text-ink-400 text-xs">
        <span className="text-ink-500">{icon}</span>
        {label}
      </dt>
      <dd className="text-ink-100 text-sm font-medium ml-6">
        {value}
        {subValue && <div className="text-xs font-normal text-ink-500 mt-0.5">{subValue}</div>}
      </dd>
    </div>
  );
}
