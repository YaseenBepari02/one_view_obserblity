/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Shield, ShieldCheck, ShieldAlert, KeyRound,
  Users, Clock, MapPin, Building2, Mail, Calendar,
  Monitor, Globe, Lock, Unlock, AlertTriangle, CheckCircle2,
  XCircle, Smartphone, Key, Fingerprint, ChevronRight,
  Activity, TrendingUp, Eye
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar, Cell
} from "recharts";

// ─── Entra ID User Details (Dummy) ────────────────────────────────────────
const ENTRA_USERS_MAP: Record<string, any> = {
  "usr-001": {
    id: "usr-001", objectId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    displayName: "Anjali Sharma", email: "anjali@baxter.com",
    userPrincipalName: "anjali@baxter.onmicrosoft.com",
    jobTitle: "Senior Cloud DevOps Engineer", department: "Cloud Operations",
    officeLocation: "Bangalore, India", companyName: "Baxter Technologies",
    accountEnabled: true, createdDateTime: "2024-03-20T09:15:00Z",
    lastSignInDateTime: "2026-10-10T14:23:00Z",
    lastNonInteractiveSignIn: "2026-10-10T15:01:00Z",
    lastPasswordChangeDateTime: "2026-08-15T10:00:00Z",
    mfaEnabled: true, mfaMethods: ["Microsoft Authenticator", "Phone (+91 ****1234)"],
    riskLevel: "none", riskState: "none", riskDetail: "No risk detected",
    assignedLicenses: ["Microsoft 365 E5", "Azure AD P2", "Intune"],
    avatar: "AS", manager: "Yaseen Bepari",
    groups: [
      { name: "Cloud-Ops-Team", type: "Security", memberCount: 12 },
      { name: "DevOps-Admins", type: "Microsoft 365", memberCount: 5 },
      { name: "All-Employees", type: "Distribution", memberCount: 156 },
      { name: "Azure-Contributors", type: "Security", memberCount: 23 },
    ],
    appRoleAssignments: [
      { appName: "OneView Monitor", role: "Admin", assignedDate: "2024-04-01" },
      { appName: "Azure Portal", role: "Contributor", assignedDate: "2024-03-20" },
      { appName: "GitHub Enterprise", role: "Member", assignedDate: "2024-05-15" },
    ],
    signInLogs: [
      { id: "si-001", timestamp: "2026-10-10T14:23:00Z", status: "Success", ipAddress: "49.37.142.88", location: "Bangalore, India", clientApp: "Browser (Chrome)", resource: "OneView Monitor", conditionalAccess: "Granted", riskLevel: "none" },
      { id: "si-002", timestamp: "2026-10-10T11:05:00Z", status: "Success", ipAddress: "49.37.142.88", location: "Bangalore, India", clientApp: "Mobile App", resource: "Microsoft Teams", conditionalAccess: "Granted", riskLevel: "none" },
      { id: "si-003", timestamp: "2026-10-09T18:42:00Z", status: "Success", ipAddress: "103.25.48.200", location: "Bangalore, India", clientApp: "Browser (Edge)", resource: "Azure Portal", conditionalAccess: "Granted", riskLevel: "none" },
      { id: "si-004", timestamp: "2026-10-09T09:15:00Z", status: "Failure", ipAddress: "185.92.71.44", location: "Amsterdam, NL", clientApp: "Browser (Firefox)", resource: "Microsoft 365", conditionalAccess: "Blocked", riskLevel: "medium" },
      { id: "si-005", timestamp: "2026-10-08T16:30:00Z", status: "Success", ipAddress: "49.37.142.88", location: "Bangalore, India", clientApp: "Desktop App", resource: "VS Code", conditionalAccess: "Granted", riskLevel: "none" },
      { id: "si-006", timestamp: "2026-10-08T08:00:00Z", status: "Success", ipAddress: "49.37.142.88", location: "Bangalore, India", clientApp: "Browser (Chrome)", resource: "Azure DevOps", conditionalAccess: "Granted", riskLevel: "none" },
      { id: "si-007", timestamp: "2026-10-07T14:20:00Z", status: "Interrupted", ipAddress: "49.37.142.88", location: "Bangalore, India", clientApp: "Browser (Chrome)", resource: "OneView Monitor", conditionalAccess: "MFA Required", riskLevel: "low" },
      { id: "si-008", timestamp: "2026-10-07T09:00:00Z", status: "Success", ipAddress: "49.37.142.88", location: "Bangalore, India", clientApp: "Mobile App", resource: "Outlook", conditionalAccess: "Granted", riskLevel: "none" },
    ],
    signInTrend: [
      { date: "Oct 4", success: 8, failed: 0 },
      { date: "Oct 5", success: 12, failed: 1 },
      { date: "Oct 6", success: 10, failed: 0 },
      { date: "Oct 7", success: 14, failed: 1 },
      { date: "Oct 8", success: 11, failed: 0 },
      { date: "Oct 9", success: 15, failed: 1 },
      { date: "Oct 10", success: 9, failed: 0 },
    ],
  },
  "usr-002": {
    id: "usr-002", objectId: "b2c3d4e5-f6a7-8901-bcde-f23456789012",
    displayName: "Divya Patel", email: "divya@baxter.com",
    userPrincipalName: "divya@baxter.onmicrosoft.com",
    jobTitle: "Cybersecurity & IAM Analyst", department: "Security & Compliance",
    officeLocation: "Mumbai, India", companyName: "Baxter Technologies",
    accountEnabled: true, createdDateTime: "2024-06-11T11:30:00Z",
    lastSignInDateTime: "2026-10-10T12:45:00Z",
    lastNonInteractiveSignIn: "2026-10-10T13:12:00Z",
    lastPasswordChangeDateTime: "2026-09-20T14:00:00Z",
    mfaEnabled: true, mfaMethods: ["Microsoft Authenticator", "FIDO2 Security Key"],
    riskLevel: "low", riskState: "atRisk", riskDetail: "Sign-in from unfamiliar location detected",
    assignedLicenses: ["Microsoft 365 E5", "Azure AD P2", "Defender for Identity"],
    avatar: "DP", manager: "Yaseen Bepari",
    groups: [
      { name: "Security-Team", type: "Security", memberCount: 8 },
      { name: "IAM-Admins", type: "Security", memberCount: 4 },
      { name: "SOC-Analysts", type: "Microsoft 365", memberCount: 6 },
    ],
    appRoleAssignments: [
      { appName: "Microsoft Defender", role: "Security Admin", assignedDate: "2024-06-15" },
      { appName: "Azure AD", role: "Identity Admin", assignedDate: "2024-06-11" },
    ],
    signInLogs: [
      { id: "si-101", timestamp: "2026-10-10T12:45:00Z", status: "Success", ipAddress: "103.50.12.77", location: "Mumbai, India", clientApp: "Browser (Chrome)", resource: "Azure AD", conditionalAccess: "Granted", riskLevel: "none" },
      { id: "si-102", timestamp: "2026-10-10T08:30:00Z", status: "Success", ipAddress: "103.50.12.77", location: "Mumbai, India", clientApp: "Desktop App", resource: "Microsoft Defender", conditionalAccess: "Granted", riskLevel: "none" },
      { id: "si-103", timestamp: "2026-10-09T22:15:00Z", status: "Success", ipAddress: "45.33.120.55", location: "Singapore", clientApp: "Browser (Chrome)", resource: "Azure Portal", conditionalAccess: "Granted", riskLevel: "low" },
    ],
    signInTrend: [
      { date: "Oct 4", success: 15, failed: 0 },
      { date: "Oct 5", success: 18, failed: 0 },
      { date: "Oct 6", success: 20, failed: 0 },
      { date: "Oct 7", success: 16, failed: 0 },
      { date: "Oct 8", success: 22, failed: 0 },
      { date: "Oct 9", success: 19, failed: 0 },
      { date: "Oct 10", success: 14, failed: 0 },
    ],
  },
};

