'use client';

import { useState } from 'react';
import { 
  BarChart3, Activity, Cpu, HardDrive, Network, 
  TrendingUp, RefreshCw, Calendar, ArrowUpRight, ShieldCheck 
} from 'lucide-react';
import { KPICard } from '@/components/shared/KPICard/KPICard';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';

export default function MetricsPage() {
  const [metricRange, setMetricRange] = useState('24h');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ov-space-5)' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--ov-space-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-2)', marginBottom: 'var(--ov-space-1)' }}>
            <h1 style={{ fontSize: 'var(--ov-font-size-2xl)', fontWeight: 'var(--ov-font-weight-bold)', color: 'var(--ov-text-primary)', margin: 0 }}>
              Metrics & Time Series
            </h1>
            <Badge variant="healthy" dot>Streaming 10s</Badge>
            <Badge variant="info">Prometheus + OTel</Badge>
          </div>
          <p style={{ fontSize: 'var(--ov-font-size-sm)', color: 'var(--ov-text-muted)', margin: 0 }}>
            Real-time multi-dimensional time series, SLI/SLO tracking, throughput and resource consumption analytics
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--ov-space-2)' }}>
          <div style={{ display: 'flex', background: 'var(--ov-bg-subtle)', padding: 3, borderRadius: 'var(--ov-radius-md)', border: '1px solid var(--ov-border)' }}>
            {['1h', '6h', '24h', '7d', '30d'].map((r) => (
              <button
                key={r}
                onClick={() => setMetricRange(r)}
                style={{
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: 4,
                  border: 'none',
                  cursor: 'pointer',
                  background: metricRange === r ? 'var(--ov-primary-muted)' : 'transparent',
                  color: metricRange === r ? 'var(--ov-primary)' : 'var(--ov-text-secondary)',
                  transition: 'all 0.15s'
                }}
              >
                {r}
              </button>
            ))}
          </div>
          <Button variant="primary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={14} /> Refresh
          </Button>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--ov-space-3)' }}>
        <KPICard label="Avg Throughput" value="112.4" unit="req/s" trend="up" trendValue="+8.2%" />
        <KPICard label="Error Rate" value="0.04" unit="%" trend="down" trendValue="-0.02%" />
        <KPICard label="P50 Response" value="18.2" unit="ms" trend="flat" />
        <KPICard label="P99 Latency" value="142" unit="ms" trend="up" trendValue="+14ms" />
        <KPICard label="Cluster CPU" value="48.2" unit="%" trend="flat" />
        <KPICard label="Cluster Memory" value="54.6" unit="%" trend="flat" />
      </div>

      {/* Metric Visualizations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--ov-space-4)' }}>
        {/* Latency Percentiles Card */}
        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-2)', fontSize: 'var(--ov-font-size-md)' }}>
              <Activity size={16} color="var(--ov-primary)" /> API Latency Distribution Percentiles
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ov-space-4)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--ov-font-size-sm)', marginBottom: 6 }}>
                  <span style={{ color: 'var(--ov-text-secondary)' }}>P50 Median Latency</span>
                  <span style={{ fontFamily: 'var(--ov-font-mono)', fontWeight: 600, color: 'var(--ov-status-healthy)' }}>18.2ms</span>
                </div>
                <div style={{ height: 8, background: 'var(--ov-bg-subtle)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '18%', height: '100%', background: '#10B981', borderRadius: 4 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--ov-font-size-sm)', marginBottom: 6 }}>
                  <span style={{ color: 'var(--ov-text-secondary)' }}>P90 Latency</span>
                  <span style={{ fontFamily: 'var(--ov-font-mono)', fontWeight: 600, color: 'var(--ov-primary)' }}>64.0ms</span>
                </div>
                <div style={{ height: 8, background: 'var(--ov-bg-subtle)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '42%', height: '100%', background: '#00F2FE', borderRadius: 4 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--ov-font-size-sm)', marginBottom: 6 }}>
                  <span style={{ color: 'var(--ov-text-secondary)' }}>P99 Tail Latency</span>
                  <span style={{ fontFamily: 'var(--ov-font-mono)', fontWeight: 600, color: 'var(--ov-status-warning)' }}>142.0ms</span>
                </div>
                <div style={{ height: 8, background: 'var(--ov-bg-subtle)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '74%', height: '100%', background: '#F59E0B', borderRadius: 4 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--ov-font-size-sm)', marginBottom: 6 }}>
                  <span style={{ color: 'var(--ov-text-secondary)' }}>P99.9 Extreme SLA Threshold</span>
                  <span style={{ fontFamily: 'var(--ov-font-mono)', fontWeight: 600, color: '#c084fc' }}>310.0ms (SLA &lt; 500ms)</span>
                </div>
                <div style={{ height: 8, background: 'var(--ov-bg-subtle)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '88%', height: '100%', background: '#8B5CF6', borderRadius: 4 }} />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Application Resource Allocation */}
        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-2)', fontSize: 'var(--ov-font-size-md)' }}>
              <Cpu size={16} color="#8B5CF6" /> Application Resource Allocation & Quotas
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ov-space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--ov-space-2) 0', borderBottom: '1px solid var(--ov-border)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ov-text-primary)' }}>Netra (RAG Baxter)</div>
                  <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>4 Pods · 8 vCPU · 16 GB RAM</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-primary)', fontWeight: 600 }}>52.4% CPU</span>
                  <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>8.2 GB Used</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--ov-space-2) 0', borderBottom: '1px solid var(--ov-border)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ov-text-primary)' }}>Kavacha (IAM & Auth)</div>
                  <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>2 Pods · 4 vCPU · 8 GB RAM</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontFamily: 'var(--ov-font-mono)', color: '#34d399', fontWeight: 600 }}>24.1% CPU</span>
                  <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>3.1 GB Used</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--ov-space-2) 0' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ov-text-primary)' }}>Blackline (Reconciliation)</div>
                  <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>3 Pods · 6 vCPU · 12 GB RAM</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontFamily: 'var(--ov-font-mono)', color: '#38bdf8', fontWeight: 600 }}>38.7% CPU</span>
                  <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>5.8 GB Used</div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
