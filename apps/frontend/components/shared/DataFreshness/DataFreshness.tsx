import { cn } from '@/lib/utils';
import { formatFreshness } from '@/lib/utils';
import type { FreshnessStatus } from '@/types';

interface DataFreshnessProps {
  status: FreshnessStatus;
  secondsAgo?: number | null;
  className?: string;
}

export function DataFreshness({ status, secondsAgo, className }: DataFreshnessProps) {
  const label = status === 'live'
    ? 'Live'
    : status === 'error'
      ? 'Source error'
      : status === 'no_data'
        ? 'No data'
        : status === 'stale'
          ? 'Stale'
          : secondsAgo != null
            ? formatFreshness(secondsAgo)
            : 'Unknown';

  return (
    <span className={cn('ov-freshness', `ov-freshness-${status}`, className)}>
      <span className="ov-freshness-dot" />
      {label}
    </span>
  );
}
