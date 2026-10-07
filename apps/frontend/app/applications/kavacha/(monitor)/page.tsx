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

const Card = ({ title, icon: Icon, children, action }: { title?: string, icon?: any, children: React.ReactNode, action?: React.ReactNode }) => (
  <div style={{
    background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '12px',
    boxShadow: 'var(--ov-shadow-md)', display: 'flex', flexDirection: 'column',
    overflow: 'hidden', height: '100%'
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
  <div style={{
    background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '12px',
    padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px',
    boxShadow: 'var(--ov-shadow-sm)', position: 'relative', overflow: 'hidden'
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
  <div style={{
    background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: '12px',
    padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px',
    boxShadow: 'var(--ov-shadow-sm)', position: 'relative', overflow: 'hidden'
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

  // Calculate failures
  const failCount = s.total_executions - s.pass_count;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.05))',
        border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '12px', padding: '24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ov-text-primary)', margin: '0 0 8px 0' }}>
            🛡️ Kavacha Test Automation Dashboard
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

      {/* 1. The Full 14-Card KPI Grid (3 rows) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Row 1: 4 cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <StatBox title="Users" value={s.total_users} subtext={`${s.admin_users} admins`} icon={Users} trend={5} />
          <StatBox title="Applications" value={s.total_applications} subtext="Active apps" icon={AppWindow} trend={12} />
          <StatBox title="Test Cases" value={s.total_test_cases.toLocaleString()} subtext="Total proposed" icon={TestTubes} trend={8} />
          <StatBox title="Generations" value={s.total_generations.toLocaleString()} subtext={`${autoRate}% automated`} icon={Sparkles} trend={15} />
        </div>
        {/* Row 2: 4 cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <StatBox title="Executions" value={s.total_executions.toLocaleString()} subtext={`${passRate}% pass rate`} icon={Play} trend={-2} />
          <StatBox title="Pass / Fail" value={`${s.pass_count} / ${failCount}`} subtext={`${failCount} errors`} icon={CheckCircle} />
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '8px' }}>
            <ProgressBar label="Generation Success Rate" percentage={82} color="#3b82f6" subtext={`${s.generated} / ${s.total_test_cases}`} />
            <ProgressBar label="Scheduled Run Success Rate" percentage={91} color="#10b981" subtext="132 / 145" />
            <ProgressBar label="Crawl Success Rate" percentage={87} color="#a78bfa" subtext="39 / 45" />
          </div>
        </Card>
        <Card title="AI Usage Stats" icon={Cpu}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', background: 'var(--ov-bg-subtle)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
            <div><div style={{ fontSize: '11px', color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>Total Calls</div><div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>{s.total_ai_calls}</div></div>
            <div><div style={{ fontSize: '11px', color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>Total Tokens</div><div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>1.3M</div></div>
            <div><div style={{ fontSize: '11px', color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>Total Cost</div><div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>${(s.total_ai_cost_usd || 0).toFixed(2)}</div></div>
            <div><div style={{ fontSize: '11px', color: 'var(--ov-text-secondary)', marginBottom: '4px' }}>Avg Latency</div><div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ov-text-primary)' }}>1.8s</div></div>
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
                  <td style={{ padding: '8px', color: 'var(--ov-text-secondary)' }}>{item.calls}</td>
                  <td style={{ padding: '8px', color: 'var(--ov-text-secondary)' }}>-</td>
                  <td style={{ padding: '8px', color: 'var(--ov-text-primary)' }}>${parseFloat(item.cost).toFixed(2)}</td>
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

      {/* 4. Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        <Card title="Execution Trend">
          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer>
              <AreaChart data={executionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPassed" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                  <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} /><stop offset="95%" stopColor="#f43f5e" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--ov-text-muted)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--ov-text-muted)' }} />
                <Tooltip contentStyle={{ background: '#111217', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--ov-text-primary)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: 'var(--ov-text-secondary)' }} />
                <Area type="monotone" dataKey="passed" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPassed)" name="Passed" />
                <Area type="monotone" dataKey="failed" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorFailed)" name="Failed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Test Case Distribution">
          <div style={{ display: 'flex', alignItems: 'center', height: '220px' }}>
            <div style={{ width: '160px', height: '160px', position: 'relative' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={testTypeData} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                    {testTypeData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#111217', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--ov-text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ov-text-primary)', fontFamily: 'monospace' }}>{s.total_test_cases}</span>
                <span style={{ fontSize: '10px', color: 'var(--ov-text-muted)' }}>TESTS</span>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '16px' }}>
              {testTypeData.map((item: any) => (
                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                    <span style={{ fontSize: '11px', color: 'var(--ov-text-secondary)', textTransform: 'uppercase' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ov-text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title="AI Trend (Cost/Calls)">
          <div style={{ height: '220px', width: '100%' }}>
            {aiTrendData.length > 0 ? (
              <ResponsiveContainer>
                <ComposedChart data={aiTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--ov-text-muted)' }} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--ov-text-muted)' }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ background: '#111217', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Bar yAxisId="left" dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Cost ($)" maxBarSize={30} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ov-text-muted)', fontSize: '13px' }}>No trend data</div>
            )}
          </div>
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

    </div>
  );
}