// Generate a fallback user for any ID not in the map
function getUser(userId: string) {
  if (ENTRA_USERS_MAP[userId]) return ENTRA_USERS_MAP[userId];
  // Fallback dummy
  return {
    id: userId, objectId: `obj-${userId}`,
    displayName: "Unknown User", email: `user-${userId}@baxter.com`,
    userPrincipalName: `user-${userId}@baxter.onmicrosoft.com`,
    jobTitle: "Employee", department: "General",
    officeLocation: "India", companyName: "Baxter Technologies",
    accountEnabled: true, createdDateTime: "2024-01-01T00:00:00Z",
    lastSignInDateTime: "2026-10-01T10:00:00Z",
    lastNonInteractiveSignIn: "2026-10-01T12:00:00Z",
    lastPasswordChangeDateTime: "2026-06-01T00:00:00Z",
    mfaEnabled: true, mfaMethods: ["Microsoft Authenticator"],
    riskLevel: "none", riskState: "none", riskDetail: "No risk detected",
    assignedLicenses: ["Microsoft 365 E3"],
    avatar: "U", manager: "Admin",
    groups: [{ name: "All-Employees", type: "Distribution", memberCount: 156 }],
    appRoleAssignments: [],
    signInLogs: [],
    signInTrend: [
      { date: "Oct 4", success: 5, failed: 0 },
      { date: "Oct 5", success: 7, failed: 1 },
      { date: "Oct 6", success: 6, failed: 0 },
      { date: "Oct 7", success: 8, failed: 0 },
      { date: "Oct 8", success: 4, failed: 0 },
      { date: "Oct 9", success: 9, failed: 1 },
      { date: "Oct 10", success: 3, failed: 0 },
    ],
  };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function getRiskBadge(level: string) {
  const map: Record<string, { bg: string; border: string; text: string; icon: any; label: string }> = {
    none: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', text: '#4ade80', icon: CheckCircle2, label: 'No Risk' },
    low: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#fbbf24', icon: AlertTriangle, label: 'Low Risk' },
    medium: { bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)', text: '#fb923c', icon: AlertTriangle, label: 'Medium Risk' },
    high: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#f87171', icon: XCircle, label: 'High Risk' },
  };
  return map[level] || map.none;
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const user = getUser(userId);
  const risk = getRiskBadge(user.riskLevel);
  const RiskIcon = risk.icon;

  const totalSignIns = user.signInTrend.reduce((s: number, d: any) => s + d.success + d.failed, 0);
  const totalFailed = user.signInTrend.reduce((s: number, d: any) => s + d.failed, 0);
  const successRate = totalSignIns > 0 ? Math.round(((totalSignIns - totalFailed) / totalSignIns) * 100) : 100;

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ─── Back Button + Header ──────────────────────────────────── */}
      <div>
        <button
          onClick={() => router.push('/applications/netra/users')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'transparent',
            border: 'none', color: '#60a5fa', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            padding: '4px 0', marginBottom: '16px',
          }}
        >
          <ArrowLeft size={14} /> Back to User Directory
        </button>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)',
          borderRadius: '16px', padding: '24px 28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '16px',
              background: user.accountEnabled ? 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.1))' : 'rgba(100,116,139,0.15)',
              border: `1px solid ${user.accountEnabled ? 'rgba(59,130,246,0.3)' : 'rgba(100,116,139,0.3)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', fontWeight: 700,
              color: user.accountEnabled ? '#60a5fa' : '#94a3b8',
            }}>
              {user.avatar}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ov-text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                  {user.displayName}
                </h1>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '3px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700,
                  background: user.accountEnabled ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  color: user.accountEnabled ? '#4ade80' : '#f87171',
                  border: `1px solid ${user.accountEnabled ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor' }} />
                  {user.accountEnabled ? 'ACTIVE' : 'DISABLED'}
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '3px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700,
                  background: risk.bg, color: risk.text, border: `1px solid ${risk.border}`,
                }}>
                  <RiskIcon size={10} /> {risk.label}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--ov-text-secondary)', margin: 0 }}>
                {user.jobTitle} · {user.department}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px', fontSize: '11px', color: 'var(--ov-text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={10} /> {user.email}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={10} /> {user.officeLocation}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Building2 size={10} /> {user.companyName}</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', color: 'var(--ov-text-muted)' }}>
            <div style={{ fontFamily: 'monospace', marginBottom: '4px' }}>Object ID: {user.objectId}</div>
            <div>UPN: {user.userPrincipalName}</div>
            <div style={{ marginTop: '4px' }}>Manager: <span style={{ color: 'var(--ov-text-primary)', fontWeight: 600 }}>{user.manager}</span></div>
          </div>
        </div>
      </div>

      {/* ─── KPI Cards Row ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        <KpiCard label="Sign-ins (7d)" value={totalSignIns} icon={Activity} color="#3b82f6" />
        <KpiCard label="Success Rate" value={`${successRate}%`} icon={TrendingUp} color="#22c55e" />
        <KpiCard label="Failed Sign-ins" value={totalFailed} icon={XCircle} color="#ef4444" />
        <KpiCard label="MFA Methods" value={user.mfaMethods.length} icon={KeyRound} color="#a78bfa" />
        <KpiCard label="Assigned Groups" value={user.groups.length} icon={Users} color="#06b6d4" />
      </div>

      {/* ─── Sign-in Trend Chart + Identity Info ──────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '16px' }}>
        {/* Sign-in Trend */}
        <div style={{
          background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)',
          borderRadius: '12px', padding: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ov-text-primary)', margin: 0 }}>Sign-in Activity (7 Days)</h3>
              <p style={{ fontSize: '11px', color: 'var(--ov-text-muted)', margin: '4px 0 0 0' }}>Interactive and non-interactive sign-in events</p>
            </div>
            <span style={{ fontSize: '10px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', fontWeight: 700, height: 'fit-content' }}>
              Last 7 Days
            </span>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={user.signInTrend} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--ov-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--ov-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--ov-bg-tooltip)', border: '1px solid var(--ov-border)', borderRadius: 8 }}
                  itemStyle={{ color: 'var(--ov-text-primary)' }}
                />
                <Bar dataKey="success" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Successful" />
                <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Identity & Security Info */}
        <div style={{
          background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)',
          borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ov-text-primary)', margin: 0 }}>Identity & Security</h3>

          <InfoRow icon={Calendar} label="Account Created" value={new Date(user.createdDateTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} />
          <InfoRow icon={Clock} label="Last Interactive Sign-in" value={timeAgo(user.lastSignInDateTime)} />
          <InfoRow icon={Monitor} label="Last Non-interactive" value={timeAgo(user.lastNonInteractiveSignIn)} />
          <InfoRow icon={Lock} label="Last Password Change" value={new Date(user.lastPasswordChangeDateTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} />

          <div style={{ borderTop: '1px solid var(--ov-border)', paddingTop: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ov-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
              MFA Authentication Methods
            </div>
            {user.mfaEnabled ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {user.mfaMethods.map((method: string) => (
                  <div key={method} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--ov-text-primary)' }}>
                    {method.includes('Authenticator') && <Smartphone size={12} color="#4ade80" />}
                    {method.includes('FIDO2') && <Fingerprint size={12} color="#a78bfa" />}
                    {method.includes('Phone') && <Key size={12} color="#60a5fa" />}
                    {method}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#f87171' }}>
                <ShieldAlert size={14} /> No MFA methods registered
              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--ov-border)', paddingTop: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ov-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
              Assigned Licenses
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {user.assignedLicenses.map((lic: string) => (
                <span key={lic} style={{
                  fontSize: '10px', padding: '4px 10px', borderRadius: '6px',
                  background: 'var(--ov-bg-subtle)', color: 'var(--ov-text-secondary)',
                  border: '1px solid var(--ov-border)',
                }}>
                  {lic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Groups & App Roles ───────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Groups */}
        <div style={{
          background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)',
          borderRadius: '12px', overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ov-border)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ov-text-primary)', margin: 0 }}>Group Memberships</h3>
            <p style={{ fontSize: '11px', color: 'var(--ov-text-muted)', margin: '4px 0 0 0' }}>Security and Microsoft 365 groups from Entra ID</p>
          </div>
          <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {user.groups.map((g: any) => (
              <div key={g.name} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', borderRadius: '8px', background: 'var(--ov-bg-subtle)',
                border: '1px solid var(--ov-border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={14} color="#60a5fa" />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ov-text-primary)' }}>{g.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--ov-text-muted)' }}>{g.type} · {g.memberCount} members</div>
                  </div>
                </div>
                <ChevronRight size={14} color="var(--ov-text-muted)" />
              </div>
            ))}
          </div>
        </div>

        {/* App Role Assignments */}
        <div style={{
          background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)',
          borderRadius: '12px', overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ov-border)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ov-text-primary)', margin: 0 }}>Application Role Assignments</h3>
            <p style={{ fontSize: '11px', color: 'var(--ov-text-muted)', margin: '4px 0 0 0' }}>Enterprise apps this user has access to</p>
          </div>
          <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {user.appRoleAssignments.length > 0 ? user.appRoleAssignments.map((app: any) => (
              <div key={app.appName} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', borderRadius: '8px', background: 'var(--ov-bg-subtle)',
                border: '1px solid var(--ov-border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Globe size={14} color="#a78bfa" />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ov-text-primary)' }}>{app.appName}</div>
                    <div style={{ fontSize: '10px', color: 'var(--ov-text-muted)' }}>Role: {app.role} · Since {app.assignedDate}</div>
                  </div>
                </div>
                <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(167,139,250,0.1)', color: '#a78bfa', fontWeight: 700 }}>
                  {app.role}
                </span>
              </div>
            )) : (
              <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--ov-text-muted)' }}>
                No application role assignments found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Sign-in Audit Logs Table ─────────────────────────────── */}
      <div style={{
        background: 'var(--ov-bg-card)', border: '1px solid var(--ov-border)',
        borderRadius: '12px', overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ov-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ov-text-primary)', margin: 0 }}>Sign-in Audit Logs</h3>
            <p style={{ fontSize: '11px', color: 'var(--ov-text-muted)', margin: '4px 0 0 0' }}>
              Detailed sign-in events from Azure AD including conditional access policies and risk detection
            </p>
          </div>
          <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--ov-text-muted)' }}>
            {user.signInLogs.length} events
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', fontSize: '12px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid var(--ov-border)', background: 'var(--ov-bg-subtle)',
                color: 'var(--ov-text-muted)', fontSize: '10px', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                <th style={{ padding: '10px 16px' }}>Status</th>
                <th style={{ padding: '10px 16px' }}>Timestamp</th>
                <th style={{ padding: '10px 16px' }}>Resource</th>
                <th style={{ padding: '10px 16px' }}>Client App</th>
                <th style={{ padding: '10px 16px' }}>IP Address</th>
                <th style={{ padding: '10px 16px' }}>Location</th>
                <th style={{ padding: '10px 16px' }}>Conditional Access</th>
                <th style={{ padding: '10px 16px' }}>Risk</th>
              </tr>
            </thead>
            <tbody>
              {user.signInLogs.map((log: any) => {
                const statusColor = log.status === 'Success' ? '#4ade80' : log.status === 'Failure' ? '#f87171' : '#fbbf24';
                const statusBg = log.status === 'Success' ? 'rgba(34,197,94,0.1)' : log.status === 'Failure' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)';
                const logRisk = getRiskBadge(log.riskLevel);

                return (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--ov-border)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        padding: '3px 10px', borderRadius: '9999px', fontSize: '10px', fontWeight: 700,
                        background: statusBg, color: statusColor,
                      }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor' }} />
                        {log.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '12px', color: 'var(--ov-text-primary)', fontWeight: 500 }}>
                        {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--ov-text-muted)' }}>
                        {new Date(log.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--ov-text-primary)', fontWeight: 500 }}>
                      {log.resource}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '11px', color: 'var(--ov-text-secondary)' }}>
                      {log.clientApp}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '11px', fontFamily: 'monospace', color: '#60a5fa' }}>
                      {log.ipAddress}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '11px', color: 'var(--ov-text-secondary)' }}>
                      {log.location}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: '10px', padding: '3px 8px', borderRadius: '4px', fontWeight: 600,
                        background: log.conditionalAccess === 'Granted' ? 'rgba(34,197,94,0.1)' : log.conditionalAccess === 'Blocked' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                        color: log.conditionalAccess === 'Granted' ? '#4ade80' : log.conditionalAccess === 'Blocked' ? '#f87171' : '#fbbf24',
                      }}>
                        {log.conditionalAccess}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: '10px', padding: '3px 8px', borderRadius: '4px', fontWeight: 600,
                        background: logRisk.bg, color: logRisk.text,
                      }}>
                        {logRisk.label.replace(' Risk', '')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-Components ───────────────────────────────────────────────────────

function KpiCard({ label, value, icon: Icon, color }: { label: string; value: any; icon: any; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '16px', borderRadius: '12px', border: '1px solid var(--ov-border)',
        background: 'var(--ov-bg-card)', position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', right: '-8px', bottom: '-10px', opacity: 0.04, pointerEvents: 'none' }}>
        <Icon size={56} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={14} color={color} />
        </div>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ov-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--ov-text-primary)' }}>
        {value}
      </div>
    </motion.div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--ov-text-muted)' }}>
        <Icon size={12} /> {label}
      </div>
      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ov-text-primary)' }}>{value}</span>
    </div>
  );
}
