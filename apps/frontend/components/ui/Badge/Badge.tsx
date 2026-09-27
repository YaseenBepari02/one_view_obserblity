import { cn } from '@/lib/utils';

type BadgeVariant = 'healthy' | 'warning' | 'critical' | 'info' | 'unknown' | 'demo' | 'success';

interface BadgeProps {
  variant?: BadgeVariant;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const STATUS_MAP: Record<string, BadgeVariant> = {
  healthy: 'healthy',
  success: 'healthy',
  running: 'healthy',
  connected: 'healthy',
  live: 'healthy',
  warning: 'warning',
  degraded: 'warning',
  stale: 'warning',
  critical: 'critical',
  error: 'critical',
  failed: 'critical',
  unhealthy: 'critical',
  info: 'info',
  unknown: 'unknown',
  no_data: 'unknown',
  demo: 'demo',
};

export function Badge({ variant = 'info', dot = false, children, className }: BadgeProps) {
  return (
    <span className={cn('ov-badge', `ov-badge-${variant}`, className)}>
      {dot && <span className="ov-badge-dot" />}
      {children}
    </span>
  );
}

/** Auto-detect variant from a status string */
export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const variant = STATUS_MAP[status.toLowerCase()] || 'unknown';
  const label = status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  return (
    <Badge variant={variant} dot className={className}>
      {label}
    </Badge>
  );
}
