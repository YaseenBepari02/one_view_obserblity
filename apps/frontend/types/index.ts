/**
 * OneView Monitor — TypeScript Type Definitions
 *
 * Shared types used across the frontend application.
 */

// ── Application ─────────────────────────────────────────────────────────────

export interface Application {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  health_monitoring: boolean;
  logs: boolean;
  application_metrics: boolean;
  custom_adapter: string;
  custom_metrics: Record<string, unknown>[];
  environment: string;
  version: string;
  owner: string;
  health_state?: HealthState;
  health_score?: number | null;
  uptime_percent?: number;
  active_users?: number;
  error_count?: number;
  request_rate?: number;
  last_updated_seconds_ago?: number;
  _demo?: boolean;
}

// ── Health ───────────────────────────────────────────────────────────────────

export type HealthState = 'healthy' | 'warning' | 'critical' | 'unknown' | 'no_data';

export interface HealthSignal {
  value: number;
  weight: number;
  contribution: number;
}

export interface HealthMetrics {
  application: string;
  health_state: HealthState;
  health_score: number | null;
  uptime_percent: number;
  request_rate: number;
  error_rate: number;
  error_count: number;
  avg_latency_ms: number;
  p50_latency_ms: number;
  p95_latency_ms: number;
  p99_latency_ms: number;
  cpu_usage_percent: number;
  memory_usage_percent: number;
  disk_usage_percent: number;
  network_ingress_mbps: number;
  network_egress_mbps: number;
  total_containers: number;
  running_containers: number;
  restart_count: number;
  container_failures: number;
  active_incidents: number;
  time_series: Record<string, TimeSeriesPoint[]>;
  _demo?: boolean;
}

// ── Metrics ─────────────────────────────────────────────────────────────────

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
  _demo?: boolean;
}

export interface MetricSeries {
  metric: string;
  unit: string;
  data: TimeSeriesPoint[];
  dimensions: Record<string, string>;
}

// ── Logs ────────────────────────────────────────────────────────────────────

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface LogEvent {
  id: number;
  timestamp: string;
  application_id: string;
  environment: string;
  level: LogLevel;
  message: string;
  service: string;
  container: string;
  host: string;
  request_id: string | null;
  trace_id: string | null;
  user_id: string | null;
  metadata: Record<string, unknown>;
  _demo?: boolean;
}

export interface LogQueryResponse {
  items: LogEvent[];
  total: number;
  limit: number;
  offset: number;
  _demo?: boolean;
}

// ── Alerts ──────────────────────────────────────────────────────────────────

export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertState = 'triggered' | 'acknowledged' | 'resolved';

export interface AlertEvent {
  id: string;
  alert_rule_id: string;
  application_id: string;
  metric: string;
  condition: string;
  threshold: number;
  current_value: number;
  severity: AlertSeverity;
  state: AlertState;
  started_at: string;
  resolved_at: string | null;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
  notification_sent: boolean;
  _demo?: boolean;
}

export interface AlertRule {
  id: string;
  name: string;
  application_id: string;
  metric: string;
  condition: string;
  threshold: number;
  severity: AlertSeverity;
  enabled: boolean;
  evaluation_interval_seconds: number;
}

// ── Infrastructure ──────────────────────────────────────────────────────────

export interface ContainerInfo {
  container_id: string;
  name: string;
  image: string;
  status: string;
  state: string;
  cpu_percent: number;
  memory_usage_mb: number;
  memory_limit_mb: number;
  memory_percent: number;
  network_rx_mb: number;
  network_tx_mb: number;
  block_read_mb: number;
  block_write_mb: number;
  pid_count: number;
  restart_count: number;
  created_at: string;
  ports: Record<string, unknown>[];
  labels: Record<string, string>;
  _demo?: boolean;
}

export interface InfrastructureSummary {
  cpu_usage_percent: number;
  memory_usage_percent: number;
  network_rx_mbps: number;
  network_tx_mbps: number;
  total_containers: number;
  running_containers: number;
  error_count: number;
  containers: ContainerInfo[];
  time_series?: Record<string, TimeSeriesPoint[]>;
  _demo?: boolean;
}

// ── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardSummary {
  total_applications: number;
  healthy: number;
  warning: number;
  critical: number;
  unknown: number;
  total_active_users: number;
  active_sessions: number;
  total_api_requests: number;
  total_errors: number;
  estimated_cost: number;
  total_tokens: number;
  _demo?: boolean;
}

// ── Panel State ─────────────────────────────────────────────────────────────

export type PanelStatus = 'loading' | 'success' | 'error' | 'empty' | 'no-data' | 'not-configured' | 'demo';

export type ConnectorState =
  | 'connected'
  | 'connecting'
  | 'authentication_failed'
  | 'permission_denied'
  | 'source_unavailable'
  | 'parse_error'
  | 'stale_data'
  | 'disabled'
  | 'disconnected';

export type FreshnessStatus = 'live' | 'recent' | 'stale' | 'no_data' | 'error';

export interface DataFreshness {
  source: string;
  status: FreshnessStatus;
  last_updated: string | null;
  seconds_ago: number | null;
  error_message: string | null;
}

export interface PanelState {
  status: PanelStatus;
  dataFreshness: DataFreshness | null;
  sourceStatus: ConnectorState | null;
}

// ── Time Range ──────────────────────────────────────────────────────────────

export type TimeRange = '5m' | '15m' | '30m' | '1h' | '6h' | '24h' | '7d' | '30d' | 'custom';

// ── Auth ────────────────────────────────────────────────────────────────────

export type UserRole = 'viewer' | 'operator' | 'admin';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// ── Navigation ──────────────────────────────────────────────────────────────

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
