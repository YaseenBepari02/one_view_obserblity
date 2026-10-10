'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { 
  Users, Activity, CheckCircle2, Clock, DollarSign, ChevronRight, UserX, UserCheck, 
  Terminal, Search, Sparkles, Layers, FileText, Database, Shield, Zap, ArrowRight, ArrowUpRight, ArrowDownRight, Map, Share2
} from 'lucide-react';

const Badge = ({ children, type }: { children: React.ReactNode, type: 'success' | 'warning' | 'error' | 'info' | 'neutral' }) => {
  const colors = {
    success: { bg: 'rgba(16,185,129,0.1)', text: '#10b981' },
    warning: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' },
    error: { bg: 'rgba(244,63,94,0.1)', text: '#f43f5e' },
    info: { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6' },
    neutral: { bg: 'var(--ov-bg-subtle)', text: 'var(--ov-text-secondary)' }
  };
  const color = colors[type];
  return (
    <span style={{
      background: color.bg, color: color.text,
      padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {children}
    </span>
  );
};

const Card = ({ title, icon: Icon, children, action, className = '' }: { title?: string, icon?: any, children: React.ReactNode, action?: React.ReactNode, className?: string }) => (
  <div className={`bento-card ${className}`} style={{
    display: 'flex', flexDirection: 'column', height: '100%'
  }}>
    {(title || action) && (
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ov-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {Icon && <Icon size={16} color="var(--ov-text-secondary)" />}
          <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--ov-text-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title}</h3>
        </div>
        {action && <div style={{ fontSize: '12px' }}>{action}</div>}
      </div>
    )}
    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  </div>
);

const StatBox = ({ title, value, subtext, icon: Icon, trend }: any) => (
  <div className="bento-card" style={{
    padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px'
  }}>
    <div style={{ position: 'absolute', right: '-12px', bottom: '-12px', opacity: 0.04, pointerEvents: 'none' }}>
      <Icon size={100} color="var(--ov-text-primary)" />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ background: 'var(--ov-bg-subtle)', padding: '8px', borderRadius: '8px' }}>
          <Icon size={16} color="var(--ov-text-secondary)" />
        </div>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ov-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
      </div>
    </div>
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ov-text-primary)', fontFamily: 'monospace' }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
        {trend && (
          <span style={{
            display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: 600,
            color: trend > 0 ? '#10b981' : trend < 0 ? '#f43f5e' : 'var(--ov-text-secondary)'
          }}>
            {trend > 0 ? <ArrowUpRight size={12} /> : trend < 0 ? <ArrowDownRight size={12} /> : null}
            {Math.abs(trend)}%
          </span>
        )}
        <span style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>{subtext}</span>
      </div>
    </div>
  </div>
);

const MiniStatBox = ({ title, value, icon: Icon }: any) => (
  <div className="bento-card" style={{
    padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px'
  }}>
    <div style={{ position: 'absolute', right: '-8px', bottom: '-15px', opacity: 0.04, pointerEvents: 'none' }}>
      <Icon size={70} color="var(--ov-text-primary)" />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
      <Icon size={14} color="var(--ov-text-secondary)" />
      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ov-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
    </div>
    <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ov-text-primary)', fontFamily: 'monospace', position: 'relative', zIndex: 1 }}>{value}</div>
  </div>
);

