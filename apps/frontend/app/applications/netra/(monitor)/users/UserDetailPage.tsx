/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UserDetailPageProps {
  email: string;
  onBack: () => void;
  onApprovalChanged?: (email: string, status: "approved" | "pending" | "rejected") => void;
}

const MOCK_DETAIL = {
  profile: {
    name: "Anjali Sharma",
    role: "Senior Cloud DevOps Engineer",
    department: "Cloud Operations",
    joined_date: "2024-03-20",
    avatar: "AS"
  },
  approval_status: "approved",
  metrics: {
    total_cost_usd: 24.24,
    success_rate: 80.8,
    total_api_calls: 21,
    total_events: 52,
    total_sessions: 11,
    total_duration_seconds: 4440,
    total_bytes_transferred: 4708106,
    total_exports: 2,
  },
  cost_timeline: [
    { date: '2026-09-19', cost_usd: 0.1 },
    { date: '2026-09-20', cost_usd: 0.1 },
    { date: '2026-09-21', cost_usd: 0.2 },
    { date: '2026-09-22', cost_usd: 1.1 },
    { date: '2026-09-23', cost_usd: 0.9 },
    { date: '2026-09-24', cost_usd: 4.5 },
    { date: '2026-09-25', cost_usd: 5.0 },
    { date: '2026-09-26', cost_usd: 3.5 },
  ],
  resource_breakdown: [
    { resource: '/netra/settings/profile', cost_usd: 5.12, calls: 12, bytes_transferred: 1015500 },
    { resource: '/netra/api/v1/metrics', cost_usd: 4.00, calls: 7, bytes_transferred: 862617 },
    { resource: '/netra/pipeline/status', cost_usd: 1.85, calls: 9, bytes_transferred: 648396 },
    { resource: '/netra/dashboard/overview', cost_usd: 0.92, calls: 5, bytes_transferred: 408780 },
    { resource: '/netra/api/v1/data', cost_usd: 0.91, calls: 3, bytes_transferred: 153600 },
  ],
  session_history: [
    { status: 'Active', login_time: '2026-09-26T04:13:29', last_activity: '2026-09-26T13:35:53', duration_seconds: 4440, ip_address: '10.29.9.184', api_calls: 21, pages_viewed: 12, session_id: 'sess-2a6fe53c' },
    { status: 'Completed', login_time: '2026-09-25T17:32:01', last_activity: '2026-09-25T15:32:57', duration_seconds: 136, ip_address: '10.27.2.231', api_calls: 1, pages_viewed: 0, session_id: 'sess-5b100c96' },
  ],
  recent_logs: [
    { event_type: "API_CALL", timestamp: "2026-09-26T13:35:53", resource: "/netra/api/v1/metrics", status_code: 200, bytes_transferred: 12340 },
    { event_type: "LOGIN", timestamp: "2026-09-26T04:13:29", resource: "/auth/login", status_code: 200, bytes_transferred: 520 },
  ]
};

