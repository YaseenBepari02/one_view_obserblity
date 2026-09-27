/**
 * OneView Monitor — Application Store (Zustand)
 */

import { create } from 'zustand';
import type { Application, AuthUser, TimeRange } from '@/types';

interface AppState {
  // Sidebar
  sidebarExpanded: boolean;
  toggleSidebar: () => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Current application context
  selectedAppId: string | null;
  setSelectedAppId: (id: string | null) => void;

  // Time range (global)
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;

  // Auto-refresh
  autoRefresh: boolean;
  refreshInterval: number; // seconds
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (seconds: number) => void;

  // Environment
  environment: string;
  setEnvironment: (env: string) => void;

  // Auth
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;

  // Demo mode
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Sidebar
  sidebarExpanded: true,
  toggleSidebar: () => set((s) => ({ sidebarExpanded: !s.sidebarExpanded })),

  // Theme
  theme: 'dark',
  toggleTheme: () => set((s) => {
    const newTheme = s.theme === 'dark' ? 'light' : 'dark';
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('ov_theme', newTheme);
    }
    return { theme: newTheme };
  }),

  // Current application
  selectedAppId: null,
  setSelectedAppId: (id) => set({ selectedAppId: id }),

  // Time range
  timeRange: '24h',
  setTimeRange: (range) => set({ timeRange: range }),

  // Auto-refresh
  autoRefresh: true,
  refreshInterval: 30,
  setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),
  setRefreshInterval: (seconds) => set({ refreshInterval: seconds }),

  // Environment
  environment: 'prod',
  setEnvironment: (env) => set({ environment: env }),

  // Auth
  user: null,
  setUser: (user) => set({ user }),

  // Demo mode
  demoMode: false,
  setDemoMode: (enabled) => set({ demoMode: enabled }),
}));
