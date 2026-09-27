'use client';

import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/stores/app-store';
import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header';
import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';

export function DashboardShell({ children }: { children: ReactNode }) {
  const { sidebarExpanded, demoMode } = useAppStore();

  return (
    <div className="ov-shell">
      <Sidebar />
      <Header />
      <main className={cn('ov-shell-content', sidebarExpanded && 'sidebar-expanded')}>
        {children}
      </main>
    </div>
  );
}
