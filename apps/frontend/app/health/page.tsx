'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { 
  Building2, Activity, ArrowRight, AlertTriangle, 
  CheckCircle2, Clock, ActivitySquare, Server
} from 'lucide-react';

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
              <div 
                key={app.id} 
                style={{ 
                  borderRadius: '16px', 
                  border: '1px solid var(--ov-border)', 
                  background: 'var(--ov-bg-card)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--ov-shadow-sm)'
                }}
              >
                {/* Top decorative line matching status */}
                <div style={{ height: '4px', width: '100%', background: color }} />
                
                <div style={{ padding: '24px', flex: 1 }}>
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--ov-bg-surface)', border: '1px solid var(--ov-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ov-text-primary)' }}>
                        {app.id.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--ov-text-primary)' }}>{app.name}</h2>
                        <p style={{ fontSize: '12px', color: 'var(--ov-text-muted)', margin: '4px 0 0 0' }}>
                          Environment: {app.environment.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      <span style={{ fontSize: '10px', fontFamily: 'monospace', padding: '2px 8px', borderRadius: '12px', background: 'var(--ov-bg-surface)', border: '1px solid var(--ov-border)', color: 'var(--ov-text-secondary)', fontWeight: 600 }}>
                        APP-{app.id.toUpperCase().substring(0,4)}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', background: bg, color: color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {state === 'healthy' ? 'Stable' : state}
                      </span>
                    </div>
                  </div>

                  {/* Location / Owner */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', fontSize: '12px', color: 'var(--ov-text-secondary)', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Server size={14} />
                      Cluster: {h.cluster_id || 'prod-us-east-1'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <UserIcon size={14} />
                      Owner: {app.name} Team
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ padding: '16px 12px', borderRadius: '12px', background: 'var(--ov-bg-surface)', border: '1px solid var(--ov-border)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Activity size={18} color="var(--ov-status-critical)" style={{ marginBottom: '8px' }} />
                      <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ov-text-primary)', lineHeight: 1 }}>
                        {h.uptime_percent !== undefined ? h.uptime_percent : '--'}%
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', marginTop: '6px' }}>Uptime</div>
                    </div>
                    <div style={{ padding: '16px 12px', borderRadius: '12px', background: 'var(--ov-bg-surface)', border: '1px solid var(--ov-border)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Clock size={18} color="var(--ov-status-info)" style={{ marginBottom: '8px' }} />
                      <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ov-text-primary)', lineHeight: 1 }}>
                        {h.p95_latency_ms !== undefined ? h.p95_latency_ms : '--'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', marginTop: '6px' }}>Latency (ms)</div>
                    </div>
                    <div style={{ padding: '16px 12px', borderRadius: '12px', background: 'var(--ov-bg-surface)', border: '1px solid var(--ov-border)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <AlertTriangle size={18} color="var(--ov-status-warning)" style={{ marginBottom: '8px' }} />
                      <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ov-text-primary)', lineHeight: 1 }}>
                        {h.error_rate !== undefined ? h.error_rate : '--'}%
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', marginTop: '6px' }}>Error Rate</div>
                    </div>
                  </div>

                  {/* Status Note & View Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--ov-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 500, color: color }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                      {state === 'healthy' ? 'All systems operational' : state === 'warning' ? 'Minor latency issues detected' : 'Critical failures reported'}
                    </div>
                    <button 
                      onClick={() => router.push('/applications/' + app.id + '/health')}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 16px', 
                        borderRadius: '8px', background: 'var(--ov-primary-muted)', color: 'var(--ov-primary)', 
                        border: '1px solid transparent', fontSize: '13px', fontWeight: 600, cursor: 'pointer' 
                      }}
                    >
                      View <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
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
