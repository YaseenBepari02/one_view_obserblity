'use client';

import Link from 'next/link';
import './page.css';
import { Server, User, Users, Activity, Cpu, AlertTriangle, CheckCircle2, Cloud, ShieldAlert, Zap, Globe, HardDrive, Network, Box, Bell, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { Badge } from '@/components/ui/Badge/Badge';
import { formatNumber, formatCurrency } from '@/lib/utils';
import type { Application, DashboardSummary } from '@/types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Synthetic global activity data for the chart
const activityData = Array.from({ length: 24 }).map((_, i) => {
  const base = 2000 + Math.sin(i / 3) * 1500;
  return {
    time: `${i}:00`,
    requests: Math.floor(base + Math.random() * 500),
    compute: Math.floor((base / 50) + Math.random() * 10),
  };
});

const recentEvents = [
  { id: 1, type: 'critical', title: 'High CPU utilization', desc: 'Prod Cluster Node-3 reached 92% CPU', time: '2m ago', icon: AlertTriangle },
  { id: 2, type: 'warning', title: 'Rate limit approaching', desc: 'API tier for user group alpha is at 85%', time: '14m ago', icon: Zap },
  { id: 3, type: 'success', title: 'Deployment successful', desc: 'Blackline v2.1.4 rolled out to production', time: '1h ago', icon: CheckCircle2 },
  { id: 4, type: 'info', title: 'Database snapshot', desc: 'Automated backup completed successfully', time: '3h ago', icon: HardDrive },
  { id: 5, type: 'warning', title: 'Elevated error rate', desc: 'Auth service experiencing 2% error rate', time: '5h ago', icon: ShieldAlert },
];

const toChartData = (arr: number[]) => (arr || []).map((val, i) => ({ time: i, value: val }));

function LiveNetraCard() {
  const { data: health } = useQuery<any>({
    queryKey: ['health-netra-live'],
    queryFn: () => api.get('/applications/netra/health?live=true'),
    refetchInterval: 1000,
  });

  const cpuData = health?.time_series?.cpu || Array(20).fill(25);
  
  return (
    <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: '6px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '16px 16px 12px 16px', borderBottom: '1px solid #1f2937' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>NETRA</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#10b981' }}></span> HEALTHY
            </span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#06b6d4', display: 'flex', alignItems: 'baseline' }}>
            {100 - (health?.cpu_usage_percent || 2)} <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, marginLeft: '2px' }}>/100</span>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace', marginTop: '4px' }}>Baxter RAG Application · GenAI...</div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', padding: '12px 16px', borderBottom: '1px solid #1f2937', textAlign: 'center' }}>
        <div><div style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '4px' }}>ACTIVE<br/>USERS</div><div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>1,420</div></div>
        <div><div style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '4px' }}>THROUGHPUT</div><div style={{ fontSize: '12px', fontWeight: 600, color: '#06b6d4' }}>3.2k RPM</div></div>
        <div><div style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '4px' }}>AVG<br/>LATENCY</div><div style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0' }}>{Math.floor(200 + (health?.memory_usage_percent || 0) * 1.5)}ms</div></div>
        <div><div style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '4px' }}>TOKENS/HR</div><div style={{ fontSize: '12px', fontWeight: 600, color: '#d946ef' }}>1.2M</div></div>
      </div>

      <div style={{ padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '0.05em' }}>VECTOR TRAFFIC & LATENCY TREND</span>
          <span style={{ fontSize: '10px', color: '#06b6d4', fontWeight: 600 }}>P95: {Math.floor(250 + (health?.cpu_usage_percent || 0) * 2)}ms</span>
        </div>
        <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', marginBottom: '8px' }}>NETRA-EMBEDDINGS-V4</div>
        <div style={{ height: '60px', width: '100%', marginLeft: '-8px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={toChartData(cpuData)}>
              <defs>
                <linearGradient id="netraGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4}/><stop offset="100%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient>
              </defs>
              <YAxis domain={[0, 100]} hide />
              <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} fill="url(#netraGrad)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid #1f2937', fontSize: '10px', fontFamily: 'monospace', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex' }}><span style={{ width: '60px', flexShrink: 0 }}>Socket<br/>Ingestion:</span><span style={{ color: '#cbd5e1', alignSelf: 'flex-end', marginLeft: 'auto' }}>/var/run/docker.sock (PID 22...</span></div>
        <div style={{ display: 'flex' }}><span style={{ width: '60px', flexShrink: 0 }}>S3 Data<br/>Archive:</span><span style={{ color: '#06b6d4', alignSelf: 'flex-end', marginLeft: 'auto' }}>s3://baxter-netra-telemetry (..</span></div>
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid #1f2937', display: 'flex', gap: '8px' }}>
        <Link href={`/applications/netra`} style={{ flex: 1, background: '#1f2937', color: '#e2e8f0', textAlign: 'center', padding: '8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Box size={14} /> Dashboard
        </Link>
        <button style={{ width: '32px', background: '#1f2937', border: 'none', borderRadius: '4px', color: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity size={14}/></button>
        <button style={{ width: '32px', background: '#1f2937', border: 'none', borderRadius: '4px', color: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{`>_`}</button>
      </div>
    </div>
  );
}

function LiveKavachCard() {
  const { data: health } = useQuery<any>({
    queryKey: ['health-kavacha-live'],
    queryFn: () => api.get('/applications/kavacha/health?live=true'),
    refetchInterval: 1000,
  });
  
  const memData = health?.time_series?.memory || Array(20).fill(50);
  const cpuVal = health?.cpu_usage_percent || 54;
  const memVal = health?.memory_usage_percent || 88.4;

  return (
    <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: '6px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '16px 16px 12px 16px', borderBottom: '1px solid #1f2937' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>KAVACH</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#f59e0b' }}></span> WARN
            </span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'baseline' }}>
            84 <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, marginLeft: '2px' }}>/100</span>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace', marginTop: '4px' }}>Security & Gateway · Core Auth...</div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', padding: '12px 16px', borderBottom: '1px solid #1f2937', textAlign: 'center' }}>
        <div><div style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '4px' }}>ACTIVE<br/>SESSIONS</div><div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>8,420</div></div>
        <div><div style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '4px' }}>THROUGHPUT</div><div style={{ fontSize: '12px', fontWeight: 600, color: '#06b6d4' }}>12.4k RPM</div></div>
        <div><div style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '4px' }}>ERROR RATE</div><div style={{ fontSize: '12px', fontWeight: 600, color: '#f59e0b' }}>0.42%</div></div>
        <div><div style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '4px' }}>UPTIME</div><div style={{ fontSize: '12px', fontWeight: 600, color: '#10b981' }}>99.82%</div></div>
      </div>

      <div style={{ padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <AlertTriangle size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span style={{ fontSize: '10px', color: '#f59e0b', fontFamily: 'monospace', lineHeight: 1.4 }}>High Memory: worker-02 at {memVal}%<br/><span style={{ color: '#64748b' }}>POD-ID: kavach-w2</span></span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 600, color: '#06b6d4', marginBottom: '4px' }}>
          <span>CPU {cpuVal}%</span>
          <span style={{ color: '#f59e0b' }}>MEM {memVal}% (Threshold: 85%)</span>
        </div>
        <div style={{ height: '4px', background: '#1f2937', borderRadius: '2px', marginBottom: '12px', display: 'flex' }}>
          <div style={{ width: `${cpuVal}%`, background: '#06b6d4', borderRadius: '2px 0 0 2px', transition: 'width 0.5s linear' }}></div>
          <div style={{ width: `${Math.max(0, memVal - cpuVal)}%`, background: '#f59e0b', transition: 'width 0.5s linear' }}></div>
        </div>
        <div style={{ height: '30px', width: '100%', marginTop: 'auto', marginLeft: '-8px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={toChartData(memData)}>
              <YAxis domain={[0, 100]} hide />
              <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} fill="none" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid #1f2937', fontSize: '10px', fontFamily: 'monospace', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex' }}><span style={{ width: '60px', flexShrink: 0 }}>Socket<br/>Ingestion:</span><span style={{ color: '#10b981', alignSelf: 'flex-end', marginLeft: 'auto' }}>Docker Socket Connected (Host...</span></div>
        <div style={{ display: 'flex' }}><span style={{ width: '60px', flexShrink: 0 }}>WAF Rule<br/>Engines:</span><span style={{ color: '#cbd5e1', alignSelf: 'flex-end', marginLeft: 'auto' }}>Zero-Trust Enforcement (4,120...</span></div>
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid #1f2937', display: 'flex', gap: '8px' }}>
        <Link href={`/applications/kavacha`} style={{ flex: 1, background: '#1f2937', color: '#e2e8f0', textAlign: 'center', padding: '8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Box size={14} /> Dashboard
        </Link>
        <button style={{ width: '32px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '4px', color: '#f59e0b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔧</button>
        <button style={{ width: '32px', background: '#1f2937', border: 'none', borderRadius: '4px', color: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{`>_`}</button>
      </div>
    </div>
  );
}

function StaticBlacklineCard() {
  return (
    <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: '6px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '16px 16px 12px 16px', borderBottom: '1px solid #1f2937' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>BLACKLINE</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#10b981' }}></span> HEALTHY
            </span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#06b6d4', display: 'flex', alignItems: 'baseline' }}>
            99 <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, marginLeft: '2px' }}>/100</span>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace', marginTop: '4px' }}>Financial Reconciliation · Bat...</div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', padding: '12px 16px', borderBottom: '1px solid #1f2937', textAlign: 'center' }}>
        <div><div style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '4px' }}>ACTIVE<br/>JOBS</div><div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>14 Active</div></div>
        <div><div style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '4px' }}>JOB<br/>FAILURES</div><div style={{ fontSize: '12px', fontWeight: 600, color: '#10b981' }}>0 Failed</div></div>
        <div><div style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '4px' }}>NEXT<br/>LEDGER SYNC</div><div style={{ fontSize: '12px', fontWeight: 600, color: '#06b6d4' }}>in 14m</div></div>
        <div><div style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '4px' }}>P99<br/>LATENCY</div><div style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0' }}>42ms</div></div>
      </div>

      <div style={{ padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '0.05em' }}>BATCH THROUGHPUT<br/>(EVENTS/SEC)</span>
          <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 600, textAlign: 'right' }}>Stable (100%<br/>SLA)</span>
        </div>
        <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', marginBottom: '8px' }}>CRON PIPELINE: SYNC-OK</div>
        <div style={{ height: '60px', width: '100%', marginTop: 'auto' }}>
          <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <path d="M0 20 L20 22 L40 19 L60 21 L80 18 L100 20" fill="none" stroke="#10b981" strokeWidth="2"/>
            <path d="M0 20 L20 22 L40 19 L60 21 L80 18 L100 20 L100 30 L0 30 Z" fill="url(#greenGrad)" stroke="none" opacity="0.2"/>
            <defs>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#10b981" stopOpacity="0"/></linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid #1f2937', fontSize: '10px', fontFamily: 'monospace', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex' }}><span style={{ width: '60px', flexShrink: 0 }}>Telemetry<br/>Feed:</span><span style={{ color: '#cbd5e1', alignSelf: 'flex-end', marginLeft: 'auto' }}>AWS S3 Log Stream (28s ago)</span></div>
        <div style={{ display: 'flex' }}><span style={{ width: '60px', flexShrink: 0 }}>Sync<br/>Target:</span><span style={{ color: '#10b981', alignSelf: 'flex-end', marginLeft: 'auto' }}>Postgres Warehouse Master · S..</span></div>
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid #1f2937', display: 'flex', gap: '8px' }}>
        <Link href={`/applications/blackline`} style={{ flex: 1, background: '#1f2937', color: '#e2e8f0', textAlign: 'center', padding: '8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Box size={14} /> Dashboard
        </Link>
        <button style={{ width: '32px', background: '#1f2937', border: 'none', borderRadius: '4px', color: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity size={14}/></button>
        <button style={{ width: '32px', background: '#1f2937', border: 'none', borderRadius: '4px', color: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{`>_`}</button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data: summary, isLoading: summaryLoading } = useQuery<DashboardSummary>({
    queryKey: ['dashboard-summary'],
    queryFn: () => api.get('/dashboard/summary'),
    refetchInterval: 30000,
  });

  const { data: applications, isLoading: appsLoading } = useQuery<Application[]>({
    queryKey: ['applications'],
    queryFn: () => api.get('/applications'),
    refetchInterval: 30000,
  });

  return (
    <div className="ov-home-container">
      {/* Hero Section */}
      <div className="ov-hero-section">
        <div className="ov-hero-bg"></div>
        <div className="ov-hero-content">
          <div>
            <h1 className="ov-hero-title">Command Center</h1>
            <p className="ov-hero-subtitle">Global observability and active monitoring across all environments.</p>
          </div>
          <div className="ov-hero-status">
            <div className="ov-status-indicator pulse-healthy"></div>
            <span>System Operational</span>
          </div>
        </div>
      </div>

      <div className="ov-main-grid">
        {/* Left Column (Main Content) */}
        <div className="ov-content-col">
          
          {/* Rich KPI Strip */}
          <div className="ov-rich-kpi-grid">
            <div className="ov-rich-kpi">
              <Globe className="ov-rich-kpi-bg" size={120} color="#3b82f6" />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Server size={14}/> Active Apps</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>
                  {summaryLoading ? <Skeleton width={40} /> : summary?.total_applications || 0}
                </div>
              </div>
            </div>
            
            <div className="ov-rich-kpi">
              <Activity className="ov-rich-kpi-bg" size={120} color="#10b981" />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Zap size={14}/> API Requests</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>
                  {summaryLoading ? <Skeleton width={80} /> : formatNumber(summary?.total_api_requests || 0)}
                </div>
              </div>
            </div>

            <div className="ov-rich-kpi">
              <Users className="ov-rich-kpi-bg" size={120} color="#8b5cf6" />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14}/> Total Users</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>
                  {summaryLoading ? <Skeleton width={60} /> : formatNumber(summary?.total_active_users || 0)}
                </div>
              </div>
            </div>

            <div className="ov-rich-kpi">
              <AlertTriangle className="ov-rich-kpi-bg" size={120} color="#f43f5e" />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldAlert size={14}/> Error Rate</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>
                  {summaryLoading ? <Skeleton width={40} /> : '0.12%'}
                </div>
              </div>
            </div>
          </div>

          <h2 className="ov-section-title" style={{ marginTop: '40px' }}><Activity size={18} color="#3b82f6" /> Global Traffic</h2>
          <div className="ov-activity-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111217', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontSize: '13px' }}
                  labelStyle={{ color: '#888', marginBottom: '4px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorReq)" />
                <Area type="monotone" dataKey="compute" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorComp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', marginBottom: '20px' }}>
            <h2 className="ov-section-title" style={{ margin: 0, fontSize: '14px', letterSpacing: '0.05em' }}>
              TIER-1 APPLICATION ROSTER <span style={{ color: '#64748b', fontWeight: 400, marginLeft: '8px' }}>[CLUSTER-TOPOLOGY]</span>
            </h2>
            <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace' }}>
              <span className="ov-status-indicator pulse-healthy" style={{ width: 6, height: 6 }} /> LIVE STREAM (1s)
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <LiveNetraCard />
            <LiveKavachCard />
            <StaticBlacklineCard />
          </div>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="ov-side-col">
          
          <h2 className="ov-section-title"><Bell size={18} color="#f59e0b" /> Event Stream</h2>
          <div className="ov-events-panel">
            {recentEvents.map(event => (
              <div key={event.id} className="ov-event-item">
                <div className={`ov-event-icon ${event.type}`}>
                  <event.icon size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#e5e7eb', marginBottom: '2px' }}>{event.title}</div>
                  <div style={{ fontSize: '12px', color: '#888', lineHeight: 1.4 }}>{event.desc}</div>
                  <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>{event.time}</div>
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <Link href="#" style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'none' }}>View All Events</Link>
            </div>
          </div>

          <h2 className="ov-section-title" style={{ marginTop: '32px' }}><HardDrive size={18} color="#8b5cf6" /> Cluster Health</h2>
          <div className="ov-infra-panel">
            <div className="ov-infra-bar">
              <div className="ov-infra-bar-labels"><span>Total CPU Allocation</span> <span>64%</span></div>
              <div className="ov-infra-bar-track">
                <div className="ov-infra-bar-fill" style={{ width: '64%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}></div>
              </div>
            </div>
            <div className="ov-infra-bar" style={{ marginTop: '12px' }}>
              <div className="ov-infra-bar-labels"><span>Total Memory Allocation</span> <span>82%</span></div>
              <div className="ov-infra-bar-track">
                <div className="ov-infra-bar-fill" style={{ width: '82%', background: 'linear-gradient(90deg, #f59e0b, #fcd34d)' }}></div>
              </div>
            </div>
            <div className="ov-infra-bar" style={{ marginTop: '12px' }}>
              <div className="ov-infra-bar-labels"><span>Storage I/O Capacity</span> <span>31%</span></div>
              <div className="ov-infra-bar-track">
                <div className="ov-infra-bar-fill" style={{ width: '31%', background: 'linear-gradient(90deg, #10b981, #34d399)' }}></div>
              </div>
            </div>
            <div className="ov-infra-bar" style={{ marginTop: '12px' }}>
              <div className="ov-infra-bar-labels"><span>Network Bandwidth</span> <span>45%</span></div>
              <div className="ov-infra-bar-track">
                <div className="ov-infra-bar-fill" style={{ width: '45%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }}></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