const NestedCircularProgress = ({ data }: { data: { label: string, percentage: number, color: string, subtext: string }[] }) => {
  const size = 160;
  const center = size / 2;
  const strokeWidth = 10;
  const gap = 6;
  
  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginTop: '16px' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {data.map((item, index) => {
            const radius = (size / 2) - strokeWidth - (index * (strokeWidth + gap));
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (item.percentage / 100) * circumference;
            return (
              <g key={item.label}>
                <circle cx={center} cy={center} r={radius} stroke="var(--ov-border)" strokeWidth={strokeWidth} fill="none" />
                <circle cx={center} cy={center} r={radius} stroke={item.color} strokeWidth={strokeWidth} fill="none" 
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} 
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} 
                />
              </g>
            );
          })}
        </svg>
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {data.map((item) => (
          <div key={item.label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
               <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
               <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ov-text-primary)' }}>{item.label}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '18px' }}>
               <div style={{ fontSize: '11px', color: 'var(--ov-text-secondary)' }}>{item.subtext}</div>
               <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>{item.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function NetraOverviewPage() {
  const appId = "netra";

  // Mock data for Netra equivalent
  const eventData = [
    { name: 'RAG Queries', value: 69600, color: '#3b82f6', percent: '65%' },
    { name: 'API Triggers', value: 24100, color: '#10b981', percent: '22%' },
    { name: 'Data Exports', value: 8500, color: '#f59e0b', percent: '8%' },
    { name: 'Errors', value: 5000, color: '#f43f5e', percent: '5%' },
  ];

  const aiModels = [
    { model: 'gpt-4o', call_count: '42,100', tokens: '124.5M', cost: 184.20 },
    { model: 'claude-3-5', call_count: '21,500', tokens: '89.2M', cost: 142.10 },
    { model: 'text-embedding-3', call_count: '114,000', tokens: '412.0M', cost: 24.50 },
  ];

  const users = [
    { initials: 'AS', name: 'Anjali Sharma', email: 'anjali@baxter.com', role: 'Senior Cloud DevOps Engineer', dept: 'Cloud Operations', status: 'APPROVED', sessions: 3, time: '1h 14m', cost: 24.24, resource: '/netra/settings/profile' },
    { initials: 'DP', name: 'Divya Patel', email: 'divya@baxter.com', role: 'Cybersecurity & IAM Analyst', dept: 'Security & Compliance', status: 'PENDING', sessions: 1, time: '18m', cost: 4.10, resource: '/netra/api/v1/auth' },
    { initials: 'PK', name: 'Praveen Kumar', email: 'praveen@baxter.com', role: 'Principal Data Architect', dept: 'Data Analytics & ML', status: 'APPROVED', sessions: 5, time: '2h 16m', cost: 45.10, resource: '/netra/pipeline/status' },
  ];

  const recentErrors = [
    { id: 1, prompt: '"Differential analysis on renal assay..."', app: 'Clinical Docs', result: 'error', time: new Date(Date.now() - 3600000).toLocaleString() },
    { id: 2, prompt: '"Extract contraindicated peptides..."', app: 'Quality Control', result: 'timeout', time: new Date(Date.now() - 7200000).toLocaleString() },
  ];

  const businessImpacts = [
    { app: 'Ask HR', time: 1450, cost: 245000, cov: 100, pass: 91, crit: 0, prio: 'High' },
    { app: 'JDE (ERP)', time: 2100, cost: 380000, cov: 72, pass: 82, crit: 2, prio: 'Critical' },
    { app: 'Quality & Reg', time: 3400, cost: 512000, cov: 53, pass: 89, crit: 0, prio: 'Critical' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', minHeight: '100vh', padding: '12px' }}>
      {/* Background Ambient Glow */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 60%)', filter: 'blur(80px)', zIndex: -1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 60%)', filter: 'blur(80px)', zIndex: -1, pointerEvents: 'none' }} />

      <style>{`
        .bento-card {
          background: rgba(255, 255, 255, 0.02) !important;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 16px !important;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1) !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative;
          overflow: hidden;
        }
        .bento-card:hover {
          transform: translateY(-4px);
          border-color: rgba(59, 130, 246, 0.4) !important;
          box-shadow: 0 12px 40px rgba(59, 130, 246, 0.15), 0 4px 24px rgba(0, 0, 0, 0.3) !important;
        }
        .bento-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .bento-card:hover::before {
          opacity: 1;
        }
      `}</style>

      {/* Banner */}
      <div className="bento-card" style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%) !important',
        padding: '24px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ov-text-primary)', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
            Netra RAG & AI Telemetry Engine
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--ov-text-secondary)', margin: 0 }}>
            Complete observability across vector retrieval, LLM generations, and user access.
          </p>
        </div>
        <Link href={`/applications/${appId}/health`} style={{ textDecoration: 'none' }}>
          <button style={{ background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            View Health Monitor →
          </button>
        </Link>
      </div>

      {/* Main KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="bento-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.03, pointerEvents: 'none' }}><DollarSign size={100} color="var(--ov-text-primary)" /></div>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, boxShadow: '0 4px 12px rgba(16,185,129,0.1)' }}>
            <DollarSign size={28} color="#10b981" />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>ESTIMATED AI API COST</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>$184.52</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>Average cost per query: $0.0182</div>
          </div>
        </div>

        <div className="bento-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.03, pointerEvents: 'none' }}><Layers size={100} color="var(--ov-text-primary)" /></div>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, boxShadow: '0 4px 12px rgba(59,130,246,0.1)' }}>
            <Layers size={28} color="#3b82f6" />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>TOTAL TOKEN CONSUMPTION</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>14.28M</span>
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>↑ 18%</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>this period</div>
          </div>
        </div>

        <div className="bento-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.03, pointerEvents: 'none' }}><CheckCircle2 size={100} color="var(--ov-text-primary)" /></div>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(167,139,250,0.05))', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, boxShadow: '0 4px 12px rgba(167,139,250,0.1)' }}>
            <CheckCircle2 size={28} color="#a78bfa" />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>HELPFUL ANSWER RATE</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>87.4%</span>
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>↑ 0.8 pts</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>rated helpful or accepted</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
        
        {/* Left Side: 2x2 Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignContent: 'start' }}>
          <StatBox title="Active Users" value="10" subtext="vs prior 7 days" icon={Users} trend={6} />
          <StatBox title="Questions Answered" value="69" subtext="across all applications" icon={Activity} trend={9} />
          <StatBox title="Hours Saved (EST.)" value="6,080" subtext="employee time returned" icon={Clock} />
          <StatBox title="Docs Grounded" value="48,200" subtext="Medical journals & Specs" icon={FileText} />
        </div>

        {/* Right Side: Event Donut Card */}
        <Card 
          title="Telemetry Events" 
          icon={CheckCircle2} 
          action={<Link href="/applications/netra/rag-analytics" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '12px', fontWeight: 600 }}>RAG Analytics &rarr;</Link>}
        >
          <div style={{ fontSize: '13px', color: 'var(--ov-text-muted)', marginTop: '-8px', marginBottom: '24px' }}>
            Event breakdown processed by Netra pipeline
          </div>
          
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', padding: '0 12px 12px 12px' }}>
            
            <div style={{ width: '180px', height: '180px', position: 'relative', flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={eventData} innerRadius={65} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                    {eventData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '8px' }} itemStyle={{ color: 'var(--ov-text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ov-text-primary)', lineHeight: '1' }}>107K</span>
                <span style={{ fontSize: '11px', color: 'var(--ov-text-secondary)', marginTop: '4px' }}>Events</span>
              </div>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
               {eventData.map((d) => (
                 <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--ov-border)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: d.color }} />
                     <span style={{ fontSize: '13px', color: 'var(--ov-text-secondary)', fontWeight: 500 }}>{d.name}</span>
                   </div>
                   <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-secondary)' }}>
                     {d.value.toLocaleString()} <span style={{ color: 'var(--ov-text-muted)', fontWeight: 400, marginLeft: '4px' }}>({d.percent})</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </Card>
      </div>

      {/* RAG Pipeline visual */}
      <Card title="RAG Pipeline Execution" icon={Share2} action={<span style={{ color: 'var(--ov-text-muted)' }}>From query to LLM response</span>}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ flex: 1, background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px', padding: '20px', display: 'flex', gap: '16px' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '50%', height: 'fit-content' }}>
              <Search size={24} color="#3b82f6" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-primary)' }}>Natural Query</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0 8px 0' }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>0ms</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ov-text-muted)' }}>Ingress payload parsing</div>
            </div>
          </div>
          <ArrowRight size={24} color="var(--ov-text-muted)" />
          <div style={{ flex: 1, background: 'rgba(167, 139, 250, 0.05)', border: '1px solid rgba(167, 139, 250, 0.2)', borderRadius: '12px', padding: '20px', display: 'flex', gap: '16px' }}>
            <div style={{ background: 'rgba(167, 139, 250, 0.1)', padding: '12px', borderRadius: '50%', height: 'fit-content' }}>
              <Database size={24} color="#a78bfa" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-primary)' }}>Vector Search</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0 8px 0' }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>24ms</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ov-text-muted)' }}>HNSW Top-K (50 Chunks)</div>
            </div>
          </div>
          <ArrowRight size={24} color="var(--ov-text-muted)" />
          <div style={{ flex: 1, background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', padding: '20px', display: 'flex', gap: '16px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '50%', height: 'fit-content' }}>
              <Layers size={24} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-primary)' }}>Cross-Encoder</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0 8px 0' }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>48ms</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ov-text-muted)' }}>Cohere reranking (Top 5)</div>
            </div>
          </div>
          <ArrowRight size={24} color="var(--ov-text-muted)" />
          <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', padding: '20px', display: 'flex', gap: '16px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '50%', height: 'fit-content' }}>
              <Sparkles size={24} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-primary)' }}>LLM Synthesis</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0 8px 0' }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>820ms</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ov-text-muted)' }}>gpt-4o streaming token</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Transfer & Document Grounding Health */}
      <Card title="Data Transfer & Document Grounding Health" icon={Database} action={<Badge type="info">Live Index Synced</Badge>}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div style={{ background: 'var(--ov-bg-subtle)', borderRadius: '8px', padding: '16px', border: '1px solid var(--ov-border)' }}>
            <div style={{ fontSize: '10px', color: 'var(--ov-text-secondary)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '12px' }}>TOTAL DATA TRANSFERRED</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ov-text-primary)', fontFamily: 'monospace', marginBottom: '8px' }}>
              42.8 GB
            </div>
            <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 600, marginBottom: '4px' }}>S3 Bucket Sync</div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>In: 30.2 GB | Out: 4.6 GB</div>
          </div>
          <div style={{ background: 'var(--ov-bg-subtle)', borderRadius: '8px', padding: '16px', border: '1px solid var(--ov-border)' }}>
            <div style={{ fontSize: '10px', color: 'var(--ov-text-secondary)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '12px' }}>DOCUMENTS RETRIEVED</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ov-text-primary)', fontFamily: 'monospace', marginBottom: '8px' }}>
              48,200
            </div>
            <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 600, marginBottom: '4px' }}>Docs Grounded</div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>Medical journals & Clinical Specs</div>
          </div>
          <div style={{ background: 'var(--ov-bg-subtle)', borderRadius: '8px', padding: '16px', border: '1px solid var(--ov-border)' }}>
            <div style={{ fontSize: '10px', color: 'var(--ov-text-secondary)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '12px' }}>AVERAGE CHUNKS / QUERY</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ov-text-primary)', fontFamily: 'monospace', marginBottom: '8px' }}>
              4.8
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', fontWeight: 500, marginBottom: '4px' }}>Target: 5.0</div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>Mean Cosine Similarity: 0.884</div>
          </div>
          <div style={{ background: 'var(--ov-bg-subtle)', borderRadius: '8px', padding: '16px', border: '1px solid var(--ov-border)' }}>
            <div style={{ fontSize: '10px', color: 'var(--ov-text-secondary)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '12px' }}>VECTOR INDEX FRESHNESS</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ov-text-primary)', fontFamily: 'monospace', marginBottom: '8px' }}>
              Synced 2m ago
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', marginBottom: '4px' }}>Baxter CDC Debezium Pipeline OK</div>
          </div>
        </div>
      </Card>

      {/* Mixed Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '24px' }}>
        <Card title="System Reliability" icon={Shield}>
          <NestedCircularProgress data={[
            { label: "Vector Search Success Rate", percentage: 99.4, color: "#3b82f6", subtext: "69K / 69.4K" },
            { label: "Database Sync Success", percentage: 98, color: "#10b981", subtext: "142 / 145" },
            { label: "LLM SLA Compliant", percentage: 92, color: "#a78bfa", subtext: "<1s Latency" }
          ]} />
        </Card>

        <Card title="AI Usage Stats" icon={Zap}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', background: 'var(--ov-bg-subtle)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
            <div><div style={{ fontSize: '11px', color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>Total Calls</div><div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>177.6K</div></div>
            <div><div style={{ fontSize: '11px', color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>Total Tokens</div><div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>625.7M</div></div>
            <div><div style={{ fontSize: '11px', color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>Total Cost</div><div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>$350.80</div></div>
            <div><div style={{ fontSize: '11px', color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>Avg Latency</div><div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>1.02s</div></div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--ov-text-secondary)', borderBottom: '1px solid var(--ov-border)' }}>
                <th style={{ padding: '8px', fontWeight: 600 }}>Provider / Model</th>
                <th style={{ padding: '8px', fontWeight: 600 }}>Calls</th>
                <th style={{ padding: '8px', fontWeight: 600 }}>Tokens</th>
                <th style={{ padding: '8px', fontWeight: 600 }}>Cost (USD)</th>
              </tr>
            </thead>
            <tbody>
              {aiModels.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--ov-border)' }}>
                  <td style={{ padding: '8px', color: 'var(--ov-text-primary)', fontWeight: 500 }}>{item.model}</td>
                  <td style={{ padding: '8px', color: 'var(--ov-text-secondary)' }}>{item.call_count}</td>
                  <td style={{ padding: '8px', color: 'var(--ov-text-secondary)' }}>{item.tokens}</td>
                  <td style={{ padding: '8px', color: 'var(--ov-text-primary)' }}>${item.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Recent Errors" icon={Clock} action={<Link href="/applications/netra/traces" style={{ color: '#3b82f6', textDecoration: 'none' }}>View all</Link>}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--ov-text-secondary)', borderBottom: '1px solid var(--ov-border)' }}>
                <th style={{ padding: '8px', fontWeight: 600 }}>Time</th>
                <th style={{ padding: '8px', fontWeight: 600 }}>Event</th>
              </tr>
            </thead>
            <tbody>
              {recentErrors.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--ov-border)' }}>
                  <td style={{ padding: '10px 8px', color: 'var(--ov-text-secondary)' }}>{item.time.split(',')[1]}</td>
                  <td style={{ padding: '10px 8px', color: 'var(--ov-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.result === 'error' ? '#f43f5e' : '#f59e0b' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>{item.prompt}</span>
                      <span style={{ fontSize: '10px', color: 'var(--ov-text-muted)' }}>{item.app}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Bottom Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <Card title="User Directory & Platform Access Control" action={<span style={{ color: 'var(--ov-text-muted)' }}>Manage user approval status and API cost tracking</span>}>
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
                      <Badge type="success">APPROVED</Badge>
                    ) : (
                      <Badge type="warning">PENDING</Badge>
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
                  <td style={{ padding: '16px', color: '#3b82f6', fontWeight: 600 }}>${user.cost}</td>
                  <td style={{ padding: '16px 0', textAlign: 'right' }}>
                    <Link href={`/applications/${appId}/users/123`} style={{ color: '#8b5cf6', textDecoration: 'none', fontSize: '12px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Analytics <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
