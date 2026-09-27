'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { NotConfigured } from '@/components/shared/NotConfigured/NotConfigured';
import { KPICard } from '@/components/shared/KPICard/KPICard';
import { Badge } from '@/components/ui/Badge/Badge';
import { formatNumber } from '@/lib/utils';

export default function SessionsPage() {
  const { id: appId } = useParams() as { id: string };
  const { data, isLoading } = useQuery({
    queryKey: ['sessions', appId],
    queryFn: () => api.get(`/applications/${appId}/sessions`),
  });

  if (!isLoading && (!data || (data as { message?: string }).message === 'Not configured')) {
    return <div style={{ paddingTop: 'var(--ov-space-5)' }}><NotConfigured title="Sessions not configured" description="Session metrics will appear when session tracking is connected." /></div>;
  }
  const d = data as Record<string, number | boolean>;
  return (
    <div style={{ paddingTop: 'var(--ov-space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-2)', marginBottom: 'var(--ov-space-4)' }}>
        <h2 style={{ fontSize: 'var(--ov-font-size-md)', fontWeight: 600, color: 'var(--ov-text-primary)' }}>Session Metrics</h2>
        {(d as { _demo?: boolean })._demo && <Badge variant="demo">DEMO</Badge>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 'var(--ov-space-3)' }}>
        <KPICard label="Total Sessions" value={formatNumber(d.total_sessions as number || 0)} isDemo={(d as { _demo?: boolean })._demo} />
        <KPICard label="Active" value={formatNumber(d.active_sessions as number || 0)} isDemo={(d as { _demo?: boolean })._demo} />
        <KPICard label="Completed" value={formatNumber(d.completed_sessions as number || 0)} isDemo={(d as { _demo?: boolean })._demo} />
        <KPICard label="Avg Duration" value={`${d.avg_session_duration_minutes || 0}m`} isDemo={(d as { _demo?: boolean })._demo} />
        <KPICard label="Failures" value={d.session_failures as number || 0} isDemo={(d as { _demo?: boolean })._demo} />
        <KPICard label="Timeouts" value={d.session_timeout_count as number || 0} isDemo={(d as { _demo?: boolean })._demo} />
      </div>
    </div>
  );
}
