import { ArrowRight } from 'lucide-react';
import { formatPokemonName } from '@/lib/pokemon-utils';

interface EvolutionStage {
  id: number;
  name: string;
  sprite: string;
}

interface EvolutionChainProps {
  stages: Array<Array<EvolutionStage>>;
  onPokemonClick: (id: number) => void;
}

export function EvolutionChain({ stages, onPokemonClick }: EvolutionChainProps) {
  if (stages.length === 0 || (stages.length === 1 && stages[0].length === 1)) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        This Pokémon does not evolve.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6" data-testid="evolution-chain">
      {stages.map((stageGroup, stageIndex) => (
        <div key={stageIndex} className="flex flex-col items-center gap-4">
          {stageIndex > 0 && (
            <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
          )}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {stageGroup.map((pokemon) => (
              <button
                key={pokemon.id}
                onClick={() => onPokemonClick(pokemon.id)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover-elevate active-elevate-2 transition-transform"
                data-testid={`button-evolution-${pokemon.id}`}
              >
                <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-full">
                  <img
                    src={pokemon.sprite}
                    alt={pokemon.name}
                    className="w-14 h-14 object-contain"
                    data-testid={`img-evolution-sprite-${pokemon.id}`}
                  />
                </div>
                <span className="text-xs font-medium capitalize text-center" data-testid={`text-evolution-name-${pokemon.id}`}>
                  {formatPokemonName(pokemon.name)}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
