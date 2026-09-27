'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { Check, X, RotateCcw } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

const CHART_DATA = [
  { date: '2026-09-19', cost: 0.1 },
  { date: '2026-09-20', cost: 0.1 },
  { date: '2026-09-21', cost: 0.2 },
  { date: '2026-09-22', cost: 1.1 },
  { date: '2026-09-23', cost: 0.9 },
  { date: '2026-09-24', cost: 4.5 },
  { date: '2026-09-25', cost: 5.0 },
  { date: '2026-09-26', cost: 3.5 },
];

const RESOURCE_COSTS = [
  { path: '/netra/settings/profile', cost: '$5.12', calls: 12, size: '991.7 KB', percent: 100 },
  { path: '/netra/api/v1/metrics', cost: '$4.00', calls: 7, size: '842.4 KB', percent: 78 },
  { path: '/netra/pipeline/status', cost: '$1.85', calls: 9, size: '633.2 KB', percent: 36 },
  { path: '/netra/dashboard/overview', cost: '$0.92', calls: 5, size: '399.2 KB', percent: 18 },
  { path: '/netra/api/v1/data', cost: '$0.91', calls: 3, size: '150.0 KB', percent: 17 },
];

const SESSIONS = [
  { id: 'sess-2a6fe53c', time: '4:13:29 AM\n9/26/2026', lastAct: '1:35:53 PM', dur: '0s', ip: '10.29.9.184', tele: '0 API · 0 Views' },
  { id: 'sess-5b100c96', time: '5:32:01 PM\n9/25/2026', lastAct: '3:32:57 PM', dur: '2m 16s', ip: '10.27.2.231', tele: '1 API · 0 Views' },
  { id: 'sess-ac98d565', time: '2:49:30 AM\n9/25/2026', lastAct: '7:21:31 PM', dur: '0s', ip: '10.22.7.116', tele: '0 API · 0 Views' },
  { id: 'sess-e8e518d6', time: '10:44:20 AM\n9/24/2026', lastAct: '3:52:26 PM', dur: '3m 56s', ip: '10.26.4.217', tele: '0 API · 2 Views' },
  { id: 'sess-0d517649', time: '8:34:11 AM\n9/24/2026', lastAct: '4:33:29 PM', dur: '4m 15s', ip: '10.25.1.122', tele: '1 API · 1 Views' },
  { id: 'sess-dfb6b784', time: '3:21:44 AM\n9/24/2026', lastAct: '5:18:48 PM', dur: '3m 50s', ip: '10.30.2.238', tele: '1 API · 0 Views' },
];

