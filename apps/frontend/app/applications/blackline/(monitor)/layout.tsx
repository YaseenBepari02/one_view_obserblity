"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import type { Application } from "@/types";

const APP_TABS = [
  { id: "overview", label: "Overview", icon: "❖" },
  { id: "health", label: "Health Monitor", icon: "∿" },
  { id: "logs", label: "Logs", icon: "≡" },
  { id: "users", label: "Users & Sessions", icon: "👥" },
  { id: "api-usage", label: "API Usage", icon: "◎" },
  { id: "cost", label: "Token & Cost", icon: "⛁" },
  { id: "rag-analytics", label: "RAG Analytics", icon: "⎈" },
  { id: "infrastructure", label: "Infrastructure", icon: "🖧" },
  { id: "alerts", label: "Alerts", icon: "🔔" },
];

export default function ApplicationLayout({ children }: { children: React.ReactNode }) {
  
  const router = useRouter();
  const pathname = usePathname();
  const appId = "blackline";

  const { data: app, isLoading } = useQuery<Application>({
    queryKey: ["application", appId],
    queryFn: () => api.get(`/applications/${appId}`),
  });

  // Determine active tab based on pathname
  let activeTab = "overview";
  for (const tab of APP_TABS) {
    if (tab.id !== "overview" && pathname.includes(`/${tab.id}`)) {
      activeTab = tab.id;
      break;
    }
  }

  const handleTabChange = (tabId: string) => {
    if (tabId === "overview") {
      router.push(`/applications/${appId}`);
    } else {
      router.push(`/applications/${appId}/${tabId}`);
    }
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "11px", fontFamily: "monospace", color: "var(--ov-text-muted)" }}>
          <button 
            onClick={() => router.push('/applications')}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", padding: 0 }}
          >
            <span style={{ fontSize: '14px' }}>←</span> Applications
          </button>
          <span>/</span>
          <span style={{ color: "var(--ov-text-primary)", fontWeight: 600, fontSize: '12px' }}>{appName}</span>
          <span style={{ background: "rgba(30, 58, 138, 0.3)", color: "#60a5fa", padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(59, 130, 246, 0.2)", letterSpacing: "0.05em" }}>
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
      <div style={{ padding: "24px", background: "linear-gradient(to bottom, rgba(15, 23, 42, 0.6), transparent)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "24px" }}>
          {/* Left Info */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <h1 style={{ fontSize: "36px", fontWeight: 800, margin: 0, color: "var(--ov-text-primary)", letterSpacing: "-0.03em" }}>{appName}</h1>
              <span style={{ background: "rgba(139, 92, 246, 0.15)", color: "#c084fc", fontSize: "10px", fontWeight: 700, padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(139, 92, 246, 0.3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {app?.description || "Baxter RAG App"}
              </span>
              <span style={{ background: "rgba(255,255,255,0.1)", color: "#e2e8f0", fontSize: "10px", fontWeight: 600, padding: "4px 8px", borderRadius: "4px", letterSpacing: "0.05em" }}>
                v{app?.version || "2.8.4-build.912"}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(16, 185, 129, 0.1)", color: "#34d399", fontSize: "10px", fontWeight: 700, padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(16, 185, 129, 0.2)", letterSpacing: "0.05em" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34d399" }} />
                PROD-US-EAST-1
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--ov-text-muted)" }}>
                <span style={{ color: "#cbd5e1", width: '16px' }}>👥</span> Team: <span style={{ color: "var(--ov-text-primary)" }}>{app?.owner || "AI Platform & Retrieval Ops"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--ov-text-muted)" }}>
                <span style={{ color: "#cbd5e1", width: '16px' }}>🚀</span> Last Deploy: <span style={{ color: "var(--ov-text-primary)", fontWeight: 600 }}>2h ago</span> via GitOps #8412
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--ov-text-muted)" }}>
                <span style={{ color: "#34d399", width: '16px' }}>🗘</span> Sync: <span style={{ color: "#34d399" }}>8s ago</span> (Docker Socket + S3 Parquet)
              </div>
            </div>
          </div>

          {/* Right Action Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "320px" }}>
            <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid var(--ov-border)", borderRadius: "8px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#34d399", fontWeight: 700, fontSize: "14px", letterSpacing: "0.05em" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399" }} />
                98/100 HEALTHY
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "10px", color: "var(--ov-text-muted)", fontWeight: 600, letterSpacing: "0.05em" }}>UPTIME SLA</div>
                <div style={{ fontSize: "13px", color: "var(--ov-text-primary)", fontFamily: "monospace" }}>99.98% <span style={{ color: "#64748b" }}>(42d 14h)</span></div>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ flex: 1, padding: "8px 16px", background: "white", color: "#0f172a", border: "none", borderRadius: "6px", fontWeight: 600, fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <span>↻</span> Trigger Health Check
              </button>
              <button style={{ padding: "8px 16px", background: "rgba(255,255,255,0.05)", color: "var(--ov-text-primary)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", fontWeight: 600, fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>📤</span> Export Telemetry
              </button>
              <button style={{ padding: "8px 12px", background: "rgba(255,255,255,0.05)", color: "var(--ov-text-primary)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v.01M12 12v.01M20 12v.01" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "8px", padding: "0 24px", overflowX: "auto", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(15, 23, 42, 0.4)" }}>
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
                borderBottom: isActive ? "2px solid #38bdf8" : "2px solid transparent",
                color: isActive ? "white" : "#94a3b8",
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
              <span style={{ opacity: isActive ? 1 : 0.7 }}>{tab.icon}</span>
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
