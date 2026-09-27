'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import type { Application } from '@/types';

export default function ApplicationDetailPage() {
  const params = useParams();
  const appId = params.id as string;

  const { data: app, isLoading } = useQuery<Application>({
    queryKey: ['application', appId],
    queryFn: () => api.get(`/applications/${appId}`),
  });

  if (isLoading) {
    return (
      <div>
        <Skeleton width="100%" height={200} />
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 'var(--ov-space-4)',
    }}>
      <div style={{ padding: 'var(--ov-space-4)', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--ov-radius-md)' }}>
        <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', marginBottom: 'var(--ov-space-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>HEALTH SCORE</div>
        <div style={{ fontSize: '32px', fontWeight: 'var(--ov-font-weight-bold)', fontFamily: 'var(--ov-font-sans)', color: 'var(--ov-text-primary)', lineHeight: 1 }}>
          {app?.health_score ?? '---'}
        </div>
      </div>
      
      <div style={{ padding: 'var(--ov-space-4)', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--ov-radius-md)' }}>
        <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', marginBottom: 'var(--ov-space-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>UPTIME</div>
        <div style={{ fontSize: '32px', fontWeight: 'var(--ov-font-weight-bold)', fontFamily: 'var(--ov-font-sans)', color: 'var(--ov-text-primary)', lineHeight: 1 }}>
          {app?.uptime_percent != null ? `${app.uptime_percent}%` : '---'}
        </div>
      </div>
      
      <div style={{ padding: 'var(--ov-space-4)', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--ov-radius-md)' }}>
        <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', marginBottom: 'var(--ov-space-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACTIVE USERS</div>
        <div style={{ fontSize: '32px', fontWeight: 'var(--ov-font-weight-bold)', fontFamily: 'var(--ov-font-sans)', color: 'var(--ov-text-primary)', lineHeight: 1 }}>
          {app?.active_users ?? '---'}
        </div>
      </div>
      
      <div style={{ padding: 'var(--ov-space-4)', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--ov-radius-md)' }}>
        <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', marginBottom: 'var(--ov-space-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ERRORS</div>
        <div style={{ fontSize: '32px', fontWeight: 'var(--ov-font-weight-bold)', fontFamily: 'var(--ov-font-sans)', color: 'var(--ov-text-primary)', lineHeight: 1 }}>
          {app?.error_count ?? '---'}
        </div>
      </div>
    </div>
  );
}
