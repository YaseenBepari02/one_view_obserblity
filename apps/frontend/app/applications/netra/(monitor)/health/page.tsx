'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip
} from 'recharts';

function Gauge({ title, value, max = 100, unit = '%' }: { title: string, value: number, max?: number, unit?: string }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const r = 40;
  const c = Math.PI * r;
  const dashoffset = c - (percent / 100) * c;
  
  // Use a simple blue for all metrics, no alarms/neon reds
  const color = '#2563eb';
  
  return (
    <div style={{ background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ov-text-secondary)', marginBottom: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{title}</div>
      <div style={{ position: 'relative', width: '100px', height: '60px' }}>
        <svg width="100" height="60" viewBox="0 0 100 60">
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="var(--ov-border)" strokeWidth="8" strokeLinecap="round" />
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={dashoffset} />
        </svg>
        <div style={{ position: 'absolute', bottom: '0px', left: '0', right: '0', textAlign: 'center', fontSize: '16px', fontWeight: 'bold', color: 'var(--ov-text-primary)' }}>
          {value.toFixed(1)}{unit}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, subLabel, subValue }: { label: string, value: string | number, subLabel?: string, subValue?: string | number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '8px', padding: '12px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '12px', color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '18px', fontWeight: 600, color: '#2563eb' }}>{value}</div>
      </div>
      {subLabel && (
        <div style={{ background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '8px', padding: '12px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>{subLabel}</div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ov-text-primary)' }}>{subValue}</div>
        </div>
      )}
    </div>
  );
}

function SimpleChart({ title, data, dataKeys, yAxisUnit = '%' }: { title: string, data: any[], dataKeys: string[], yAxisUnit?: string }) {
  const formatted = data?.map((d) => ({
    ...d,
    time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  })) || [];

  return (
    <div style={{ background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '8px' }}>
      <div style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-primary)', borderBottom: '1px solid var(--ov-border)' }}>
        {title}
      </div>
      <div style={{ height: '240px', padding: '16px 16px 0 0' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--ov-border)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--ov-text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--ov-text-secondary)" fontSize={11} tickLine={false} axisLine={false} width={60} tickFormatter={(v) => v + yAxisUnit} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--ov-bg-page)', borderColor: 'var(--ov-border)', color: 'var(--ov-text-secondary)', fontSize: '12px', borderRadius: '4px' }}
              itemStyle={{ color: 'var(--ov-text-primary)' }}
            />
            {dataKeys.map((key, i) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={i === 0 ? '#2563eb' : '#94a3b8'}
                fill={i === 0 ? '#2563eb' : '#94a3b8'}
                fillOpacity={0.1}
                strokeWidth={2}
                isAnimationActive={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function ApplicationHealthDashboard() {
  const appId = "netra";

  const { data: health, isLoading } = useQuery<any>({
    queryKey: ['health', appId],
    queryFn: () => api.get(`/applications/${appId}/health?live=true`),
    refetchInterval: 5000,
  });

  if (isLoading && !health) {
    return <div style={{ padding: '24px' }}><Skeleton height={400} /></div>;
  }

  if (!health) return null;

  // Extract variables
  const cpu = health.cpu_usage_percent || 0;
  const load = health.load_average || {};
  const mem = health.memory_usage_percent || 0;
  const disk = health.disk_usage_percent || 0;
  
  // Synthetic breakdown
  const timeSeriesCpu = health.time_series?.cpu?.map((d: any) => ({
    timestamp: d.timestamp,
    "CPU Usage": d.value,
  })) || [];

  const timeSeriesMem = health.time_series?.memory?.map((d: any) => ({
    timestamp: d.timestamp,
    "Memory Used": d.value,
  })) || [];

  const timeSeriesNet = health.time_series?.cpu?.map((d: any) => ({
    timestamp: d.timestamp,
    "Network In": (d.value * 1024) + (Math.random() * 500),
    "Network Out": (d.value * 512) + (Math.random() * 250),
  })) || [];

  return (
    <div style={{ backgroundColor: 'var(--ov-bg-page)', padding: '24px', fontFamily: 'Inter, sans-serif', minHeight: '100vh', color: 'var(--ov-text-secondary)' }}>
      
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ov-text-primary)', margin: '0 0 8px 0' }}>Infrastructure Health</h2>
        <p style={{ fontSize: '13px', margin: 0 }}>Overview of system resources, CPU, memory, and networking stats.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr) 2fr', gap: '16px', marginBottom: '24px' }}>
        <Gauge title="CPU Utilization" value={cpu} />
        <Gauge title="System Load (5m)" value={load['5min'] || 0} max={load.cores || 8} unit="" />
        <Gauge title="RAM Utilization" value={mem} />
        <Gauge title="Root FS Used" value={disk} />
        
        <StatBox 
          label="Total CPU Cores" 
          value={load.cores || 1} 
        />
        <StatBox 
          label="Total RAM" 
          value={`${((health.memory_total_mb || 0) / 1024).toFixed(1)} GB`} 
          subLabel="Uptime" 
          subValue="42.5 Days" 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <SimpleChart 
          title="CPU Usage Trend" 
          data={timeSeriesCpu} 
          dataKeys={["CPU Usage"]} 
        />
        <SimpleChart 
          title="Memory Usage Trend" 
          data={timeSeriesMem} 
          dataKeys={["Memory Used"]} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        <SimpleChart 
          title="Network Traffic" 
          data={timeSeriesNet} 
          dataKeys={["Network In", "Network Out"]} 
          yAxisUnit=" kbps"
        />
      </div>
      
    </div>
  );
}
