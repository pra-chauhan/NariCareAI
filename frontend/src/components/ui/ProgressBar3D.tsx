import { cn } from '@/lib/utils';

interface ProgressBar3DProps {
  value: number;
  max: number;
  color?: string;
  className?: string;
  label?: string;
}

const ProgressBar3D = ({ value, max, color = 'bg-primary', className, label }: ProgressBar3DProps) => {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <div className="flex justify-between text-xs font-body">
          <span className="text-muted-foreground">{label}</span>
          <span className="text-foreground font-semibold">{value}/{max}</span>
        </div>
      )}
      <div className="progress-bar-3d h-3 relative">
        <div
          className={cn('fill h-full transition-all duration-700 shimmer relative', color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar3D;
