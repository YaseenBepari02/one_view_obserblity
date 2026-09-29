'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Users, Activity, CheckCircle2, Clock, DollarSign, ChevronRight, UserX, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatNumber } from '@/lib/utils';

// Donut Chart Data
const eventData = [
  { name: 'PAGE_VIEW', value: 8500, color: '#3b82f6', percent: '54%' },
  { name: 'API_CALL', value: 4200, color: '#10b981', percent: '35%' },
  { name: 'LOGIN', value: 850, color: '#f59e0b', percent: '7%' },
  { name: 'EXPORT', value: 500, color: '#a855f7', percent: '4%' },
];

// Mock Heatmap Data (7 days x 24 hours)
const heatmapData = Array.from({ length: 7 }).map((_, day) => 
  Array.from({ length: 24 }).map((_, hour) => Math.floor(Math.random() * 10))
);
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Mock Users
const users = [
  { initials: 'AS', name: 'Anjali Sharma', email: 'anjali@baxter.com', role: 'Senior Cloud DevOps Engineer', dept: 'Cloud Operations', status: 'APPROVED', sessions: 3, time: '1h 14m', cost: 24.24, resource: '/netra/settings/profile' },
  { initials: 'DP', name: 'Divya Patel', email: 'divya@baxter.com', role: 'Cybersecurity & IAM Analyst', dept: 'Security & Compliance', status: 'PENDING', sessions: 1, time: '18m', cost: 4.10, resource: '/netra/api/v1/auth' },
  { initials: 'PK', name: 'Praveen Kumar', email: 'praveen@baxter.com', role: 'Principal Data Architect', dept: 'Data Analytics & ML', status: 'APPROVED', sessions: 5, time: '2h 16m', cost: 45.10, resource: '/netra/pipeline/status' },
];

