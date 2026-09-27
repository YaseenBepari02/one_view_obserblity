'use client';

import { useRouter } from "next/navigation";

export default function UserActivityPanel() {
  const router = useRouter();
  const appId = "kavacha";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", background: "var(--ov-bg-page)" }}>
      <div style={{ padding: "24px", flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '16px' }}>
          {/* ─── Health Redirection Section ────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderRadius: '12px', border: '1px solid var(--ov-border)', background: 'var(--ov-bg-card)' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: "var(--ov-text-primary)", margin: 0 }}>Want to see the health of the application?</h3>
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
        </div>
      </div>
    </div>
  );
}
