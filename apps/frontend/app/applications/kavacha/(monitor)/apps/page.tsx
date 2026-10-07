'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

export default function KavachaAppsPage() {
  const { data, isLoading } = useQuery<any>({
    queryKey: ['kavacha-applications'],
    queryFn: () => api.get('/kavacha/applications'),
  });

  if (isLoading) {
    return <div style={{ padding: '24px' }}><Skeleton width="100%" height={400} /></div>;
  }

  const items = data?.items || [];

  return (
    <div style={{ padding: '24px', background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '12px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ov-text-primary)', margin: '0 0 8px 0' }}>Applications Under Test</h2>
        <p style={{ fontSize: '13px', color: '#8b949e', margin: 0 }}>Registered applications in the NextGen2 platform.</p>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--ov-border)', color: '#8b949e' }}>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>ID</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>NAME</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>BASE URL</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>OWNER</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>TEST CASES</th>
          </tr>
        </thead>
        <tbody>
          {items.map((app: any) => (
            <tr key={app.id} style={{ borderBottom: '1px solid var(--ov-border)' }}>
              <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{app.id}</td>
              <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--ov-text-primary)' }}>{app.name}</td>
              <td style={{ padding: '12px 16px', color: '#3b82f6' }}>{app.base_url || '-'}</td>
              <td style={{ padding: '12px 16px' }}>{app.owner_name || app.owner || '-'}</td>
              <td style={{ padding: '12px 16px', fontWeight: 600 }}>{app.test_case_count || 0}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#8b949e' }}>No applications found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
