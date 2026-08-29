import { useRef, useState, useEffect } from 'react';
import { Video, Maximize2 } from 'lucide-react';
import { classNames } from '@/lib/format';

interface CameraFrameProps {
  cameraName: string;
  location: string;
  online: boolean;
  live?: boolean;
  className?: string;
  aspect?: 'video' | 'square';
  showLabel?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  scanline?: boolean;
}

// Generates a deterministic "scene" gradient per camera name
function sceneColors(seed: string): [string, string, string] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash) + seed.charCodeAt(i);
  const h = Math.abs(hash);
  const hue = h % 360;
  return [
    `hsl(${hue}, 15%, 8%)`,
    `hsl(${(hue + 30) % 360}, 20%, 12%)`,
    `hsl(${(hue + 60) % 360}, 18%, 6%)`,
  ];
}

export function CameraFrame({
  cameraName,
  location,
  online,
  live = false,
  className,
  aspect = 'video',
  showLabel = true,
  onClick,
  children,
  scanline = true,
}: CameraFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [c1, c2, c3] = sceneColors(cameraName + location);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (document.fullscreenElement) document.exitFullscreen();
    else ref.current?.requestFullscreen?.();
  };

  const aspectClass = aspect === 'video' ? 'aspect-video' : 'aspect-square';

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={classNames(
        'relative overflow-hidden rounded-lg border border-ink-700 bg-ink-900',
        aspectClass,
        onClick && 'cursor-pointer',
        className,
      )}
      style={{ background: `linear-gradient(135deg, ${c1}, ${c2} 50%, ${c3})` }}
    >
      {/* Simulated scene elements */}
      {online ? (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Faux perspective grid */}
          <div className="absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
          {/* Faux silhouettes */}
          <div className="absolute bottom-[20%] left-[30%] w-3 h-12 bg-black/30 rounded-t-full" />
          <div className="absolute bottom-[18%] left-[55%] w-4 h-16 bg-black/25 rounded-t-full" />
          <div className="absolute bottom-[22%] right-[25%] w-3 h-10 bg-black/30 rounded-t-full" />
          {/* Shelves hint for inside cameras */}
          <div className="absolute top-[15%] left-[10%] right-[10%] h-8 bg-black/15 rounded" />
          <div className="absolute top-[30%] left-[15%] right-[15%] h-6 bg-black/10 rounded" />
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-500">
          <Video size={28} className="opacity-40" />
          <span className="text-xs font-medium">Camera Offline</span>
        </div>
      )}

      {/* Scanline effect for live cameras */}
      {online && scanline && <div className="scanline-overlay absolute inset-0 pointer-events-none" />}

      {/* Top overlay: camera name + live indicator */}
      {showLabel && online && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-2 min-w-0">
            {live && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-danger-400 animate-pulse-dot" />
                LIVE
              </span>
            )}
            <span className="text-xs font-medium text-white/90 truncate">{cameraName}</span>
          </div>
          {onClick && (
            <button onClick={toggleFullscreen} className="text-white/60 hover:text-white transition-colors p-1 rounded">
              <Maximize2 size={14} />
            </button>
          )}
        </div>
      )}

      {/* Bottom overlay: location */}
      {showLabel && online && (
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
          <span className="text-[11px] text-white/70 truncate">{location}</span>
        </div>
      )}

      {/* ROI / overlays */}
      {children}
    </div>
  );
}
