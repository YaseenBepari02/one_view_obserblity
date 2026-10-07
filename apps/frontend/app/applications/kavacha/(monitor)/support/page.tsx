'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

export default function KavachaSupportPage() {
  const { data, isLoading } = useQuery<any>({
    queryKey: ['kavacha-support'],
    queryFn: () => api.get('/kavacha/support'),
  });

  if (isLoading) {
    return <div style={{ padding: '24px' }}><Skeleton width="100%" height={400} /></div>;
  }

  const items = data?.items || [];

  return (
    <div style={{ padding: '24px', background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '12px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ov-text-primary)', margin: '0 0 8px 0' }}>Support Tickets</h2>
        <p style={{ fontSize: '13px', color: '#8b949e', margin: 0 }}>User submitted support and help requests.</p>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--ov-border)', color: '#8b949e' }}>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>ID</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>SUMMARY</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>CATEGORY</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>STATUS</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>RAISED BY</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>CREATED</th>
          </tr>
        </thead>
        <tbody>
          {items.map((ticket: any) => (
            <tr key={ticket.id} style={{ borderBottom: '1px solid var(--ov-border)' }}>
              <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{ticket.id}</td>
              <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--ov-text-primary)' }}>{ticket.summary}</td>
              <td style={{ padding: '12px 16px', textTransform: 'capitalize' }}>{ticket.category}</td>
              <td style={{ padding: '12px 16px' }}>
                <span style={{ 
                  background: ticket.status === 'resolved' || ticket.status === 'closed' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', 
                  color: ticket.status === 'resolved' || ticket.status === 'closed' ? '#10b981' : '#f59e0b',
                  padding: '4px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase'
                }}>{ticket.status}</span>
              </td>
              <td style={{ padding: '12px 16px' }}>{ticket.raised_by}</td>
              <td style={{ padding: '12px 16px' }}>{new Date(ticket.created_at).toLocaleString()}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#8b949e' }}>No support tickets found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
