'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { 
  Building2, Activity, ArrowRight, AlertTriangle, 
  CheckCircle2, Clock, ActivitySquare, Server
} from 'lucide-react';
import { ApplicationCard } from '@/components/ui/ApplicationCard/ApplicationCard';
import { useAppStore } from '@/lib/stores/app-store';
import { cn } from '@/lib/utils';
import type { TimeRange } from '@/types';

const HEALTH_TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '5m', label: '5m' },
  { value: '30m', label: '30m' },
  { value: '1h', label: '1h' },
  { value: '24h', label: '24h' }
];

interface AppSummary {
  id: string;
  name: string;
  description: string;
  environment: string;
  health: any;
}

export default function GlobalHealthPage() {
  const router = useRouter();
  const [apps, setApps] = useState<AppSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);
  const { timeRange, setTimeRange } = useAppStore();

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      try {
        setLoading(true);
        // Fetch all apps
        const appList = await api.get<any[]>('/applications');
        
        // Fetch health for each app
        const appsWithHealth = await Promise.all(
          appList.map(async (app) => {
            try {
              const health = await api.get<any>('/applications/' + app.id + '/health');
              return { ...app, health };
            } catch (err) {
              return { ...app, health: null };
            }
          })
        );
        
        setApps(appsWithHealth);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Failed to load global health:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
    const interval = setInterval(loadData, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'healthy': return 'var(--ov-status-healthy)';
      case 'warning': return 'var(--ov-status-warning)';
      case 'critical': return 'var(--ov-status-critical)';
      default: return 'var(--ov-text-muted)';
    }
  };

  const getStatusBg = (state: string) => {
    switch (state) {
      case 'healthy': return 'var(--ov-status-healthy-bg)';
      case 'warning': return 'var(--ov-status-warning-bg)';
      case 'critical': return 'var(--ov-status-critical-bg)';
      default: return 'rgba(148, 163, 184, 0.1)';
    }
  };

  const counts = {
    healthy: apps.filter(a => a.health?.health_state === 'healthy').length,
    warning: apps.filter(a => a.health?.health_state === 'warning').length,
    critical: apps.filter(a => a.health?.health_state === 'critical').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', background: 'var(--ov-bg-page)', padding: '24px' }}>
      {/* --- Header -------------------------------------------------------- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Building2 size={24} color="var(--ov-primary)" />
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--ov-text-primary)' }}>Application Health Overview</h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--ov-text-secondary)', fontSize: '14px', fontWeight: 500 }}>
          <div className="ov-header-time-range" style={{ marginRight: '8px' }}>
            {HEALTH_TIME_RANGES.map((tr) => (
              <button
                key={tr.value}
                className={cn('ov-header-time-btn', timeRange === tr.value && 'is-active')}
                onClick={() => setTimeRange(tr.value)}
              >
                {tr.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Server size={16} />
            {apps.length} applications
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} />
            {mounted ? lastUpdated.toLocaleTimeString() : '--:--:--'}
          </div>
        </div>
      </div>

      {/* --- Summary Badges ------------------------------------------------ */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', background: 'var(--ov-status-critical-bg)', color: 'var(--ov-status-critical)', fontWeight: 600, fontSize: '13px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <AlertTriangle size={16} />
          {counts.critical} Critical
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', background: 'var(--ov-status-warning-bg)', color: 'var(--ov-status-warning)', fontWeight: 600, fontSize: '13px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <ActivitySquare size={16} />
          {counts.warning} Warning
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', background: 'var(--ov-status-healthy-bg)', color: 'var(--ov-status-healthy)', fontWeight: 600, fontSize: '13px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <CheckCircle2 size={16} />
          {counts.healthy} Stable
        </div>
      </div>

      {/* --- Application Cards --------------------------------------------- */}
      {loading && apps.length === 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
          {[1, 2].map((i) => (
            <div key={i} style={{ height: '300px', borderRadius: '16px', background: 'var(--ov-bg-surface)', border: '1px solid var(--ov-border)', opacity: 0.5, animation: 'pulse 2s infinite' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
          {apps.map(app => {
            const h = app.health || {};
            const state = h.health_state || 'unknown';
            const color = getStatusColor(state);
            const bg = getStatusBg(state);

            return (
              <ApplicationCard
                key={app.id}
                id={app.id}
                name={app.name}
                description={`Cluster: ${h.cluster_id || 'prod-us-east-1'} • Owner: ${app.name} Team`}
                status={state}
                environment={app.environment}
                metrics={{
                  uptime: h.uptime_percent !== undefined ? `${h.uptime_percent}%` : '--',
                  latency: h.p95_latency_ms !== undefined ? `${h.p95_latency_ms}ms` : '--',
                  errorRate: h.error_rate !== undefined ? `${h.error_rate}%` : '--'
                }}
              />
            );
          })}
        </div>
      )}
      
      <div style={{ textAlign: 'center', marginTop: '48px', color: 'var(--ov-text-muted)', fontSize: '12px' }}>
        <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
        Last updated: {mounted ? lastUpdated.toLocaleTimeString() : '--:--:--'}
      </div>
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}
