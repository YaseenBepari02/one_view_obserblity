/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users, Shield, ShieldAlert, ShieldCheck, KeyRound,
  Search, Filter, ChevronDown, ExternalLink, Clock,
  UserCheck, UserX, AlertTriangle, CheckCircle2, XCircle
} from "lucide-react";

// ─── Microsoft Entra ID Dummy Data ─────────────────────────────────────────
const ENTRA_USERS = [
  {
    id: "usr-001",
    displayName: "Anjali Sharma",
    email: "anjali@baxter.com",
    userPrincipalName: "anjali@baxter.onmicrosoft.com",
    jobTitle: "Senior Cloud DevOps Engineer",
    department: "Cloud Operations",
    officeLocation: "Bangalore, India",
    accountEnabled: true,
    createdDateTime: "2024-03-20T09:15:00Z",
    lastSignInDateTime: "2026-10-10T14:23:00Z",
    lastNonInteractiveSignIn: "2026-10-10T15:01:00Z",
    mfaEnabled: true,
    mfaMethods: ["Microsoft Authenticator", "Phone"],
    riskLevel: "none",
    riskState: "none",
    assignedLicenses: ["Microsoft 365 E5", "Azure AD P2"],
    groups: ["Cloud-Ops-Team", "DevOps-Admins", "All-Employees"],
    signInCount30d: 87,
    failedSignIns30d: 2,
    avatar: "AS",
  },
  {
    id: "usr-002",
    displayName: "Divya Patel",
    email: "divya@baxter.com",
    userPrincipalName: "divya@baxter.onmicrosoft.com",
    jobTitle: "Cybersecurity & IAM Analyst",
    department: "Security & Compliance",
    officeLocation: "Mumbai, India",
    accountEnabled: true,
    createdDateTime: "2024-06-11T11:30:00Z",
    lastSignInDateTime: "2026-10-10T12:45:00Z",
    lastNonInteractiveSignIn: "2026-10-10T13:12:00Z",
    mfaEnabled: true,
    mfaMethods: ["Microsoft Authenticator", "FIDO2 Key"],
    riskLevel: "low",
    riskState: "atRisk",
    assignedLicenses: ["Microsoft 365 E5", "Azure AD P2", "Defender for Identity"],
    groups: ["Security-Team", "IAM-Admins", "SOC-Analysts"],
    signInCount30d: 124,
    failedSignIns30d: 0,
    avatar: "DP",
  },
  {
    id: "usr-003",
    displayName: "Praveen Kumar",
    email: "praveen@baxter.com",
    userPrincipalName: "praveen@baxter.onmicrosoft.com",
    jobTitle: "Principal Data Architect",
    department: "Data Analytics & ML",
    officeLocation: "Hyderabad, India",
    accountEnabled: true,
    createdDateTime: "2023-11-05T08:00:00Z",
    lastSignInDateTime: "2026-10-09T18:30:00Z",
    lastNonInteractiveSignIn: "2026-10-10T02:00:00Z",
    mfaEnabled: true,
    mfaMethods: ["Microsoft Authenticator"],
    riskLevel: "none",
    riskState: "none",
    assignedLicenses: ["Microsoft 365 E5", "Power BI Pro"],
    groups: ["Data-Team", "ML-Engineers", "All-Employees"],
    signInCount30d: 145,
    failedSignIns30d: 5,
    avatar: "PK",
  },
  {
    id: "usr-004",
    displayName: "Rahul Verma",
    email: "rahul@baxter.com",
    userPrincipalName: "rahul@baxter.onmicrosoft.com",
    jobTitle: "Data Pipeline Specialist",
    department: "Pipeline Engineering",
    officeLocation: "Pune, India",
    accountEnabled: true,
    createdDateTime: "2024-01-15T10:00:00Z",
    lastSignInDateTime: "2026-10-10T09:14:00Z",
    lastNonInteractiveSignIn: "2026-10-10T11:45:00Z",
    mfaEnabled: false,
    mfaMethods: [],
    riskLevel: "medium",
    riskState: "atRisk",
    assignedLicenses: ["Microsoft 365 E3"],
    groups: ["Pipeline-Team", "All-Employees"],
    signInCount30d: 63,
    failedSignIns30d: 12,
    avatar: "RV",
  },
  {
    id: "usr-005",
    displayName: "Suresh Nair",
    email: "suresh@baxter.com",
    userPrincipalName: "suresh@baxter.onmicrosoft.com",
    jobTitle: "Compliance & Audit Officer",
    department: "Governance & Regulatory",
    officeLocation: "Chennai, India",
    accountEnabled: false,
    createdDateTime: "2024-02-28T14:00:00Z",
    lastSignInDateTime: "2026-09-15T11:00:00Z",
    lastNonInteractiveSignIn: "2026-09-15T11:30:00Z",
    mfaEnabled: true,
    mfaMethods: ["Phone"],
    riskLevel: "none",
    riskState: "none",
    assignedLicenses: ["Microsoft 365 E3"],
    groups: ["Compliance-Team", "Audit-Board"],
    signInCount30d: 0,
    failedSignIns30d: 0,
    avatar: "SN",
  },
  {
    id: "usr-006",
    displayName: "Yaseen Bepari",
    email: "yaseen@baxter.com",
    userPrincipalName: "yaseen@baxter.onmicrosoft.com",
    jobTitle: "Lead Systems Engineer",
    department: "Platform & Observability",
    officeLocation: "Bangalore, India",
    accountEnabled: true,
    createdDateTime: "2023-08-10T09:00:00Z",
    lastSignInDateTime: "2026-10-10T16:05:00Z",
    lastNonInteractiveSignIn: "2026-10-10T16:30:00Z",
    mfaEnabled: true,
    mfaMethods: ["Microsoft Authenticator", "FIDO2 Key", "Phone"],
    riskLevel: "none",
    riskState: "none",
    assignedLicenses: ["Microsoft 365 E5", "Azure AD P2", "Intune"],
    groups: ["Platform-Team", "SRE-Team", "Admin-Group", "All-Employees"],
    signInCount30d: 198,
    failedSignIns30d: 1,
    avatar: "YB",
  },
  {
    id: "usr-007",
    displayName: "Meera Krishnan",
    email: "meera@baxter.com",
    userPrincipalName: "meera@baxter.onmicrosoft.com",
    jobTitle: "QA Lead",
    department: "Quality Assurance",
    officeLocation: "Kochi, India",
    accountEnabled: true,
    createdDateTime: "2024-07-22T10:30:00Z",
    lastSignInDateTime: "2026-10-10T11:20:00Z",
    lastNonInteractiveSignIn: "2026-10-10T12:00:00Z",
    mfaEnabled: true,
    mfaMethods: ["Microsoft Authenticator"],
    riskLevel: "none",
    riskState: "none",
    assignedLicenses: ["Microsoft 365 E3", "Azure DevOps"],
    groups: ["QA-Team", "All-Employees"],
    signInCount30d: 76,
    failedSignIns30d: 3,
    avatar: "MK",
  },
  {
    id: "usr-008",
    displayName: "Arjun Reddy",
    email: "arjun@baxter.com",
    userPrincipalName: "arjun@baxter.onmicrosoft.com",
    jobTitle: "Frontend Architect",
    department: "Product Engineering",
    officeLocation: "Bangalore, India",
    accountEnabled: true,
    createdDateTime: "2024-09-01T09:00:00Z",
    lastSignInDateTime: "2026-10-10T15:40:00Z",
    lastNonInteractiveSignIn: "2026-10-10T16:10:00Z",
    mfaEnabled: false,
    mfaMethods: [],
    riskLevel: "high",
    riskState: "atRisk",
    assignedLicenses: ["Microsoft 365 E3"],
    groups: ["Frontend-Team", "Product-Engineering", "All-Employees"],
    signInCount30d: 92,
    failedSignIns30d: 18,
    avatar: "AR",
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// Simplified for business people
function getRiskBadge(level: string) {
  const map: Record<string, { color: string; label: string }> = {
    none: { color: 'var(--ov-text-secondary)', label: 'None' },
    low: { color: '#000000', label: 'Low' },
    medium: { color: '#d97706', label: 'Medium' },
    high: { color: '#dc2626', label: 'High' },
  };
  return map[level] || map.none;
}

// ─── Main Page Component ──────────────────────────────────────────────────
export default function EntraUsersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "enabled" | "disabled">("all");
  const [filterMfa, setFilterMfa] = useState<"all" | "enabled" | "disabled">("all");

  const filteredUsers = ENTRA_USERS.filter((u) => {
    const matchesSearch =
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "enabled" && u.accountEnabled) ||
      (filterStatus === "disabled" && !u.accountEnabled);
    const matchesMfa =
      filterMfa === "all" ||
      (filterMfa === "enabled" && u.mfaEnabled) ||
      (filterMfa === "disabled" && !u.mfaEnabled);
    return matchesSearch && matchesStatus && matchesMfa;
  });

  // Summary stats
  const totalUsers = ENTRA_USERS.length;
  const enabledUsers = ENTRA_USERS.filter((u) => u.accountEnabled).length;
  const mfaEnabledCount = ENTRA_USERS.filter((u) => u.mfaEnabled).length;
  const atRiskCount = ENTRA_USERS.filter((u) => u.riskState === "atRisk").length;
  const totalSignIns = ENTRA_USERS.reduce((s, u) => s + u.signInCount30d, 0);
  const totalFailedSignIns = ENTRA_USERS.reduce((s, u) => s + u.failedSignIns30d, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", background: "var(--ov-bg-page)", fontFamily: 'Inter, sans-serif' }}>
      <div style={{ padding: "24px", flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* ─── Header Banner (Simplified) ───────────────────────────────────────────── */}
          <div style={{
            background: 'var(--ov-bg-card)',
            border: '1px solid var(--ov-border)', borderRadius: '12px', padding: '24px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ov-text-primary)', margin: 0 }}>
                  Microsoft Entra ID — User Directory
                </h2>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--ov-text-secondary)', margin: 0 }}>
                Identity governance, access management, and sign-in analytics from your Azure AD tenant.
              </p>
            </div>
          </div>

          {/* ─── Summary Metric Cards (Simplified) ──────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
            <MetricTile label="Total Users" value={totalUsers} />
            <MetricTile label="Enabled" value={enabledUsers} />
            <MetricTile label="Disabled" value={totalUsers - enabledUsers} />
            <MetricTile label="MFA Enabled" value={`${Math.round((mfaEnabledCount / totalUsers) * 100)}%`} />
            <MetricTile label="At Risk" value={atRiskCount} />
            <MetricTile label="Sign-ins (30d)" value={totalSignIns} subtitle={`${totalFailedSignIns} failed`} />
          </div>

          {/* ─── Search & Filters (Simplified) ─────────────────────────────────────── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderRadius: '12px',
            border: '1px solid var(--ov-border)', background: 'var(--ov-bg-card)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, background: 'var(--ov-bg-subtle)', borderRadius: '8px', padding: '8px 12px' }}>
              <Search size={14} color="var(--ov-text-muted)" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent', border: 'none', outline: 'none', width: '100%',
                  fontSize: '13px', color: 'var(--ov-text-primary)', fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FilterDropdown
                label="Account Status"
                value={filterStatus}
                options={[{ value: "all", label: "All" }, { value: "enabled", label: "Enabled" }, { value: "disabled", label: "Disabled" }]}
                onChange={(v: any) => setFilterStatus(v)}
              />
              <FilterDropdown
                label="MFA"
                value={filterMfa}
                options={[{ value: "all", label: "All" }, { value: "enabled", label: "Enabled" }, { value: "disabled", label: "Not Registered" }]}
                onChange={(v: any) => setFilterMfa(v)}
              />
            </div>
          </div>

          {/* ─── Users Table (Simplified) ──────────────────────────────────────────── */}
          <div style={{ borderRadius: '12px', border: '1px solid var(--ov-border)', overflow: 'hidden', background: 'var(--ov-bg-card)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', fontSize: '13px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{
                    borderBottom: '1px solid var(--ov-border)', background: 'var(--ov-bg-subtle)',
                    color: 'var(--ov-text-secondary)', fontSize: '12px', fontWeight: 600
                  }}>
                    <th style={{ padding: '12px 16px' }}>User Name</th>
                    <th style={{ padding: '12px 16px' }}>Role</th>
                    <th style={{ padding: '12px 16px' }}>Account Status</th>
                    <th style={{ padding: '12px 16px' }}>MFA Status</th>
                    <th style={{ padding: '12px 16px' }}>Risk Level</th>
                    <th style={{ padding: '12px 16px' }}>Last Sign-In</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--ov-text-primary)' }}>
                  {filteredUsers.map((user, i) => {
                    const risk = getRiskBadge(user.riskLevel);

                    return (
                      <tr
                        key={user.id}
                        onClick={() => router.push(`/applications/netra/users/${user.id}`)}
                        style={{
                          borderBottom: '1px solid var(--ov-border)', cursor: 'pointer',
                        }}
                      >
                        {/* User */}
                        <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                           <div style={{ fontWeight: 500 }}>{user.displayName}</div>
                           <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>{user.email}</div>
                        </td>

                        {/* Job Title */}
                        <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                          <div>{user.jobTitle}</div>
                          <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)' }}>{user.department}</div>
                        </td>

                        {/* Account */}
                        <td style={{ padding: '16px', color: user.accountEnabled ? '#16a34a' : 'var(--ov-text-secondary)' }}>
                          {user.accountEnabled ? 'Enabled' : 'Disabled'}
                        </td>

                        {/* MFA */}
                        <td style={{ padding: '16px', color: user.mfaEnabled ? '#16a34a' : '#dc2626' }}>
                          {user.mfaEnabled ? 'Registered' : 'Not Registered'}
                        </td>

                        {/* Risk Level */}
                        <td style={{ padding: '16px', color: risk.color, fontWeight: user.riskLevel !== 'none' ? 600 : 400 }}>
                          {risk.label}
                        </td>

                        {/* Last Sign-In */}
                        <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                          <div>{timeAgo(user.lastSignInDateTime)}</div>
                        </td>
                      </tr>
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

// ─── Sub-Components (Simplified) ───────────────────────────────────────────────────────

function MetricTile({ label, value, subtitle }: { label: string; value: any; subtitle?: string }) {
  return (
    <div
      style={{
        padding: '16px', borderRadius: '12px', border: '1px solid var(--ov-border)',
        background: 'var(--ov-bg-card)', display: 'flex', flexDirection: 'column', gap: '8px',
      }}
    >
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ov-text-secondary)' }}>
        {label}
      </div>
      <div>
        <div style={{ fontSize: '24px', fontWeight: 600, color: '#2563eb' }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '11px', color: 'var(--ov-text-muted)', marginTop: '2px' }}>{subtitle}</div>
        )}
      </div>
    </div>
  );
}

function FilterDropdown({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <Filter size={12} color="var(--ov-text-muted)" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: 'var(--ov-bg-subtle)', border: '1px solid var(--ov-border)',
          borderRadius: '6px', padding: '6px 10px', fontSize: '12px',
          color: 'var(--ov-text-primary)', outline: 'none', cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{label}: {opt.label}</option>
        ))}
      </select>
    </div>
  );
}
