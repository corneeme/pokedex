import { formatPokemonName, getTypeColor } from '@/lib/pokemon-utils';
import { Badge } from '@/components/ui/badge';

interface TypeBadgeProps {
  type: string;
  className?: string;
}

export function TypeBadge({ type, className = '' }: TypeBadgeProps) {
  const bgColor = getTypeColor(type);
  const isLightBg = ['electric', 'ice', 'ground', 'steel'].includes(type);

  return (
    <Badge
      className={`uppercase text-xs font-semibold tracking-wide px-4 py-1 rounded-full border ${className}`}
      style={{
        backgroundColor: bgColor,
        borderColor: `${bgColor}dd`,
        color: isLightBg ? '#000' : '#fff',
      }}
      data-testid={`badge-type-${type}`}
    >
      {formatPokemonName(type)}
    </Badge>
  );
}
