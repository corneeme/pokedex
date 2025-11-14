import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { ArrowLeft, Ruler, Weight } from 'lucide-react';
import { Pokemon, PokemonSpecies, EvolutionChain, MoveDetail } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TypeBadge } from '@/components/TypeBadge';
import { StatBar } from '@/components/StatBar';
import { MoveListItem } from '@/components/MoveListItem';
import { EvolutionChain as EvolutionChainComponent } from '@/components/EvolutionChain';
import {
  formatPokemonName,
  formatHeight,
  formatWeight,
  getTypeColor,
  parseEvolutionChain,
} from '@/lib/pokemon-utils';
import { useEffect, useState } from 'react';
import { useTransition } from '@/lib/transition-context';

export default function PokemonDetail() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [contentVisible, setContentVisible] = useState(false);
  const pokemonId = params.id;
  const { transitionState } = useTransition();

  const { data: pokemon, isLoading: isPokemonLoading } = useQuery<Pokemon>({
    queryKey: ['/api/pokemon', pokemonId],
  });

  const { data: species } = useQuery<PokemonSpecies>({
    queryKey: ['/api/pokemon', pokemonId, 'species'],
    enabled: !!pokemon,
  });

  const { data: evolutionChain } = useQuery<EvolutionChain>({
    queryKey: ['/api/pokemon', pokemonId, 'evolution'],
    enabled: !!species,
  });

  const { data: movesData } = useQuery<MoveDetail[]>({
    queryKey: ['/api/pokemon', pokemonId, 'moves'],
    enabled: !!pokemon,
  });

  // Fade in content when transition signals reveal or immediately if no transition
  useEffect(() => {
    if (!transitionState.isTransitioning && transitionState.targetPokemonId === null) {
      // Direct navigation - show content immediately
      setContentVisible(true);
    } else if (transitionState.shouldRevealContent) {
      // Transition signaled reveal - show content now
      setContentVisible(true);
    } else {
      // Transition in progress - hide content
      setContentVisible(false);
    }
  }, [transitionState.isTransitioning, transitionState.targetPokemonId, transitionState.shouldRevealContent, pokemonId]);

  if (isPokemonLoading || !pokemon) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Skeleton className="h-10 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-64 w-64 mx-auto mb-6" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="lg:col-span-3">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const typeColor = getTypeColor(primaryType);

  const flavorText = species?.flavor_text_entries
    .find((entry) => entry.language.name === 'en')
    ?.flavor_text.replace(/\f/g, ' ');

  const genus = species?.genera.find((g) => g.language.name === 'en')?.genus;

  // Parse evolution chain
  const evolutionStages = evolutionChain
    ? parseEvolutionChain(evolutionChain.chain)
    : [];

  // Get unique moves with details - filter out null/invalid moves
  const uniqueMoves = pokemon.moves
    .map((move) => {
      const moveDetail = movesData?.find((m) => m && m.name === move.move.name);
      const learnDetails = move.version_group_details[0];
      return {
        move: moveDetail,
        learnMethod: learnDetails?.move_learn_method.name || '',
        level: learnDetails?.level_learned_at || 0,
      };
    })
    .filter((m) => m.move && m.move.damage_class && m.move.type)
    .sort((a, b) => {
      if (a.learnMethod === 'level-up' && b.learnMethod === 'level-up') {
        return a.level - b.level;
      }
      return a.learnMethod.localeCompare(b.learnMethod);
    });

  return (
    <div
      className={`min-h-screen bg-background transition-opacity duration-700 ${
        contentVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <Button
          onClick={() => setLocation('/')}
          variant="secondary"
          className="rounded-full px-4 py-2 shadow-lg"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Pokemon Info & Stats */}
          <div className="lg:col-span-2">
            {/* Pokemon Header */}
            <div className="text-right mb-6">
              <h1 className="text-4xl md:text-5xl font-bold font-poppins capitalize" data-testid="text-pokemon-name">
                {formatPokemonName(pokemon.name)}
              </h1>
              <p className="text-lg text-muted-foreground font-mono mt-1" data-testid="text-dex-number">
                #{pokemon.id.toString().padStart(3, '0')}
              </p>
              <div className="flex gap-2 justify-end mt-3" data-testid="type-badges">
                {pokemon.types.map((type) => (
                  <TypeBadge key={type.slot} type={type.type.name} />
                ))}
              </div>
              {genus && (
                <p className="text-sm text-muted-foreground mt-2" data-testid="text-genus">
                  {genus}
                </p>
              )}
            </div>

            {/* Pokemon Sprite */}
            <div className="flex justify-center mb-8">
              <div
                className="w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center transition-all duration-300"
                style={{ backgroundColor: `${typeColor}20` }}
              >
                <img
                  src={pokemon.sprites.other['official-artwork'].front_default}
                  alt={pokemon.name}
                  className="w-full h-full object-contain p-8"
                  data-testid="img-pokemon-artwork"
                />
              </div>
            </div>

            {/* Base Stats */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold font-poppins mb-4">Base Stats</h2>
              <div className="space-y-3">
                {pokemon.stats.map((stat) => (
                  <StatBar
                    key={stat.stat.name}
                    name={stat.stat.name}
                    value={stat.base_stat}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Details, Moves, Evolution */}
          <div className="lg:col-span-3 space-y-6">
            {/* Pokedex Entry */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold font-poppins mb-3">Pokédex Entry</h2>
              <p className="text-sm font-serif leading-relaxed" data-testid="text-flavor-text">
                {flavorText || 'No Pokédex entry available.'}
              </p>
            </Card>

            {/* Abilities, Height, Weight */}
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    Abilities
                  </h3>
                  <div className="space-y-1" data-testid="abilities-list">
                    {pokemon.abilities.map((ability) => (
                      <p
                        key={ability.slot}
                        className="text-sm capitalize"
                        data-testid={`ability-${ability.ability.name}`}
                      >
                        {ability.ability.name.replace(/-/g, ' ')}
                        {ability.is_hidden && (
                          <span className="text-xs text-muted-foreground ml-2">
                            (Hidden)
                          </span>
                        )}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Ruler className="w-4 h-4" />
                      <span>Height</span>
                    </div>
                    <p className="text-sm font-medium" data-testid="text-height">
                      {formatHeight(pokemon.height)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Weight className="w-4 h-4" />
                      <span>Weight</span>
                    </div>
                    <p className="text-sm font-medium" data-testid="text-weight">
                      {formatWeight(pokemon.weight)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Moves List */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold font-poppins mb-4">Moves</h2>
              <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground mb-2 px-2">
                <div className="col-span-4">Name</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2 text-center">Power</div>
                <div className="col-span-2 text-center">Acc.</div>
                <div className="col-span-1 text-center">Cat.</div>
                <div className="col-span-1 text-right">Learn</div>
              </div>
              <ScrollArea className="h-96">
                <div className="space-y-1" data-testid="moves-list">
                  {uniqueMoves.length > 0 ? (
                    uniqueMoves.slice(0, 50).map((moveData, index) => (
                      <MoveListItem
                        key={index}
                        move={moveData.move!}
                        learnMethod={moveData.learnMethod}
                        level={moveData.level}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No moves available
                    </p>
                  )}
                </div>
              </ScrollArea>
            </Card>

            {/* Evolution Chain */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold font-poppins mb-4">Evolution</h2>
              <EvolutionChainComponent
                stages={evolutionStages}
                onPokemonClick={(id) => setLocation(`/pokemon/${id}`)}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
