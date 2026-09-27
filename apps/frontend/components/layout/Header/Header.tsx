'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/stores/app-store';
import {
  RefreshCw, Search, Bell, User, ChevronDown, Sun, Moon
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import type { TimeRange } from '@/types';

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '30m', label: '30m' },
  { value: '1h', label: '1h' },
  { value: '6h', label: '6h' },
  { value: '24h', label: '24h' },
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
];

const ENVIRONMENTS = ['Dev', 'QA', 'UAT', 'Prod'];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const {
    sidebarExpanded, timeRange, setTimeRange,
    environment, setEnvironment, user,
    theme, toggleTheme
  } = useAppStore();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('ov_theme') as 'light' | 'dark' | null;
    if (saved && (saved === 'light' || saved === 'dark')) {
      useAppStore.setState({ theme: saved });
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  // Extract current app from pathname (e.g. /applications/netra/logs -> netra)
  const appMatch = pathname ? pathname.match(/\/applications\/([^/]+)/) : null;
  const currentApp = appMatch ? appMatch[1] : 'all';

  const handleAppChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'all') {
      router.push('/applications');
    } else {
      router.push(`/applications/${val}/health`);
    }
  };

  return (
    <header className={cn('ov-header', sidebarExpanded && 'sidebar-expanded')}>
      <div className="ov-header-left">
        {/* Application Selector */}
        <select 
          className="ov-header-app-selector" 
          value={currentApp} 
          onChange={handleAppChange}
          aria-label="Select Application"
        >
          <option value="all">All Applications</option>
          <option value="netra">Netra</option>
          <option value="kavacha">Kavacha</option>
          <option value="blackline">Blackline</option>
        </select>

        {/* Time Range */}
        <div className="ov-header-time-range">
          {TIME_RANGES.map((tr) => (
            <button
              key={tr.value}
              className={cn('ov-header-time-btn', timeRange === tr.value && 'is-active')}
              onClick={() => setTimeRange(tr.value)}
            >
              {tr.label}
            </button>
          ))}
        </div>

        {/* Refresh */}
        <button className="ov-header-icon-btn" title="Refresh">
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="ov-header-right">
        {/* Theme Toggle */}
        <button 
          className="ov-header-icon-btn" 
          title={mounted && theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"} 
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {!mounted ? <Sun size={14} /> : theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Search */}
        <button className="ov-header-icon-btn" title="Search">
          <Search size={14} />
        </button>

        {/* Notifications */}
        <button className="ov-header-icon-btn" title="Alerts">
          <Bell size={14} />
          <span className="ov-header-badge">2</span>
        </button>

        {/* Environment */}
        <select
          className="ov-header-env"
          value={environment}
          onChange={(e) => setEnvironment(e.target.value)}
        >
          {ENVIRONMENTS.map((env) => (
            <option key={env} value={env.toLowerCase()}>
              {env}
            </option>
          ))}
        </select>

        {/* User */}
        <div className="ov-header-user">
          <div className="ov-header-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
}
