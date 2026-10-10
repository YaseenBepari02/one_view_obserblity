'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import Link from 'next/link';
import {
  Users, AppWindow, TestTubes, Sparkles, Play, Calendar,
  DollarSign, LifeBuoy, Map, ArrowUpRight, ArrowDownRight, Settings, Cpu, Clock, Share2, FileText, ArrowRight, Layers, Wrench, BookOpen, CheckCircle
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, AreaChart, Area, LineChart, Line, ComposedChart, Legend
} from 'recharts';

// --- Helper Components ---

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

const ProgressBar = ({ label, percentage, color, subtext }: { label: string, percentage: number, color: string, subtext: string }) => (
  <div style={{ marginBottom: '16px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ov-text-primary)' }}>{label}</span>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>{percentage}%</div>
        <div style={{ fontSize: '10px', color: 'var(--ov-text-muted)' }}>{subtext}</div>
      </div>
    </div>
    <div style={{ height: '6px', background: 'var(--ov-bg-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ height: '100%', background: color, width: `${percentage}%`, borderRadius: '3px' }} />
    </div>
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

const CircularProgress = ({ label, percentage, color, subtext }: { label: string, percentage: number, color: string, subtext: string }) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
      <div style={{ position: 'relative', width: '56px', height: '56px', flexShrink: 0 }}>
        <svg width="56" height="56" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="28" cy="28" r={radius} stroke="var(--ov-border)" strokeWidth="5" fill="none" />
          <circle cx="28" cy="28" r={radius} stroke={color} strokeWidth="5" fill="none" 
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} 
          />
        </svg>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>
          {percentage}%
        </div>
      </div>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ov-text-primary)', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '12px', color: 'var(--ov-text-secondary)' }}>{subtext}</div>
      </div>
    </div>
  );
};

