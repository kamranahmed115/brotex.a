import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Grid2x2, Grid3x3, X, Maximize2, SlidersHorizontal } from 'lucide-react';
import { useApp, useCamerasForSelected } from '@/store/AppContext';
import { AI_MODE_META } from '@/types';
import type { Camera } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CameraStatusBadge, AIBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CameraFrame } from '@/components/cameras/CameraFrame';
import { Modal } from '@/components/ui/Modal';
import { classNames } from '@/lib/format';

export function LiveMonitoringPage() {
  const navigate = useNavigate();
  const cameras = useCamerasForSelected();
  const [gridSize, setGridSize] = useState<2 | 3>(3);
  const [selected, setSelected] = useState<Camera | null>(null);

  const onlineCameras = cameras.filter(c => c.status === 'online');

  const gridClass = gridSize === 2
    ? 'grid-cols-1 sm:grid-cols-2'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-ink-800 border border-ink-700 flex items-center justify-center text-ink-300">
            <Radio size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Live Monitoring</h1>
            <p className="text-sm text-ink-400">{onlineCameras.length} live cameras · {cameras.length - onlineCameras.length} offline</p>
          </div>
        </div>

        {/* Grid size toggle */}
        <div className="flex items-center gap-1 surface p-1">
          <button
            onClick={() => setGridSize(2)}
            className={classNames('p-1.5 rounded-md transition-colors', gridSize === 2 ? 'bg-steel-600/30 text-steel-200' : 'text-ink-400 hover:text-ink-200')}
            aria-label="2-column grid"
          >
            <Grid2x2 size={18} />
          </button>
          <button
            onClick={() => setGridSize(3)}
            className={classNames('p-1.5 rounded-md transition-colors', gridSize === 3 ? 'bg-steel-600/30 text-steel-200' : 'text-ink-400 hover:text-ink-200')}
            aria-label="3-column grid"
          >
            <Grid3x3 size={18} />
          </button>
        </div>
      </div>

      {/* Grid */}
      {onlineCameras.length === 0 ? (
        <Card><EmptyState icon="cameras" title="No live cameras" message="No online cameras available for live monitoring." /></Card>
      ) : (
        <div className={classNames('grid gap-4', gridClass)}>
          {cameras.map(cam => (
            <div key={cam.id} className="space-y-2">
              <CameraFrame
                cameraName={cam.name}
                location={cam.location}
                online={cam.status === 'online'}
                live={cam.status === 'online'}
                showLabel
                onClick={() => cam.status === 'online' && setSelected(cam)}
                scanline={cam.status === 'online'}
              />
              <div className="flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2 min-w-0">
                  <CameraStatusBadge status={cam.status} />
                  <AIBadge enabled={cam.aiEnabled} mode={cam.aiMode} />
                </div>
                <button
                  onClick={() => navigate(`/cameras/${cam.id}/configure`)}
                  className="text-ink-400 hover:text-ink-100 p-1 rounded transition-colors flex-shrink-0"
                  aria-label="Configure camera"
                >
                  <SlidersHorizontal size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enlarged view modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.name} — ${selected.location}` : ''}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelected(null)}>Close</Button>
            <Button variant="secondary" onClick={() => { const s = selected; setSelected(null); if (s) navigate(`/cameras/${s.id}/configure`); }}>
              <SlidersHorizontal size={14} />
              Configure
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-3">
            <CameraFrame
              cameraName={selected.name}
              location={selected.location}
              online
              live
              showLabel
              scanline
            />
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CameraStatusBadge status="online" />
                <AIBadge enabled={selected.aiEnabled} mode={selected.aiMode} />
              </div>
              {selected.aiMode && (
                <span className="text-xs text-ink-400">AI Mode: {AI_MODE_META[selected.aiMode].label}</span>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
