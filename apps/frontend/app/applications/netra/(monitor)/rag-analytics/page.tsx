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
  { time: '04:00', input: 120, output: 40, spend: 30 },
  { time: '06:00', input: 180, output: 60, spend: 50 },
  { time: '08:00', input: 240, output: 70, spend: 65 },
  { time: '10:00', input: 300, output: 90, spend: 85 },
  { time: '12:00', input: 350, output: 100, spend: 105 },
  { time: '14:00', input: 380, output: 110, spend: 115 },
  { time: '15:00', input: 420, output: 130, spend: 130 },
];

export default function NetraRagAnalyticsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ov-space-4)', paddingBottom: 'var(--ov-space-6)' }}>
      {/* Header Area */}
      <div style={{ background: 'var(--ov-bg-card)', padding: 'var(--ov-space-4)', borderRadius: 'var(--ov-radius-lg)', border: '1px solid var(--ov-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--ov-space-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-3)', marginBottom: 'var(--ov-space-2)' }}>
            <span style={{ color: '#00F2FE', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em' }}>VECTOR CLUSTER NODE 04</span>
            <span style={{ color: 'var(--ov-text-muted)', fontSize: '11px', fontFamily: 'var(--ov-font-mono)' }}>/applications/netra/rag</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '2px 8px', borderRadius: 12, fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} /> PIPELINE OPTIMAL
            </span>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 'var(--ov-font-weight-bold)', color: 'var(--ov-text-primary)', margin: '0 0 8px 0' }}>
            Netra — RAG & AI Telemetry Engine
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--ov-text-muted)', margin: 0, maxWidth: 600, lineHeight: 1.5 }}>
            Token consumption, vector retrieval performance, model costs, and generative quality metrics across production Baxter LLM gateways.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--ov-bg-subtle)', padding: '6px 12px', borderRadius: 4, fontSize: '11px', border: '1px solid var(--ov-border)', color: 'var(--ov-text-secondary)', cursor: 'pointer' }}>
              <Terminal size={12} /> MODEL: <strong style={{ color: 'var(--ov-text-primary)' }}>All Models (gpt-4o, claude-3-5, emb-3)</strong> <ChevronDown size={12} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--ov-bg-subtle)', padding: '6px 12px', borderRadius: 4, fontSize: '11px', border: '1px solid var(--ov-border)', color: 'var(--ov-text-secondary)' }}>
              <span style={{ color: '#F59E0B' }}>$</span> USD TIER: ENTERPRISE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--ov-bg-subtle)', padding: '6px 12px', borderRadius: 4, fontSize: '11px', border: '1px solid var(--ov-border)', color: 'var(--ov-text-secondary)', cursor: 'pointer' }}>
              <Calendar size={12} /> Today — Sept 25, 2026 <ChevronDown size={12} />
            </div>
          </div>
          <div style={{ marginTop: 4 }}>
            <Button variant="secondary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--ov-text-primary)', color: 'var(--ov-bg-page)', border: 'none', fontWeight: 600 }}>
              <Filter size={14} /> Audit Traces
            </Button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--ov-space-3)' }}>
        {/* Card 1 */}
        <div style={{ background: 'var(--ov-bg-card)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)', border: '1px solid var(--ov-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ov-text-secondary)', letterSpacing: '0.05em' }}>TOTAL TOKEN CONSUMPTION</span>
            <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>+18%</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'var(--ov-font-weight-bold)', color: 'var(--ov-text-primary)', marginBottom: 24, fontFamily: 'var(--ov-font-mono)' }}>
            14.28M
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ov-text-muted)' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00F2FE' }}/> Input Chunks</span>
              <span style={{ fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-text-primary)', fontWeight: 600 }}>11.20M <span style={{ color: 'var(--ov-text-muted)', fontWeight: 400 }}>(78.4%)</span></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ov-text-muted)' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c084fc' }}/> Generation</span>
              <span style={{ fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-text-primary)', fontWeight: 600 }}>3.08M <span style={{ color: 'var(--ov-text-muted)', fontWeight: 400 }}>(21.6%)</span></span>
            </div>
            <div style={{ height: 4, display: 'flex', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: '78.4%', background: '#00F2FE' }} />
              <div style={{ width: '21.6%', background: '#c084fc' }} />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div style={{ background: 'var(--ov-bg-card)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)', border: '1px solid var(--ov-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ov-text-secondary)', letterSpacing: '0.05em' }}>ESTIMATED AI API COST</span>
            <span style={{ fontSize: '10px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--ov-text-primary)', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>BAXTER TIER</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'var(--ov-font-weight-bold)', color: 'var(--ov-text-primary)', marginBottom: 24, fontFamily: 'var(--ov-font-mono)' }}>
            $184.52
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--ov-text-muted)', marginBottom: 4, letterSpacing: '0.05em', fontWeight: 600 }}>AVERAGE COST / QUERY</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ov-text-primary)', fontFamily: 'var(--ov-font-mono)' }}>$0.0182</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: 'var(--ov-text-muted)', marginBottom: 4, letterSpacing: '0.05em', fontWeight: 600 }}>BUDGET CAP BURNDOWN</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#10B981', fontFamily: 'var(--ov-font-mono)' }}>36.9% of <br/> $500/day</div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div style={{ background: 'var(--ov-bg-card)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)', border: '1px solid var(--ov-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ov-text-secondary)', letterSpacing: '0.05em' }}>RAG RETRIEVAL LATENCY</span>
            <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>p95 SLA 250ms</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'var(--ov-font-weight-bold)', color: '#00F2FE', marginBottom: 24, fontFamily: 'var(--ov-font-mono)' }}>
            184<span style={{ fontSize: '16px' }}>ms</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--ov-text-muted)', marginBottom: 4, fontWeight: 600 }}>V-Search</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ov-text-primary)', fontFamily: 'var(--ov-font-mono)' }}>28ms</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--ov-text-muted)', marginBottom: 4, fontWeight: 600 }}>Rerank</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#00F2FE', fontFamily: 'var(--ov-font-mono)' }}>44ms</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--ov-text-muted)', marginBottom: 4, fontWeight: 600 }}>Context</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#c084fc', fontFamily: 'var(--ov-font-mono)' }}>112ms</div>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div style={{ background: 'var(--ov-bg-card)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)', border: '1px solid var(--ov-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ov-text-secondary)', letterSpacing: '0.05em' }}>TOTAL RAG QUERIES</span>
            <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>99.8% OK</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'var(--ov-font-weight-bold)', color: 'var(--ov-text-primary)', marginBottom: 24, fontFamily: 'var(--ov-font-mono)' }}>
            10,140
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--ov-text-muted)', marginBottom: 4, letterSpacing: '0.05em', fontWeight: 600 }}>GROUNDING PASS</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#10B981', fontFamily: 'var(--ov-font-mono)' }}>99.4% <br/> Validated</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: 'var(--ov-text-muted)', marginBottom: 4, letterSpacing: '0.05em', fontWeight: 600 }}>RETRY / FALLBACK</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#F59E0B', fontFamily: 'var(--ov-font-mono)' }}>18 calls <br/> (0.17%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section (Trends and Pipeline Breakdown) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--ov-space-3)' }}>
        {/* Token Trends Chart */}
        <div style={{ background: 'var(--ov-bg-card)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)', border: '1px solid var(--ov-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ov-text-primary)', fontWeight: 600, fontSize: '14px', marginBottom: 4 }}>
                <Activity size={16} color="#00F2FE" /> Token Consumption & Cost Trends Over Time
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>Granularity: 1-Hour Windows (00:00 - 15:00 UTC)</div>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: '11px', color: 'var(--ov-text-primary)', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: '#00F2FE', borderRadius: 2 }} /> Input Tokens</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: '#c084fc', borderRadius: 2 }} /> Output Tokens</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 16, height: 2, background: '#10B981' }} /> Spend ($)</span>
            </div>
          </div>
          
          <div style={{ flex: 1, minHeight: 280, width: '100%', marginBottom: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#849495', fontFamily: 'monospace' }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#849495', fontFamily: 'monospace' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={false} />
                <Tooltip contentStyle={{ background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)', borderRadius: 6, fontSize: 12 }} />
                <Bar yAxisId="left" dataKey="input" stackId="a" fill="#00F2FE" barSize={16} radius={[0, 0, 4, 4]} />
                <Bar yAxisId="left" dataKey="output" stackId="a" fill="#c084fc" barSize={16} radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="spend" stroke="#10B981" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--ov-border)', paddingTop: 12, fontSize: '10px', fontFamily: 'var(--ov-font-mono)' }}>
            <span style={{ color: 'var(--ov-text-muted)' }}>Max hourly throughput: 1.84M Tokens</span>
            <span style={{ color: '#10B981', fontWeight: 600 }}>Cumulative Cost: $184.52</span>
          </div>
        </div>

        {/* Vector Retrieval Pipeline Breakdown */}
        <div style={{ background: 'var(--ov-bg-card)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)', border: '1px solid var(--ov-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ov-text-primary)', fontWeight: 600, fontSize: '14px', marginBottom: 4 }}>
                <Terminal size={16} color="#00F2FE" /> Vector Retrieval Pipeline Breakdown
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
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'var(--ov-bg-subtle)', padding: 12, borderRadius: 6, border: '1px solid rgba(255,255,255,0.02)', position: 'relative', zIndex: 1 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ov-bg-page)', border: '1px solid var(--ov-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>1</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '12px', color: 'var(--ov-text-primary)', fontWeight: 500 }}>User Natural Query</span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-text-secondary)' }}>10,140 req</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>Raw Clinical Prompt Payload</span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--ov-font-mono)', color: '#10B981' }}>0ms ingress</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'var(--ov-bg-subtle)', padding: 12, borderRadius: 6, border: '1px solid rgba(255,255,255,0.02)', position: 'relative', zIndex: 1 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ov-bg-page)', border: '1px solid #00F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00F2FE' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '12px', color: '#00F2FE', fontWeight: 500 }}>Query Embedding</span>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-text-primary)', fontWeight: 600 }}>18ms</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>text-embedding-3-Large (3072 dim)</span>
                  <span style={{ fontSize: '10px', color: '#10B981', fontFamily: 'var(--ov-font-mono)' }}>Cosine Dense</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'var(--ov-bg-subtle)', padding: 12, borderRadius: 6, border: '1px solid rgba(255,255,255,0.02)', position: 'relative', zIndex: 1 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ov-bg-page)', border: '1px solid #0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0284C7' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '12px', color: '#0284C7', fontWeight: 500 }}>Vector Search Retrieval</span>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--ov-font-mono)', color: '#00F2FE', fontWeight: 600 }}>24ms</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>HNSW Index Top-K (50 Chunks pulled)</span>
                  <span style={{ fontSize: '10px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>k=50 vectors</span>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'var(--ov-bg-subtle)', padding: 12, borderRadius: 6, border: '1px solid rgba(255,255,255,0.02)', position: 'relative', zIndex: 1 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ov-bg-page)', border: '1px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 500 }}>Cross-Encoder Rerank</span>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--ov-font-mono)', color: '#F59E0B', fontWeight: 600 }}>48ms</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Cohere/bge-reranker-large (Top 5 Chunks)</span>
                  <span style={{ fontSize: '10px', color: 'var(--ov-text-muted)', textAlign: 'right', fontFamily: 'var(--ov-font-mono)' }}>90%<br/>filtered</span>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'var(--ov-bg-subtle)', padding: 12, borderRadius: 6, border: '1px solid rgba(255,255,255,0.02)', position: 'relative', zIndex: 1 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ov-bg-page)', border: '1px solid #c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c084fc' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '12px', color: '#c084fc', fontWeight: 500 }}>LLM Synthesis & Grounding</span>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--ov-font-mono)', color: '#c084fc', fontWeight: 600 }}>820ms</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>gpt-4o streaming token assembly</span>
                  <span style={{ fontSize: '10px', color: '#10B981', fontFamily: 'var(--ov-font-mono)' }}>Grounding Pass</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
              <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>Clinical telemetry attribution across Baxter Roles teams</div>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', textAlign: 'right' }}>4 Active</div>
          </div>

          <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', marginBottom: 'auto' }}>
            <thead>
              <tr style={{ color: 'var(--ov-text-secondary)', borderBottom: '1px solid var(--ov-border)' }}>
                <th style={{ textAlign: 'left', paddingBottom: 8, fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'var(--ov-font-mono)' }}>ROLE</th>
                <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'var(--ov-font-mono)' }}>QUERIES</th>
                <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'var(--ov-font-mono)' }}>TOKENS</th>
                <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'var(--ov-font-mono)' }}>SPEND</th>
              </tr>
            </thead>
            <tbody>
              {[
                { role: 'Clinical Researcher', color: '#00F2FE', q: '4,210', t: '6.2M', s: '$82.40' },
                { role: 'Medical Officer', color: '#c084fc', q: '3,110', t: '4.8M', s: '$59.20' },
                { role: 'Bio-Engineer', color: '#a855f7', q: '1,840', t: '2.1M', s: '$28.10' },
                { role: 'Admin / QA', color: '#849495', q: '980', t: '1.1M', s: '$14.82' },
              ].map((r, i) => (
                <tr key={r.role} style={{ borderBottom: i === 3 ? 'none' : '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '16px 0', color: 'var(--ov-text-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--ov-font-mono)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }} /> {r.role}
                  </td>
                  <td style={{ padding: '16px 0', textAlign: 'right', fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-text-secondary)' }}>{r.q}</td>
                  <td style={{ padding: '16px 0', textAlign: 'right', fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-text-secondary)' }}>{r.t}</td>
                  <td style={{ padding: '16px 0', textAlign: 'right', fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-text-primary)', fontWeight: 600 }}>{r.s}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--ov-border)', paddingTop: 12, fontSize: '10px', marginTop: 16 }}>
            <span style={{ color: 'var(--ov-text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--ov-font-mono)' }}>
              <Shield size={12} color="#10B981" /> Role policy enforcement: strict
            </span>
            <span style={{ color: 'var(--ov-text-primary)', fontWeight: 600, fontFamily: 'var(--ov-font-mono)' }}>100% Attributed</span>
          </div>
        </div>

        {/* Top Expensive Queries */}
        <div style={{ background: 'var(--ov-bg-card)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)', border: '1px solid var(--ov-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ov-text-primary)', fontWeight: 600, fontSize: '14px', marginBottom: 4 }}>
                <FileText size={16} color="#F59E0B" /> Top Expensive / High-Volume Queries & Endpoints
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>Traces prioritized by token consumption and dollar impact</div>
            </div>
            <div style={{ background: 'var(--ov-bg-subtle)', padding: '6px 12px', borderRadius: 4, fontSize: '10px', border: '1px solid var(--ov-border)', fontWeight: 700, color: 'var(--ov-text-primary)', letterSpacing: '0.05em', cursor: 'pointer' }}>
              Export JSON
            </div>
          </div>

          <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', marginBottom: 'auto' }}>
            <thead>
              <tr style={{ color: 'var(--ov-text-secondary)', borderBottom: '1px solid var(--ov-border)' }}>
                <th style={{ textAlign: 'left', paddingBottom: 8, fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'var(--ov-font-mono)' }}>PROMPT PREVIEW & ENDPOINT</th>
                <th style={{ textAlign: 'left', paddingBottom: 8, fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'var(--ov-font-mono)' }}>MODEL</th>
                <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'var(--ov-font-mono)' }}>TOKENS</th>
                <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'var(--ov-font-mono)' }}>COST</th>
                <th style={{ textAlign: 'right', paddingBottom: 8, fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'var(--ov-font-mono)' }}>LATENCY</th>
              </tr>
            </thead>
            <tbody>
              {[
                { prompt: '"Differential analysis on renal assay b...', ep: '/v1/clinical/synthesize', model: 'gpt-4o', mcolor: 'rgba(255, 255, 255, 0.05)', mtcolor: 'var(--ov-text-primary)', tok: '18,420', cost: '$0.276', lat: '1,240ms', lcolor: '#00F2FE' },
                { prompt: '"Summarize full Baxter hemodialysis ...', ep: '/v1/rag/cohort-extract', model: 'claude-3-5', mcolor: 'rgba(192, 132, 252, 0.15)', mtcolor: '#c084fc', tok: '14,910', cost: '$0.223', lat: '1,090ms', lcolor: '#00F2FE' },
                { prompt: '"Extract contraindicated peptides acr...', ep: '/v1/pharma/cross-reference', model: 'gpt-4o', mcolor: 'rgba(255, 255, 255, 0.05)', mtcolor: 'var(--ov-text-primary)', tok: '12,180', cost: '$0.182', lat: '940ms', lcolor: '#00F2FE' },
                { prompt: '"Embedding batch lookup for 120 cli...', ep: '/v1/vectors/batch-embed', model: 'text-emb-3', mcolor: 'rgba(0, 242, 254, 0.15)', mtcolor: '#00F2FE', tok: '96,400', cost: '$0.012', lat: '340ms', lcolor: '#00F2FE' },
              ].map((r, i) => (
                <tr key={r.prompt} style={{ borderBottom: i === 3 ? 'none' : '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '12px 0' }}>
                    <div style={{ color: 'var(--ov-text-primary)', fontWeight: 500, marginBottom: 4, fontFamily: 'var(--ov-font-mono)' }}>{r.prompt}</div>
                    <div style={{ fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-text-muted)' }}>{r.ep}</div>
                  </td>
                  <td style={{ padding: '12px 0' }}>
                    <span style={{ background: r.mcolor, color: r.mtcolor, padding: '4px 8px', borderRadius: 4, fontFamily: 'var(--ov-font-mono)', fontWeight: 600 }}>{r.model}</span>
                  </td>
                  <td style={{ padding: '12px 0', textAlign: 'right', fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-text-primary)' }}>{r.tok}</td>
                  <td style={{ padding: '12px 0', textAlign: 'right', fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-text-primary)' }}>{r.cost}</td>
                  <td style={{ padding: '12px 0', textAlign: 'right', fontFamily: 'var(--ov-font-mono)', color: r.lcolor, fontWeight: 600 }}>{r.lat}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--ov-border)', paddingTop: 12, fontSize: '10px', marginTop: 16 }}>
            <span style={{ color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>Displaying top 4 anomalous cost clusters</span>
            <span style={{ color: 'var(--ov-text-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--ov-font-mono)', cursor: 'pointer' }}>Open Traces Explorer <ArrowUpRight size={14}/></span>
          </div>
        </div>
      </div>

      {/* Bottom Section (Data Transfer & Document Grounding Health) */}
      <div style={{ background: 'var(--ov-bg-card)', borderRadius: 'var(--ov-radius-lg)', padding: 'var(--ov-space-4)', border: '1px solid var(--ov-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ov-text-primary)', fontWeight: 600, fontSize: '14px' }}>
            <Database size={16} color="#00F2FE" /> Data Transfer & Document Grounding Health
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '4px 10px', borderRadius: 4, fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em' }}>
            Live Index Synced
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <div style={{ background: 'var(--ov-bg-subtle)', borderRadius: 6, padding: '20px 16px', border: '1px solid rgba(255,255,255,0.02)' }}>
            <div style={{ fontSize: '10px', color: 'var(--ov-text-secondary)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 16 }}>TOTAL DATA TRANSFERRED</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--ov-text-primary)', fontFamily: 'var(--ov-font-mono)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              42.8 GB <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, fontFamily: 'var(--ov-font-sans)' }}>S3 Bucket Sync</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>In: 30.2 GB | Out: 4.6 GB</div>
          </div>
          <div style={{ background: 'var(--ov-bg-subtle)', borderRadius: 6, padding: '20px 16px', border: '1px solid rgba(255,255,255,0.02)' }}>
            <div style={{ fontSize: '10px', color: 'var(--ov-text-secondary)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 16 }}>DOCUMENTS RETRIEVED</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--ov-text-primary)', fontFamily: 'var(--ov-font-mono)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              48,200 <span style={{ fontSize: '11px', color: '#00F2FE', fontWeight: 600, fontFamily: 'var(--ov-font-sans)' }}>Docs Grounded</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>Medical journals & Clinical Specs</div>
          </div>
          <div style={{ background: 'var(--ov-bg-subtle)', borderRadius: 6, padding: '20px 16px', border: '1px solid rgba(255,255,255,0.02)' }}>
            <div style={{ fontSize: '10px', color: 'var(--ov-text-secondary)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 16 }}>AVERAGE CHUNKS / QUERY</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00F2FE', fontFamily: 'var(--ov-font-mono)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              4.8 <span style={{ fontSize: '11px', color: 'var(--ov-text-muted)', fontWeight: 500, fontFamily: 'var(--ov-font-sans)' }}>Target: 5.0</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>Mean Cosine Similarity: 0.884</div>
          </div>
          <div style={{ background: 'var(--ov-bg-subtle)', borderRadius: 6, padding: '20px 16px', border: '1px solid rgba(255,255,255,0.02)' }}>
            <div style={{ fontSize: '10px', color: 'var(--ov-text-secondary)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 16 }}>VECTOR INDEX FRESHNESS</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981', fontFamily: 'var(--ov-font-mono)', marginBottom: 16 }}>
              Synced 2m ago
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', fontFamily: 'var(--ov-font-mono)' }}>Baxter CDC Debezium Pipeline OK</div>
          </div>
        </div>
      </div>
    </div>
  );
}
