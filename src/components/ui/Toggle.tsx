import { classNames } from '@/lib/format';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md';
  ariaLabel?: string;
}

export function Toggle({ checked, onChange, size = 'md', ariaLabel }: ToggleProps) {
  const dims = size === 'sm' ? { w: 'w-9', h: 'h-5', knob: 'w-3.5 h-3.5', translate: 'translate-x-4' } : { w: 'w-11', h: 'h-6', knob: 'w-4 h-4', translate: 'translate-x-5' };
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={classNames(
        'relative inline-flex items-center rounded-full transition-colors duration-200 flex-shrink-0',
        dims.w, dims.h,
        checked ? 'bg-steel-600' : 'bg-ink-700',
      )}
    >
      <span className={classNames(
        'inline-block bg-white rounded-full shadow-sm transition-transform duration-200 ml-0.5',
        dims.knob,
        checked && dims.translate,
      )} />
    </button>
  );
}
