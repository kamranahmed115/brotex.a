import type { ReactNode, HTMLAttributes } from 'react';
import { classNames } from '@/lib/format';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  raised?: boolean;
  noPadding?: boolean;
}

export function Card({ children, raised, noPadding, className, ...props }: CardProps) {
  return (
    <div
      className={classNames(raised ? 'surface-raised' : 'surface', !noPadding && 'p-5', className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, icon, className }: CardHeaderProps) {
  return (
    <div className={classNames('flex items-start justify-between gap-3 mb-4', className)}>
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && <span className="text-ink-400 flex-shrink-0">{icon}</span>}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-ink-100 truncate">{title}</h3>
          {subtitle && <p className="text-xs text-ink-400 mt-0.5 truncate">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
