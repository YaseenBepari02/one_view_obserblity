'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

export default function KavachaExecutionsPage() {
  const { data, isLoading } = useQuery<any>({
    queryKey: ['kavacha-executions'],
    queryFn: () => api.get('/kavacha/executions'),
  });

  if (isLoading) {
    return <div style={{ padding: '24px' }}><Skeleton width="100%" height={400} /></div>;
  }

  const items = data?.items || [];

  return (
    <div style={{ padding: '24px', background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '12px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ov-text-primary)', margin: '0 0 8px 0' }}>Executions</h2>
        <p style={{ fontSize: '13px', color: '#8b949e', margin: 0 }}>Test run execution results.</p>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--ov-border)', color: '#8b949e' }}>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>ID</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>TEST CASE</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>APP</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>RESULT</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>DURATION</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>ENVIRONMENT</th>
          </tr>
        </thead>
        <tbody>
          {items.map((exec: any) => (
            <tr key={exec.id} style={{ borderBottom: '1px solid var(--ov-border)' }}>
              <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{exec.id}</td>
              <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--ov-text-primary)' }}>{exec.test_case_title}</td>
              <td style={{ padding: '12px 16px' }}>{exec.app_name}</td>
              <td style={{ padding: '12px 16px' }}>
                <span style={{ 
                  background: exec.result === 'pass' ? 'rgba(16,185,129,0.1)' : exec.result === 'fail' ? 'rgba(244,63,94,0.1)' : 'var(--ov-bg-subtle)', 
                  color: exec.result === 'pass' ? '#10b981' : exec.result === 'fail' ? '#f43f5e' : 'inherit',
                  padding: '4px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase'
                }}>{exec.result}</span>
              </td>
              <td style={{ padding: '12px 16px' }}>{exec.duration_ms ? `${exec.duration_ms}ms` : '-'}</td>
              <td style={{ padding: '12px 16px' }}>{exec.environment || '-'}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#8b949e' }}>No executions found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
