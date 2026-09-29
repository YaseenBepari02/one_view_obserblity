import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from 'next/font/google';

// Styles
import "./globals.css";
import "@/components/layout/DashboardShell/DashboardShell.css";
import "@/components/layout/Sidebar/Sidebar.css";
import "@/components/layout/Header/Header.css";
import "@/components/ui/Button/Button.css";
import "@/components/ui/Badge/Badge.css";
import "@/components/ui/Card/Card.css";
import "@/components/ui/Skeleton/Skeleton.css";
import "@/components/ui/Tabs/Tabs.css";
import "@/components/shared/KPICard/KPICard.css";
import "@/components/shared/EmptyState/EmptyState.css";
import "@/components/shared/DataFreshness/DataFreshness.css";

import { QueryProvider } from '@/lib/api/query-provider';
import { DashboardShell } from '@/components/layout/DashboardShell/DashboardShell';

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "OneView Monitor",
  description: "Unified application tracking and infrastructure observability platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetBrainsMono.variable}`} suppressHydrationWarning>
      <body>
        <QueryProvider>
          <DashboardShell>
            {children}
          </DashboardShell>
        </QueryProvider>
      </body>
    </html>
  );
}
