'use client';

import Link from 'next/link';
import { Activity, Server, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/Badge/Badge';

const apps = [
  {
    id: 'netra',
    name: 'Netra',
    description: 'Centralized observability and monitoring platform.',
    icon: Activity,
    status: 'healthy',
    environment: 'prod',
    color: 'var(--ov-primary)',
  },
  {
    id: 'kavacha',
    name: 'Kavacha',
    description: 'Security and access management.',
    icon: Shield,
    status: 'warning',
    environment: 'prod',
    color: 'var(--ov-info)',
  },
  {
    id: 'blackline',
    name: 'Blackline',
    description: 'Financial reconciliation platform.',
    icon: Server,
    status: 'healthy',
    environment: 'prod',
    color: 'var(--ov-warning)',
  },
];

export default function ApplicationsPage() {
  return (
    <div style={{ padding: 'var(--ov-space-6)', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--ov-space-6)' }}>
        <h1 style={{ fontSize: 'var(--ov-font-size-2xl)', fontWeight: 'var(--ov-font-weight-bold)', color: 'var(--ov-text-primary)' }}>
          Applications
        </h1>
        <p style={{ color: 'var(--ov-text-muted)', marginTop: 'var(--ov-space-2)' }}>
          Select an application to view its details, monitors, and active users.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 'var(--ov-space-5)',
      }}>
        {apps.map((app) => (
          <Link
            key={app.id}
            href={`/applications/${app.id}`}
            style={{
              display: 'block',
              padding: 'var(--ov-space-5)',
              background: 'var(--ov-bg-card)',
              border: '1px solid var(--ov-border)',
              borderRadius: 'var(--ov-radius-xl)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = app.color;
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'var(--ov-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--ov-space-4)' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: 48, 
                height: 48, 
                borderRadius: 'var(--ov-radius-lg)', 
                background: `color-mix(in srgb, ${app.color} 15%, transparent)`,
                color: app.color 
              }}>
                <app.icon size={24} />
              </div>
              <Badge variant={app.status === 'healthy' ? 'success' : 'warning'}>
                {app.status}
              </Badge>
            </div>
            
            <h2 style={{ fontSize: 'var(--ov-font-size-lg)', fontWeight: 'var(--ov-font-weight-semibold)', color: 'var(--ov-text-primary)', marginBottom: 'var(--ov-space-2)' }}>
              {app.name}
            </h2>
            <p style={{ color: 'var(--ov-text-muted)', fontSize: 'var(--ov-font-size-sm)', marginBottom: 'var(--ov-space-4)' }}>
              {app.description}
            </p>
            
            <div style={{ display: 'flex', gap: 'var(--ov-space-2)' }}>
              <Badge variant="info">{app.environment}</Badge>
              <Badge variant="outline">View Details →</Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
