import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames } from '@/lib/format';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-2.5 py-1.5',
  md: '',
  lg: 'text-base px-5 py-2.5',
};

export function Button({ variant = 'secondary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button className={classNames(variantClasses[variant], sizeClasses[size], className)} {...props}>
      {children}
    </button>
  );
}
