'use client';

import { BarChart3, Database, DollarSign, Activity, CheckCircle, Zap } from 'lucide-react';
import { KPICard } from '@/components/shared/KPICard/KPICard';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';

export default function BlacklineRagAnalyticsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ov-space-5)' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 'var(--ov-font-size-xl)', fontWeight: 'var(--ov-font-weight-bold)', color: 'var(--ov-text-primary)', margin: 0 }}>
            Blackline Financial Reconciliation Analytics
          </h2>
          <p style={{ fontSize: 'var(--ov-font-size-sm)', color: 'var(--ov-text-muted)', margin: '4px 0 0 0' }}>
            Automated balance ledger reconciliation, anomaly detection, and ERP synchronization throughput
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--ov-space-2)' }}>
          <Badge variant="healthy" dot>Reconciliation Engine: RUNNING</Badge>
          <Badge variant="info">ERP Sync: SAP S/4HANA</Badge>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--ov-space-3)' }}>
        <KPICard label="Recon Accuracy" value="99.99" unit="%" trend="flat" />
        <KPICard label="Batch Sync Duration" value="4.2" unit="min" trend="up" trendValue="-30s" />
        <KPICard label="Matched Accounts" value="42,850" unit="" trend="up" />
        <KPICard label="Variance Flags" value="2" unit="items" trend="down" />
        <KPICard label="Ledger Volume" value="1.8" unit="M tx" />
        <KPICard label="Close Cycle" value="1.4" unit="days" />
      </div>

      {/* Analytics Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--ov-space-4)' }}>
        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-2)' }}>
              <Zap size={16} color="var(--ov-primary)" /> Reconciliation Batch Telemetry
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ov-space-3)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--ov-font-size-sm)', marginBottom: 4 }}>
                  <span style={{ color: 'var(--ov-text-secondary)' }}>Automated Transaction Matching</span>
                  <span style={{ fontFamily: 'var(--ov-font-mono)', fontWeight: 600 }}>98.6% auto-cleared</span>
                </div>
                <div style={{ height: 6, background: 'var(--ov-bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '98%', height: '100%', background: '#10B981', borderRadius: 3 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--ov-font-size-sm)', marginBottom: 4 }}>
                  <span style={{ color: 'var(--ov-text-secondary)' }}>Sub-ledger to GL Integrity Check</span>
                  <span style={{ fontFamily: 'var(--ov-font-mono)', fontWeight: 600 }}>100% verified</span>
                </div>
                <div style={{ height: 6, background: 'var(--ov-bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: '#00F2FE', borderRadius: 3 }} />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-2)' }}>
              <DollarSign size={16} color="#10B981" /> Financial Variances by Region
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ov-space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--ov-space-2) 0', borderBottom: '1px solid var(--ov-border)' }}>
                <span style={{ color: 'var(--ov-text-primary)', fontWeight: 500 }}>North America (USD)</span>
                <span style={{ fontFamily: 'var(--ov-font-mono)', color: '#10B981' }}>$0.00 variance</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--ov-space-2) 0', borderBottom: '1px solid var(--ov-border)' }}>
                <span style={{ color: 'var(--ov-text-primary)', fontWeight: 500 }}>EMEA (EUR / GBP)</span>
                <span style={{ fontFamily: 'var(--ov-font-mono)', color: '#10B981' }}>$0.00 variance</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--ov-space-2) 0' }}>
                <span style={{ color: 'var(--ov-text-primary)', fontWeight: 500 }}>APAC (SGD / JPY)</span>
                <span style={{ fontFamily: 'var(--ov-font-mono)', color: '#F59E0B' }}>$142.10 pending fx</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
