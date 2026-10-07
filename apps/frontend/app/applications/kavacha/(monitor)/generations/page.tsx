'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

export default function KavachaGenerationsPage() {
  const { data, isLoading } = useQuery<any>({
    queryKey: ['kavacha-generations'],
    queryFn: () => api.get('/kavacha/generations'),
  });

  if (isLoading) {
    return <div style={{ padding: '24px' }}><Skeleton width="100%" height={400} /></div>;
  }

  const items = data?.items || [];

  return (
    <div style={{ padding: '24px', background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '12px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ov-text-primary)', margin: '0 0 8px 0' }}>AI Generations</h2>
        <p style={{ fontSize: '13px', color: '#8b949e', margin: 0 }}>Automated test script generation history.</p>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--ov-border)', color: '#8b949e' }}>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>ID</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>TEST CASE</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>APP</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>STATUS</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>PROVIDER / MODEL</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>VERDICT</th>
          </tr>
        </thead>
        <tbody>
          {items.map((gen: any) => (
            <tr key={gen.id} style={{ borderBottom: '1px solid var(--ov-border)' }}>
              <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{gen.id}</td>
              <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--ov-text-primary)' }}>{gen.test_case_title}</td>
              <td style={{ padding: '12px 16px' }}>{gen.app_name}</td>
              <td style={{ padding: '12px 16px' }}>
                <span style={{ 
                  background: gen.generation_status === 'success' ? 'rgba(16,185,129,0.1)' : 'var(--ov-bg-subtle)', 
                  color: gen.generation_status === 'success' ? '#10b981' : 'inherit',
                  padding: '4px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: 600 
                }}>{gen.generation_status}</span>
              </td>
              <td style={{ padding: '12px 16px' }}>{gen.provider} <span style={{ color: '#8b949e' }}>/ {gen.model}</span></td>
              <td style={{ padding: '12px 16px' }}>{gen.test_verdict || '-'}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#8b949e' }}>No generations found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
