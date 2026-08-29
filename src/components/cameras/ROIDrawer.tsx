import { useState, useRef, MouseEvent } from 'react';
import type { ROIPoint } from '@/types';
import { classNames } from '@/lib/format';

interface ROIDrawerProps {
  points: ROIPoint[];
  onChange: (points: ROIPoint[]) => void;
  editable: boolean;
  color?: string;
  className?: string;
}

export function ROIDrawer({ points, onChange, editable, color = '#7C5CFF', className }: ROIDrawerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<ROIPoint[]>([]);
  const [mousePos, setMousePos] = useState<ROIPoint | null>(null);

  const activePoints = drawing ? currentPoints : points;

  function getCoords(e: MouseEvent<SVGSVGElement>): ROIPoint | null {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
  }

  function handleMouseMove(e: MouseEvent<SVGSVGElement>) {
    if (!drawing || !editable) return;
    setMousePos(getCoords(e));
  }

  function handleClick(e: MouseEvent<SVGSVGElement>) {
    if (!editable) return;
    const pos = getCoords(e);
    if (!pos) return;

    if (!drawing) {
      setDrawing(true);
      setCurrentPoints([pos]);
      setMousePos(pos);
    } else {
      if (currentPoints.length >= 3) {
        const first = currentPoints[0];
        const dist = Math.sqrt(Math.pow(pos.x - first.x, 2) + Math.pow(pos.y - first.y, 2));
        if (dist < 0.05) { // 5% distance to close polygon
          onChange(currentPoints);
          setDrawing(false);
          setMousePos(null);
          return;
        }
      }
      setCurrentPoints([...currentPoints, pos]);
    }
  }

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
    if (drawing) {
      setDrawing(false);
      setMousePos(null);
      setCurrentPoints([]);
    }
  }

  const polyPoints = activePoints.map(p => `${p.x * 100},${p.y * 100}`).join(' ');
  let cursorLine = '';
  if (drawing && mousePos && activePoints.length > 0) {
    const last = activePoints[activePoints.length - 1];
    cursorLine = `${last.x * 100},${last.y * 100} ${mousePos.x * 100},${mousePos.y * 100}`;
  }

  return (
    <svg
      ref={svgRef}
      className={classNames('absolute inset-0 w-full h-full z-10', editable ? 'cursor-crosshair' : 'pointer-events-none', className)}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {activePoints.length > 1 && !drawing && (
        <polygon points={polyPoints} fill={`${color}33`} stroke={color} strokeWidth="0.5" strokeDasharray="1" />
      )}
      
      {drawing && (
        <>
          <polyline points={polyPoints} fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="1" />
          {cursorLine && <polyline points={cursorLine} fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="1" opacity="0.6" />}
          {activePoints.map((p, i) => (
            <circle key={i} cx={p.x * 100} cy={p.y * 100} r="1" fill={color} />
          ))}
          {activePoints.length >= 3 && (
            <circle cx={activePoints[0].x * 100} cy={activePoints[0].y * 100} r="1.5" fill="white" stroke={color} strokeWidth="0.5" />
          )}
        </>
      )}
      {!drawing && activePoints.map((p, i) => (
        <circle key={i} cx={p.x * 100} cy={p.y * 100} r="0.8" fill={color} />
      ))}
    </svg>
  );
}
