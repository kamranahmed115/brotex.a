import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, AlertCircle, FileCheck, Clock, Video, Cpu,
  Tag, Activity, Camera as CameraIcon, Store as StoreIcon, ChevronRight,
} from 'lucide-react';
import { useApp, useAlertById, useCameraById, useStoreById } from '@/store/AppContext';
import { ALERT_TYPE_META, PRIORITY_META } from '@/types';
import type { AlertStatus } from '@/types';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { VideoPlayer } from '@/components/alerts/VideoPlayer';
import { formatDuration, formatDateLong, formatTimeShort, classNames } from '@/lib/format';
import { toast } from '@/components/ui/Toast';

export function AlertDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const alert = useAlertById(id);
  const camera = useCameraById(alert?.cameraId);
  const store = useStoreById(alert?.storeId);
  const { updateAlertStatus, cameras } = useApp();

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

  function handleStatusChange(newStatus: AlertStatus) {
    updateAlertStatus(alert!.id, newStatus);
    const labels: Record<AlertStatus, string> = { new: 'marked as new', acknowledged: 'acknowledged', needs_review: 'marked for review', resolved: 'resolved' };
    toast('success', `Alert ${labels[newStatus]}.`);
  }

  const canAcknowledge = alert.status === 'new' || alert.status === 'needs_review';
  const canResolve = alert.status !== 'resolved';
  const canReview = alert.status === 'new';

  return (
    <div className="space-y-5">
      {/* Back link */}
      <button
        onClick={() => navigate('/alerts')}
        className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-100 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Alerts
      </button>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
            <h1 className="text-xl font-bold text-white">{meta.label}</h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-ink-400 flex-wrap">
              <span className="flex items-center gap-1"><CameraIcon size={14} /> {camera?.name}</span>
              <span className="text-ink-600">·</span>
              <span className="flex items-center gap-1"><StoreIcon size={14} /> {store?.name}</span>
            </div>
            <div className="text-sm text-ink-400 mt-0.5">{formatDateLong(alert.timestamp)}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={alert.priority} />
          <StatusBadge status={alert.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: Video + sequence */}
        <div className="xl:col-span-2 space-y-5">
          {/* Video player */}
          <VideoPlayer
            cameraName={camera?.name ?? 'Unknown'}
            location={camera?.location ?? ''}
            durationSec={alert.clipDurationSec}
            confidence={alert.confidence}
          />

          {/* Alert summary */}
          <Card>
            <CardHeader title="Alert Summary" icon={<AlertCircle size={16} />} />
            <div className="rounded-lg border border-warning-500/20 bg-warning-500/5 px-4 py-3 mb-4">
              <p className="text-sm text-ink-200">{alert.summary}</p>
            </div>

            {/* Detection sequence */}
            <div>
              <h4 className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-3">Detection Sequence</h4>
              <div className="space-y-0">
                {alert.detectionSequence.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {/* Vertical line + dot */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className={classNames(
                        'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                        step.reached ? 'bg-accent-600/20 text-accent-400 border border-accent-600/40' : 'bg-ink-700 text-ink-500 border border-ink-600',
                      )}>
                        {i + 1}
                      </div>
                      {i < alert.detectionSequence.length - 1 && (
                        <div className={classNames('w-px h-7', step.reached ? 'bg-accent-600/30' : 'bg-ink-700')} />
                      )}
                    </div>
                    {/* Label */}
                    <div className="pt-1.5 pb-2">
                      <span className={classNames('text-sm', step.reached ? 'text-ink-100' : 'text-ink-500')}>
                        {step.label}
                      </span>
                    </div>
                    {/* Arrow for flow */}
                    {i < alert.detectionSequence.length - 1 && (
                      <div className="hidden" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Actions + metadata */}
        <div className="space-y-5">
          {/* Actions */}
          <Card>
            <CardHeader title="Actions" icon={<FileCheck size={16} />} />
            <div className="space-y-2">
              <Button
                variant="primary"
                className="w-full"
                disabled={!canAcknowledge}
                onClick={() => handleStatusChange('acknowledged')}
              >
                <CheckCircle2 size={16} />
                Acknowledge
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                disabled={!canResolve}
                onClick={() => handleStatusChange('resolved')}
              >
                <FileCheck size={16} />
                Resolve
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                disabled={!canReview}
                onClick={() => handleStatusChange('needs_review')}
              >
                <AlertCircle size={16} />
                Needs Review
              </Button>
            </div>

            {/* Status flow indicator */}
            <div className="mt-4 pt-4 border-t border-ink-700">
              <div className="text-[10px] font-semibold text-ink-500 uppercase tracking-wide mb-2">Status Flow</div>
              <div className="flex items-center gap-1.5 text-xs">
                {(['new', 'acknowledged', 'resolved'] as AlertStatus[]).map((s, i) => (
                  <div key={s} className="flex items-center gap-1.5">
                    <span className={classNames(
                      'px-1.5 py-0.5 rounded font-medium',
                      alert.status === s ? 'bg-steel-600/30 text-steel-200' : 'text-ink-500',
                    )}>
                      {s === 'needs_review' ? 'Review' : s.replace('_', ' ')}
                    </span>
                    {i < 2 && <ChevronRight size={12} className="text-ink-600" />}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-xs mt-1.5 text-ink-500">
                <span className="px-1.5 py-0.5 rounded">new</span>
                <ChevronRight size={12} className="text-ink-600" />
                <span className="px-1.5 py-0.5 rounded">needs_review</span>
              </div>
            </div>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader title="Alert Metadata" icon={<Tag size={16} />} />
            <dl className="space-y-2.5 text-sm">
              <MetaRow icon={<StoreIcon size={14} />} label="Store" value={store?.name ?? '—'} />
              <MetaRow icon={<CameraIcon size={14} />} label="Camera" value={camera ? `${camera.name} — ${camera.location}` : '—'} />
              <MetaRow icon={<AlertCircle size={14} />} label="Detection Type" value={meta.label} />
              <MetaRow icon={<Clock size={14} />} label="Timestamp" value={formatDateLong(alert.timestamp)} />
              <MetaRow icon={<Cpu size={14} />} label="AI Confidence" value={`${alert.confidence}%`} />
              <MetaRow icon={<Tag size={14} />} label="Alert Priority" value={PRIORITY_META[alert.priority].label} />
              <MetaRow icon={<Video size={14} />} label="Clip Duration" value={formatDuration(alert.clipDurationSec)} />
              <MetaRow icon={<Activity size={14} />} label="Detection Status" value={alert.reviewed ? 'Reviewed' : 'Pending review'} />
            </dl>
          </Card>

          {/* Go to camera config */}
          {camera && (
            <Card className="hover:border-ink-600 transition-colors cursor-pointer" onClick={() => navigate(`/cameras/${camera.id}/configure`)}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-steel-600/15 border border-steel-600/30 flex items-center justify-center text-steel-400 flex-shrink-0">
                  <CameraIcon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink-100">Configure Camera</div>
                  <div className="text-xs text-ink-400">View & edit AI settings for {camera.name}</div>
                </div>
                <ChevronRight size={16} className="text-ink-500" />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="flex items-center gap-2 text-ink-400 text-xs flex-shrink-0">
        <span className="text-ink-500">{icon}</span>
        {label}
      </dt>
      <dd className="text-ink-100 text-sm text-right">{value}</dd>
    </div>
  );
}
