import { cn } from '@/lib/utils';

interface OrbStatProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  color: string;
  size?: 'sm' | 'md';
}

const OrbStat = ({ value, max, label, unit = '', color, size = 'md' }: OrbStatProps) => {
  const pct = Math.min(100, (value / max) * 100);
  const sz = size === 'sm' ? 'w-20 h-20' : 'w-28 h-28';

  return (
    <div className={cn('orb-stat', sz, color)}>
      <span className="text-lg font-bold font-display text-foreground">{value}</span>
      <span className="text-[10px] font-body text-muted-foreground">{unit}{unit ? ' / ' : ''}{label}</span>
      <svg className="absolute inset-0" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" opacity="0.3" />
        <circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${pct * 2.83} ${283 - pct * 2.83}`}
          transform="rotate(-90 50 50)"
          className="transition-all duration-700"
        />
      </svg>
    </div>
  );
};

export default OrbStat;
