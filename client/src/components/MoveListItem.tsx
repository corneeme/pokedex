import { MoveDetail } from '@shared/schema';
import { TypeBadge } from './TypeBadge';
import { formatLearnMethod } from '@/lib/pokemon-utils';
import { Swords, Sparkles, Circle } from 'lucide-react';

interface MoveListItemProps {
  move: MoveDetail;
  learnMethod: string;
  level: number;
}

export function MoveListItem({ move, learnMethod, level }: MoveListItemProps) {
  if (!move || !move.damage_class || !move.type) {
    return null;
  }

  const getDamageClassIcon = () => {
    const damageClass = move.damage_class?.name;
    switch (damageClass) {
      case 'physical':
        return <Swords className="w-4 h-4" />;
      case 'special':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getDamageClassColor = () => {
    const damageClass = move.damage_class?.name;
    switch (damageClass) {
      case 'physical':
        return 'text-orange-500';
      case 'special':
        return 'text-purple-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div
      className="grid grid-cols-12 gap-2 items-center py-3 border-b border-border last:border-b-0 hover-elevate rounded-md px-2"
      data-testid={`move-${move.name}`}
    >
      <div className="col-span-4 text-sm font-medium capitalize">
        {move.name.replace(/-/g, ' ')}
      </div>
      <div className="col-span-2">
        <TypeBadge type={move.type.name} className="text-[10px] px-2 py-0.5" />
      </div>
      <div className="col-span-2 text-sm text-center font-mono" data-testid={`move-power-${move.name}`}>
        {move.power ?? '—'}
      </div>
      <div className="col-span-2 text-sm text-center font-mono" data-testid={`move-accuracy-${move.name}`}>
        {move.accuracy ?? '—'}
      </div>
      <div className={`col-span-1 flex justify-center ${getDamageClassColor()}`}>
        {getDamageClassIcon()}
      </div>
      <div className="col-span-1 text-xs text-muted-foreground text-right">
        {learnMethod === 'level-up' && level > 0 ? `Lv${level}` : formatLearnMethod(learnMethod)}
      </div>
    </div>
  );
}
