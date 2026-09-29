import React from 'react';
import Link from 'next/link';
import { Activity, Server, Shield, ChevronRight, ActivitySquare, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge/Badge';
import './ApplicationCard.css';

export interface ApplicationMetrics {
  uptime?: string | number;
  latency?: string | number;
  errorRate?: string | number;
  activeUsers?: string | number;
  throughput?: string | number;
}

export interface ApplicationCardProps {
  id: string;
  name: string;
  description?: string;
  status?: 'healthy' | 'warning' | 'critical' | 'unknown' | string;
  score?: number;
  environment?: string;
  metrics?: ApplicationMetrics;
  icon?: any;
}

const getStatusDetails = (status: string = 'unknown') => {
  const s = status.toLowerCase();
  if (s === 'healthy' || s === 'stable') return { color: 'var(--ov-status-healthy)', bg: 'var(--ov-status-healthy-bg)', label: 'HEALTHY' };
  if (s === 'warning' || s === 'degraded') return { color: 'var(--ov-status-warning)', bg: 'var(--ov-status-warning-bg)', label: 'WARNING' };
  if (s === 'critical' || s === 'down') return { color: 'var(--ov-status-critical)', bg: 'var(--ov-status-critical-bg)', label: 'CRITICAL' };
  return { color: 'var(--ov-text-muted)', bg: 'var(--ov-bg-subtle)', label: 'UNKNOWN' };
};

const getDefaultIcon = (id: string) => {
  if (id.toLowerCase().includes('kavach')) return Shield;
  if (id.toLowerCase().includes('blackline')) return Server;
  return Activity;
};

export function ApplicationCard({ id, name, description, status, score, environment = 'prod', metrics, icon }: ApplicationCardProps) {
  const Icon = icon || getDefaultIcon(id);
  const statusDetails = getStatusDetails(status);

  return (
    <div className="ov-app-component-card">
      <div className="ov-app-component-header">
        <div className="ov-app-component-title-row">
          <div className="ov-app-component-icon-container">
            <Icon size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 className="ov-app-component-name">{name}</h3>
              <span className="ov-app-component-env">{environment.toUpperCase()}</span>
            </div>
            <p className="ov-app-component-desc">{description || 'Application active and monitored.'}</p>
          </div>
          {score !== undefined && (
            <div className="ov-app-component-score" style={{ color: statusDetails.color }}>
              {score} <span className="ov-app-component-score-max">/100</span>
            </div>
          )}
        </div>
      </div>

      {(metrics && Object.keys(metrics).length > 0) && (
        <div className="ov-app-component-metrics">
          {metrics.activeUsers !== undefined && (
            <div className="ov-app-component-metric">
              <div className="label">ACTIVE USERS</div>
              <div className="value">{metrics.activeUsers}</div>
            </div>
          )}
          {metrics.throughput !== undefined && (
            <div className="ov-app-component-metric">
              <div className="label">THROUGHPUT</div>
              <div className="value">{metrics.throughput}</div>
            </div>
          )}
          {metrics.uptime !== undefined && (
            <div className="ov-app-component-metric">
              <div className="label">UPTIME</div>
              <div className="value">{metrics.uptime}</div>
            </div>
          )}
          {metrics.latency !== undefined && (
            <div className="ov-app-component-metric">
              <div className="label">LATENCY</div>
              <div className="value">{metrics.latency}</div>
            </div>
          )}
          {metrics.errorRate !== undefined && (
            <div className="ov-app-component-metric">
              <div className="label">ERROR RATE</div>
              <div className="value" style={{ color: status === 'warning' || status === 'critical' ? statusDetails.color : 'inherit' }}>
                {metrics.errorRate}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="ov-app-component-footer">
        <div className="ov-app-component-status" style={{ color: statusDetails.color }}>
          <span className="indicator" style={{ background: statusDetails.color }}></span>
          {statusDetails.label}
        </div>
        <Link href={`/applications/${id}`} className="ov-app-component-link">
          Dashboard <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
