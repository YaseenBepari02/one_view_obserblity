# Component Patterns — Before/After

These examples show the refactor from scattered inline style objects
(common failure mode) to the 3-layer approach: Global tokens + Component
CSS classes. **The CSS itself is 100% framework-agnostic** — plain classes
and `var(--app-*)` tokens work identically in React, Angular, Vue, or plain
HTML. Only the markup/binding syntax around `className`/`style` differs;
react/tsx is used below purely as one illustration, not a requirement.
Adapt the token names to whatever prefix the target project uses, and swap
the markup syntax per this table:

| Concern | React (JSX/TSX) | Angular | Vue | Plain HTML |
|---|---|---|---|---|
| Static class | `className="app-card"` | `class="app-card"` | `class="app-card"` | `class="app-card"` |
| Conditional class | `className={active ? 'app-badge-success' : 'app-badge-info'}` | `[class.is-active]="active"` or `[ngClass]` | `:class="{ 'is-active': active }"` | toggle via JS `classList.toggle(...)` |
| Runtime-computed inline style (only allowed exception) | `style={{ width: pct + '%' }}` | `[style.width.%]="pct"` | `:style="{ width: pct + '%' }"` | `element.style.width = pct + '%'` |

Everything below the table is illustrated once (in JSX/CSS) for brevity —
port the CSS as-is and translate only the markup using the table above.

## 1. Card

**❌ Before — hardcoded inline styles, no reuse, colors duplicated per instance:**
```tsx
<div style={{
  background: '#FFFFFF',
  border: '1px solid #E2E6EA',
  borderRadius: 6,
  boxShadow: 'rgba(0,0,0,0.06) 0px 1px 3px 0px',
  display: 'flex',
  flexDirection: 'column',
}}>
  <div style={{ padding: '9px 14px 8px', borderBottom: '1px solid #E2E6EA' }}>
    <span style={{ fontSize: 12, fontWeight: 700, color: '#1A2027' }}>{title}</span>
  </div>
  <div style={{ flex: 1, padding: '10px 14px 8px' }}>{children}</div>
</div>
```

**✅ After — Component-layer CSS, tokens only, one definition reused everywhere:**
```css
/* components/common/Card/Card.css */
.app-card {
  display: flex;
  flex-direction: column;
  background: var(--app-bg-card);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-md);
  box-shadow: var(--app-shadow-sm);
  overflow: hidden;
}
.app-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--app-space-2) var(--app-space-4);
  border-bottom: 1px solid var(--app-border);
}
.app-card-title {
  font-size: var(--app-font-size-sm);
  font-weight: var(--app-font-weight-bold);
  color: var(--app-text-primary);
}
.app-card-body {
  flex: 1;
  padding: var(--app-space-3) var(--app-space-4);
  overflow: auto;
}
```
```tsx
// components/common/Card/Card.tsx
import './Card.css';

export default function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="app-card">
      <div className="app-card-header">
        <span className="app-card-title">{title}</span>
      </div>
      <div className="app-card-body">{children}</div>
    </div>
  );
}
```
Only *runtime-computed* values (like a dynamic `minHeight` passed as a prop)
may still use inline style, e.g. `style={{ minHeight }}` — everything static
moves to the class.

## 2. Button

**✅ Component CSS:**
```css
/* components/common/Button/Button.css */
.app-btn {
  border: none;
  border-radius: var(--app-radius-sm);
  font-size: var(--app-font-size-md);
  font-weight: var(--app-font-weight-bold);
  padding: 11px var(--app-space-5);
  cursor: pointer;
  transition: background 0.15s;
}
.app-btn-primary {
  background: var(--app-primary);
  color: var(--app-text-on-dark);
}
.app-btn-primary:hover:not(:disabled) { background: var(--app-primary-hover); }
.app-btn-primary:disabled { background: var(--app-text-muted); cursor: not-allowed; }

.app-btn-danger {
  background: transparent;
  border: 1px solid var(--app-status-danger);
  color: var(--app-status-danger);
}
```
Usage: `<button className="app-btn app-btn-primary">Save</button>`

## 3. Status Badge (semantic-color mapping stays in the Component, not inline)

**✅ Component CSS + a small variant map (no hex codes inline in TSX):**
```css
/* components/common/Badge/Badge.css */
.app-badge {
  display: inline-block;
  border-radius: var(--app-radius-sm);
  padding: 2px var(--app-space-2);
  font-size: var(--app-font-size-xs);
  font-weight: var(--app-font-weight-bold);
  letter-spacing: 0.03em;
  white-space: nowrap;
}
.app-badge-success { background: #DCFCE7; color: var(--app-status-success); }
.app-badge-warning { background: #FEF3C7; color: var(--app-status-warning); }
.app-badge-info     { background: #DBEAFE; color: var(--app-status-info); }
.app-badge-danger   { background: #FEE2E2; color: var(--app-status-danger); }
.app-badge-pending  { background: #F3E8FF; color: var(--app-status-pending); }
```
```tsx
const VARIANT_BY_STATUS: Record<string, string> = {
  Approved: 'app-badge-success',
  'Not Prepared': 'app-badge-warning',
  Prepared: 'app-badge-info',
  Rejected: 'app-badge-danger',
  Decertified: 'app-badge-pending',
};

export default function Badge({ status }: { status: string }) {
  return <span className={`app-badge ${VARIANT_BY_STATUS[status] ?? 'app-badge-info'}`}>{status}</span>;
}
```

## 4. Sidebar (layout/positioning is fine inline-free too)

**✅ Component CSS:**
```css
/* components/layout/Sidebar/Sidebar.css */
.app-sidebar-rail {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  width: 52px;
  background: var(--app-bg-sidebar);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: var(--app-space-4);
  gap: var(--app-space-5);
  z-index: 400;
}
.app-sidebar-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: var(--app-radius-sm);
  padding: var(--app-space-2);
  cursor: pointer;
  transition: background 0.15s;
}
.app-sidebar-icon-btn.is-active,
.app-sidebar-icon-btn:hover {
  background: rgba(255, 255, 255, 0.14);
}
```
Note the `is-active` **utility/state class** instead of inline
`background: activePanel === id ? '...' : 'transparent'` — toggle the class
via `className` string composition instead of computing a style object.

## Module-layer example (layout only, no new colors)

```css
/* app/(auth)/login/login.css — MODULE layer */
.app-auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--app-space-6) var(--app-space-4);
  background: linear-gradient(135deg, var(--app-bg-page) 0%, #E8EDF5 100%);
}
.app-auth-card-wrapper {
  width: 100%;
  max-width: 420px;
}
```
The actual card styling (background, radius, shadow) is NOT redefined here
— the module wraps the existing `.app-card` Component and only adds
page-level centering/max-width, which is the Module layer's job.
