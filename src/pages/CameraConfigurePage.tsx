import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Maximize2, Settings, Video, Camera as CameraIcon, CheckCircle2 } from 'lucide-react';
import { useApp, useCameraById, useROIsForCamera } from '@/store/AppContext';
import { CameraFrame } from '@/components/cameras/CameraFrame';
import { ROIDrawer } from '@/components/cameras/ROIDrawer';
import { AIConfigForm } from '@/components/cameras/AIConfigForm';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';
import { Card, CardHeader } from '@/components/ui/Card';
import { CameraStatusBadge, PriorityBadge } from '@/components/ui/Badge';
import type { ROIPoint } from '@/types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { mockCameraActivity } from '@/data/mockAnalytics';
import { timeAgo, classNames } from '@/lib/format';
import { ALERT_TYPE_META } from '@/types';

export function CameraConfigurePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cameras, updateCameraConfig, saveROI, alerts } = useApp();
  const camera = useCameraById(id);
  const rois = useROIsForCamera(id);

  const defaultROI = rois.length > 0 ? rois[0] : null;
  const [activePoints, setActivePoints] = useState<ROIPoint[]>([]);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (defaultROI) {
      setActivePoints(defaultROI.points);
    } else {
      setActivePoints([]);
    }
    setDrawing(false);
  }, [id, defaultROI]);

  if (!camera) {
    return (
      <div className="p-6 text-ink-300 flex flex-col items-center justify-center h-[50vh]">
        <p>Camera not found.</p>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/cameras')}>Back to Cameras</Button>
      </div>
    );
  }

  const cameraAlerts = alerts.filter(a => a.cameraId === camera.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

  async function handleSaveConfig(config: any) {
    await updateCameraConfig(camera!.id, config);
    if (activePoints.length > 2) {
      saveROI({
        id: defaultROI?.id || `roi_${Date.now()}`,
        cameraId: camera!.id,
        points: activePoints,
        type: 'detection',
        label: 'Custom ROI',
        active: true,
        createdBy: 'Manager',
        createdAt: defaultROI?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    toast('success', 'Camera configuration saved.');
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-xl font-bold text-white">Camera Configuration</h1>
        <p className="text-sm text-ink-400">Configure AI intelligence and monitoring zones</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Camera List */}
        <Card noPadding className="lg:col-span-3 lg:sticky lg:top-4 bg-ink-900 border-ink-800">
          <div className="p-4 border-b border-ink-800">
            <h2 className="text-[10px] font-bold text-ink-500 uppercase tracking-wide">Cameras</h2>
          </div>
          <div className="max-h-[70vh] overflow-y-auto divide-y divide-ink-800/50">
            {cameras.map(c => (
              <Link 
                key={c.id} 
                to={`/cameras/${c.id}/configure`}
                className={classNames(
                  'flex items-center gap-3 p-3 transition-colors hover:bg-ink-800/50',
                  c.id === camera.id ? 'bg-steel-600/10 border-l-2 border-l-steel-500' : 'border-l-2 border-l-transparent'
                )}
              >
                <span className={classNames('w-2 h-2 rounded-full flex-shrink-0', c.status === 'online' ? 'bg-success-500' : 'bg-danger-500')} />
                <div className="min-w-0 flex-1">
                  <div className={classNames('text-sm font-medium truncate', c.id === camera.id ? 'text-white' : 'text-ink-100')}>{c.name}</div>
                  <div className="text-xs text-ink-400 truncate mt-0.5">{c.location}</div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Center Column: Camera Preview & Analytics */}
        <div className="lg:col-span-6 space-y-6">
          <Card noPadding className="overflow-hidden border-ink-800 bg-ink-900/50">
            {/* Header Above Video */}
            <div className="p-4 flex flex-wrap items-center justify-between border-b border-ink-800 bg-ink-900 gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  {camera.name}
                  <CameraStatusBadge status={camera.status} />
                </h2>
                <p className="text-xs text-ink-400 mt-1">{camera.location}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setDrawing(!drawing)}>
                  <Settings size={14} className="mr-1.5" /> Configure ROI
                </Button>
                <Button variant="ghost" size="sm">
                  <Maximize2 size={14} className="mr-1.5" /> Fullscreen
                </Button>
              </div>
            </div>

            {/* Video Frame */}
            <div className="relative aspect-video bg-black">
               <CameraFrame cameraName={camera.name} location={camera.location} online={camera.status === 'online'} showLabel={false} scanline={false} className="w-full h-full !rounded-none !border-0" />
               <ROIDrawer points={activePoints} onChange={setActivePoints} editable={drawing} />
               
               {drawing && (
                 <div className="absolute top-4 left-4 right-4 z-20 bg-ink-900/85 backdrop-blur text-xs px-4 py-2.5 rounded-lg border border-ink-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                   <div className="flex items-center gap-2 text-ink-100">
                     <AlertCircle size={16} className="text-steel-400 flex-shrink-0" />
                     <span>Click to place vertices. Click near the first point to close polygon. Right-click to cancel.</span>
                   </div>
                   <div className="flex items-center gap-2 w-full sm:w-auto">
                     <Button variant="ghost" size="sm" onClick={() => setActivePoints([])} className="flex-1 sm:flex-none">Clear</Button>
                     <Button variant="secondary" size="sm" onClick={() => setDrawing(false)} className="flex-1 sm:flex-none text-white border-ink-600 bg-ink-800">Done</Button>
                   </div>
                 </div>
               )}
            </div>

            {/* Camera Specs Footer */}
            <div className="flex flex-wrap items-center justify-between px-5 py-3 bg-ink-950 border-t border-ink-800 text-xs text-ink-300">
              <div className="flex gap-4 sm:gap-6">
                <span className="flex items-center gap-1.5"><Video size={14} className="text-ink-500" /> Res: <strong className="text-ink-100">480p</strong></span>
                <span>FPS: <strong className="text-ink-100">3 FPS</strong></span>
                <span className="hidden sm:inline">Bitrate: <strong className="text-ink-100">1.2 Mbps</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse-dot" /> 
                Last Activity: <strong className="text-ink-100">2 min ago</strong>
              </div>
            </div>
          </Card>

          {/* Activity Chart */}
          <Card>
            <CardHeader title="Camera Activity" subtitle="Events detected in the last 24 hours" />
            <div className="h-[200px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockCameraActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#1E293B' }} contentStyle={{ backgroundColor: '#0D1326', borderColor: '#1E293B', fontSize: '12px' }} />
                  <Bar dataKey="alerts" fill="#7C5CFF" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent Alerts */}
          <Card noPadding>
            <CardHeader title="Recent Alerts" subtitle="Latest incidents from this camera" className="px-5 pt-5 pb-2" />
            <div className="divide-y divide-ink-800 mt-2">
              {cameraAlerts.length > 0 ? cameraAlerts.map(alert => (
                <div key={alert.id} className="p-4 hover:bg-ink-800/50 transition-colors cursor-pointer" onClick={() => navigate(`/alerts/${alert.id}`)}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-ink-100 flex items-center gap-2">
                      {ALERT_TYPE_META[alert.type]?.label}
                    </span>
                    <span className="text-xs text-ink-500">{timeAgo(alert.timestamp)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <PriorityBadge priority={alert.priority} size="sm" />
                    <span className={classNames('text-[10px] font-bold uppercase tracking-wide', alert.status === 'resolved' ? 'text-success-400' : 'text-warning-400')}>
                      {alert.status}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-sm text-ink-400">No recent alerts found.</div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: AI Configuration */}
        <div className="lg:col-span-3 lg:sticky lg:top-4">
          <AIConfigForm camera={camera} onSave={handleSaveConfig} onCancel={() => navigate('/cameras')} />
        </div>
      </div>
    </div>
  );
}
