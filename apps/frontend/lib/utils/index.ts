/**
 * OneView Monitor — Utility Functions
 */

import { clsx, type ClassValue } from 'clsx';

/** Merge class names */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format a number with commas */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

/** Format bytes to human-readable */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/** Format duration in milliseconds */
export function formatDuration(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}us`;
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

/** Format seconds ago to human-readable freshness string */
export function formatFreshness(secondsAgo: number): string {
  if (secondsAgo < 5) return 'Live';
  if (secondsAgo < 60) return `${secondsAgo}s ago`;
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
  return `${Math.floor(secondsAgo / 86400)}d ago`;
}

/** Format currency */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Format percentage */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/** Get status color CSS variable name */
export function getStatusColor(state: string): string {
  switch (state) {
    case 'healthy':
    case 'success':
    case 'running':
    case 'connected':
      return 'var(--ov-status-healthy)';
    case 'warning':
    case 'stale':
    case 'degraded':
      return 'var(--ov-status-warning)';
    case 'critical':
    case 'error':
    case 'failed':
    case 'unhealthy':
      return 'var(--ov-status-critical)';
    default:
      return 'var(--ov-status-unknown)';
  }
}

/** Truncate string with ellipsis */
export function truncate(str: string, maxLen: number = 80): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '...';
}
