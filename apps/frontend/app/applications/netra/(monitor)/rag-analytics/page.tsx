'use client';

import { useState } from 'react';
import {
  Database, Activity, Zap, Layers, Search, Sparkles, Filter, Calendar, MapPin,
  Terminal, Shield, FileText, ChevronDown, ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const CHART_DATA = [
  { time: '04:00', input: 20, output: 5, spend: 5 },
  { time: '06:00', input: 35, output: 10, spend: 10 },
  { time: '08:00', input: 45, output: 15, spend: 12 },
  { time: '10:00', input: 90, output: 25, spend: 20 },
  { time: '12:00', input: 120, output: 40, spend: 35 },
  { time: '14:00', input: 350, output: 95, spend: 90 },
  { time: '15:00', input: 580, output: 190, spend: 180 },
];

export default function NetraRagAnalyticsPage() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('All Models (gpt-4o, claude-3-5, emb-3)');
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Today — Sept 25, 2026');
  const [timeRange, setTimeRange] = useState('7 days');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ov-space-4)', paddingBottom: 'var(--ov-space-6)' }}>
      {/* Header Area */}
      <div style={{ background: 'var(--ov-bg-card)', padding: 'var(--ov-space-4)', borderRadius: 'var(--ov-radius-lg)', border: '1px solid var(--ov-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--ov-space-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-3)', marginBottom: 'var(--ov-space-2)' }}>
            <span style={{ color: '#2563eb', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em' }}>VECTOR CLUSTER NODE 04</span>
            <span style={{ color: 'var(--ov-text-muted)', fontSize: '11px', fontFamily: 'var(--ov-font-mono)' }}>/applications/netra/rag</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', padding: '2px 8px', borderRadius: 12, fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563eb' }} /> PIPELINE OPTIMAL
            </span>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 'var(--ov-font-weight-bold)', color: 'var(--ov-text-primary)', margin: '0 0 8px 0' }}>
            Netra Baxter RAG
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--ov-text-muted)', margin: 0, maxWidth: 600, lineHeight: 1.5 }}>
            Token consumption, vector retrieval performance, model costs, and generative quality metrics across production Baxter LLM gateways.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setIsModelOpen(!isModelOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--ov-bg-subtle)', padding: '6px 12px', borderRadius: 4, fontSize: '11px', border: '1px solid var(--ov-border)', color: 'var(--ov-text-secondary)', cursor: 'pointer' }}
              >
                <Terminal size={12} /> MODEL: <strong style={{ color: 'var(--ov-text-primary)' }}>{selectedModel}</strong> <ChevronDown size={12} />
              </div>
              {isModelOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: 6, boxShadow: 'var(--ov-shadow-md)', zIndex: 50, minWidth: 200, padding: 4 }}>
                  {['All Models (gpt-4o, claude-3-5, emb-3)', 'GPT-4o Only', 'Claude 3.5 Sonnet', 'text-embedding-3'].map(m => (
                    <div
                      key={m}
                      onClick={() => { setSelectedModel(m); setIsModelOpen(false); }}
                      style={{ padding: '6px 12px', fontSize: '11px', color: 'var(--ov-text-primary)', cursor: 'pointer', borderRadius: 4, background: selectedModel === m ? 'var(--ov-bg-subtle)' : 'transparent' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--ov-bg-subtle)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = selectedModel === m ? 'var(--ov-bg-subtle)' : 'transparent'}
                    >
                      {m}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--ov-bg-subtle)', padding: '6px 12px', borderRadius: 4, fontSize: '11px', border: '1px solid var(--ov-border)', color: 'var(--ov-text-secondary)' }}>
              <span style={{ color: '#2563eb' }}>$</span> USD TIER: ENTERPRISE
            </div>
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setIsDateOpen(!isDateOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--ov-bg-subtle)', padding: '6px 12px', borderRadius: 4, fontSize: '11px', border: '1px solid var(--ov-border)', color: 'var(--ov-text-secondary)', cursor: 'pointer' }}
              >
                <Calendar size={12} /> {selectedDate} <ChevronDown size={12} />
              </div>
              {isDateOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: 6, boxShadow: 'var(--ov-shadow-md)', zIndex: 50, minWidth: 160, padding: 4 }}>
                  {['Today — Sept 25, 2026', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Custom Range...'].map(d => (
                    <div
                      key={d}
                      onClick={() => { setSelectedDate(d); setIsDateOpen(false); }}
                      style={{ padding: '6px 12px', fontSize: '11px', color: 'var(--ov-text-primary)', cursor: 'pointer', borderRadius: 4, background: selectedDate === d ? 'var(--ov-bg-subtle)' : 'transparent' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--ov-bg-subtle)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = selectedDate === d ? 'var(--ov-bg-subtle)' : 'transparent'}
                    >
                      {d}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{ marginTop: 4 }}>
            <button
              onClick={() => alert('Opening audit traces filter...')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--ov-text-primary)', color: 'var(--ov-bg-page)', border: 'none', fontWeight: 600, padding: '6px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
            >
              <Filter size={12} /> Audit Traces
            </button>
          </div>
        </div>
      </div>

      {/* Executive Insights */}
      <div style={{ background: 'var(--ov-bg-card)', padding: 'var(--ov-space-4)', borderRadius: 'var(--ov-radius-lg)', border: '1px solid var(--ov-border)', marginBottom: 'var(--ov-space-2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'var(--ov-font-weight-bold)', color: 'var(--ov-text-primary)', margin: '0 0 4px 0' }}>
              Netra — Executive Insights
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--ov-text-muted)', margin: 0 }}>
              How Baxter employees use AI answers across Ask HR, JDE and other business applications — adoption, quality, cost and what to fix next.
            </p>
          </div>
          <div style={{ display: 'flex', border: '1px solid var(--ov-border)', borderRadius: '6px', overflow: 'hidden' }}>
            {['7 days', '30 days', '90 days'].map((tr, idx) => (
              <button
                key={tr}
                onClick={() => setTimeRange(tr)}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: timeRange === tr ? '#2563eb' : 'var(--ov-bg-page)',
                  color: timeRange === tr ? '#fff' : 'var(--ov-text-secondary)',
                  border: 'none',
                  borderLeft: idx !== 0 ? '1px solid var(--ov-border)' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s'
                }}
              >
                {tr}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            { label: 'ACTIVE USERS', val: '10', inc: '6%', dir: 'up', text: 'vs prior 7 days' },
            { label: 'QUESTIONS ANSWERED', val: '69', inc: '9%', dir: 'up', text: 'across all applications' },
            { label: 'HELPFUL ANSWER RATE', val: '87.4%', inc: '0.8 pts', dir: 'up', text: 'rated helpful or accepted' },
            { label: 'HOURS SAVED (EST.)', val: '6,080', inc: '9%', dir: 'up', text: 'employee time returned' },
            { label: 'COST PER QUESTION', val: '$0.0183', inc: '2%', dir: 'down', text: 'lower is better' },
          ].map(k => (
            <div key={k.label} style={{ border: '1px solid var(--ov-border)', borderRadius: '8px', padding: '16px', background: 'var(--ov-bg-page)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ov-text-secondary)', marginBottom: '8px' }}>{k.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--ov-text-primary)', marginBottom: '8px', fontFamily: 'var(--ov-font-sans)' }}>{k.val}</div>
              <div style={{ fontSize: '11px', display: 'flex', gap: '4px' }}>
                <span style={{ color: '#10b981', fontWeight: 600 }}>{k.dir === 'up' ? '↑' : '↓'} {k.inc}</span>
                <span style={{ color: '#3b82f6' }}>{k.text}</span>
              </div>
            </div>
          ))}

          {/* AI SPEND VS BUDGET */}
          <div style={{ border: '1px solid var(--ov-border)', borderRadius: '8px', padding: '16px', background: 'var(--ov-bg-page)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ov-text-secondary)', marginBottom: '8px' }}>AI SPEND VS BUDGET</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--ov-text-primary)', marginBottom: '12px', fontFamily: 'var(--ov-font-sans)' }}>$1,272</div>
            <div style={{ height: '4px', background: 'var(--ov-border)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ width: '36%', height: '100%', background: '#2563eb', borderRadius: '2px' }} />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>36% of $3,500 · on track</div>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--ov-space-3)', marginBottom: 'var(--ov-space-3)' }}>
        {/* Card 1 */}
        <div style={{ background: 'var(--ov-bg-card)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)', border: '1px solid var(--ov-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ov-text-secondary)', letterSpacing: '0.05em' }}>TOTAL TOKEN CONSUMPTION</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--ov-text-primary)', marginBottom: 8, fontFamily: 'var(--ov-font-sans)' }}>
            14.28M
          </div>
          <div style={{ fontSize: '12px', display: 'flex', gap: '4px' }}>
            <span style={{ color: '#10b981', fontWeight: 600 }}>↑ 18%</span>
            <span style={{ color: '#3b82f6' }}>this period</span>
          </div>
        </div>

        {/* Card 2 */}
        <div style={{ background: 'var(--ov-bg-card)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)', border: '1px solid var(--ov-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ov-text-secondary)', letterSpacing: '0.05em' }}>ESTIMATED AI API COST</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--ov-text-primary)', marginBottom: 8, fontFamily: 'var(--ov-font-sans)' }}>
            $184.52
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ov-text-muted)' }}>Average cost per query: $0.0182</div>
        </div>

        {/* Card 3 */}
        <div style={{ background: 'var(--ov-bg-card)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)', border: '1px solid var(--ov-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ov-text-secondary)', letterSpacing: '0.05em' }}>RAG RETRIEVAL LATENCY</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--ov-text-primary)', marginBottom: 8, fontFamily: 'var(--ov-font-sans)' }}>
            184ms
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ov-text-muted)' }}>Below p95 SLA (250ms)</div>
        </div>

        {/* Card 4 */}
        <div style={{ background: 'var(--ov-bg-card)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)', border: '1px solid var(--ov-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ov-text-secondary)', letterSpacing: '0.05em' }}>TOTAL RAG QUERIES</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--ov-text-primary)', marginBottom: 8, fontFamily: 'var(--ov-font-sans)' }}>
            10,140
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ov-text-muted)' }}>99.4% successfully validated</div>
        </div>
      </div>

      {/* Middle Section (Trends and Pipeline Breakdown) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--ov-space-3)' }}>
        {/* Token Trends Chart */}
        <div style={{ background: 'var(--ov-bg-card)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)', border: '1px solid var(--ov-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ov-text-primary)', fontWeight: 600, fontSize: '14px', marginBottom: 4 }}>
                <Activity size={16} color="#2563eb" /> Token Consumption & Cost Trends Over Time
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>Granularity: 1-Hour Windows (00:00 - 15:00 UTC)</div>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: '11px', color: 'var(--ov-text-primary)', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: '#2563eb', borderRadius: 2 }} /> Input Tokens</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: '#60a5fa', borderRadius: 2 }} /> Output Tokens</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 16, height: 2, background: '#94a3b8' }} /> Spend ($)</span>
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 280, width: '100%', marginBottom: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ov-border)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={false} />
                <Tooltip contentStyle={{ background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: 6, fontSize: 12 }} />
                <Bar yAxisId="left" dataKey="input" stackId="a" fill="#2563eb" barSize={16} radius={[0, 0, 4, 4]} />
                <Bar yAxisId="left" dataKey="output" stackId="a" fill="#60a5fa" barSize={16} radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="spend" stroke="#94a3b8" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--ov-border)', paddingTop: 12, fontSize: '12px' }}>
            <span style={{ color: 'var(--ov-text-muted)' }}>Max hourly throughput: 1.84M Tokens</span>
            <span style={{ color: 'var(--ov-text-primary)', fontWeight: 600 }}>Cumulative Cost: $184.52</span>
          </div>
        </div>

        {/* Vector Retrieval Pipeline Breakdown */}
        <div style={{ background: 'var(--ov-bg-card)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)', border: '1px solid var(--ov-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ov-text-primary)', fontWeight: 600, fontSize: '14px', marginBottom: 4 }}>
                <Terminal size={16} color="#2563eb" /> Vector Retrieval Pipeline Breakdown
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>Sequential Latency & Dimensional Shrinkage</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: 'var(--ov-text-muted)' }}>Total:</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ov-text-primary)', fontFamily: 'var(--ov-font-mono)' }}>1,022ms</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 11, top: 20, bottom: 20, width: 2, background: 'var(--ov-border)' }} />
            
            {/* Step 1 */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'var(--ov-bg-subtle)', padding: 12, borderRadius: 6, border: '1px solid var(--ov-border)', position: 'relative', zIndex: 1 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ov-bg-page)', border: '1px solid var(--ov-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>1</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '12px', color: 'var(--ov-text-primary)', fontWeight: 500 }}>User Natural Query</span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-text-secondary)' }}>10,140 req</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>Raw Clinical Prompt Payload</span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--ov-font-mono)', color: '#3b82f6' }}>0ms ingress</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'var(--ov-bg-subtle)', padding: 12, borderRadius: 6, border: '1px solid var(--ov-border)', position: 'relative', zIndex: 1 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ov-bg-page)', border: '1px solid #93c5fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#93c5fd' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '12px', color: '#60a5fa', fontWeight: 500 }}>Query Embedding</span>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-text-primary)', fontWeight: 600 }}>18ms</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>text-embedding-3-Large (3072 dim)</span>
                  <span style={{ fontSize: '10px', color: '#3b82f6', fontFamily: 'var(--ov-font-mono)' }}>Cosine Dense</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'var(--ov-bg-subtle)', padding: 12, borderRadius: 6, border: '1px solid var(--ov-border)', position: 'relative', zIndex: 1 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ov-bg-page)', border: '1px solid #60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 500 }}>Vector Search Retrieval</span>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--ov-font-mono)', color: '#3b82f6', fontWeight: 600 }}>24ms</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>HNSW Index Top-K (50 Chunks pulled)</span>
                  <span style={{ fontSize: '10px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>k=50 vectors</span>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'var(--ov-bg-subtle)', padding: 12, borderRadius: 6, border: '1px solid var(--ov-border)', position: 'relative', zIndex: 1 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ov-bg-page)', border: '1px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 500 }}>Cross-Encoder Rerank</span>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--ov-font-mono)', color: '#2563eb', fontWeight: 600 }}>48ms</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Cohere/bge-reranker-large (Top 5 Chunks)</span>
                  <span style={{ fontSize: '10px', color: 'var(--ov-text-muted)', textAlign: 'right', fontFamily: 'var(--ov-font-mono)' }}>90%<br/>filtered</span>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'var(--ov-bg-subtle)', padding: 12, borderRadius: 6, border: '1px solid var(--ov-border)', position: 'relative', zIndex: 1 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ov-bg-page)', border: '1px solid #1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1d4ed8' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '12px', color: '#1d4ed8', fontWeight: 500 }}>LLM Synthesis & Grounding</span>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--ov-font-mono)', color: '#1d4ed8', fontWeight: 600 }}>820ms</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>gpt-4o streaming token assembly</span>
                  <span style={{ fontSize: '10px', color: '#3b82f6', fontFamily: 'var(--ov-font-mono)' }}>Grounding Pass</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Gaps */}
      <div style={{ background: 'var(--ov-bg-card)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)', border: '1px solid var(--ov-border)', marginBottom: 'var(--ov-space-3)' }}>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ov-text-primary)', margin: '0 0 4px 0' }}>Content gaps — questions Netra could not answer well</h3>
          <p style={{ fontSize: '12px', color: 'var(--ov-text-muted)', margin: 0 }}>Fix the source content and these disappear. Top 5 this period.</p>
        </div>
        <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: 'var(--ov-text-secondary)', borderBottom: '1px solid var(--ov-border)' }}>
              <th style={{ textAlign: 'left', paddingBottom: 8, fontWeight: 600 }}>TOPIC</th>
              <th style={{ textAlign: 'left', paddingBottom: 8, fontWeight: 600 }}>APPLICATION</th>
              <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 600 }}>UNANSWERED</th>
            </tr>
          </thead>
          <tbody>
            {[
              { topic: 'Parental leave policy (India)', app: 'Ask HR', count: '298' },
              { topic: 'PO approval limits by plant', app: 'JDE', count: '235' },
              { topic: 'Supplier quality agreement template', app: 'Quality & Regulatory', count: '182' },
              { topic: 'Inbound shipment delay escalation steps', app: 'Supply Chain', count: '166' },
              { topic: 'VPN token reset on new laptops', app: 'IT Service Desk', count: '130' },
            ].map((r, i) => (
              <tr key={r.topic} style={{ borderBottom: i === 4 ? 'none' : '1px solid var(--ov-border)' }}>
                <td style={{ padding: '10px 0', color: 'var(--ov-text-primary)' }}>{r.topic}</td>
                <td style={{ padding: '10px 0', color: 'var(--ov-text-secondary)' }}>{r.app}</td>
                <td style={{ padding: '10px 0', textAlign: 'right', color: 'var(--ov-text-primary)', fontWeight: 600 }}>{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lower Section (Roles and Endpoints) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 'var(--ov-space-3)' }}>
        {/* Usage & Cost by User Role */}
        <div style={{ background: 'var(--ov-bg-card)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)', border: '1px solid var(--ov-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ov-text-primary)', fontWeight: 600, fontSize: '14px', marginBottom: 4 }}>
                <Shield size={16} /> Usage & Cost by User Role
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ov-text-muted)' }}>Cost attribution across teams</div>
            </div>
          </div>

          <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', marginBottom: 'auto' }}>
            <thead>
              <tr style={{ color: 'var(--ov-text-secondary)', borderBottom: '1px solid var(--ov-border)' }}>
                <th style={{ textAlign: 'left', paddingBottom: 8, fontWeight: 600 }}>ROLE</th>
                <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 600 }}>QUERIES</th>
                <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 600 }}>TOKENS</th>
                <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 600 }}>SPEND</th>
              </tr>
            </thead>
            <tbody>
              {[
                { role: 'Clinical Researcher', q: '4,210', t: '6.2M', s: '$82.40' },
                { role: 'Medical Officer', q: '3,110', t: '4.8M', s: '$59.20' },
                { role: 'Bio-Engineer', q: '1,840', t: '2.1M', s: '$28.10' },
                { role: 'Admin / QA', q: '980', t: '1.1M', s: '$14.82' },
              ].map((r, i) => (
                <tr key={r.role} style={{ borderBottom: i === 3 ? 'none' : '1px solid var(--ov-border)' }}>
                  <td style={{ padding: '16px 0', color: 'var(--ov-text-primary)', fontWeight: 600 }}>
                    {r.role}
                  </td>
                  <td style={{ padding: '16px 0', textAlign: 'right', color: 'var(--ov-text-secondary)' }}>{r.q}</td>
                  <td style={{ padding: '16px 0', textAlign: 'right', color: 'var(--ov-text-secondary)' }}>{r.t}</td>
                  <td style={{ padding: '16px 0', textAlign: 'right', color: 'var(--ov-text-primary)', fontWeight: 600 }}>{r.s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Expensive Queries */}
        <div style={{ background: 'var(--ov-bg-card)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)', border: '1px solid var(--ov-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ov-text-primary)', fontWeight: 600, fontSize: '14px', marginBottom: 4 }}>
                <FileText size={16} /> Top Expensive / High-Volume Queries & Endpoints
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ov-text-muted)' }}>Prioritized by cost and volume</div>
            </div>
            <button onClick={() => alert('Exporting data to JSON...')} style={{ background: 'var(--ov-bg-subtle)', padding: '6px 12px', borderRadius: 4, fontSize: '11px', border: '1px solid var(--ov-border)', fontWeight: 600, color: 'var(--ov-text-primary)', cursor: 'pointer' }}>
              Export JSON
            </button>
          </div>

          <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', marginBottom: 'auto' }}>
            <thead>
              <tr style={{ color: 'var(--ov-text-secondary)', borderBottom: '1px solid var(--ov-border)' }}>
                <th style={{ textAlign: 'left', paddingBottom: 8, fontWeight: 600 }}>ENDPOINT & PREVIEW</th>
                <th style={{ textAlign: 'left', paddingBottom: 8, fontWeight: 600 }}>MODEL</th>
                <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 600 }}>TOKENS</th>
                <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 600 }}>COST</th>
              </tr>
            </thead>
            <tbody>
              {[
                { prompt: '"Differential analysis on renal assay b...', ep: '/v1/clinical/synthesize', model: 'gpt-4o', tok: '18,420', cost: '$0.276' },
                { prompt: '"Summarize full Baxter hemodialysis ...', ep: '/v1/rag/cohort-extract', model: 'claude-3-5', tok: '14,910', cost: '$0.223' },
                { prompt: '"Extract contraindicated peptides acr...', ep: '/v1/pharma/cross-reference', model: 'gpt-4o', tok: '12,180', cost: '$0.182' },
                { prompt: '"Embedding batch lookup for 120 cli...', ep: '/v1/vectors/batch-embed', model: 'text-emb-3', tok: '96,400', cost: '$0.012' },
              ].map((r, i) => (
                <tr key={r.prompt} style={{ borderBottom: i === 3 ? 'none' : '1px solid var(--ov-border)' }}>
                  <td style={{ padding: '12px 0' }}>
                    <div style={{ color: 'var(--ov-text-primary)', fontWeight: 500, marginBottom: 4 }}>{r.prompt}</div>
                    <div style={{ color: 'var(--ov-text-muted)' }}>{r.ep}</div>
                  </td>
                  <td style={{ padding: '12px 0' }}>
                    <span style={{ color: 'var(--ov-text-primary)', fontWeight: 600 }}>{r.model}</span>
                  </td>
                  <td style={{ padding: '12px 0', textAlign: 'right', color: 'var(--ov-text-primary)' }}>{r.tok}</td>
                  <td style={{ padding: '12px 0', textAlign: 'right', color: 'var(--ov-text-primary)' }}>{r.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance by source application Section */}
      <div style={{ background: 'var(--ov-bg-card)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)', border: '1px solid var(--ov-border)', display: 'flex', flexDirection: 'column', marginBottom: 'var(--ov-space-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ov-text-primary)', fontWeight: 600, fontSize: '14px', marginBottom: 4 }}>
              <Layers size={16} /> Performance by source application
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ov-text-muted)' }}>Where Netra retrieves answers from — usage, quality and cost per application</div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', marginBottom: 'auto' }}>
            <thead>
              <tr style={{ color: 'var(--ov-text-secondary)', borderBottom: '1px solid var(--ov-border)' }}>
                <th style={{ textAlign: 'left', paddingBottom: 8, fontWeight: 600 }}>APPLICATION</th>
                <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 600 }}>QUESTIONS</th>
                <th style={{ textAlign: 'center', paddingBottom: 8, fontWeight: 600 }}>SHARE OF USAGE</th>
                <th style={{ textAlign: 'center', paddingBottom: 8, fontWeight: 600 }}>HELPFUL</th>
                <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 600 }}>SPEND</th>
                <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 600 }}>COST / QUESTION</th>
                <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 600 }}>GROWTH</th>
              </tr>
            </thead>
            <tbody>
              {[
                { app: 'Ask HR', desc: 'Policies, leave, payroll', q: '285,360', share: 100, helpful: 91, spend: '$3,335', cost: '$0.0117', growth: '+12%' },
                { app: 'JDE (ERP)', desc: 'Orders, procurement, finance', q: '206,480', share: 72, helpful: 82, spend: '$4,002', cost: '$0.0194', growth: '+21%' },
                { app: 'Quality & Regulatory', desc: 'SOPs, audits, compliance docs', q: '151,670', share: 53, helpful: 89, spend: '$3,654', cost: '$0.0241', growth: '+8%' },
                { app: 'IT Service Desk', desc: 'Access, devices, how-tos', q: '107,010', share: 37, helpful: 93, spend: '$1,131', cost: '$0.0106', growth: '+5%' },
                { app: 'Supply Chain', desc: 'Suppliers, logistics, planning', q: '63,220', share: 22, helpful: 76, spend: '$1,508', cost: '$0.0239', growth: '+17%' },
                { app: 'Clinical & Medical', desc: 'Research, clinical references', q: '27,260', share: 10, helpful: 85, spend: '$1,740', cost: '$0.0638', growth: '+24%' },
              ].map((r, i) => (
                <tr key={r.app} style={{ borderBottom: i === 5 ? 'none' : '1px solid var(--ov-border)' }}>
                  <td style={{ padding: '12px 0' }}>
                    <div style={{ color: 'var(--ov-text-primary)', fontWeight: 600, marginBottom: 2 }}>{r.app}</div>
                    <div style={{ color: 'var(--ov-text-muted)', fontSize: '11px' }}>{r.desc}</div>
                  </td>
                  <td style={{ padding: '12px 0', textAlign: 'right', color: 'var(--ov-text-secondary)' }}>{r.q}</td>
                  <td style={{ padding: '12px 0', textAlign: 'center' }}>
                    <div style={{ width: '80%', height: '4px', background: 'var(--ov-border)', borderRadius: '2px', margin: '0 auto', overflow: 'hidden' }}>
                      <div style={{ width: `${r.share}%`, height: '100%', background: '#3b82f6', borderRadius: '2px' }} />
                    </div>
                  </td>
                  <td style={{ padding: '12px 0', textAlign: 'center', color: 'var(--ov-text-primary)' }}>
                    {r.helpful}%
                  </td>
                  <td style={{ padding: '12px 0', textAlign: 'right', color: 'var(--ov-text-secondary)' }}>{r.spend}</td>
                  <td style={{ padding: '12px 0', textAlign: 'right', color: 'var(--ov-text-secondary)' }}>{r.cost}</td>
                  <td style={{ padding: '12px 0', textAlign: 'right', color: '#10b981', fontWeight: 600 }}>↑ {r.growth.replace('+', '')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section (Data Transfer & Document Grounding Health) */}
      <div style={{ background: 'var(--ov-bg-card)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)', border: '1px solid var(--ov-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ov-text-primary)', fontWeight: 600, fontSize: '14px' }}>
            <Database size={16} /> Data Transfer & Document Grounding Health
          </div>
          <div style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', padding: '4px 10px', borderRadius: 4, fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em' }}>
            Live Index Synced
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <div style={{ background: 'var(--ov-bg-subtle)', borderRadius: 6, padding: '20px 16px', border: '1px solid var(--ov-border)' }}>
            <div style={{ fontSize: '10px', color: 'var(--ov-text-secondary)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 16 }}>TOTAL DATA TRANSFERRED</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--ov-text-primary)', fontFamily: 'var(--ov-font-mono)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              42.8 GB <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 600, fontFamily: 'var(--ov-font-sans)' }}>S3 Bucket Sync</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>In: 30.2 GB | Out: 4.6 GB</div>
          </div>
          <div style={{ background: 'var(--ov-bg-subtle)', borderRadius: 6, padding: '20px 16px', border: '1px solid var(--ov-border)' }}>
            <div style={{ fontSize: '10px', color: 'var(--ov-text-secondary)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 16 }}>DOCUMENTS RETRIEVED</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--ov-text-primary)', fontFamily: 'var(--ov-font-mono)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              48,200 <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 600, fontFamily: 'var(--ov-font-sans)' }}>Docs Grounded</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>Medical journals & Clinical Specs</div>
          </div>
          <div style={{ background: 'var(--ov-bg-subtle)', borderRadius: 6, padding: '20px 16px', border: '1px solid var(--ov-border)' }}>
            <div style={{ fontSize: '10px', color: 'var(--ov-text-secondary)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 16 }}>AVERAGE CHUNKS / QUERY</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', fontFamily: 'var(--ov-font-mono)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              4.8 <span style={{ fontSize: '11px', color: 'var(--ov-text-muted)', fontWeight: 500, fontFamily: 'var(--ov-font-sans)' }}>Target: 5.0</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>Mean Cosine Similarity: 0.884</div>
          </div>
          <div style={{ background: 'var(--ov-bg-subtle)', borderRadius: 6, padding: '20px 16px', border: '1px solid var(--ov-border)' }}>
            <div style={{ fontSize: '10px', color: 'var(--ov-text-secondary)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 16 }}>VECTOR INDEX FRESHNESS</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', fontFamily: 'var(--ov-font-mono)', marginBottom: 16 }}>
              Synced 2m ago
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>Baxter CDC Debezium Pipeline OK</div>
          </div>
        </div>
      </div>
    </div>
  );
}
