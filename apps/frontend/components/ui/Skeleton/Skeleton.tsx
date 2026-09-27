import { cn } from '@/lib/utils';

interface SkeletonProps {
  variant?: 'text' | 'circle' | 'card' | 'chart' | 'rect';
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

export function Skeleton({
  variant = 'rect',
  width,
  height,
  className,
  count = 1,
}: SkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {items.map((i) => (
        <div
          key={i}
          className={cn(
            'ov-skeleton',
            variant === 'text' && 'ov-skeleton-text',
            variant === 'circle' && 'ov-skeleton-circle',
            variant === 'card' && 'ov-skeleton-card',
            variant === 'chart' && 'ov-skeleton-chart',
            className
          )}
          style={{
            width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
            height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
          }}
        />
      ))}
    </>
  );
}

export function SkeletonCard() {
  return (
    <div className="ov-skeleton ov-skeleton-card" />
  );
}