export default function UserDetailPage() {
  const router = useRouter();

  return (
    <div style={{ paddingTop: 'var(--ov-space-4)' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', 
        borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-5)', 
        marginBottom: 'var(--ov-space-4)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-4)' }}>
          <div style={{ 
            width: 56, height: 56, borderRadius: 'var(--ov-radius-md)', 
            backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--ov-brand-primary)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: 'var(--ov-font-size-xl)', fontWeight: 'var(--ov-font-weight-bold)' 
          }}>
            AS
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-3)', marginBottom: 'var(--ov-space-1)' }}>
              <h1 style={{ fontSize: 'var(--ov-font-size-xl)', fontWeight: 'var(--ov-font-weight-semibold)', color: 'var(--ov-text-primary)', margin: 0 }}>Anjali Sharma</h1>
              <Badge variant="success" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px' }}>
                <span style={{width: 6, height: 6, borderRadius: '50%', background: 'currentColor'}}></span> ACCESS APPROVED
              </Badge>
            </div>
            <div style={{ fontSize: 'var(--ov-font-size-sm)', color: 'var(--ov-text-muted)' }}>
              <span style={{ color: 'var(--ov-text-primary)' }}>Senior Cloud DevOps Engineer</span> · Cloud Operations
            </div>
            <div style={{ fontSize: 'var(--ov-font-size-sm)', color: 'var(--ov-text-muted)', marginTop: 2 }}>
              <span style={{ fontFamily: 'var(--ov-font-mono)' }}>anjali@baxter.com</span> · Member since 2024-03-20
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-3)' }}>
          <span style={{ fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 'var(--ov-font-weight-semibold)' }}>ADMIN ACTION:</span>
          <Button variant="ghost" style={{ color: 'var(--ov-status-success)', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
            <Check size={16} style={{ marginRight: 6 }} /> Approve Access
          </Button>
          <Button variant="ghost" style={{ color: 'var(--ov-status-critical)', border: '1px solid rgba(248, 113, 113, 0.2)', background: 'rgba(248, 113, 113, 0.05)' }}>
            <X size={16} style={{ marginRight: 6 }} /> Reject Access
          </Button>
          <Button variant="ghost" style={{ border: '1px solid var(--ov-border)' }}>
            Reset
          </Button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--ov-space-4)', marginBottom: 'var(--ov-space-4)' }}>
        <div style={{ background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--ov-space-2)' }}>
            <div style={{ fontSize: 'var(--ov-font-size-sm)', fontWeight: 'var(--ov-font-weight-medium)' }}>Total API Cost</div>
            <Badge variant="info" style={{ fontSize: 10, padding: '2px 6px' }}>USD</Badge>
          </div>
          <div style={{ fontSize: 'var(--ov-font-size-3xl)', fontWeight: 'var(--ov-font-weight-bold)', marginBottom: 'var(--ov-space-1)', fontFamily: 'var(--ov-font-mono)' }}>$24.24</div>
          <div style={{ fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)' }}>Avg $2.20 per session</div>
        </div>
        
        <div style={{ background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--ov-space-2)' }}>
            <div style={{ fontSize: 'var(--ov-font-size-sm)', fontWeight: 'var(--ov-font-weight-medium)' }}>Total API Calls</div>
            <div style={{ fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-status-success)' }}>80.8% success</div>
          </div>
          <div style={{ fontSize: 'var(--ov-font-size-3xl)', fontWeight: 'var(--ov-font-weight-bold)', marginBottom: 'var(--ov-space-1)', fontFamily: 'var(--ov-font-mono)' }}>21</div>
          <div style={{ fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)' }}>52 total telemetry events</div>
        </div>
        
        <div style={{ background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--ov-space-2)' }}>
            <div style={{ fontSize: 'var(--ov-font-size-sm)', fontWeight: 'var(--ov-font-weight-medium)' }}>Total Login Sessions</div>
            <div style={{ fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-status-info)' }}>Active user</div>
          </div>
          <div style={{ fontSize: 'var(--ov-font-size-3xl)', fontWeight: 'var(--ov-font-weight-bold)', marginBottom: 'var(--ov-space-1)', fontFamily: 'var(--ov-font-mono)' }}>11</div>
          <div style={{ fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)' }}>Total active time: 74 mins</div>
        </div>
        
        <div style={{ background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--ov-space-2)' }}>
            <div style={{ fontSize: 'var(--ov-font-size-sm)', fontWeight: 'var(--ov-font-weight-medium)' }}>Data Transferred</div>
            <div style={{ fontSize: 'var(--ov-font-size-xs)', color: '#d946ef' }}>Network</div>
          </div>
          <div style={{ fontSize: 'var(--ov-font-size-3xl)', fontWeight: 'var(--ov-font-weight-bold)', marginBottom: 'var(--ov-space-1)', fontFamily: 'var(--ov-font-mono)' }}>4.49 <span style={{ fontSize: 'var(--ov-font-size-sm)'}}>MB</span></div>
          <div style={{ fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)' }}>2 report exports generated</div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--ov-space-4)', marginBottom: 'var(--ov-space-4)' }}>
        <div style={{ background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--ov-space-4)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--ov-font-size-base)', fontWeight: 'var(--ov-font-weight-semibold)' }}>API Cost & Usage Trend ($ USD)</h3>
              <div style={{ fontSize: 'var(--ov-font-size-sm)', color: 'var(--ov-text-muted)' }}>Daily cost accumulation based on pipeline executions</div>
            </div>
            <Badge variant="info" style={{ height: 'fit-content' }}>7 Days Window</Badge>
          </div>
          
          <div style={{ height: 240, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--ov-text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val} />
                <YAxis stroke="var(--ov-text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--ov-bg-tooltip)', border: '1px solid var(--ov-border)', borderRadius: 'var(--ov-radius-md)' }} 
                  itemStyle={{ color: 'var(--ov-text-primary)' }}
                />
                <Area type="monotone" dataKey="cost" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-5)' }}>
          <h3 style={{ fontSize: 'var(--ov-font-size-base)', fontWeight: 'var(--ov-font-weight-semibold)' }}>Cost by Pipeline Resource</h3>
          <div style={{ fontSize: 'var(--ov-font-size-sm)', color: 'var(--ov-text-muted)', marginBottom: 'var(--ov-space-5)' }}>Endpoints generating the highest API cost</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ov-space-4)' }}>
            {RESOURCE_COSTS.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--ov-font-size-sm)', marginBottom: 6, fontFamily: 'var(--ov-font-mono)' }}>
                  <span style={{ color: 'var(--ov-text-primary)' }}>{item.path}</span>
                  <span style={{ fontWeight: 'var(--ov-font-weight-semibold)' }}>{item.cost}</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, marginBottom: 4 }}>
                  <div style={{ height: '100%', width: `${item.percent}%`, background: '#6366f1', borderRadius: 3 }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)' }}>
                  <span>{item.calls} calls</span>
                  <span>{item.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div style={{ background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: 'var(--ov-radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--ov-space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--ov-border)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--ov-font-size-base)', fontWeight: 'var(--ov-font-weight-semibold)' }}>Total Login Times & Session Details</h3>
            <div style={{ fontSize: 'var(--ov-font-size-sm)', color: 'var(--ov-text-muted)' }}>Complete audit trail of user logins, session durations, and client IPs</div>
          </div>
          <div style={{ fontSize: 'var(--ov-font-size-sm)', color: 'var(--ov-text-muted)' }}>Total 11 Sessions Logged</div>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--ov-border)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
              <th style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 'var(--ov-font-weight-semibold)', textTransform: 'uppercase' }}>STATUS</th>
              <th style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 'var(--ov-font-weight-semibold)', textTransform: 'uppercase' }}>LOGIN TIME</th>
              <th style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 'var(--ov-font-weight-semibold)', textTransform: 'uppercase' }}>LAST ACTIVITY</th>
              <th style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 'var(--ov-font-weight-semibold)', textTransform: 'uppercase' }}>SESSION DURATION</th>
              <th style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 'var(--ov-font-weight-semibold)', textTransform: 'uppercase' }}>IP ADDRESS</th>
              <th style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 'var(--ov-font-weight-semibold)', textTransform: 'uppercase' }}>TELEMETRY</th>
              <th style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 'var(--ov-font-weight-semibold)', textTransform: 'uppercase' }}>SESSION ID</th>
            </tr>
          </thead>
          <tbody>
            {SESSIONS.map((sess, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--ov-border)' }}>
                <td style={{ padding: 'var(--ov-space-3) var(--ov-space-4)' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 16, fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-primary)' }}>
                    <span style={{width: 6, height: 6, borderRadius: '50%', background: 'var(--ov-text-muted)'}}></span> Completed
                  </div>
                </td>
                <td style={{ padding: 'var(--ov-space-3) var(--ov-space-4)' }}>
                  <div style={{ fontWeight: 'var(--ov-font-weight-medium)', color: 'var(--ov-text-primary)' }}>{sess.time.split('\n')[0]}</div>
                  <div style={{ fontSize: 'var(--ov-font-size-sm)', color: 'var(--ov-text-muted)' }}>{sess.time.split('\n')[1]}</div>
                </td>
                <td style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-sm)', color: 'var(--ov-text-primary)' }}>{sess.lastAct}</td>
                <td style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-sm)', color: 'var(--ov-text-primary)', fontWeight: 'var(--ov-font-weight-medium)' }}>{sess.dur}</td>
                <td style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-sm)', color: 'var(--ov-brand-primary)', fontFamily: 'var(--ov-font-mono)' }}>{sess.ip}</td>
                <td style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)' }}>{sess.tele}</td>
                <td style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-sm)', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>{sess.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
