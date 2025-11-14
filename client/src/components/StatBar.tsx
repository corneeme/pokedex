import { formatStatName, getStatColor } from '@/lib/pokemon-utils';

interface StatBarProps {
  name: string;
  value: number;
}

export function StatBar({ name, value }: StatBarProps) {
  const maxStat = 255;
  const percentage = (value / maxStat) * 100;
  const statColor = getStatColor(value);

  return (
    <div className="flex items-center gap-3" data-testid={`stat-${name}`}>
      <div className="w-28 text-sm font-medium text-muted-foreground">
        {formatStatName(name)}
      </div>
      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={`${statColor} h-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="w-12 text-right text-sm font-mono font-medium" data-testid={`stat-value-${name}`}>
        {value}
      </div>
    </div>
  );
}
