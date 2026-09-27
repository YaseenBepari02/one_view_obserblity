/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import MetricCard from "./MetricCard";
import UserDetailPage from "./UserDetailPage";

const EVENT_COLORS: Record<string, string> = {
  PAGE_VIEW: "#6366f1",
  API_CALL: "#06b6d4",
  LOGIN: "#22c55e",
  LOGOUT: "#f59e0b",
  EXPORT: "#8b5cf6",
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MOCK_ACTIVITY = {
  users: [
    { email: "anjali@baxter.com", name: "Anjali Sharma", role: "Senior Cloud DevOps Engineer", department: "Cloud Operations", approval_status: "approved", avatar: "AS", sessions_today: 3, total_duration_seconds: 4440, estimated_cost_usd: 24.24, top_resource: "/netra/settings/profile" },
    { email: "divya@baxter.com", name: "Divya Patel", role: "Cybersecurity & IAM Analyst", department: "Security & Compliance", approval_status: "pending", avatar: "DP", sessions_today: 1, total_duration_seconds: 600, estimated_cost_usd: 4.10, top_resource: "/netra/api/v1/auth" },
    { email: "praveen@baxter.com", name: "Praveen Kumar", role: "Principal Data Architect", department: "Data Analytics & ML", approval_status: "approved", avatar: "PK", sessions_today: 5, total_duration_seconds: 8200, estimated_cost_usd: 45.10, top_resource: "/netra/pipeline/status" },
    { email: "rahul@baxter.com", name: "Rahul Verma", role: "Data Pipeline Specialist", department: "Pipeline Engineering", approval_status: "approved", avatar: "RV", sessions_today: 4, total_duration_seconds: 5200, estimated_cost_usd: 35.80, top_resource: "/netra/pipeline/run" },
    { email: "suresh@baxter.com", name: "Suresh Nair", role: "Compliance & Audit Officer", department: "Governance & Regulatory", approval_status: "rejected", avatar: "SN", sessions_today: 0, total_duration_seconds: 0, estimated_cost_usd: 0, top_resource: "-" },
    { email: "yaseen@baxter.com", name: "Yaseen Bepari", role: "Lead Systems Engineer", department: "Platform & Observability", approval_status: "approved", avatar: "YB", sessions_today: 2, total_duration_seconds: 3600, estimated_cost_usd: 18.50, top_resource: "/netra/dashboard/overview" },
  ],
  active_sessions: 37,
  approved_count: 4,
  pending_count: 1,
  rejected_count: 1,
  total_api_cost_usd: 51.27,
  total_events: 12050,
  event_breakdown: [
    { event_type: "PAGE_VIEW", count: 6500 },
    { event_type: "API_CALL", count: 4200 },
    { event_type: "LOGIN", count: 850 },
    { event_type: "EXPORT", count: 500 },
  ],
  login_heatmap: Array.from({ length: 7 * 24 }, (_, i) => ({
    day: Math.floor(i / 24),
    hour: i % 24,
    count: Math.random() > 0.6 ? Math.floor(Math.random() * 20) : 0,
  }))
};

export default function UserActivityPanel() {
  const [activity, setActivity] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);
  const [updatingEmail, setUpdatingEmail] = useState<string | null>(null);
  const router = useRouter();

  const appId = "netra";

  const fetchData = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 400));
    setActivity(MOCK_ACTIVITY);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInlineApproval = async (
    e: React.MouseEvent,
    email: string,
    status: "approved" | "rejected"
  ) => {
    e.stopPropagation(); // prevent opening user detail view
    setUpdatingEmail(email);
    await new Promise(r => setTimeout(r, 600)); // Simulate API call
    setActivity((prev: any) => {
      if (!prev) return null;
      const updatedUsers = prev.users.map((u: any) =>
        u.email === email ? { ...u, approval_status: status } : u
      );
      const approvedCount = updatedUsers.filter((u: any) => u.approval_status === "approved").length;
      const pendingCount = updatedUsers.filter((u: any) => u.approval_status === "pending").length;
      const rejectedCount = updatedUsers.filter((u: any) => u.approval_status === "rejected").length;
      return {
        ...prev,
        users: updatedUsers,
        approved_count: approvedCount,
        pending_count: pendingCount,
        rejected_count: rejectedCount,
      };
    });
    setUpdatingEmail(null);
  };

  if (selectedUserEmail) {
    return (
      <UserDetailPage
        email={selectedUserEmail}
        onBack={() => setSelectedUserEmail(null)}
        onApprovalChanged={(email, status) => {
          setActivity((prev: any) => {
            if (!prev) return null;
            const updatedUsers = prev.users.map((u: any) =>
              u.email === email ? { ...u, approval_status: status } : u
            );
            return { ...prev, users: updatedUsers };
          });
        }}
      />
    );
  }

  if (loading && !activity) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-900/60 border border-slate-800 animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-slate-900/60 border border-slate-800 animate-pulse" />
      </div>
    );
  }

  if (!activity) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", background: "var(--ov-bg-page)" }}>
      <div style={{ padding: "24px", flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '16px' }}>
          {/* ─── Health Redirection Section ────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderRadius: '12px', border: '1px solid var(--ov-border)', background: 'var(--ov-bg-card)' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ov-text-primary)', margin: 0 }}>Want to see the health of the application?</h3>
              <p style={{ fontSize: '14px', marginTop: '4px', color: 'var(--ov-text-muted)' }}>Go back to the overview page to check primary infrastructure metrics and health scores.</p>
            </div>
            <button
              onClick={() => router.push(`/applications/${appId}/health`)}
              style={{
                padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                background: 'transparent', color: 'var(--ov-brand-primary)', border: '1px solid rgba(59, 130, 246, 0.3)'
              }}
            >
              View Health Overview &rarr;
            </button>
          </div>

          {/* ─── Summary Metric Cards ───────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <MetricCard
              title="Total Users"
              value={activity.users.length}
              subtitle="Registered accounts"
              color="#6366f1"
              delay={0}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              }
            />
            <MetricCard
              title="Active Sessions"
              value={activity.active_sessions}
              subtitle="Currently online"
              color="#22c55e"
              delay={0.05}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
            />
            <MetricCard
              title="Approved Access"
              value={activity.approved_count}
              subtitle="Full platform access"
              color="#22c55e"
              delay={0.1}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              }
            />
            <MetricCard
              title="Pending Approvals"
              value={activity.pending_count}
              subtitle="Requires admin review"
              color="#f59e0b"
              delay={0.15}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              }
            />
            <MetricCard
              title="Total API Cost"
              value={`$${activity.total_api_cost_usd?.toFixed(2)}`}
              subtitle="Cumulative usage (USD)"
              color="#06b6d4"
              delay={0.2}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              }
            />
          </div>

          {/* ─── Middle Section: Event Donut & Login Heatmap ───────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Event Breakdown Donut */}
            <div
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', border: '1px solid var(--ov-border)', background: 'var(--ov-bg-card)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ov-text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Event Type Breakdown</h4>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--ov-text-muted)' }}>{activity.total_events.toLocaleString()} events</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '160px', height: '160px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activity.event_breakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="count"
                        nameKey="event_type"
                      >
                        {activity.event_breakdown.map((entry: any) => (
                          <Cell
                            key={entry.event_type}
                            fill={EVENT_COLORS[entry.event_type] || "#64748b"}
                            stroke="transparent"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "var(--ov-bg-tooltip)",
                          border: "1px solid var(--ov-border)",
                          borderRadius: 8,
                          fontSize: 11,
                          color: "var(--ov-text-primary)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {activity.event_breakdown.map((entry: any) => {
                    const pct = activity.total_events
                      ? Math.round((entry.count / activity.total_events) * 100)
                      : 0;
                    return (
                      <div key={entry.event_type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{ width: '8px', height: '8px', borderRadius: '50%', background: EVENT_COLORS[entry.event_type] || "var(--ov-text-muted)" }}
                          />
                          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--ov-text-secondary)' }}>{entry.event_type}</span>
                        </div>
                        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--ov-text-muted)' }}>
                          {entry.count.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 7-Day Login Heatmap */}
            <div
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', border: '1px solid var(--ov-border)', background: 'var(--ov-bg-card)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ov-text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Login Heatmap (7 Days)</h4>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--ov-text-muted)' }}>Hour × Day Matrix</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <LoginHeatmap data={activity.login_heatmap} />
              </div>
            </div>
          </div>

          {/* ─── Per-User Management & Approvals Directory Table ───────────── */}
          <div
            style={{ borderRadius: '12px', border: '1px solid var(--ov-border)', overflow: 'hidden', background: 'var(--ov-bg-card)' }}
          >
            <div style={{ padding: '16px', borderBottom: '1px solid var(--ov-border)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ov-text-primary)', margin: 0 }}>User Directory & Platform Access Control</h4>
                <p style={{ fontSize: '12px', color: 'var(--ov-text-muted)', margin: '4px 0 0 0' }}>
                  Manage user approval status and click on any user to view detailed API cost and login history.
                </p>
              </div>
              <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--ov-text-muted)' }}>
                {activity.users.length} Registered Users
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', fontSize: '12px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr
                    style={{ borderBottom: '1px solid var(--ov-border)', background: 'var(--ov-bg-subtle)', color: 'var(--ov-text-muted)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    <th style={{ padding: '12px 16px' }}>User</th>
                    <th style={{ padding: '12px 16px' }}>Role & Department</th>
                    <th style={{ padding: '12px 16px' }}>Access Status</th>
                    <th style={{ padding: '12px 16px' }}>Admin Action</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>Sessions</th>
                    <th style={{ padding: '12px 16px' }}>Active Time</th>
                    <th style={{ padding: '12px 16px' }}>Est. API Cost</th>
                    <th style={{ padding: '12px 16px' }}>Top Resource</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Details</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--ov-text-secondary)' }}>
                  {activity.users.map((user: any, i: number) => {
                    const status = user.approval_status || "pending";
                    const isUpdating = updatingEmail === user.email;

                    const badge =
                      status === "approved"
                        ? { bg: "rgba(34, 197, 94, 0.15)", border: "rgba(34, 197, 94, 0.35)", text: "#4ade80", dot: "#22c55e", label: "APPROVED" }
                        : status === "rejected"
                          ? { bg: "rgba(239, 68, 68, 0.15)", border: "rgba(239, 68, 68, 0.35)", text: "#f87171", dot: "#ef4444", label: "REJECTED" }
                          : { bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.35)", text: "#fbbf24", dot: "#f59e0b", label: "PENDING" };

                    return (
                      <motion.tr
                        key={user.email}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => setSelectedUserEmail(user.email)}
                        style={{ borderTop: '1px solid var(--ov-border)', cursor: 'pointer' }}
                      >
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px',
                                background: "rgba(99, 102, 241, 0.2)",
                                color: "#818cf8",
                                border: "1px solid rgba(99, 102, 241, 0.3)",
                              }}
                            >
                              {user.avatar || user.email.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p style={{ fontWeight: 600, fontSize: '12px', color: 'var(--ov-text-primary)', margin: 0 }}>
                                {user.name || user.email.split("@")[0]}
                              </p>
                              <p style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--ov-text-muted)', margin: 0 }}>{user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <p style={{ fontWeight: 500, fontSize: '12px', color: 'var(--ov-text-secondary)', margin: 0 }}>{user.role || "Software Engineer"}</p>
                          <p style={{ fontSize: '10px', color: 'var(--ov-text-muted)', margin: 0 }}>{user.department || "Engineering"}</p>
                        </td>

                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
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
                        </td>

                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              onClick={(e) => handleInlineApproval(e, user.email, "approved")}
                              disabled={isUpdating || status === "approved"}
                              style={{
                                padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, cursor: 'pointer', opacity: (isUpdating || status === "approved") ? 0.3 : 1,
                                background: status === "approved" ? "rgba(34, 197, 94, 0.25)" : "rgba(34, 197, 94, 0.1)",
                                color: "#4ade80",
                                border: "1px solid rgba(34, 197, 94, 0.35)",
                              }}
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={(e) => handleInlineApproval(e, user.email, "rejected")}
                              disabled={isUpdating || status === "rejected"}
                              style={{
                                padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, cursor: 'pointer', opacity: (isUpdating || status === "rejected") ? 0.3 : 1,
                                background: status === "rejected" ? "rgba(239, 68, 68, 0.25)" : "rgba(239, 68, 68, 0.1)",
                                color: "#f87171",
                                border: "1px solid rgba(239, 68, 68, 0.35)",
                              }}
                            >
                              ✕ Reject
                            </button>
                          </div>
                        </td>

                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', textAlign: 'center', fontFamily: 'monospace', fontSize: '12px', fontWeight: 600, color: 'var(--ov-text-primary)' }}>
                          {user.sessions_today}
                        </td>

                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', fontSize: '12px', fontFamily: 'monospace', color: 'var(--ov-text-secondary)' }}>
                          {formatDuration(user.total_duration_seconds)}
                        </td>

                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold', color: '#22d3ee' }}>
                          ${user.estimated_cost_usd?.toFixed(2) || "24.50"}
                        </td>

                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              fontSize: '10px', fontFamily: 'monospace', padding: '2px 8px', borderRadius: '4px', background: '#1e293b', color: '#a5b4fc', display: 'inline-block', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                            }}
                            title={user.top_resource}
                          >
                            {user.top_resource || "-"}
                          </span>
                        </td>

                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#818cf8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            Analytics →
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

      function LoginHeatmap({data}: {data: {day: number; hour: number; count: number }[] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
      const hours = Array.from({length: 24 }, (_, i) => i);

      return (
      <div style={{ display: 'flex', gap: '4px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '8px', paddingTop: '20px' }}>
          {DAY_LABELS.map((d) => (
            <div key={d} style={{ height: '16px', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '9px', color: "var(--ov-text-muted)" }}>
                {d}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '2px' }}>
          {hours.map((hour) => (
            <div key={hour} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '8px', textAlign: 'center', marginBottom: '2px', color: "var(--ov-text-muted)" }}>
                {hour % 6 === 0 ? `${hour}h` : ""}
              </span>
              {DAY_LABELS.map((_, dayIndex) => {
                const cell = data.find((d) => d.day === dayIndex && d.hour === hour);
                const count = cell?.count || 0;
                const intensity = count / maxCount;

                return (
                  <div
                    key={`${dayIndex}-${hour}`}
                    style={{
                      width: '16px', height: '16px', borderRadius: '2px', cursor: 'default',
                      background:
                        count === 0
                          ? "rgba(255,255,255,0.02)"
                          : `rgba(99, 102, 241, ${0.15 + intensity * 0.85})`,
                      border: count > 0 ? "1px solid rgba(99, 102, 241, 0.2)" : "1px solid transparent",
                    }}
                    title={`${DAY_LABELS[dayIndex]} ${hour}:00 — ${count} logins`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      );
}

      function formatDuration(seconds: number): string {
  if (seconds === 0) return "0s";
      if (seconds < 60) return `${seconds}s`;
      const mins = Math.floor(seconds / 60);
      if (mins < 60) return `${mins}m`;
      const hrs = Math.floor(mins / 60);
      const remainMins = mins % 60;
      return `${hrs}h ${remainMins}m`;
}
