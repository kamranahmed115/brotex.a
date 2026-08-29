import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Search, SlidersHorizontal, Eye, ArrowRight, MapPin } from 'lucide-react';
import { useApp, useCamerasForSelected, useSelectedStores } from '@/store/AppContext';
import { AI_MODE_META } from '@/types';
import type { Camera, CameraDomain } from '@/types';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CameraStatusBadge, AIBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Select } from '@/components/ui/Select';
import type { SelectOption } from '@/components/ui/Select';
import { CameraFrame } from '@/components/cameras/CameraFrame';
import { timeAgo, classNames } from '@/lib/format';

export function CamerasPage() {
  const navigate = useNavigate();
  const cameras = useCamerasForSelected();
  const stores = useSelectedStores();
  const { alerts } = useApp();

  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [aiFilter, setAiFilter] = useState<string>('all');

  const domainOptions: SelectOption[] = [
    { value: 'all', label: 'All Areas' },
    { value: 'inside', label: 'Inside Store' },
    { value: 'outside', label: 'Outside Store' },
  ];
  const statusOptions: SelectOption[] = [
    { value: 'all', label: 'All Status' },
    { value: 'online', label: 'Online' },
    { value: 'offline', label: 'Offline' },
  ];
  const aiOptions: SelectOption[] = [
    { value: 'all', label: 'All AI' },
    { value: 'enabled', label: 'AI Enabled' },
    { value: 'disabled', label: 'AI Disabled' },
  ];

  const filtered = cameras.filter(c => {
    if (search) {
      const q = search.toLowerCase();
      const haystack = `${c.name} ${c.location}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (domain !== 'all' && c.domain !== domain) return false;
    if (status !== 'all' && c.status !== status) return false;
    if (aiFilter === 'enabled' && !c.aiEnabled) return false;
    if (aiFilter === 'disabled' && c.aiEnabled) return false;
    return true;
  });

  function storeName(storeId: string) {
    return stores.find(s => s.id === storeId)?.shortName ?? '';
  }
  function alertCount(camId: string) {
    return alerts.filter(a => a.cameraId === camId && a.status === 'new').length;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-ink-800 border border-ink-700 flex items-center justify-center text-ink-300">
            <Video size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Cameras</h1>
            <p className="text-sm text-ink-400">{filtered.length} of {cameras.length} cameras</p>
          </div>
        </div>
        <Button variant="secondary" onClick={() => navigate('/cameras/live')}>
          <Eye size={16} />
          Live Monitoring
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-base pl-9"
              placeholder="Search cameras..."
            />
          </div>
          <div className="grid grid-cols-3 gap-2.5 sm:flex sm:w-auto">
            <Select value={domain} onChange={setDomain} options={domainOptions} size="sm" className="sm:w-36" />
            <Select value={status} onChange={setStatus} options={statusOptions} size="sm" className="sm:w-32" />
            <Select value={aiFilter} onChange={setAiFilter} options={aiOptions} size="sm" className="sm:w-32" />
          </div>
        </div>
      </Card>

      {/* Camera grid */}
      {filtered.length === 0 ? (
        <Card><EmptyState icon="cameras" title="No cameras found" message="No cameras have been added to this store or match the selected filters." /></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((cam: Camera) => {
            const aiModeLabel = cam.aiMode ? AI_MODE_META[cam.aiMode].label : null;
            const ac = alertCount(cam.id);
            return (
              <Card key={cam.id} noPadding className="overflow-hidden hover:border-ink-600 transition-colors group">
                {/* Frame */}
                <div className="relative">
                  <CameraFrame cameraName={cam.name} location={cam.location} online={cam.status === 'online'} showLabel scanline={cam.status === 'online'} />
                  {ac > 0 && cam.status === 'online' && (
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-md bg-danger-600/90 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-bold text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-dot" />
                      {ac} NEW
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-ink-100 truncate">{cam.name}</div>
                      <div className="flex items-center gap-1 text-xs text-ink-400 mt-0.5">
                        <MapPin size={11} />
                        <span className="truncate">{cam.location}</span>
                      </div>
                    </div>
                    <CameraStatusBadge status={cam.status} />
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-3">
                    <AIBadge enabled={cam.aiEnabled} mode={cam.aiMode} />
                    <span className="text-[11px] text-ink-500">{timeAgo(cam.lastActive)}</span>
                  </div>

                  {aiModeLabel && (
                    <div className="text-xs text-ink-400 mb-3 truncate">
                      <span className="text-ink-500">AI Mode:</span> {aiModeLabel}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-3 border-t border-ink-700">
                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => navigate(`/cameras/${cam.id}/configure`)}>
                      <SlidersHorizontal size={14} />
                      Configure
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => navigate('/cameras/live')}>
                      <Eye size={14} />
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
