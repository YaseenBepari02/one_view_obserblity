'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/stores/app-store';
import {
  LayoutDashboard, AppWindow, HeartPulse, ScrollText,
  BarChart3, DollarSign, Server, Bell, Plug, Network,
  Cpu, CircleDashed, Settings, ChevronLeft, ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '/', icon: LayoutDashboard },
  { id: 'applications', label: 'Applications', href: '/applications', icon: AppWindow, badge: '3 Active', badgeColor: '#1e3a8a', badgeTextColor: '#bfdbfe' },
  { id: 'health', label: 'Health Monitor', href: '/health', icon: HeartPulse },

  { section: 'OBSERVABILITY' },
  { id: 'metrics', label: 'Metrics & Time Series', href: '/metrics', icon: BarChart3 },
  { id: 'logs', label: 'Log Explorer', href: '/logs', icon: ScrollText, badge: 'Live', badgeColor: '#064e3b', badgeTextColor: '#34d399' },
  { id: 'traces', label: 'Traces & Correlation', href: '/traces', icon: Network },
  { id: 'infrastructure', label: 'Infrastructure & Docker', href: '/infrastructure', icon: Server },

  { section: 'APPLICATION INTEL' },
  { id: 'rag-analytics', label: 'Netra RAG Analytics', href: '/rag-analytics', icon: Cpu, badge: 'AI', badgeColor: '#4c1d95', badgeTextColor: '#c084fc' },
  { id: 'api-usage', label: 'API Usage & Tokens', href: '/api-usage', icon: CircleDashed },
  { id: 'cost', label: 'Cost & Cloud Spend', href: '/cost', icon: DollarSign },

  { section: 'MANAGEMENT' },
  { id: 'alerts', label: 'Alerts & Incidents', href: '/alerts', icon: Bell, badge: '1 Warn', badgeColor: '#78350f', badgeTextColor: '#fbbf24' },
  { id: 'connectors', label: 'Connectors', href: '/connectors', icon: Plug },
  { id: 'settings', label: 'Settings', href: '/settings', icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarExpanded, toggleSidebar } = useAppStore();

  return (
    <aside className={cn('ov-sidebar', sidebarExpanded && 'is-expanded')}>
      <div className="ov-sidebar-brand">
        <div className="ov-sidebar-brand-icon">O</div>
        <span className="ov-sidebar-brand-text">OneView</span>
      </div>

      <nav className="ov-sidebar-nav">
        {NAV_ITEMS.map((item, idx) => {
          if ('section' in item) {
            return (
              <div key={`section-${idx}`} className="ov-sidebar-section-label" style={{ marginTop: '16px', color: '#64748b', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {item.section}
              </div>
            );
          }

          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname ? pathname.startsWith(item.href) : false;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn('ov-sidebar-item', isActive && 'is-active')}
              title={!sidebarExpanded ? item.label : undefined}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon className="ov-sidebar-item-icon" size={18} />
                <span className="ov-sidebar-item-label" style={{ fontSize: '13px' }}>{item.label}</span>
              </div>
              {('badge' in item) && (item as any).badge && sidebarExpanded && (
                <span style={{ 
                  background: (item as any).badgeColor, color: (item as any).badgeTextColor, 
                  fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
                  letterSpacing: '0.05em'
                }}>
                  {(item as any).badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="ov-sidebar-toggle">
        <button
          className="ov-sidebar-toggle-btn"
          onClick={toggleSidebar}
          aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </aside>
  );
}