function KPICard({ title, value, icon: Icon, sub, prefix = '' }: any) {
  return (
    <div style={{ background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#8b949e', letterSpacing: '0.05em' }}>{title}</span>
        <Icon size={16} color="#3b82f6" />
      </div>
      <div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>{prefix}{value}</div>
        <div style={{ fontSize: '12px', color: '#8b949e', marginTop: '4px' }}>{sub}</div>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const appId = "netra";

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--ov-bg-page)', minHeight: '100vh', color: 'var(--ov-text-secondary)', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Banner */}
      <div style={{ background: 'linear-gradient(90deg, var(--ov-bg-card), var(--ov-bg-card))', border: '1px solid var(--ov-border)', borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ov-text-primary)', margin: '0 0 8px 0' }}>Want to see the health of the application?</h2>
          <p style={{ fontSize: '13px', color: '#8b949e', margin: 0 }}>Go back to the overview page to check primary infrastructure metrics and health scores.</p>
        </div>
        <Link href={`/applications/${appId}/health`} style={{ textDecoration: 'none' }}>
          <button style={{ background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            View Health Overview &rarr;
          </button>
        </Link>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        <KPICard title="TOTAL USERS" value="6" icon={Users} sub="Registered accounts" />
        <KPICard title="ACTIVE SESSIONS" value="37" icon={Activity} sub="Currently online" />
        <KPICard title="APPROVED ACCESS" value="4" icon={CheckCircle2} sub="Full platform access" />
        <KPICard title="PENDING APPROVALS" value="1" icon={Clock} sub="Requires admin review" />
        <KPICard title="TOTAL API COST" value="51.27" prefix="$" icon={DollarSign} sub="Cumulative usage (USD)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Event Breakdown */}
        <div style={{ background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#8b949e', letterSpacing: '0.05em' }}>EVENT TYPE BREAKDOWN</span>
            <span style={{ fontSize: '10px', color: '#8b949e', fontFamily: 'monospace' }}>13,650 EVENTS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '160px', height: '160px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={eventData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                    {eventData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--ov-border)', border: 'none', borderRadius: '8px', color: 'var(--ov-text-primary)', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, paddingLeft: '40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {eventData.map(event => (
                <div key={event.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: event.color }}></div>
                    <span style={{ fontSize: '12px', color: 'var(--ov-text-secondary)', fontWeight: 500, fontFamily: 'monospace' }}>{event.name}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#8b949e', fontFamily: 'monospace' }}>
                    <span style={{ color: 'var(--ov-text-secondary)' }}>{formatNumber(event.value)}</span> ({event.percent})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div style={{ background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#8b949e', letterSpacing: '0.05em' }}>LOGIN HEATMAP (7 DAYS)</span>
            <span style={{ fontSize: '10px', color: '#8b949e', fontFamily: 'monospace' }}>Hour x Day Matrix</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Y-axis */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '20px' }}>
              {days.map(d => <div key={d} style={{ height: '14px', fontSize: '10px', color: '#8b949e', display: 'flex', alignItems: 'center' }}>{d}</div>)}
            </div>
            {/* Grid */}
            <div style={{ flex: 1 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '10px', color: '#8b949e', paddingRight: '4px' }}>
                  <span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>24h</span>
               </div>
               <div style={{ display: 'grid', gridTemplateRows: 'repeat(7, 1fr)', gap: '2px' }}>
                 {heatmapData.map((row, rIdx) => (
                   <div key={rIdx} style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', gap: '2px' }}>
                     {row.map((val, cIdx) => (
                       <div key={cIdx} style={{ height: '14px', background: val === 0 ? 'var(--ov-border)' : `rgba(139, 92, 246, ${Math.max(0.2, val/10)})`, borderRadius: '2px' }} title={`${val} logins`} />
                     ))}
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Directory */}
      <div style={{ background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ov-text-primary)', margin: 0 }}>User Directory & Platform Access Control</h3>
          <span style={{ fontSize: '11px', color: '#8b949e' }}>6 Registered Users</span>
        </div>
        <p style={{ fontSize: '12px', color: '#8b949e', margin: '0 0 24px 0' }}>Manage user approval status and click on any user to view detailed API cost and login history.</p>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--ov-border)', color: '#8b949e' }}>
              <th style={{ padding: '12px 0', fontWeight: 600, fontSize: '10px', letterSpacing: '0.05em' }}>USER</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '10px', letterSpacing: '0.05em' }}>ROLE & DEPARTMENT</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '10px', letterSpacing: '0.05em' }}>ACCESS STATUS</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '10px', letterSpacing: '0.05em' }}>ADMIN ACTION</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '10px', letterSpacing: '0.05em' }}>SESSIONS</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '10px', letterSpacing: '0.05em' }}>ACTIVE TIME</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '10px', letterSpacing: '0.05em' }}>EST. API COST</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '10px', letterSpacing: '0.05em' }}>TOP RESOURCE</th>
              <th style={{ padding: '12px 0', fontWeight: 600, fontSize: '10px', letterSpacing: '0.05em', textAlign: 'right' }}>DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--ov-border)' }}>
                <td style={{ padding: '16px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                      {user.initials}
                    </div>
                    <div>
                      <div style={{ color: 'var(--ov-text-primary)', fontWeight: 500, fontSize: '13px' }}>{user.name}</div>
                      <div style={{ color: '#8b949e', fontSize: '11px' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ color: 'var(--ov-text-secondary)', fontSize: '12px' }}>{user.role}</div>
                  <div style={{ color: '#8b949e', fontSize: '11px' }}>{user.dept}</div>
                </td>
                <td style={{ padding: '16px' }}>
                  {user.status === 'APPROVED' ? (
                    <span style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '4px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 4, height: 4, borderRadius: '50%', background: '#10b981' }}></span> APPROVED</span>
                  ) : (
                    <span style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '4px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 4, height: 4, borderRadius: '50%', background: '#f59e0b' }}></span> PENDING</span>
                  )}
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ background: 'transparent', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} disabled={user.status === 'APPROVED'}><UserCheck size={12} /> Approve</button>
                    <button style={{ background: 'transparent', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f43f5e', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><UserX size={12} /> Reject</button>
                  </div>
                </td>
                <td style={{ padding: '16px', color: 'var(--ov-text-secondary)', fontWeight: 500 }}>{user.sessions}</td>
                <td style={{ padding: '16px', color: 'var(--ov-text-secondary)', fontSize: '12px' }}>{user.time}</td>
                <td style={{ padding: '16px', color: '#3b82f6', fontWeight: 600 }}>{formatCurrency(user.cost)}</td>
                <td style={{ padding: '16px', color: '#8b949e', fontFamily: 'monospace', fontSize: '11px' }}>{user.resource}</td>
                <td style={{ padding: '16px 0', textAlign: 'right' }}>
                  <Link href={`/applications/${appId}/users/123`} style={{ color: '#8b5cf6', textDecoration: 'none', fontSize: '12px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Analytics <ChevronRight size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
