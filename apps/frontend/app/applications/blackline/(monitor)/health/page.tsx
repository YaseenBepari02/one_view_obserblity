'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card/Card';
import { KPICard } from '@/components/shared/KPICard/KPICard';
import { Badge } from '@/components/ui/Badge/Badge';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { DataFreshness } from '@/components/shared/DataFreshness/DataFreshness';
import { formatPercent, formatNumber, formatDuration } from '@/lib/utils';
import { Sparkline } from '@/components/shared/Sparkline/Sparkline';
import type { HealthMetrics } from '@/types';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, LineChart, Line,
} from 'recharts';

function MetricChart({ title, data, color, unit, isDemo }: {
  title: string; data: { timestamp: string; value: number }[];
  color: string; unit?: string; isDemo?: boolean;
}) {
  const formatted = data?.map((d) => ({
    ...d,
    time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {isDemo && <Badge variant="demo">DEMO</Badge>}
      </CardHeader>
      <CardBody>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <AreaChart data={formatted} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ov-border)" strokeOpacity={0.5} />
              <XAxis dataKey="time" tick={{ fill: 'var(--ov-text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: 'var(--ov-text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} width={40} />
              <Tooltip
                contentStyle={{
                  background: 'var(--ov-bg-card)',
                  border: '1px solid var(--ov-border)',
                  borderRadius: 'var(--ov-radius-md)',
                  fontSize: 'var(--ov-font-size-sm)',
                  color: 'var(--ov-text-primary)',
                }}
              />
              <defs>
                <linearGradient id={`fill-${title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={1.5}
                fill={`url(#fill-${title.replace(/\s/g, '')})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}

export default function HealthMonitorPage() {
  
  const router = useRouter();
  const appId = "blackline";

  const { data: health, isLoading } = useQuery<HealthMetrics>({
    queryKey: ['health', appId],
    queryFn: () => api.get(`/applications/${appId}/health`),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div style={{ paddingTop: 'var(--ov-space-5)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 'var(--ov-space-3)', marginBottom: 'var(--ov-space-5)' }}>
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} variant="card" height={88} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--ov-space-4)' }}>
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="chart" />)}
        </div>
      </div>
    );
  }

  if (!health) return null;

  const isDemo = health._demo;

  return (
    <div style={{ paddingTop: 'var(--ov-space-5)' }}>
      {/* Primary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 'var(--ov-space-3)', marginBottom: 'var(--ov-space-5)' }}>
        <KPICard label="Health Score" value={health.health_score ?? '---'} isDemo={isDemo} />
        <KPICard label="Uptime" value={formatPercent(health.uptime_percent)} isDemo={isDemo} />
        <KPICard label="Request Rate" value={`${health.request_rate}`} unit="req/s" isDemo={isDemo} />
        <KPICard label="Error Rate" value={formatPercent(health.error_rate)} trend={health.error_rate > 3 ? 'up' : 'flat'} isDemo={isDemo} />
        <KPICard label="Avg Latency" value={formatDuration(health.avg_latency_ms)} isDemo={isDemo} />
        <KPICard label="P95 Latency" value={formatDuration(health.p95_latency_ms)} isDemo={isDemo} />
        <KPICard label="P99 Latency" value={formatDuration(health.p99_latency_ms)} isDemo={isDemo} />
        <KPICard label="CPU" value={formatPercent(health.cpu_usage_percent)} trend={health.cpu_usage_percent > 70 ? 'up' : 'flat'} isDemo={isDemo} />
        <KPICard label="Memory" value={formatPercent(health.memory_usage_percent)} trend={health.memory_usage_percent > 80 ? 'up' : 'flat'} isDemo={isDemo} />
        <KPICard label="Containers" value={`${health.running_containers}/${health.total_containers}`} isDemo={isDemo} />
        <KPICard label="Restarts" value={health.restart_count} isDemo={isDemo} />
        <KPICard label="Incidents" value={health.active_incidents} trend={health.active_incidents > 0 ? 'up' : 'flat'} isDemo={isDemo} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--ov-space-4)' }}>
        {health.time_series?.cpu && (
          <MetricChart title="CPU Usage (%)" data={health.time_series.cpu} color="var(--ov-primary)" isDemo={isDemo} />
        )}
        {health.time_series?.memory && (
          <MetricChart title="Memory Usage (%)" data={health.time_series.memory} color="var(--ov-accent)" isDemo={isDemo} />
        )}
        {health.time_series?.request_rate && (
          <MetricChart title="Request Rate" data={health.time_series.request_rate} color="var(--ov-status-healthy)" isDemo={isDemo} />
        )}
        {health.time_series?.error_rate && (
          <MetricChart title="Error Rate" data={health.time_series.error_rate} color="var(--ov-status-critical)" isDemo={isDemo} />
        )}
        {health.time_series?.latency_p95 && (
          <MetricChart title="P95 Latency (ms)" data={health.time_series.latency_p95} color="var(--ov-status-warning)" isDemo={isDemo} />
        )}
      </div>
    </div>
  );
}
