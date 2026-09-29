"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api/client";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import type { Application } from "@/types";
import { Activity, Users } from "lucide-react";

const APP_TABS = [
  { id: "health", label: "Health Monitor", icon: Activity },
  { id: "users", label: "Users & Sessions", icon: Users },
];

export default function ApplicationLayout({ children }: { children: React.ReactNode }) {
  
  const router = useRouter();
  const pathname = usePathname();
  const appId = "kavacha";

  const queryClient = useQueryClient();
  const [isChecking, setIsChecking] = useState(false);

  const { data: app, isLoading, refetch } = useQuery<Application>({
    queryKey: ["application", appId],
    queryFn: () => api.get(`/applications/${appId}`),
  });

  const { data: healthData, refetch: refetchHealth } = useQuery({
    queryKey: ['health', appId],
    queryFn: () => api.get(`/applications/${appId}/health?live=true`),
  });

  const handleHealthCheck = async () => {
    if (isChecking) return;
    setIsChecking(true);
    await refetch();
    await refetchHealth();
    await queryClient.invalidateQueries({ queryKey: ["health"] });
    setTimeout(() => {
      setIsChecking(false);
    }, 1000);
  };

  // Determine active tab based on pathname
  let activeTab = "health";
  for (const tab of APP_TABS) {
    if (pathname.includes(`/${tab.id}`)) {
      activeTab = tab.id;
      break;
    }
  }

  const handleTabChange = (tabId: string) => {
    router.push(`/applications/${appId}/${tabId}`);
  };

  if (isLoading) {
    return (
      <div style={{ padding: "24px" }}>
        <Skeleton width="100%" height={200} />
      </div>
    );
  }

  const appName = app?.name || (appId.charAt(0).toUpperCase() + appId.slice(1));

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", background: "var(--ov-bg-page)" }}>
      {/* Top Breadcrumb & Global Status Row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: "1px solid var(--ov-border)", boxShadow: "var(--ov-shadow-sm)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "11px", fontFamily: "monospace", color: "var(--ov-text-muted)" }}>
          <button 
            onClick={() => router.push('/applications')}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "var(--ov-text-muted)", cursor: "pointer", padding: 0 }}
          >
            <span style={{ fontSize: '14px' }}>←</span> Applications
          </button>
          <span>/</span>
          <span style={{ color: "var(--ov-text-primary)", fontWeight: 600, fontSize: '12px' }}>{appName}</span>
          <span style={{ background: "var(--ov-status-info-bg)", color: "var(--ov-status-info)", padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--ov-status-info)", opacity: 0.8, fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em" }}>
            CLUSTER ID: {appId.toUpperCase()}-PROD-01
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "10px", fontFamily: "monospace", color: "var(--ov-text-muted)", fontWeight: 600, letterSpacing: "0.05em" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
            GATEWAY STREAM LIVE
          </span>
          <span>•</span>
          <span>OTEL INGESTION ACTIVE</span>
        </div>
      </div>

      {/* Main Header Area */}
      <div style={{ padding: "24px", background: "var(--ov-bg-surface)", borderBottom: "1px solid var(--ov-border)", boxShadow: "var(--ov-shadow-sm)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "24px" }}>
          {/* Left Info */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <h1 style={{ fontSize: "36px", fontWeight: 800, margin: 0, color: "var(--ov-text-primary)", letterSpacing: "-0.03em" }}>{appName}</h1>
              <span style={{ background: "var(--ov-primary-muted)", color: "var(--ov-primary)", fontSize: "10px", fontWeight: 700, padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--ov-border-focus)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {app?.description || "Baxter RAG App"}
              </span>
              <span style={{ background: "var(--ov-bg-subtle)", color: "var(--ov-text-secondary)", fontSize: "10px", fontWeight: 600, padding: "4px 8px", borderRadius: "6px", letterSpacing: "0.05em" }}>
                v{app?.version || "2.8.4-build.912"}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--ov-status-healthy-bg)", color: "var(--ov-status-healthy)", fontSize: "10px", fontWeight: 700, padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--ov-status-healthy)", opacity: 0.8, letterSpacing: "0.05em" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--ov-status-healthy)" }} />
                PROD-US-EAST-1
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--ov-text-muted)" }}>
                <span style={{ color: "var(--ov-text-muted)", width: '16px' }}>👥</span> Team: <span style={{ color: "var(--ov-text-primary)" }}>{app?.owner || "AI Platform & Retrieval Ops"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--ov-text-muted)" }}>
                <span style={{ color: "var(--ov-text-muted)", width: '16px' }}>🚀</span> Last Deploy: <span style={{ color: "var(--ov-text-primary)", fontWeight: 600 }}>2h ago</span> via GitOps #8412
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--ov-text-muted)" }}>
                <span style={{ color: "#34d399", width: '16px' }}>🗘</span> Sync: <span style={{ color: "#34d399" }}>8s ago</span> (Docker Socket + S3 Parquet)
              </div>
            </div>
          </div>

          {/* Right Action Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "320px" }}>
            <div style={{ background: "var(--ov-bg-card)", border: "1px solid var(--ov-border)", borderRadius: "12px", boxShadow: "var(--ov-shadow-md)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: (healthData as any)?.health_score < 80 ? "var(--ov-status-warning)" : "#34d399", fontWeight: 700, fontSize: "14px", letterSpacing: "0.05em" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: (healthData as any)?.health_score < 80 ? "var(--ov-status-warning)" : "var(--ov-status-healthy)" }} />
                {(healthData as any)?.health_score ?? "98"}/100 {((healthData as any)?.health_state ?? "HEALTHY").toUpperCase()}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "10px", color: "var(--ov-text-muted)", fontWeight: 600, letterSpacing: "0.05em" }}>UPTIME SLA</div>
                <div style={{ fontSize: "13px", color: "var(--ov-text-primary)", fontFamily: "monospace" }}>{((healthData as any)?.uptime_percent * 100)?.toFixed(2) || "99.98"}% <span style={{ color: "#64748b" }}>(42d 14h)</span></div>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                onClick={handleHealthCheck}
                disabled={isChecking}
                style={{ 
                  flex: 1, 
                  padding: "8px 16px", 
                  background: isChecking ? "var(--ov-bg-hover)" : "var(--ov-btn-bg)", 
                  color: isChecking ? "var(--ov-text-muted)" : "var(--ov-btn-text)", 
                  border: "none", 
                  borderRadius: "6px", 
                  fontWeight: 600, 
                  fontSize: "12px", 
                  cursor: isChecking ? "not-allowed" : "pointer", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: "8px",
                  transition: "all 0.2s"
                }}
              >
                <span style={{ 
                  display: "inline-block",
                  animation: isChecking ? "spin 1s linear infinite" : "none" 
                }}>↻</span> 
                {isChecking ? "Checking Health..." : "Trigger Health Check"}
              </button>
              <button 
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(healthData || {}, null, 2));
                  const downloadAnchorNode = document.createElement('a');
                  downloadAnchorNode.setAttribute("href", dataStr);
                  downloadAnchorNode.setAttribute("download", `telemetry-${appId}.json`);
                  document.body.appendChild(downloadAnchorNode);
                  downloadAnchorNode.click();
                  downloadAnchorNode.remove();
                }}
                style={{ padding: "8px 16px", background: "var(--ov-bg-card)", color: "var(--ov-text-primary)", border: "1px solid var(--ov-border-strong)", boxShadow: "var(--ov-shadow-sm)", borderRadius: "6px", fontWeight: 600, fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span>📤</span> Export Telemetry
              </button>
              <button style={{ padding: "8px 12px", background: "var(--ov-bg-card)", color: "var(--ov-text-primary)", border: "1px solid var(--ov-border-strong)", boxShadow: "var(--ov-shadow-sm)", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v.01M12 12v.01M20 12v.01" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "8px", padding: "0 24px", overflowX: "auto", borderBottom: "1px solid var(--ov-border)", boxShadow: "var(--ov-shadow-sm)", background: "var(--ov-bg-surface)" }}>
        {APP_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                padding: "16px 20px",
                background: "transparent",
                border: "none",
                borderBottom: isActive ? "2px solid var(--ov-primary)" : "2px solid transparent",
                color: isActive ? "var(--ov-primary)" : "var(--ov-text-secondary)",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                whiteSpace: "nowrap",
                transition: "all 0.2s"
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.7, display: 'flex' }}><tab.icon size={16} /></span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Page Content */}
      <div style={{ padding: "24px", flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
