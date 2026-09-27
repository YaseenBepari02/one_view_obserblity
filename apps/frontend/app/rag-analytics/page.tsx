'use client';

import { useState } from 'react';
import { 
  Cpu, Database, Sparkles, Activity, CheckCircle2, 
  AlertCircle, Search, FileText, Layers, Zap, ArrowUpRight, 
  RefreshCw, Filter, SlidersHorizontal 
} from 'lucide-react';
import { KPICard } from '@/components/shared/KPICard/KPICard';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';

interface RagQueryTrace {
  id: string;
  query: string;
  retrievalLatency: string;
  llmLatency: string;
  groundedness: number;
  sources: string[];
  tokens: number;
  status: 'passed' | 'review' | 'flagged';
  timestamp: string;
}

const RECENT_TRACES: RagQueryTrace[] = [
  {
    id: 'rag-tr-9021',
    query: 'What are the sterile packaging validation protocols for dialyzer fluid paths under ISO 11607?',
    retrievalLatency: '48ms',
    llmLatency: '210ms',
    groundedness: 99.4,
    sources: ['ISO-11607-Section4.pdf', 'SOP-Baxter-Sterile-P5.md'],
    tokens: 1420,
    status: 'passed',
    timestamp: '24s ago'
  },
  {
    id: 'rag-tr-9020',
    query: 'Heparin infusion rate guidelines for pediatric CRRT Prismaflex version 8.2 firmware',
    retrievalLatency: '52ms',
    llmLatency: '245ms',
    groundedness: 98.8,
    sources: ['Prismaflex-v8.2-ClinicalManual.pdf', 'Pediatric-Heparin-Dosing.pdf'],
    tokens: 1890,
    status: 'passed',
    timestamp: '1m ago'
  },
  {
    id: 'rag-tr-9019',
    query: 'Alarm troubleshooting sequence for air-in-line detector error code E-304 on AK98',
    retrievalLatency: '61ms',
    llmLatency: '320ms',
    groundedness: 97.2,
    sources: ['AK98-Service-Troubleshooting-v3.pdf'],
    tokens: 2150,
    status: 'passed',
    timestamp: '3m ago'
  },
  {
    id: 'rag-tr-9018',
    query: 'Batch variance documentation requirements for peritoneal dialysis solution manufacturing',
    retrievalLatency: '94ms',
    llmLatency: '410ms',
    groundedness: 94.6,
    sources: ['GMP-Batch-Deviation-Proc.pdf', 'Baxter-Quality-QMS-08.pdf'],
    tokens: 2840,
    status: 'review',
    timestamp: '6m ago'
  },
  {
    id: 'rag-tr-9017',
    query: 'Electrolyte balance threshold limits for automated peritoneal dialysis home cyclers',
    retrievalLatency: '42ms',
    llmLatency: '195ms',
    groundedness: 99.1,
    sources: ['HomeChoice-Claria-Guide.pdf'],
    tokens: 1120,
    status: 'passed',
    timestamp: '9m ago'
  }
];

