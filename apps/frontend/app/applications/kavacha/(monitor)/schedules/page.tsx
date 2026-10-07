'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

export default function KavachaSchedulesPage() {
  const { data, isLoading } = useQuery<any>({
    queryKey: ['kavacha-schedules'],
    queryFn: () => api.get('/kavacha/schedules'),
  });

  if (isLoading) {
    return <div style={{ padding: '24px' }}><Skeleton width="100%" height={400} /></div>;
  }

  const items = data?.items || [];

  return (
    <div style={{ padding: '24px', background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '12px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ov-text-primary)', margin: '0 0 8px 0' }}>Schedules</h2>
        <p style={{ fontSize: '13px', color: '#8b949e', margin: 0 }}>Scheduled test suite runs and jobs.</p>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--ov-border)', color: '#8b949e' }}>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>ID</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>NAME</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>APP</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>FREQUENCY</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>STATUS</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>NEXT RUN</th>
          </tr>
        </thead>
        <tbody>
          {items.map((schedule: any) => (
            <tr key={schedule.id} style={{ borderBottom: '1px solid var(--ov-border)' }}>
              <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{schedule.id}</td>
              <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--ov-text-primary)' }}>{schedule.name}</td>
              <td style={{ padding: '12px 16px' }}>{schedule.app_name}</td>
              <td style={{ padding: '12px 16px' }}>{schedule.frequency}</td>
              <td style={{ padding: '12px 16px' }}>
                <span style={{ 
                  background: schedule.enabled ? 'rgba(16,185,129,0.1)' : 'var(--ov-bg-subtle)', 
                  color: schedule.enabled ? '#10b981' : 'inherit',
                  padding: '4px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: 600 
                }}>{schedule.enabled ? 'ACTIVE' : 'DISABLED'}</span>
              </td>
              <td style={{ padding: '12px 16px' }}>{schedule.next_run_at ? new Date(schedule.next_run_at).toLocaleString() : '-'}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#8b949e' }}>No schedules found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
