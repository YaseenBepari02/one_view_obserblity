'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card/Card';
import { KPICard } from '@/components/shared/KPICard/KPICard';
import { Badge } from '@/components/ui/Badge/Badge';
import { StatusBadge } from '@/components/ui/Badge/Badge';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { formatPercent, formatBytes } from '@/lib/utils';
import type { InfrastructureSummary } from '@/types';

export default function InfrastructurePage() {
  const appId = "kavacha";
  const { data, isLoading } = useQuery<InfrastructureSummary>({
    queryKey: ['infrastructure', appId],
    queryFn: () => api.get(`/applications/${appId}/infrastructure`),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return <div style={{ paddingTop: 'var(--ov-space-5)' }}><Skeleton variant="chart" /></div>;
  }
  if (!data) return null;

  return (
    <div style={{ paddingTop: 'var(--ov-space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-2)', marginBottom: 'var(--ov-space-4)' }}>
        <h2 style={{ fontSize: 'var(--ov-font-size-md)', fontWeight: 600, color: 'var(--ov-text-primary)' }}>Infrastructure</h2>
        {data._demo && <Badge variant="demo">DEMO</Badge>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 'var(--ov-space-3)', marginBottom: 'var(--ov-space-5)' }}>
        <KPICard label="CPU" value={formatPercent(data.cpu_usage_percent)} isDemo={data._demo} />
        <KPICard label="Memory" value={formatPercent(data.memory_usage_percent)} isDemo={data._demo} />
        <KPICard label="Net In" value={`${data.network_rx_mbps}`} unit="Mbps" isDemo={data._demo} />
        <KPICard label="Net Out" value={`${data.network_tx_mbps}`} unit="Mbps" isDemo={data._demo} />
        <KPICard label="Containers" value={`${data.running_containers}/${data.total_containers}`} isDemo={data._demo} />
        <KPICard label="Errors" value={data.error_count} isDemo={data._demo} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Containers</CardTitle>
        </CardHeader>
        <CardBody style={{ padding: 0, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ov-border)' }}>
                {['Name', 'Image', 'Status', 'CPU', 'Memory', 'Network', 'Restarts'].map((h) => (
                  <th key={h} style={{ padding: 'var(--ov-space-2) var(--ov-space-3)', textAlign: 'left', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.containers.map((c) => (
                <tr key={c.container_id} style={{ borderBottom: '1px solid var(--ov-border)' }}>
                  <td style={{ padding: 'var(--ov-space-2) var(--ov-space-3)', fontSize: 'var(--ov-font-size-base)', fontWeight: 500, color: 'var(--ov-text-primary)' }}>{c.name}</td>
                  <td style={{ padding: 'var(--ov-space-2) var(--ov-space-3)', fontSize: 'var(--ov-font-size-xs)', fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-text-muted)' }}>{c.image}</td>
                  <td style={{ padding: 'var(--ov-space-2) var(--ov-space-3)' }}><StatusBadge status={c.state} /></td>
                  <td style={{ padding: 'var(--ov-space-2) var(--ov-space-3)', fontSize: 'var(--ov-font-size-base)', fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-text-primary)' }}>{formatPercent(c.cpu_percent)}</td>
                  <td style={{ padding: 'var(--ov-space-2) var(--ov-space-3)', fontSize: 'var(--ov-font-size-base)', fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-text-primary)' }}>{formatBytes(c.memory_usage_mb * 1024 * 1024)} / {formatBytes(c.memory_limit_mb * 1024 * 1024)}</td>
                  <td style={{ padding: 'var(--ov-space-2) var(--ov-space-3)', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)' }}>{formatBytes(c.network_rx_mb * 1024 * 1024)} / {formatBytes(c.network_tx_mb * 1024 * 1024)}</td>
                  <td style={{ padding: 'var(--ov-space-2) var(--ov-space-3)', fontSize: 'var(--ov-font-size-base)', fontFamily: 'var(--ov-font-mono)', color: c.restart_count > 0 ? 'var(--ov-status-warning)' : 'var(--ov-text-primary)' }}>{c.restart_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