export default function RagAnalyticsPage() {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredTraces = RECENT_TRACES.filter(trace => {
    const matchesQuery = trace.query.toLowerCase().includes(filterQuery.toLowerCase()) || 
                         trace.id.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || trace.status === selectedStatus;
    return matchesQuery && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ov-space-5)' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--ov-space-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-2)', marginBottom: 'var(--ov-space-1)' }}>
            <h1 style={{ fontSize: 'var(--ov-font-size-2xl)', fontWeight: 'var(--ov-font-weight-bold)', color: 'var(--ov-text-primary)', margin: 0 }}>
              Netra RAG Analytics
            </h1>
            <Badge variant="healthy" dot>Live Telemetry</Badge>
            <Badge variant="info">Cluster: NETRA-PROD-01</Badge>
          </div>
          <p style={{ fontSize: 'var(--ov-font-size-sm)', color: 'var(--ov-text-muted)', margin: 0 }}>
            Enterprise Retrieval-Augmented Generation monitoring, hallucination prevention, and vector search observability
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--ov-space-2)' }}>
          <Button variant="secondary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <SlidersHorizontal size={14} /> Evaluation Config
          </Button>
          <Button variant="primary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={14} /> Refresh Traces
          </Button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--ov-space-3)' }}>
        <KPICard label="Retrieval P95" value="58" unit="ms" trend="up" trendValue="-6ms" />
        <KPICard label="Groundedness" value="98.7" unit="%" trend="up" trendValue="+0.4%" />
        <KPICard label="Context Recall" value="96.4" unit="%" trend="flat" />
        <KPICard label="Hallucination Rate" value="0.32" unit="%" trend="down" trendValue="-0.15%" />
        <KPICard label="Avg Tokens / Query" value="1,745" unit="tok" />
        <KPICard label="Total Evaluated" value="14,280" unit="queries" />
      </div>

      {/* RAG Diagnostics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--ov-space-4)' }}>
        {/* Pipeline Latency Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-2)', fontSize: 'var(--ov-font-size-md)' }}>
              <Zap size={16} color="var(--ov-primary)" /> Retrieval Pipeline Latency Breakdown
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ov-space-3)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--ov-font-size-xs)', marginBottom: 4 }}>
                  <span style={{ color: 'var(--ov-text-secondary)' }}>Query Embedding Generation (text-embedding-3-large)</span>
                  <span style={{ fontFamily: 'var(--ov-font-mono)', fontWeight: 600 }}>24ms</span>
                </div>
                <div style={{ height: 6, background: 'var(--ov-bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '18%', height: '100%', background: '#00F2FE', borderRadius: 3 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--ov-font-size-xs)', marginBottom: 4 }}>
                  <span style={{ color: 'var(--ov-text-secondary)' }}>Qdrant HNSW Vector Search (cosine top_k=6)</span>
                  <span style={{ fontFamily: 'var(--ov-font-mono)', fontWeight: 600 }}>34ms</span>
                </div>
                <div style={{ height: 6, background: 'var(--ov-bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '28%', height: '100%', background: '#8B5CF6', borderRadius: 3 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--ov-font-size-xs)', marginBottom: 4 }}>
                  <span style={{ color: 'var(--ov-text-secondary)' }}>Cross-Encoder Re-ranking & Deduplication</span>
                  <span style={{ fontFamily: 'var(--ov-font-mono)', fontWeight: 600 }}>28ms</span>
                </div>
                <div style={{ height: 6, background: 'var(--ov-bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '22%', height: '100%', background: '#F59E0B', borderRadius: 3 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--ov-font-size-xs)', marginBottom: 4 }}>
                  <span style={{ color: 'var(--ov-text-secondary)' }}>LLM Generation & Stream TTFT (Azure OpenAI GPT-4o)</span>
                  <span style={{ fontFamily: 'var(--ov-font-mono)', fontWeight: 600 }}>185ms</span>
                </div>
                <div style={{ height: 6, background: 'var(--ov-bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '72%', height: '100%', background: '#10B981', borderRadius: 3 }} />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Vector DB & Knowledge Health */}
        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-2)', fontSize: 'var(--ov-font-size-md)' }}>
              <Database size={16} color="#8B5CF6" /> Vector Database Cluster Health
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ov-space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--ov-space-2) 0', borderBottom: '1px solid var(--ov-border)' }}>
                <span style={{ color: 'var(--ov-text-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} /> Qdrant Vector Nodes
                </span>
                <span style={{ fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-text-secondary)' }}>3 / 3 Healthy (Replica 2)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--ov-space-2) 0', borderBottom: '1px solid var(--ov-border)' }}>
                <span style={{ color: 'var(--ov-text-primary)', fontWeight: 500 }}>Total Embedded Vectors</span>
                <span style={{ fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-text-secondary)', fontWeight: 600 }}>286,410 vectors</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--ov-space-2) 0', borderBottom: '1px solid var(--ov-border)' }}>
                <span style={{ color: 'var(--ov-text-primary)', fontWeight: 500 }}>Vector Index Memory</span>
                <span style={{ fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-text-secondary)' }}>4.1 GB / 16.0 GB (25.6%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--ov-space-2) 0' }}>
                <span style={{ color: 'var(--ov-text-primary)', fontWeight: 500 }}>Embedding Dimension</span>
                <span style={{ fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-text-secondary)' }}>3,072 dims (Cosine)</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Real-Time Query Evaluation Traces */}
      <Card>
        <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--ov-space-3)' }}>
          <div>
            <CardTitle style={{ fontSize: 'var(--ov-font-size-md)', display: 'flex', alignItems: 'center', gap: 'var(--ov-space-2)' }}>
              <Sparkles size={16} color="var(--ov-primary)" /> Real-Time RAG Query Traces & Groundedness Checks
            </CardTitle>
            <p style={{ fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', margin: '4px 0 0 0' }}>
              Live verification score against clinical document ground truth
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ov-space-2)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ov-text-muted)' }} />
              <input
                type="text"
                placeholder="Search queries, trace IDs..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                style={{
                  padding: '6px 12px 6px 30px',
                  background: 'var(--ov-bg-subtle)',
                  border: '1px solid var(--ov-border)',
                  borderRadius: 'var(--ov-radius-md)',
                  color: 'var(--ov-text-primary)',
                  fontSize: 'var(--ov-font-size-xs)',
                  outline: 'none',
                  minWidth: 220
                }}
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: '6px 10px',
                background: 'var(--ov-bg-subtle)',
                border: '1px solid var(--ov-border)',
                borderRadius: 'var(--ov-radius-md)',
                color: 'var(--ov-text-secondary)',
                fontSize: 'var(--ov-font-size-xs)',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">All Statuses</option>
              <option value="passed">Passed (&gt;95%)</option>
              <option value="review">Needs Review</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>
        </CardHeader>

        <CardBody style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--ov-border)' }}>
                  <th style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 600 }}>TRACE ID</th>
                  <th style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 600 }}>USER QUERY PROMPT</th>
                  <th style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 600 }}>RETRIEVAL / LLM</th>
                  <th style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 600 }}>GROUNDEDNESS</th>
                  <th style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 600 }}>SOURCES</th>
                  <th style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 600 }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredTraces.map((trace) => (
                  <tr key={trace.id} style={{ borderBottom: '1px solid var(--ov-border)', transition: 'background 0.15s' }}>
                    <td style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-xs)', fontFamily: 'var(--ov-font-mono)', color: 'var(--ov-primary)' }}>
                      {trace.id}
                      <div style={{ fontSize: '10px', color: 'var(--ov-text-muted)' }}>{trace.timestamp}</div>
                    </td>
                    <td style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-sm)', color: 'var(--ov-text-primary)', maxWidth: 400 }}>
                      {trace.query}
                    </td>
                    <td style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-xs)', fontFamily: 'var(--ov-font-mono)' }}>
                      <span style={{ color: '#00F2FE' }}>{trace.retrievalLatency}</span>
                      <span style={{ color: 'var(--ov-text-muted)' }}> / </span>
                      <span style={{ color: '#10B981' }}>{trace.llmLatency}</span>
                      <div style={{ fontSize: '10px', color: 'var(--ov-text-muted)' }}>{trace.tokens} tok</div>
                    </td>
                    <td style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-sm)', fontFamily: 'var(--ov-font-mono)', fontWeight: 600, color: trace.groundedness >= 97 ? 'var(--ov-status-healthy)' : 'var(--ov-status-warning)' }}>
                      {trace.groundedness}%
                    </td>
                    <td style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {trace.sources.map((src, i) => (
                          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--ov-text-secondary)' }}>
                            <FileText size={12} /> {src}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: 'var(--ov-space-3) var(--ov-space-4)' }}>
                      <Badge variant={trace.status === 'passed' ? 'healthy' : trace.status === 'review' ? 'warning' : 'critical'}>
                        {trace.status.toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
