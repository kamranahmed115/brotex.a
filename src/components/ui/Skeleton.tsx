import { classNames } from '@/lib/format';

export function Skeleton({ className }: { className?: string }) {
  return <div className={classNames('animate-pulse rounded-lg bg-ink-700/50', className)} />;
}

export function StatCardSkeleton() {
  return (
    <div className="surface p-5">
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function TableRowSkeleton({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
