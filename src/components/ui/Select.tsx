import type { ReactNode } from 'react';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { classNames } from '@/lib/format';

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md';
  ariaLabel?: string;
}

export function Select({ value, onChange, options, placeholder, className, size = 'md', ariaLabel }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className={classNames('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={ariaLabel}
        aria-expanded={open}
        className={classNames(
          'w-full flex items-center justify-between gap-2 rounded-lg border border-ink-700 bg-ink-900 text-left transition-colors hover:border-ink-600',
          size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm',
          open && 'border-steel-500',
        )}
      >
        <span className={classNames('flex items-center gap-2 min-w-0 truncate', !selected && 'text-ink-400')}>
          {selected?.icon}
          <span className="truncate">{selected?.label ?? placeholder}</span>
        </span>
        <ChevronDown size={size === 'sm' ? 14 : 16} className={classNames('text-ink-400 flex-shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-full surface-raised shadow-card-lg py-1 max-h-60 overflow-auto animate-slide-up">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={classNames(
                'w-full flex items-center justify-between gap-2 px-3 py-2 text-sm transition-colors text-left',
                opt.value === value ? 'text-steel-200 bg-steel-700/20' : 'text-ink-300 hover:text-ink-100 hover:bg-ink-800',
              )}
            >
              <span className="flex items-center gap-2 min-w-0">
                {opt.icon}
                <span className="truncate">{opt.label}</span>
              </span>
              {opt.value === value && <Check size={14} className="text-steel-400 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
