'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

export default function KavachaTestCasesPage() {
  const { data, isLoading } = useQuery<any>({
    queryKey: ['kavacha-test-cases'],
    queryFn: () => api.get('/kavacha/test-cases'),
  });

  if (isLoading) {
    return <div style={{ padding: '24px' }}><Skeleton width="100%" height={400} /></div>;
  }

  const items = data?.items || [];

  return (
    <div style={{ padding: '24px', background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '12px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ov-text-primary)', margin: '0 0 8px 0' }}>Test Cases</h2>
        <p style={{ fontSize: '13px', color: '#8b949e', margin: 0 }}>All test case proposals from NextGen2.</p>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--ov-border)', color: '#8b949e' }}>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>ID</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>TITLE</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>APP</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>STATUS</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>TYPE</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>PRIORITY</th>
          </tr>
        </thead>
        <tbody>
          {items.map((tc: any) => (
            <tr key={tc.id} style={{ borderBottom: '1px solid var(--ov-border)' }}>
              <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{tc.id}</td>
              <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--ov-text-primary)' }}>{tc.title}</td>
              <td style={{ padding: '12px 16px' }}>{tc.app_name}</td>
              <td style={{ padding: '12px 16px' }}>
                <span style={{ 
                  background: 'var(--ov-bg-subtle)', padding: '4px 8px', 
                  borderRadius: '100px', fontSize: '10px', fontWeight: 600 
                }}>{tc.status}</span>
              </td>
              <td style={{ padding: '12px 16px' }}>{tc.test_type}</td>
              <td style={{ padding: '12px 16px' }}>{tc.priority || '-'}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#8b949e' }}>No test cases found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
