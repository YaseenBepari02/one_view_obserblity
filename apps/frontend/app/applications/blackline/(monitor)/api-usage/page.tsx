'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { NotConfigured } from '@/components/shared/NotConfigured/NotConfigured';
import { KPICard } from '@/components/shared/KPICard/KPICard';
import { Badge } from '@/components/ui/Badge/Badge';
import { formatNumber, formatDuration, formatPercent, formatCurrency } from '@/lib/utils';

export default function ApiUsagePage() {
  const appId = "blackline";
  const { data: apiData, isLoading: apiLoading } = useQuery({
    queryKey: ['api-usage', appId],
    queryFn: () => api.get(`/applications/${appId}/api-usage`),
  });

  const { data: costData, isLoading: costLoading } = useQuery({
    queryKey: ['cost', appId],
    queryFn: () => api.get(`/applications/${appId}/cost`),
  });

  if (apiLoading || costLoading) return null;

  if (!apiData || (apiData as { message?: string }).message === 'Not configured') {
    return <div style={{ paddingTop: 'var(--ov-space-5)' }}><NotConfigured title="API Usage not configured" description="API usage metrics will appear when API tracking is enabled for this application." /></div>;
  }
  
  const d = apiData as Record<string, number | boolean | unknown[]>;
  const c = (costData || {}) as Record<string, number | boolean | string>;

  return (
    <div style={{ paddingTop: 'var(--ov-space-5)' }}>
      {/* API Usage Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-2)', marginBottom: 'var(--ov-space-4)' }}>
        <h2 style={{ fontSize: 'var(--ov-font-size-md)', fontWeight: 600, color: 'var(--ov-text-primary)' }}>API Usage</h2>
        {(d as { _demo?: boolean })._demo && <Badge variant="demo">DEMO</Badge>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 'var(--ov-space-3)', marginBottom: 'var(--ov-space-8)' }}>
        <KPICard label="Total Requests" value={formatNumber(d.total_requests as number || 0)} isDemo={(d as { _demo?: boolean })._demo} />
        <KPICard label="Req/min" value={`${d.requests_per_minute || 0}`} isDemo={(d as { _demo?: boolean })._demo} />
        <KPICard label="Success" value={formatNumber(d.success_count as number || 0)} isDemo={(d as { _demo?: boolean })._demo} />
        <KPICard label="Errors" value={formatNumber(d.error_count as number || 0)} isDemo={(d as { _demo?: boolean })._demo} />
        <KPICard label="Error Rate" value={formatPercent(d.error_rate_percent as number || 0)} isDemo={(d as { _demo?: boolean })._demo} />
        <KPICard label="Avg Latency" value={formatDuration(d.avg_latency_ms as number || 0)} isDemo={(d as { _demo?: boolean })._demo} />
        <KPICard label="P95 Latency" value={formatDuration(d.p95_latency_ms as number || 0)} isDemo={(d as { _demo?: boolean })._demo} />
        <KPICard label="P99 Latency" value={formatDuration(d.p99_latency_ms as number || 0)} isDemo={(d as { _demo?: boolean })._demo} />
      </div>

      {/* Token & Cost Section */}
      {c && (c as { message?: string }).message !== 'Not configured' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-2)', marginBottom: 'var(--ov-space-4)' }}>
            <h2 style={{ fontSize: 'var(--ov-font-size-md)', fontWeight: 600, color: 'var(--ov-text-primary)' }}>Token / Cost</h2>
            {(c as { _demo?: boolean })._demo && <Badge variant="demo">DEMO</Badge>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 'var(--ov-space-3)' }}>
            <KPICard label="Total Cost" value={formatCurrency(c.total_estimated_cost as number || 0)} isDemo={(c as { _demo?: boolean })._demo} />
            <KPICard label="Today" value={formatCurrency(c.cost_today as number || 0)} isDemo={(c as { _demo?: boolean })._demo} />
            <KPICard label="This Week" value={formatCurrency(c.cost_this_week as number || 0)} isDemo={(c as { _demo?: boolean })._demo} />
            <KPICard label="This Month" value={formatCurrency(c.cost_this_month as number || 0)} isDemo={(c as { _demo?: boolean })._demo} />
            <KPICard label="Avg/Request" value={formatCurrency(c.avg_cost_per_request as number || 0)} isDemo={(c as { _demo?: boolean })._demo} />
          </div>
        </>
      )}
    </div>
  );
}
