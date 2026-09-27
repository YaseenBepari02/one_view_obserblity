import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
}

export function EmptyState({
  icon,
  title = 'No data available',
  description = 'No data available for this time range.',
}: EmptyStateProps) {
  return (
    <div className="ov-empty">
      <div className="ov-empty-icon">
        {icon || <Inbox size={32} />}
      </div>
      <div className="ov-empty-title">{title}</div>
      <div className="ov-empty-description">{description}</div>
    </div>
  );
}
