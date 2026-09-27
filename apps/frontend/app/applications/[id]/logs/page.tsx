'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api/client';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { EmptyState } from '@/components/shared/EmptyState/EmptyState';
import type { LogQueryResponse, LogEvent } from '@/types';

const LEVEL_COLORS: Record<string, string> = {
  DEBUG: 'var(--ov-text-muted)',
  INFO: 'var(--ov-status-info)',
  WARN: 'var(--ov-status-warning)',
  ERROR: 'var(--ov-status-critical)',
  FATAL: 'var(--ov-status-critical)',
};

function LogRow({ log, expanded, onToggle }: { log: LogEvent; expanded: boolean; onToggle: () => void }) {
  return (
    <>
      <tr
        onClick={onToggle}
        style={{ cursor: 'pointer', borderBottom: '1px solid var(--ov-border)' }}
      >
        <td style={{ padding: 'var(--ov-space-2) var(--ov-space-3)', fontFamily: 'var(--ov-font-mono)', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', whiteSpace: 'nowrap' }}>
          {new Date(log.timestamp).toLocaleTimeString()}
        </td>
        <td style={{ padding: 'var(--ov-space-2) var(--ov-space-3)' }}>
          <span style={{ fontFamily: 'var(--ov-font-mono)', fontSize: 'var(--ov-font-size-xs)', fontWeight: 600, color: LEVEL_COLORS[log.level] || 'var(--ov-text-muted)' }}>
            {log.level}
          </span>
        </td>
        <td style={{ padding: 'var(--ov-space-2) var(--ov-space-3)', fontSize: 'var(--ov-font-size-base)', color: 'var(--ov-text-primary)', maxWidth: '500px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {log.message}
        </td>
        <td style={{ padding: 'var(--ov-space-2) var(--ov-space-3)', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)' }}>
          {log.service}
        </td>
        <td style={{ padding: 'var(--ov-space-2) var(--ov-space-3)', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)' }}>
          {log.container}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={5} style={{ padding: 'var(--ov-space-3) var(--ov-space-4)', background: 'var(--ov-bg-subtle)', fontSize: 'var(--ov-font-size-sm)', fontFamily: 'var(--ov-font-mono)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--ov-space-3)', marginBottom: 'var(--ov-space-3)' }}>
              <div><span style={{ color: 'var(--ov-text-muted)' }}>Timestamp:</span> {log.timestamp}</div>
              <div><span style={{ color: 'var(--ov-text-muted)' }}>Host:</span> {log.host}</div>
              <div><span style={{ color: 'var(--ov-text-muted)' }}>Request ID:</span> {log.request_id || '---'}</div>
              <div><span style={{ color: 'var(--ov-text-muted)' }}>Trace ID:</span> {log.trace_id || '---'}</div>
              <div><span style={{ color: 'var(--ov-text-muted)' }}>User ID:</span> {log.user_id || '---'}</div>
              <div><span style={{ color: 'var(--ov-text-muted)' }}>Environment:</span> {log.environment}</div>
            </div>
            <div style={{ color: 'var(--ov-text-primary)' }}>{log.message}</div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function LogsPage() {
  const params = useParams();
  const router = useRouter();
  const appId = params.id as string;
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery<LogQueryResponse>({
    queryKey: ['logs', appId, search, levelFilter, page],
    queryFn: () => api.get(`/applications/${appId}/logs`, {
      q: search || undefined,
      level: levelFilter || undefined,
      limit: 100,
      offset: page * 100,
    }),
    refetchInterval: 15000,
  });

  return (
    <div style={{ paddingTop: 'var(--ov-space-5)' }}>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--ov-space-3)', marginBottom: 'var(--ov-space-4)', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          style={{
            flex: 1, maxWidth: 400, padding: 'var(--ov-space-2) var(--ov-space-3)',
            background: 'var(--ov-bg-input)', border: '1px solid var(--ov-border)',
            borderRadius: 'var(--ov-radius-md)', color: 'var(--ov-text-primary)',
            fontSize: 'var(--ov-font-size-base)', fontFamily: 'var(--ov-font-sans)',
          }}
        />
        <select
          value={levelFilter}
          onChange={(e) => { setLevelFilter(e.target.value); setPage(0); }}
          style={{
            padding: 'var(--ov-space-2) var(--ov-space-3)',
            background: 'var(--ov-bg-input)', border: '1px solid var(--ov-border)',
            borderRadius: 'var(--ov-radius-md)', color: 'var(--ov-text-primary)',
            fontSize: 'var(--ov-font-size-base)',
          }}
        >
          <option value="">All levels</option>
          <option value="DEBUG">DEBUG</option>
          <option value="INFO">INFO</option>
          <option value="WARN">WARN</option>
          <option value="ERROR">ERROR</option>
          <option value="FATAL">FATAL</option>
        </select>
        {data?._demo && <Badge variant="demo">DEMO</Badge>}
        <span style={{ fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)' }}>
          {data?.total ?? 0} results
        </span>
      </div>

      {/* Log Table */}
      <Card>
        <CardBody style={{ padding: 0, overflow: 'auto' }}>
          {isLoading ? (
            <div style={{ padding: 'var(--ov-space-4)' }}>
              {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} variant="text" />)}
            </div>
          ) : data?.items.length === 0 ? (
            <EmptyState title="No logs found" description="No logs match your current filters." />
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--ov-border)' }}>
                  <th style={{ padding: 'var(--ov-space-2) var(--ov-space-3)', textAlign: 'left', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 600 }}>Time</th>
                  <th style={{ padding: 'var(--ov-space-2) var(--ov-space-3)', textAlign: 'left', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 600 }}>Level</th>
                  <th style={{ padding: 'var(--ov-space-2) var(--ov-space-3)', textAlign: 'left', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 600 }}>Message</th>
                  <th style={{ padding: 'var(--ov-space-2) var(--ov-space-3)', textAlign: 'left', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 600 }}>Service</th>
                  <th style={{ padding: 'var(--ov-space-2) var(--ov-space-3)', textAlign: 'left', fontSize: 'var(--ov-font-size-xs)', color: 'var(--ov-text-muted)', fontWeight: 600 }}>Container</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map((log) => (
                  <LogRow
                    key={log.id}
                    log={log}
                    expanded={expandedId === log.id}
                    onToggle={() => setExpandedId(expandedId === log.id ? null : log.id)}
                  />
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      {/* Pagination */}
      {data && data.total > 100 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--ov-space-2)', marginTop: 'var(--ov-space-4)' }}>
          <Button variant="secondary" size="sm" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
            Previous
          </Button>
          <span style={{ padding: 'var(--ov-space-2)', fontSize: 'var(--ov-font-size-sm)', color: 'var(--ov-text-muted)' }}>
            Page {page + 1} of {Math.ceil(data.total / 100)}
          </span>
          <Button variant="secondary" size="sm" onClick={() => setPage(page + 1)} disabled={(page + 1) * 100 >= data.total}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
