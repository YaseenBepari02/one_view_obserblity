import { EmptyState } from '@/components/shared/EmptyState/EmptyState';

export default function NotFound() {
  return (
    <div style={{ padding: 'var(--ov-space-8) 0' }}>
      <EmptyState
        title="Page not found"
        description="The page you are looking for does not exist or has been moved."
        actionLabel="Return Home"
        onAction={() => window.location.href = '/'}
      />
    </div>
  );
}