export default function UserDetailPage({
  email,
  onBack,
  onApprovalChanged,
}: UserDetailPageProps) {
  const [detail, setDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchDetail = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    setDetail({ ...MOCK_DETAIL, profile: { ...MOCK_DETAIL.profile, name: email.split("@")[0] } });
    setLoading(false);
  };

  useEffect(() => {
    fetchDetail();
  }, [email]);

  const handleApprovalAction = async (status: "approved" | "pending" | "rejected") => {
    setUpdating(true);
    await new Promise(r => setTimeout(r, 600));
    setDetail((prev: any) => (prev ? { ...prev, approval_status: status } : null));
    onApprovalChanged?.(email, status);
    setToastMessage(`User status updated to ${status.toUpperCase()}`);
    setTimeout(() => setToastMessage(null), 3500);
    setUpdating(false);
  };

  if (loading && !detail) {
    return (
      <div className="space-y-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          ← Back to Users Directory
        </button>
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse h-44" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-900/60 border border-slate-800 animate-pulse" />
          ))}
        </div>
        <div className="h-72 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p>User not found</p>
        <button onClick={onBack} className="mt-4 text-xs text-indigo-400 underline">
          ← Back to Users Directory
        </button>
      </div>
    );
  }

  const { profile, metrics, approval_status, cost_timeline, resource_breakdown, session_history, recent_logs } = detail;

  const statusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return {
          bg: "rgba(34, 197, 94, 0.15)",
          border: "rgba(34, 197, 94, 0.35)",
          text: "#4ade80",
          label: "ACCESS APPROVED",
          dot: "#22c55e",
        };
      case "rejected":
        return {
          bg: "rgba(239, 68, 68, 0.15)",
          border: "rgba(239, 68, 68, 0.35)",
          text: "#f87171",
          label: "ACCESS REJECTED",
          dot: "#ef4444",
        };
      default:
        return {
          bg: "rgba(245, 158, 11, 0.15)",
          border: "rgba(245, 158, 11, 0.35)",
          text: "#fbbf24",
          label: "APPROVAL PENDING",
          dot: "#f59e0b",
        };
    }
  };

  const badge = statusBadge(approval_status);
  const color = "#6366f1";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '16px' }}>
      {/* ─── Back Navigation & Toast ──────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--ov-border)', background: 'transparent', color: "var(--ov-text-muted)", cursor: 'pointer' }}
        >
          <span>← Back to Users Directory</span>
        </button>

        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontFamily: 'monospace', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.4)' }}
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Profile Header Banner ────────────────────────────────────── */}
      <div
        style={{
          padding: '24px', borderRadius: '16px', border: '1px solid var(--ov-border)', position: 'relative', overflow: 'hidden', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px',
          background: "var(--ov-bg-card)",
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', border: `1px solid ${color}50`, textTransform: 'uppercase', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              background: `linear-gradient(135deg, ${color}30, rgba(99, 102, 241, 0.2))`,
              color: color,
            }}
          >
            {profile.avatar}
          </div>

          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--ov-text-primary)', margin: 0 }}>{profile.name}</h3>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '2px 10px', borderRadius: '9999px', fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace',
                  background: badge.bg,
                  border: `1px solid ${badge.border}`,
                  color: badge.text,
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: badge.dot }} />
                {badge.label}
              </span>
            </div>

            <p style={{ fontSize: '12px', fontWeight: 500, color: "var(--ov-text-muted)", margin: 0 }}>
              {profile.role} · <span>{profile.department}</span>
            </p>
            <p style={{ fontSize: '11px', fontFamily: 'monospace', marginTop: '2px', color: "var(--ov-text-muted)", margin: '2px 0 0 0' }}>
              {email} · Member since {profile.joined_date}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--ov-border)' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, fontFamily: 'monospace', letterSpacing: '0.05em', color: "var(--ov-text-muted)" }}>
            Admin Action:
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => handleApprovalAction("approved")}
              disabled={updating || approval_status === "approved"}
              style={{
                flex: 1, padding: '8px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', opacity: (updating || approval_status === "approved") ? 0.4 : 1,
                background: approval_status === "approved" ? "rgba(34, 197, 94, 0.2)" : "rgba(34, 197, 94, 0.12)",
                color: "#4ade80",
                border: "1px solid rgba(34, 197, 94, 0.35)",
              }}
            >
              <span>✓</span>
              <span>Approve Access</span>
            </button>

            <button
              onClick={() => handleApprovalAction("rejected")}
              disabled={updating || approval_status === "rejected"}
              style={{
                flex: 1, padding: '8px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', opacity: (updating || approval_status === "rejected") ? 0.4 : 1,
                background: approval_status === "rejected" ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.12)",
                color: "#f87171",
                border: "1px solid rgba(239, 68, 68, 0.35)",
              }}
            >
              <span>✕</span>
              <span>Reject Access</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 4 Top Metric Cards ───────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div
          style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--ov-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', background: "var(--ov-bg-card)" }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#a5b4fc' }}>Total API Cost</span>
              <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#818cf8', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                USD
              </span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '30px', fontWeight: 800, fontFamily: 'monospace', color: 'var(--ov-text-primary)', letterSpacing: '-0.025em' }}>
              ${metrics.total_cost_usd.toFixed(2)}
            </div>
          </div>
          <p style={{ fontSize: '10px', marginTop: '8px', fontFamily: 'monospace', color: "var(--ov-text-muted)", margin: 0 }}>
            Avg ${(metrics.total_cost_usd / Math.max(1, metrics.total_sessions)).toFixed(2)} per session
          </p>
        </div>

        <div
          style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--ov-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: "var(--ov-bg-card)" }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: "var(--ov-text-muted)" }}>Total API Calls</span>
              <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#34d399', fontWeight: 'bold' }}>
                {metrics.success_rate}% success
              </span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '30px', fontWeight: 800, fontFamily: 'monospace', color: '#f1f5f9', letterSpacing: '-0.025em' }}>
              {metrics.total_api_calls.toLocaleString()}
            </div>
          </div>
          <p style={{ fontSize: '10px', marginTop: '8px', fontFamily: 'monospace', color: "var(--ov-text-muted)", margin: 0 }}>
            {metrics.total_events} total telemetry events
          </p>
        </div>

        <div
          style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--ov-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: "var(--ov-bg-card)" }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: "var(--ov-text-muted)" }}>Total Login Sessions</span>
              <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#22d3ee', fontWeight: 'bold' }}>Active user</span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '30px', fontWeight: 800, fontFamily: 'monospace', color: '#f1f5f9', letterSpacing: '-0.025em' }}>
              {metrics.total_sessions}
            </div>
          </div>
          <p style={{ fontSize: '10px', marginTop: '8px', fontFamily: 'monospace', color: "var(--ov-text-muted)", margin: 0 }}>
            Total active time: {Math.round(metrics.total_duration_seconds / 60)} mins
          </p>
        </div>

        <div
          style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--ov-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: "var(--ov-bg-card)" }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: "var(--ov-text-muted)" }}>Data Transferred</span>
              <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#c084fc', fontWeight: 'bold' }}>Network</span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '30px', fontWeight: 800, fontFamily: 'monospace', color: '#f1f5f9', letterSpacing: '-0.025em' }}>
              {(metrics.total_bytes_transferred / (1024 * 1024)).toFixed(2)}
              <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '4px', color: "var(--ov-text-muted)" }}>MB</span>
            </div>
          </div>
          <p style={{ fontSize: '10px', marginTop: '8px', fontFamily: 'monospace', color: "var(--ov-text-muted)", margin: 0 }}>
            {metrics.total_exports} report exports generated
          </p>
        </div>
      </div>

      {/* ─── API Cost Trend & Resource Breakdown Grid ─────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div
          style={{ gridColumn: '1 / span 2', padding: '20px', borderRadius: '16px', border: '1px solid var(--ov-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: "var(--ov-bg-card)" }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ov-text-primary)', margin: 0 }}>API Cost & Usage Trend ($ USD)</h4>
              <p style={{ fontSize: '11px', color: "var(--ov-text-muted)", margin: '4px 0 0 0' }}>Daily cost accumulation based on pipeline executions</p>
            </div>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#818cf8', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              {cost_timeline.length} Days Window
            </span>
          </div>

          <div style={{ height: '256px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cost_timeline} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="var(--ov-text-muted)" tick={{ fontSize: 10 }} />
                <YAxis stroke="var(--ov-text-muted)" tick={{ fontSize: 10 }} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  contentStyle={{ background: "var(--ov-bg-tooltip)", border: "1px solid var(--ov-border)", borderRadius: 8, fontSize: 11, color: "var(--ov-text-primary)" }}
                  formatter={(val: any) => [`$${Number(val || 0).toFixed(2)}`, "Cost USD"]}
                />
                <Area type="monotone" dataKey="cost_usd" stroke="#818cf8" strokeWidth={2} fill="url(#costGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--ov-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: "var(--ov-bg-card)" }}
        >
          <div style={{ marginBottom: '12px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ov-text-primary)', margin: 0 }}>Cost by Pipeline Resource</h4>
            <p style={{ fontSize: '11px', color: "var(--ov-text-muted)", margin: '4px 0 0 0' }}>Endpoints generating the highest API cost</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '256px', paddingRight: '4px' }}>
            {resource_breakdown.length === 0 ? (
              <p style={{ fontSize: '12px', textAlign: 'center', padding: '24px 0', color: "var(--ov-text-muted)" }}>No resource telemetry recorded</p>
            ) : (
              resource_breakdown.map((res: any, i: number) => {
                const maxCost = resource_breakdown[0]?.cost_usd || 1;
                const pct = Math.min(100, (res.cost_usd / maxCost) * 100);

                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'monospace' }}>
                      <span style={{ color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }} title={res.resource}>
                        {res.resource}
                      </span>
                      <span style={{ color: '#a5b4fc', fontWeight: 'bold' }}>${res.cost_usd.toFixed(2)}</span>
                    </div>

                    <div style={{ height: '6px', width: '100%', borderRadius: '9999px', overflow: 'hidden', background: "rgba(255,255,255,0.05)" }}>
                      <div
                        style={{ height: '100%', background: '#6366f1', borderRadius: '9999px', width: `${pct}%` }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'monospace', color: "var(--ov-text-muted)" }}>
                      <span>{res.calls} calls</span>
                      <span>{(res.bytes_transferred / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ─── Total Login Times & Session History Details ───────────────── */}
      <div
        style={{ borderRadius: '16px', border: '1px solid var(--ov-border)', overflow: 'hidden', background: "var(--ov-bg-card)" }}
      >
        <div style={{ padding: '16px', borderBottom: '1px solid var(--ov-border)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ov-text-primary)', margin: 0 }}>Total Login Times & Session Details</h4>
            <p style={{ fontSize: '11px', color: "var(--ov-text-muted)", margin: '4px 0 0 0' }}>Complete audit trail of user logins, session durations, and client IPs</p>
          </div>
          <span style={{ fontSize: '12px', fontFamily: 'monospace', color: "var(--ov-text-muted)" }}>
            Total {session_history.length} Sessions Logged
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', fontSize: '12px', borderCollapse: 'collapse' }}>
            <thead>
              <tr
                style={{ borderBottom: '1px solid var(--ov-border)', background: 'rgba(255,255,255,0.02)', color: "var(--ov-text-muted)", fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Login Time</th>
                <th style={{ padding: '12px 16px' }}>Last Activity</th>
                <th style={{ padding: '12px 16px' }}>Session Duration</th>
                <th style={{ padding: '12px 16px' }}>IP Address</th>
                <th style={{ padding: '12px 16px' }}>Telemetry</th>
                <th style={{ padding: '12px 16px' }}>Session ID</th>
              </tr>
            </thead>
            <tbody style={{ color: '#cbd5e1', fontFamily: 'monospace', fontSize: '11px' }}>
              {session_history.map((s: any, idx: number) => (
                <tr key={idx} style={{ borderTop: idx !== 0 ? '1px solid var(--ov-border)' : 'none' }}>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '2px 8px', borderRadius: '9999px', fontSize: '10px', fontWeight: 'bold',
                      background: s.status === "Active" ? "rgba(16, 185, 129, 0.15)" : "rgba(30, 41, 59, 1)",
                      color: s.status === "Active" ? "#34d399" : "#94a3b8",
                      border: `1px solid ${s.status === "Active" ? "rgba(16, 185, 129, 0.3)" : "rgba(51, 65, 85, 1)"}`
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.status === "Active" ? "#34d399" : "#64748b" }} />
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', color: '#e2e8f0' }}>
                    {new Date(s.login_time).toLocaleTimeString()}
                    <span style={{ display: 'block', fontSize: '10px', marginTop: '2px', color: "var(--ov-text-muted)" }}>
                      {new Date(s.login_time).toLocaleDateString()}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', color: "var(--ov-text-muted)" }}>
                    {new Date(s.last_activity).toLocaleTimeString()}
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', fontWeight: 'bold', color: '#e2e8f0' }}>
                    {s.duration_seconds < 60
                      ? `${s.duration_seconds}s`
                      : `${Math.floor(s.duration_seconds / 60)}m ${s.duration_seconds % 60}s`}
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', color: '#22d3ee' }}>{s.ip_address}</td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', color: "var(--ov-text-muted)" }}>
                    <span style={{ color: '#818cf8', fontWeight: 'bold' }}>{s.api_calls}</span> API ·{" "}
                    <span style={{ color: '#cbd5e1' }}>{s.pages_viewed}</span> Views
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px', color: "var(--ov-text-muted)" }} title={s.session_id}>
                    {s.session_id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
