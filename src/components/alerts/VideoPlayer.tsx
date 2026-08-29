import { useRef, useState, useEffect } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Settings2, RotateCcw,
} from 'lucide-react';
import { CameraFrame } from '@/components/cameras/CameraFrame';
import { classNames, formatDuration } from '@/lib/format';

interface VideoPlayerProps {
  cameraName: string;
  location: string;
  durationSec: number;
  confidence: number;
}

export function VideoPlayer({ cameraName, location, durationSec, confidence }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0); // 0..1
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const rafRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    lastTickRef.current = performance.now();
    const tick = (now: number) => {
      const dt = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      setCurrentTime(prev => {
        const next = prev + dt * playbackRate;
        if (next >= durationSec) {
          setPlaying(false);
          return durationSec;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, playbackRate, durationSec]);

  useEffect(() => {
    setProgress(currentTime / durationSec);
  }, [currentTime, durationSec]);

  function togglePlay() {
    if (currentTime >= durationSec) {
      setCurrentTime(0);
      setPlaying(true);
    } else {
      setPlaying(p => !p);
    }
  }

  function restart() {
    setCurrentTime(0);
    setPlaying(true);
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    setCurrentTime(Math.max(0, Math.min(durationSec, ratio * durationSec)));
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current?.requestFullscreen?.();
  }

  const rates = [0.5, 1, 1.5, 2];

  return (
    <div ref={containerRef} className="surface-raised overflow-hidden">
      {/* Video area */}
      <div className="relative">
        <CameraFrame
          cameraName={cameraName}
          location={location}
          online
          showLabel
          scanline={playing}
          className="!rounded-none !border-0 w-full"
        />

        {/* AI confidence overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <div className="flex items-center gap-1.5 rounded-md bg-black/60 backdrop-blur-sm px-2 py-1 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
            <span className="text-white/90 font-medium">AI {confidence}%</span>
          </div>
        </div>

        {/* Detection bounding box simulation */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className={classNames(
            'relative w-[35%] h-[45%] rounded border-2 transition-opacity',
            playing ? 'border-accent-400/70' : 'border-accent-400/40',
          )} style={{ marginTop: '5%' }}>
            <div className="absolute -top-5 left-0 text-[10px] font-semibold text-accent-400 bg-black/70 rounded px-1.5 py-0.5">
              Person · {confidence}%
            </div>
            {playing && (
              <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-accent-400 overflow-hidden">
                <div className="h-full w-1/3 bg-white/60 animate-pulse" style={{ animationDuration: '1.5s' }} />
              </div>
            )}
          </div>
        </div>

        {/* Center play button when paused */}
        {!playing && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center z-10 group"
            aria-label={currentTime > 0 ? 'Resume' : 'Play'}
          >
            <div className="w-16 h-16 rounded-full bg-ink-950/70 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-steel-600/80 group-hover:scale-105 transition-all">
              <Play size={28} className="text-white ml-1" fill="currentColor" />
            </div>
          </button>
        )}
      </div>

      {/* Controls bar */}
      <div className="bg-ink-900 px-4 py-3">
        {/* Timeline */}
        <div
          onClick={handleSeek}
          className="group relative h-1.5 bg-ink-700 rounded-full cursor-pointer mb-3 hover:h-2 transition-all"
        >
          <div className="absolute inset-y-0 left-0 bg-steel-500 rounded-full" style={{ width: `${progress * 100}%` }} />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progress * 100}% - 6px)` }}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button onClick={togglePlay} className="p-1.5 rounded-lg text-ink-200 hover:text-white hover:bg-ink-700 transition-colors" aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button onClick={restart} className="p-1.5 rounded-lg text-ink-300 hover:text-white hover:bg-ink-700 transition-colors" aria-label="Restart">
              <RotateCcw size={16} />
            </button>
            <button onClick={() => setMuted(m => !m)} className="p-1.5 rounded-lg text-ink-300 hover:text-white hover:bg-ink-700 transition-colors" aria-label={muted ? 'Unmute' : 'Mute'}>
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <span className="text-xs text-ink-400 font-mono ml-1">
              {formatDuration(Math.floor(currentTime))} / {formatDuration(durationSec)}
            </span>
          </div>

          <div className="flex items-center gap-1 relative">
            <button
              onClick={() => setShowSettings(s => !s)}
              className={classNames('p-1.5 rounded-lg transition-colors', showSettings ? 'text-steel-300 bg-steel-600/20' : 'text-ink-300 hover:text-white hover:bg-ink-700')}
              aria-label="Playback speed"
            >
              <Settings2 size={16} />
            </button>
            {showSettings && (
              <div className="absolute bottom-full right-0 mb-2 surface-raised shadow-card-lg py-1.5 w-32 animate-slide-up">
                <div className="px-3 py-1 text-[10px] font-semibold text-ink-500 uppercase tracking-wide">Speed</div>
                {rates.map(r => (
                  <button
                    key={r}
                    onClick={() => { setPlaybackRate(r); setShowSettings(false); }}
                    className={classNames(
                      'w-full flex items-center justify-between px-3 py-1.5 text-xs transition-colors',
                      playbackRate === r ? 'text-steel-300 bg-steel-700/20' : 'text-ink-300 hover:text-ink-100 hover:bg-ink-800',
                    )}
                  >
                    {r}x {r === 1 && <span className="text-ink-500">Normal</span>}
                  </button>
                ))}
              </div>
            )}
            <button onClick={toggleFullscreen} className="p-1.5 rounded-lg text-ink-300 hover:text-white hover:bg-ink-700 transition-colors" aria-label="Fullscreen">
              <Maximize size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
