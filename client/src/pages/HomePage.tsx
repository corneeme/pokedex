import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { PokemonListItem, Pokemon } from '@shared/schema';
import { PokemonCard } from '@/components/PokemonCard';
import { SearchBar } from '@/components/SearchBar';
import { CircleTransition } from '@/components/CircleTransition';
import { Skeleton } from '@/components/ui/skeleton';
import { useTransition } from '@/lib/transition-context';
import { getTypeColor } from '@/lib/pokemon-utils';

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSticky, setIsSticky] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const stickyTriggerRef = useRef<HTMLDivElement>(null);
  const { transitionState, startTransition, revealContent, completeTransition } = useTransition();

  const { data: pokemonList, isLoading } = useQuery<PokemonListItem[]>({
    queryKey: ['/api/pokemon'],
  });

  // Prefetch Pokemon data for smooth transition
  const { data: selectedPokemon } = useQuery<Pokemon>({
    queryKey: ['/api/pokemon', transitionState.targetPokemonId],
    enabled: transitionState.targetPokemonId !== null,
  });

  // Filter Pokemon based on search query
  const filteredPokemon = pokemonList?.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Handle sticky search bar
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-1px 0px 0px 0px',
      }
    );

    if (stickyTriggerRef.current) {
      observer.observe(stickyTriggerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePokemonClick = async (pokemonId: number, position: { x: number; y: number }) => {
    // Find the Pokemon to get sprite URL
    const pokemon = filteredPokemon.find(p => p.id === pokemonId);
    if (!pokemon) return;

    // Fetch Pokemon data to get type color
    const response = await fetch(`/api/pokemon/${pokemonId}`);
    const pokemonData: Pokemon = await response.json();
    const primaryType = pokemonData.types[0]?.type.name || 'normal';
    const typeColor = getTypeColor(primaryType);

    // Start the circle transition animation with sprite
    startTransition(typeColor, position, pokemonId, pokemon.sprite);

    // Navigate after a slight delay to ensure animation starts
    setTimeout(() => {
      setLocation(`/pokemon/${pokemonId}`);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <CircleTransition
        isActive={transitionState.isTransitioning}
        color={transitionState.color}
        startPosition={transitionState.position}
        spriteUrl={transitionState.spriteUrl}
        onRevealContent={revealContent}
        onComplete={completeTransition}
      />

      <div className="max-w-7xl mx-auto px-4">
        {/* Sticky trigger point */}
        <div ref={stickyTriggerRef} className="h-px" />

        {/* Search Bar */}
        <div ref={searchRef} className="pt-8 pb-12">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            isSticky={isSticky}
          />
        </div>

        {/* Pokemon Grid */}
        {isLoading ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center p-4">
                <Skeleton className="aspect-square w-full rounded-full mb-3" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredPokemon.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6 pb-12">
                {filteredPokemon.map((pokemon) => (
                  <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    onClick={(position) => handlePokemonClick(pokemon.id, position)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">
                  No Pokémon found matching "{searchQuery}"
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
