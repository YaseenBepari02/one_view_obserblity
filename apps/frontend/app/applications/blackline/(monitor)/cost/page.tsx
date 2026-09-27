'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { NotConfigured } from '@/components/shared/NotConfigured/NotConfigured';
import { KPICard } from '@/components/shared/KPICard/KPICard';
import { Badge } from '@/components/ui/Badge/Badge';
import { formatCurrency } from '@/lib/utils';

export default function CostPage() {
  const appId = "blackline";
  const { data, isLoading } = useQuery({
    queryKey: ['cost', appId],
    queryFn: () => api.get(`/applications/${appId}/cost`),
  });

  if (isLoading || !data) {
    return <div style={{ paddingTop: 'var(--ov-space-5)', color: 'var(--ov-text-muted)' }}>Loading cost metrics...</div>;
  }
  if ((data as { message?: string }).message === 'Not configured') {
    return <div style={{ paddingTop: 'var(--ov-space-5)' }}><NotConfigured title="Cost tracking not configured" description="Cost and token usage will appear when AI cost tracking is enabled." /></div>;
  }
  const d = data as Record<string, number | boolean | string>;
  return (
    <div style={{ paddingTop: 'var(--ov-space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-2)', marginBottom: 'var(--ov-space-4)' }}>
        <h2 style={{ fontSize: 'var(--ov-font-size-md)', fontWeight: 600, color: 'var(--ov-text-primary)' }}>Token / Cost</h2>
        {(d as { _demo?: boolean })._demo && <Badge variant="demo">DEMO</Badge>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 'var(--ov-space-3)' }}>
        <KPICard label="Total Cost" value={formatCurrency(d.total_estimated_cost as number || 0)} isDemo={(d as { _demo?: boolean })._demo} />
        <KPICard label="Today" value={formatCurrency(d.cost_today as number || 0)} isDemo={(d as { _demo?: boolean })._demo} />
        <KPICard label="This Week" value={formatCurrency(d.cost_this_week as number || 0)} isDemo={(d as { _demo?: boolean })._demo} />
        <KPICard label="This Month" value={formatCurrency(d.cost_this_month as number || 0)} isDemo={(d as { _demo?: boolean })._demo} />
        <KPICard label="Avg/Request" value={formatCurrency(d.avg_cost_per_request as number || 0)} isDemo={(d as { _demo?: boolean })._demo} />
      </div>
    </div>
  );
}
