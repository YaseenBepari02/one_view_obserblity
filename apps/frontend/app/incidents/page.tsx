'use client';
import { NotConfigured } from '@/components/shared/NotConfigured/NotConfigured';
export default function IncidentsPage() {
  return <div><h1 style={{ fontSize: 'var(--ov-font-size-xl)', fontWeight: 600, color: 'var(--ov-text-primary)', marginBottom: 'var(--ov-space-4)' }}>Incidents</h1><NotConfigured title="No active incidents" description="Incidents will appear here when alerts are triggered and escalated." /></div>;
}
