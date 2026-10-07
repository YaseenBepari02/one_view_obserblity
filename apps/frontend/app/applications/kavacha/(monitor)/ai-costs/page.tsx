'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

export default function KavachaAICostsPage() {
  const { data, isLoading } = useQuery<any>({
    queryKey: ['kavacha-ai-costs'],
    queryFn: () => api.get('/kavacha/ai-costs'),
  });

  if (isLoading) {
    return <div style={{ padding: '24px' }}><Skeleton width="100%" height={400} /></div>;
  }

  const items = data?.items || [];

  return (
    <div style={{ padding: '24px', background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '12px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ov-text-primary)', margin: '0 0 8px 0' }}>AI Costs & Calls</h2>
        <p style={{ fontSize: '13px', color: '#8b949e', margin: 0 }}>Log of LLM API calls and associated costs.</p>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--ov-border)', color: '#8b949e' }}>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>ID</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>TYPE</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>PROVIDER / MODEL</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>INPUT TOKENS</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>OUTPUT TOKENS</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>COST (USD)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((call: any) => (
            <tr key={call.id} style={{ borderBottom: '1px solid var(--ov-border)' }}>
              <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{call.id}</td>
              <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--ov-text-primary)', textTransform: 'capitalize' }}>{call.related_to_type}</td>
              <td style={{ padding: '12px 16px' }}>{call.provider} <span style={{ color: '#8b949e' }}>/ {call.model}</span></td>
              <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{call.input_tokens || 0}</td>
              <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{call.output_tokens || 0}</td>
              <td style={{ padding: '12px 16px', fontWeight: 600, color: '#10b981' }}>${parseFloat(call.cost_usd || 0).toFixed(4)}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#8b949e' }}>No AI calls found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
