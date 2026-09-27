'use client';

import { useParams, useRouter } from 'next/navigation';
import { Activity, Server, Database, Globe, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge/Badge';

export default function MonitorsPage() {
  
  const router = useRouter();
  const appId = "kavacha";

  const monitors = [
    {
      id: 'm-1',
      name: 'Frontend Web Server',
      type: 'http',
      url: 'https://app.example.com',
      status: 'up',
      responseTime: '45ms',
      uptime: '99.99%',
      lastChecked: '2 mins ago',
      icon: Globe
    },
    {
      id: 'm-2',
      name: 'Core API Gateway',
      type: 'api',
      url: 'https://api.example.com/health',
      status: 'up',
      responseTime: '120ms',
      uptime: '99.95%',
      lastChecked: '1 min ago',
      icon: Server
    },
    {
      id: 'm-3',
      name: 'Primary Database cluster',
      type: 'database',
      url: 'postgres://db.internal:5432',
      status: 'up',
      responseTime: '12ms',
      uptime: '99.99%',
      lastChecked: '1 min ago',
      icon: Database
    },
    {
      id: 'm-4',
      name: 'Background Worker',
      type: 'worker',
      url: 'redis://queue.internal',
      status: 'down',
      responseTime: '-',
      uptime: '98.50%',
      lastChecked: 'Just now',
      icon: Activity
    }
  ];

  return (
    <div style={{ padding: 'var(--ov-space-6)', maxWidth: '1200px', margin: '0 auto' }}>
      <button 
        onClick={() => router.back()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--ov-space-2)',
          background: 'none',
          border: 'none',
          color: 'var(--ov-text-muted)',
          cursor: 'pointer',
          marginBottom: 'var(--ov-space-6)',
          fontSize: 'var(--ov-font-size-sm)'
        }}
      >
        <ArrowLeft size={16} />
        Back to Application
      </button>

      <div style={{ marginBottom: 'var(--ov-space-6)' }}>
        <h1 style={{ fontSize: 'var(--ov-font-size-2xl)', fontWeight: 'var(--ov-font-weight-bold)', color: 'var(--ov-text-primary)' }}>
          Monitors for {appId}
        </h1>
        <p style={{ color: 'var(--ov-text-muted)', marginTop: 'var(--ov-space-2)' }}>
          Real-time status and health checks for application components.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 'var(--ov-space-4)' }}>
        {monitors.map(monitor => (
          <div 
            key={monitor.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--ov-space-5)',
              background: 'var(--ov-bg-card)',
              border: `1px solid ${monitor.status === 'down' ? 'var(--ov-error)' : 'var(--ov-border)'}`,
              borderRadius: 'var(--ov-radius-lg)',
              boxShadow: monitor.status === 'down' ? '0 0 0 1px var(--ov-error)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-4)' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--ov-radius-full)',
                background: monitor.status === 'up' ? 'color-mix(in srgb, var(--ov-success) 15%, transparent)' : 'color-mix(in srgb, var(--ov-error) 15%, transparent)',
                color: monitor.status === 'up' ? 'var(--ov-success)' : 'var(--ov-error)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {monitor.status === 'up' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
              </div>
              
              <div>
                <h3 style={{ fontSize: 'var(--ov-font-size-lg)', fontWeight: 'var(--ov-font-weight-semibold)', color: 'var(--ov-text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--ov-space-2)' }}>
                  {monitor.name}
                  <Badge variant={monitor.status === 'up' ? 'success' : 'error'}>
                    {monitor.status.toUpperCase()}
                  </Badge>
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-3)', marginTop: 'var(--ov-space-1)', color: 'var(--ov-text-muted)', fontSize: 'var(--ov-font-size-sm)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-1)' }}>
                    <monitor.icon size={14} />
                    {monitor.type}
                  </span>
                  <span>•</span>
                  <span style={{ fontFamily: 'var(--ov-font-mono)' }}>{monitor.url}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--ov-space-6)', textAlign: 'right' }}>
              <div>
                <div style={{ fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', marginBottom: 'var(--ov-space-1)' }}>RESPONSE</div>
                <div style={{ fontFamily: 'var(--ov-font-mono)', fontWeight: 'var(--ov-font-weight-medium)', color: 'var(--ov-text-primary)' }}>{monitor.responseTime}</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', marginBottom: 'var(--ov-space-1)' }}>UPTIME</div>
                <div style={{ fontFamily: 'var(--ov-font-mono)', fontWeight: 'var(--ov-font-weight-medium)', color: 'var(--ov-text-primary)' }}>{monitor.uptime}</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', marginBottom: 'var(--ov-space-1)' }}>LAST CHECKED</div>
                <div style={{ fontWeight: 'var(--ov-font-weight-medium)', color: 'var(--ov-text-primary)' }}>{monitor.lastChecked}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
