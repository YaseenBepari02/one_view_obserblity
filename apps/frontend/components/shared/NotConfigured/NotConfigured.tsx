import { Settings } from 'lucide-react';

interface NotConfiguredProps {
  title?: string;
  description?: string;
}

export function NotConfigured({
  title = 'Not configured yet',
  description = 'This section will display data when a data source is connected.',
}: NotConfiguredProps) {
  return (
    <div className="ov-empty">
      <div className="ov-empty-icon">
        <Settings size={32} />
      </div>
      <div className="ov-empty-title">{title}</div>
      <div className="ov-empty-description">{description}</div>
    </div>
  );
}
