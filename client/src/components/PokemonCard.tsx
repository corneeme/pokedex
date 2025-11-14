import { PokemonListItem } from '@shared/schema';
import { formatPokemonName } from '@/lib/pokemon-utils';
import { useRef } from 'react';

interface PokemonCardProps {
  pokemon: PokemonListItem;
  onClick: (position: { x: number; y: number }) => void;
  circleColor?: string;
}

export function PokemonCard({ pokemon, onClick, circleColor = '#E0E0E0' }: PokemonCardProps) {
  const circleRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (circleRef.current) {
      const rect = circleRef.current.getBoundingClientRect();
      const position = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      onClick(position);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group flex flex-col items-center p-4 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
      data-testid={`card-pokemon-${pokemon.id}`}
    >
      <div
        ref={circleRef}
        className="aspect-square w-full rounded-full flex items-center justify-center mb-3 transition-all duration-300"
        style={{ backgroundColor: circleColor }}
      >
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className="w-20 h-20 md:w-24 md:h-24 object-contain"
          loading="lazy"
          data-testid={`img-sprite-${pokemon.id}`}
        />
      </div>
      <p className="text-sm md:text-base font-medium text-foreground capitalize text-center" data-testid={`text-name-${pokemon.id}`}>
        {formatPokemonName(pokemon.name)}
      </p>
    </button>
  );
}