const COLORS = ['#a78bfa', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#ec4899', '#8b5cf6'];

// --- Main Page Component ---

export default function KavachaPremiumOverview() {
  // Fetch all necessary data
  const { data: summary, isLoading: loading1 } = useQuery<any>({ queryKey: ['kavacha-overview'], queryFn: () => api.get('/kavacha/overview') });
  const { data: testStats, isLoading: loading2 } = useQuery<any>({ queryKey: ['kavacha-test-stats'], queryFn: () => api.get('/kavacha/test-cases/stats') });
  const { data: aiStats, isLoading: loading3 } = useQuery<any>({ queryKey: ['kavacha-ai-stats'], queryFn: () => api.get('/kavacha/ai-costs/stats') });
  const { data: schedulesData } = useQuery<any>({ queryKey: ['kavacha-schedules'], queryFn: () => api.get('/kavacha/schedules?limit=5') });
  const { data: executionsData } = useQuery<any>({ queryKey: ['kavacha-executions'], queryFn: () => api.get('/kavacha/executions?limit=20') });
  const { data: supportData } = useQuery<any>({ queryKey: ['kavacha-support'], queryFn: () => api.get('/kavacha/support?limit=5') });
  const { data: appMapsData } = useQuery<any>({ queryKey: ['kavacha-app-maps'], queryFn: () => api.get('/kavacha/app-maps?limit=5') });
  const { data: impactData } = useQuery<any>({ queryKey: ['kavacha-business-impact'], queryFn: () => api.get('/kavacha/business-impact') });

  if (loading1 || loading2 || loading3) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} height={140} />)}
      </div>
    );
  }

  const s = summary || {};
  const passRate = s.total_executions > 0 ? ((s.pass_count / s.total_executions) * 100).toFixed(1) : '0';
  const autoRate = s.total_test_cases > 0 ? ((s.generated / s.total_test_cases) * 100).toFixed(1) : '0';

  const executionTrendData = [
    { date: 'Sep 26', passed: 120, failed: 20, error: 5 },
    { date: 'Oct 03', passed: 150, failed: 25, error: 2 },
    { date: 'Oct 10', passed: 180, failed: 15, error: 8 },
    { date: 'Oct 17', passed: 210, failed: 10, error: 3 },
    { date: 'Oct 24', passed: 250, failed: 18, error: 4 },
  ];

  const testTypeData = (testStats?.by_test_type || []).map((t: any, i: number) => ({
    name: t.test_type, value: t.count, color: COLORS[i % COLORS.length]
  }));

  const aiTrendData = (aiStats?.cost_last_7d || []).map((item: any) => ({
    date: new Date(item.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    cost: parseFloat(item.cost),
    calls: item.calls
  }));

  const recentExecutions = executionsData?.items || [];
  const recentFailures = recentExecutions.filter((e: any) => e.result !== 'pass').slice(0, 5);
  const aiModels = aiStats?.by_model || [];
  
  // Using real data from the backend Postgres API
  const businessImpacts = impactData || [];

  // Calculate failures & errors for the donut chart
  const failCount = s.fail_count || 0;
  const errorCount = s.error_count || 0;
  const skipCount = s.skip_count || 0;
  const notPassCount = s.total_executions > 0 ? (s.total_executions - s.pass_count) : 0;
  
  const passPct = s.total_executions > 0 ? Math.round((s.pass_count / s.total_executions) * 100) : 0;
  const failPct = s.total_executions > 0 ? Math.round((failCount / s.total_executions) * 100) : 0;
  const errorPct = s.total_executions > 0 ? Math.round((errorCount / s.total_executions) * 100) : 0;
  const skipPct = s.total_executions > 0 ? Math.round((skipCount / s.total_executions) * 100) : 0;

  // Calculate Savings using real schema data passed from the backend API
  const timeSavedHours = s.time_saved_hours || 0;
  const resourcesSavedFTE = s.resource_saved_fte || 0;
  const costSavings = s.cost_saved_usd || 0;

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
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%) !important',
        padding: '24px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ov-text-primary)', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
            Kavacha Test Automation Dashboard
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--ov-text-secondary)', margin: 0 }}>
            Complete visibility across your applications, tests, and automation ecosystem.
          </p>
        </div>
        <Link href="/applications/kavacha/health" style={{ textDecoration: 'none' }}>
          <button style={{ background: 'transparent', border: '1px solid #a78bfa', color: '#a78bfa', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            View Health Monitor →
          </button>
        </Link>
      </div>

      {/* Savings Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="bento-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.03, pointerEvents: 'none' }}><Clock size={100} color="var(--ov-text-primary)" /></div>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, boxShadow: '0 4px 12px rgba(16,185,129,0.1)' }}>
            <Clock size={28} color="#10b981" />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>Time Saved</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>{timeSavedHours} hours</span>
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>↑ 42%</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>vs previous 30 days</div>
          </div>
        </div>

        <div className="bento-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.03, pointerEvents: 'none' }}><Users size={100} color="var(--ov-text-primary)" /></div>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, boxShadow: '0 4px 12px rgba(59,130,246,0.1)' }}>
            <Users size={28} color="#3b82f6" />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>Resources Saved</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>{resourcesSavedFTE} FTE</span>
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>↑ 33%</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>vs previous 30 days</div>
          </div>
        </div>

        <div className="bento-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.03, pointerEvents: 'none' }}><DollarSign size={100} color="var(--ov-text-primary)" /></div>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(167,139,250,0.05))', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, boxShadow: '0 4px 12px rgba(167,139,250,0.1)' }}>
            <DollarSign size={28} color="#a78bfa" />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>Cost Saving Est.</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>${costSavings.toLocaleString()}</span>
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>↑ 28%</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>vs previous 30 days</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
        
        {/* Left Side: 2x2 Grid of Original Pipeline KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignContent: 'start' }}>
          <StatBox title="Test Cases" value={s.total_test_cases.toLocaleString()} subtext="Total proposed" icon={TestTubes} trend={8} />
          <StatBox title="Generations" value={s.total_generations.toLocaleString()} subtext={`${autoRate}% automated`} icon={Sparkles} trend={15} />
          <StatBox title="Executions" value={s.total_executions.toLocaleString()} subtext={`${passRate}% pass rate`} icon={Play} trend={-2} />
          <StatBox title="Pass / Fail" value={`${s.pass_count} / ${notPassCount}`} subtext={`${failCount} hard fails`} icon={CheckCircle} />
        </div>

        {/* Right Side: Execution Results Donut Card */}
        <Card 
          title="Execution Results" 
          icon={CheckCircle} 
          action={<button style={{ background: 'transparent', border: '1px solid var(--ov-border)', color: '#3b82f6', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>View Details</button>}
        >
          <div style={{ fontSize: '13px', color: 'var(--ov-text-muted)', marginTop: '-8px', marginBottom: '24px' }}>
            Overall test execution results in this period
          </div>
          
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', padding: '0 12px 12px 12px' }}>
            
            {/* Donut Chart */}
            <div style={{ width: '180px', height: '180px', position: 'relative', flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Pass', value: s.pass_count, color: '#10b981' },
                      { name: 'Fail', value: failCount, color: '#ef4444' },
                      { name: 'Error', value: errorCount, color: '#f59e0b' },
                      { name: 'Skip', value: skipCount, color: '#94a3b8' }
                    ].filter(d => d.value > 0 || d.name === 'Pass' || d.name === 'Fail')}
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell key="Pass" fill="#10b981" />
                    <Cell key="Fail" fill="#ef4444" />
                    <Cell key="Error" fill="#f59e0b" />
                    <Cell key="Skip" fill="#94a3b8" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--ov-text-primary)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ov-text-primary)', lineHeight: '1' }}>{s.total_executions}</span>
                <span style={{ fontSize: '11px', color: 'var(--ov-text-secondary)', marginTop: '4px' }}>Executions</span>
              </div>
            </div>
            
            {/* Legend / Metrics List */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--ov-border)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                   <span style={{ fontSize: '13px', color: 'var(--ov-text-secondary)', fontWeight: 500 }}>Pass</span>
                 </div>
                 <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-secondary)' }}>
                   {s.pass_count} <span style={{ color: 'var(--ov-text-muted)', fontWeight: 400, margin: '0 2px' }}>/</span> {s.total_executions} <span style={{ color: 'var(--ov-text-muted)', fontWeight: 400, marginLeft: '4px' }}>({passPct}%)</span>
                 </div>
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--ov-border)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                   <span style={{ fontSize: '13px', color: 'var(--ov-text-secondary)', fontWeight: 500 }}>Fail</span>
                 </div>
                 <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-secondary)' }}>
                   {failCount} <span style={{ color: 'var(--ov-text-muted)', fontWeight: 400, margin: '0 2px' }}>/</span> {s.total_executions} <span style={{ color: 'var(--ov-text-muted)', fontWeight: 400, marginLeft: '4px' }}>({failPct}%)</span>
                 </div>
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--ov-border)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                   <span style={{ fontSize: '13px', color: 'var(--ov-text-secondary)', fontWeight: 500 }}>Error</span>
                 </div>
                 <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-secondary)' }}>
                   {errorCount} <span style={{ color: 'var(--ov-text-muted)', fontWeight: 400, margin: '0 2px' }}>/</span> {s.total_executions} <span style={{ color: 'var(--ov-text-muted)', fontWeight: 400, marginLeft: '4px' }}>({errorPct}%)</span>
                 </div>
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#94a3b8' }} />
                   <span style={{ fontSize: '13px', color: 'var(--ov-text-secondary)', fontWeight: 500 }}>Skip</span>
                 </div>
                 <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-secondary)' }}>
                   {skipCount} <span style={{ color: 'var(--ov-text-muted)', fontWeight: 400, margin: '0 2px' }}>/</span> {s.total_executions} <span style={{ color: 'var(--ov-text-muted)', fontWeight: 400, marginLeft: '4px' }}>({skipPct}%)</span>
                 </div>
               </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. Core System Metrics Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Consolidated row of remaining 4 technical metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <StatBox title="Users" value={s.total_users} subtext={`${s.admin_users} admins`} icon={Users} trend={5} />
          <StatBox title="Applications" value={s.total_applications} subtext="Active apps" icon={AppWindow} trend={12} />
          <StatBox title="AI Cost" value={`$${(s.total_ai_cost_usd || 0).toFixed(2)}`} subtext={`${s.total_ai_calls} calls`} icon={DollarSign} trend={4} />
          <StatBox title="Active Schedules" value={s.total_schedules || 0} subtext="Total schedules" icon={Calendar} />
        </div>
        {/* Row 3: 6 mini cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
          <MiniStatBox title="Test Suites" value={0} icon={Layers} />
          <MiniStatBox title="Documents" value={0} icon={FileText} />
          <MiniStatBox title="App Maps" value={s.total_applications || 0} icon={Map} />
          <MiniStatBox title="Healing" value={0} icon={Wrench} />
          <MiniStatBox title="Open Tickets" value={0} icon={LifeBuoy} />
          <MiniStatBox title="Help Articles" value={0} icon={BookOpen} />
        </div>
      </div>

      {/* 2. NextGen2 Pipeline */}
      <Card title="NextGen2 in Action" icon={Share2} action={<span style={{ color: 'var(--ov-text-muted)' }}>From application onboarding to test execution</span>}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ flex: 1, background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px', padding: '20px', display: 'flex', gap: '16px' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '50%', height: 'fit-content' }}>
              <AppWindow size={24} color="#3b82f6" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-primary)' }}>Applications Onboarded</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0 8px 0' }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>{s.total_applications}</span>
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>↑+2 new</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ov-text-muted)' }}>Total applications in the system</div>
            </div>
          </div>
          <ArrowRight size={24} color="var(--ov-text-muted)" />
          <div style={{ flex: 1, background: 'rgba(167, 139, 250, 0.05)', border: '1px solid rgba(167, 139, 250, 0.2)', borderRadius: '12px', padding: '20px', display: 'flex', gap: '16px' }}>
            <div style={{ background: 'rgba(167, 139, 250, 0.1)', padding: '12px', borderRadius: '50%', height: 'fit-content' }}>
              <FileText size={24} color="#a78bfa" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-primary)' }}>Scenarios Created</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0 8px 0' }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>{s.total_test_cases}</span>
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>↑+18%</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ov-text-muted)' }}>Test case proposals created</div>
            </div>
          </div>
          <ArrowRight size={24} color="var(--ov-text-muted)" />
          <div style={{ flex: 1, background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', padding: '20px', display: 'flex', gap: '16px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '50%', height: 'fit-content' }}>
              <Settings size={24} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-primary)' }}>Scripts Generated</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0 8px 0' }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>{s.generated}</span>
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>↑+16%</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ov-text-muted)' }}>Proposals with successful generation</div>
            </div>
          </div>
          <ArrowRight size={24} color="var(--ov-text-muted)" />
          <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', padding: '20px', display: 'flex', gap: '16px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '50%', height: 'fit-content' }}>
              <Play size={24} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ov-text-primary)' }}>Tests Executed</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0 8px 0' }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>{s.total_executions}</span>
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>↑+18%</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ov-text-muted)' }}>Total test runs</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Mixed Section: Reliability, AI Table, Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '24px' }}>
        <Card title="Automation Reliability" icon={Settings}>
          <NestedCircularProgress data={[
            { label: "Generation Success Rate", percentage: 82, color: "#3b82f6", subtext: `${s.generated} / ${s.total_test_cases}` },
            { label: "Scheduled Run Success Rate", percentage: 91, color: "#10b981", subtext: "132 / 145" },
            { label: "Crawl Success Rate", percentage: 87, color: "#a78bfa", subtext: "39 / 45" }
          ]} />
        </Card>
        <Card title="AI Usage Stats" icon={Cpu}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', background: 'var(--ov-bg-subtle)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
            <div><div style={{ fontSize: '11px', color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>Total Calls</div><div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>{s.total_ai_calls}</div></div>
            <div><div style={{ fontSize: '11px', color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>Total Tokens</div><div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>{((s.total_ai_input_tokens + s.total_ai_output_tokens) / 1000).toFixed(1)}K</div></div>
            <div><div style={{ fontSize: '11px', color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>Total Cost</div><div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>${(s.total_ai_cost_usd || 0).toFixed(2)}</div></div>
            <div><div style={{ fontSize: '11px', color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>Avg Latency</div><div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>{((aiStats?.avg_latency_ms || 0) / 1000).toFixed(1)}s</div></div>
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
              {aiModels.length > 0 ? aiModels.map((item: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--ov-border)' }}>
                  <td style={{ padding: '8px', color: 'var(--ov-text-primary)', fontWeight: 500 }}>{item.model}</td>
                  <td style={{ padding: '8px', color: 'var(--ov-text-secondary)' }}>{item.call_count}</td>
                  <td style={{ padding: '8px', color: 'var(--ov-text-secondary)' }}>{((item.input_tokens + item.output_tokens) / 1000).toFixed(1)}K</td>
                  <td style={{ padding: '8px', color: 'var(--ov-text-primary)' }}>${parseFloat(item.total_cost).toFixed(2)}</td>
                </tr>
              )) : (
                <tr>
                  <td style={{ padding: '8px', color: 'var(--ov-text-primary)', fontWeight: 500 }}>OpenAI / gpt-4o</td>
                  <td style={{ padding: '8px', color: 'var(--ov-text-secondary)' }}>0</td>
                  <td style={{ padding: '8px', color: 'var(--ov-text-secondary)' }}>0</td>
                  <td style={{ padding: '8px', color: 'var(--ov-text-primary)' }}>$0.00</td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
        <Card title="Recent Activity" icon={Clock} action={<Link href="/applications/kavacha/executions" style={{ color: '#3b82f6', textDecoration: 'none' }}>View all</Link>}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--ov-text-secondary)', borderBottom: '1px solid var(--ov-border)' }}>
                <th style={{ padding: '8px', fontWeight: 600 }}>Time</th>
                <th style={{ padding: '8px', fontWeight: 600 }}>Event</th>
              </tr>
            </thead>
            <tbody>
              {recentExecutions.length > 0 ? recentExecutions.slice(0, 4).map((item: any) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--ov-border)' }}>
                  <td style={{ padding: '10px 8px', color: 'var(--ov-text-secondary)' }}>{new Date(item.executed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td style={{ padding: '10px 8px', color: 'var(--ov-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.result === 'pass' ? '#10b981' : '#f43f5e' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>Run {item.result === 'pass' ? 'Completed' : 'Failed'}</span>
                      <span style={{ fontSize: '10px', color: 'var(--ov-text-muted)' }}>{item.app_name}</span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={2} style={{ padding: '16px', textAlign: 'center', color: 'var(--ov-text-muted)' }}>No recent activity</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>


      {/* 5. Bottom Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <Card title="Upcoming Schedules" action={<Link href="/applications/kavacha/schedules" style={{ color: '#a78bfa', textDecoration: 'none' }}>View All</Link>}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--ov-text-muted)', borderBottom: '1px solid var(--ov-border)' }}>
                <th style={{ padding: '12px 8px', fontWeight: 600, textTransform: 'uppercase' }}>Name</th>
                <th style={{ padding: '12px 8px', fontWeight: 600, textTransform: 'uppercase' }}>Application</th>
                <th style={{ padding: '12px 8px', fontWeight: 600, textTransform: 'uppercase' }}>Next Run</th>
                <th style={{ padding: '12px 8px', fontWeight: 600, textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(schedulesData?.items || []).map((item: any) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--ov-border)' }}>
                  <td style={{ padding: '12px 8px', color: 'var(--ov-text-primary)', fontWeight: 500 }}>{item.name}</td>
                  <td style={{ padding: '12px 8px', color: 'var(--ov-text-secondary)' }}>{item.app_name}</td>
                  <td style={{ padding: '12px 8px', color: 'var(--ov-text-secondary)' }}>{item.next_run_at ? new Date(item.next_run_at).toLocaleString() : '-'}</td>
                  <td style={{ padding: '12px 8px' }}><Badge type={item.enabled ? 'success' : 'neutral'}>{item.enabled ? 'Enabled' : 'Disabled'}</Badge></td>
                </tr>
              ))}
              {(!schedulesData?.items || schedulesData.items.length === 0) && (
                <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--ov-text-muted)' }}>No upcoming schedules</td></tr>
              )}
            </tbody>
          </table>
        </Card>

        <Card title="Recent Failures" action={<Link href="/applications/kavacha/executions" style={{ color: '#a78bfa', textDecoration: 'none' }}>View All</Link>}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--ov-text-muted)', borderBottom: '1px solid var(--ov-border)' }}>
                <th style={{ padding: '12px 8px', fontWeight: 600, textTransform: 'uppercase' }}>Test Case</th>
                <th style={{ padding: '12px 8px', fontWeight: 600, textTransform: 'uppercase' }}>Application</th>
                <th style={{ padding: '12px 8px', fontWeight: 600, textTransform: 'uppercase' }}>Result</th>
                <th style={{ padding: '12px 8px', fontWeight: 600, textTransform: 'uppercase' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentFailures.map((item: any) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--ov-border)' }}>
                  <td style={{ padding: '12px 8px', color: 'var(--ov-text-primary)', fontWeight: 500 }}>{item.test_case_title}</td>
                  <td style={{ padding: '12px 8px', color: 'var(--ov-text-secondary)' }}>{item.app_name}</td>
                  <td style={{ padding: '12px 8px' }}><Badge type={item.result === 'error' ? 'warning' : 'error'}>{item.result}</Badge></td>
                  <td style={{ padding: '12px 8px', color: 'var(--ov-text-secondary)' }}>{new Date(item.executed_at).toLocaleString()}</td>
                </tr>
              ))}
              {recentFailures.length === 0 && (
                <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--ov-text-muted)' }}>No recent failures!</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Application Business Impact Table */}
      <Card title="Application Business Impact" action={<span style={{ color: 'var(--ov-text-muted)', fontSize: '13px' }}>Applications ranked by business value delivered through test automation</span>}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--ov-text-muted)', borderBottom: '1px solid var(--ov-border)' }}>
              <th style={{ padding: '16px 12px', fontWeight: 600 }}>#</th>
              <th style={{ padding: '16px 12px', fontWeight: 600 }}>Application</th>
              <th style={{ padding: '16px 12px', fontWeight: 600 }}>Time Saved (hrs)</th>
              <th style={{ padding: '16px 12px', fontWeight: 600 }}>Cost Savings (₹)</th>
              <th style={{ padding: '16px 12px', fontWeight: 600 }}>Automation Coverage</th>
              <th style={{ padding: '16px 12px', fontWeight: 600 }}>Pass Rate</th>
              <th style={{ padding: '16px 12px', fontWeight: 600 }}>Critical Issues</th>
              <th style={{ padding: '16px 12px', fontWeight: 600 }}>Business Priority</th>
            </tr>
          </thead>
          <tbody>
            {businessImpacts.map((item: any, idx: number) => {
              const priorityColors: Record<string, string> = {
                'Critical': 'rgba(239, 68, 68, 0.15)',
                'High': 'rgba(249, 115, 22, 0.15)',
                'Medium': 'rgba(234, 179, 8, 0.15)',
                'Low': 'rgba(16, 185, 129, 0.15)'
              };
              const priorityTextColors: Record<string, string> = {
                'Critical': '#ef4444',
                'High': '#f97316',
                'Medium': '#eab308',
                'Low': '#10b981'
              };
              
              const coverageColor = item.automation_coverage >= 80 ? 'success' : item.automation_coverage >= 50 ? 'warning' : 'error';
              
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--ov-border)' }}>
                  <td style={{ padding: '16px 12px', color: 'var(--ov-text-secondary)' }}>{idx + 1}</td>
                  <td style={{ padding: '16px 12px', color: 'var(--ov-text-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: COLORS[idx % COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <AppWindow size={16} />
                    </div>
                    {item.name}
                  </td>
                  <td style={{ padding: '16px 12px', color: 'var(--ov-text-primary)', fontWeight: 600 }}>{item.time_saved_hours}</td>
                  <td style={{ padding: '16px 12px', color: 'var(--ov-text-primary)', fontWeight: 600 }}>₹{item.cost_savings_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td style={{ padding: '16px 12px' }}><Badge type={coverageColor}>{item.automation_coverage}%</Badge></td>
                  <td style={{ padding: '16px 12px', color: 'var(--ov-text-secondary)', fontWeight: 500 }}>{item.pass_rate}%</td>
                  <td style={{ padding: '16px 12px', color: item.critical_issues > 0 ? '#ef4444' : 'var(--ov-text-secondary)', fontWeight: item.critical_issues > 0 ? 600 : 400 }}>{item.critical_issues}</td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ padding: '4px 12px', borderRadius: '12px', display: 'inline-block', fontSize: '12px', fontWeight: 600, background: priorityColors[item.business_priority] || priorityColors['Medium'], color: priorityTextColors[item.business_priority] || priorityTextColors['Medium'] }}>
                      {item.business_priority}
                    </div>
                  </td>
                </tr>
              );
            })}
            {businessImpacts.length === 0 && (
              <tr><td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: 'var(--ov-text-muted)' }}>No application impact data available.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

    </div>
  );
}
