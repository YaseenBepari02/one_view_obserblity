import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge/Badge';

interface KPICardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  unit?: string;
  isDemo?: boolean;
  className?: string;
}

export function KPICard({
  label, value, trend = 'flat', trendValue, unit, isDemo, className,
}: KPICardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className={cn('ov-kpi', className)}>
      <div className="ov-kpi-label">
        {label}
        {isDemo && (
          <Badge variant="demo" className="ov-kpi-demo">DEMO</Badge>
        )}
      </div>
      <div className="ov-kpi-value">
        {value}{unit && <span style={{ fontSize: 'var(--ov-font-size-sm)', color: 'var(--ov-text-muted)' }}> {unit}</span>}
      </div>
      {trendValue && (
        <div className={cn('ov-kpi-trend', `ov-kpi-trend-${trend}`)}>
          <TrendIcon size={12} />
          {trendValue}
        </div>
      )}
    </div>
  );
}
