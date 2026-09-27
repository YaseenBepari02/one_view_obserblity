'use client';
import { useParams } from 'next/navigation';
import { NotConfigured } from '@/components/shared/NotConfigured/NotConfigured';

export default function AlertsPage() {
  const appId = "netra";
  return (
    <div style={{ paddingTop: 'var(--ov-space-5)' }}>
      <NotConfigured
        title="Alerts not configured"
        description="Alert rules and triggered alerts for this application will appear here when alert rules are created."
      />
    </div>
  );
}
