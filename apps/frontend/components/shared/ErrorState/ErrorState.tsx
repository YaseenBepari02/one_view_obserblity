import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Failed to load data',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="ov-empty">
      <div className="ov-empty-icon">
        <AlertCircle size={32} />
      </div>
      <div className="ov-empty-title">{message}</div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
