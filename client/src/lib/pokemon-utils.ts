// Pokemon type color mappings based on official Pokemon colors
export const TYPE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  normal: { bg: 'bg-[#A8A878]', border: 'border-[#6D6D4E]', text: 'text-white' },
  fire: { bg: 'bg-[#F08030]', border: 'border-[#9C531F]', text: 'text-white' },
  water: { bg: 'bg-[#6890F0]', border: 'border-[#445E9C]', text: 'text-white' },
  electric: { bg: 'bg-[#F8D030]', border: 'border-[#A1871F]', text: 'text-black' },
  grass: { bg: 'bg-[#78C850]', border: 'border-[#4E8234]', text: 'text-white' },
  ice: { bg: 'bg-[#98D8D8]', border: 'border-[#638D8D]', text: 'text-black' },
  fighting: { bg: 'bg-[#C03028]', border: 'border-[#7D1F1A]', text: 'text-white' },
  poison: { bg: 'bg-[#A040A0]', border: 'border-[#682A68]', text: 'text-white' },
  ground: { bg: 'bg-[#E0C068]', border: 'border-[#927D44]', text: 'text-black' },
  flying: { bg: 'bg-[#A890F0]', border: 'border-[#6D5E9C]', text: 'text-white' },
  psychic: { bg: 'bg-[#F85888]', border: 'border-[#A13959]', text: 'text-white' },
  bug: { bg: 'bg-[#A8B820]', border: 'border-[#6D7815]', text: 'text-white' },
  rock: { bg: 'bg-[#B8A038]', border: 'border-[#786824]', text: 'text-white' },
  ghost: { bg: 'bg-[#705898]', border: 'border-[#493963]', text: 'text-white' },
  dragon: { bg: 'bg-[#7038F8]', border: 'border-[#4924A1]', text: 'text-white' },
  dark: { bg: 'bg-[#705848]', border: 'border-[#49392F]', text: 'text-white' },
  steel: { bg: 'bg-[#B8B8D0]', border: 'border-[#787887]', text: 'text-black' },
  fairy: { bg: 'bg-[#EE99AC]', border: 'border-[#9B6470]', text: 'text-white' },
};

// Get hex color for a Pokemon type (for circle backgrounds)
export const getTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  return colorMap[type] || '#A8A878';
};

// Format Pokemon name (capitalize first letter, handle special cases)
export const formatPokemonName = (name: string | undefined): string => {
  if (!name) return '';
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Format stat name
export const formatStatName = (stat: string): string => {
  const statMap: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed',
  };
  return statMap[stat] || stat;
};

// Get Pokemon ID from URL
export const getPokemonIdFromUrl = (url: string): number => {
  const matches = url.match(/\/(\d+)\//);
  return matches ? parseInt(matches[1]) : 0;
};

// Format height (decimeters to meters)
export const formatHeight = (height: number): string => {
  return `${(height / 10).toFixed(1)} m`;
};

// Format weight (hectograms to kilograms)
export const formatWeight = (weight: number): string => {
  return `${(weight / 10).toFixed(1)} kg`;
};

// Get stat color based on value
export const getStatColor = (value: number): string => {
  if (value >= 150) return 'bg-green-500';
  if (value >= 100) return 'bg-blue-500';
  if (value >= 70) return 'bg-yellow-500';
  if (value >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};

// Format move learn method
export const formatLearnMethod = (method: string): string => {
  const methodMap: Record<string, string> = {
    'level-up': 'Level',
    'machine': 'TM/HM',
    'tutor': 'Tutor',
    'egg': 'Egg',
  };
  return methodMap[method] || method;
};

// Parse evolution chain from API response - handles branching evolutions
export function parseEvolutionChain(
  chain: any
): Array<Array<{ id: number; name: string; sprite: string }>> {
  if (!chain || !chain.species) return [];
  
  const stages: Array<Array<{ id: number; name: string; sprite: string }>> = [];
  
  // Add the base Pokemon
  const baseId = getPokemonIdFromUrl(chain.species.url);
  stages.push([{
    id: baseId,
    name: chain.species.name,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${baseId}.png`,
  }]);

  // Recursively add all evolution branches
  if (chain.evolves_to && chain.evolves_to.length > 0) {
    const nextStage: Array<{ id: number; name: string; sprite: string }> = [];
    
    for (const evolution of chain.evolves_to) {
      const evoId = getPokemonIdFromUrl(evolution.species.url);
      nextStage.push({
        id: evoId,
        name: evolution.species.name,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evoId}.png`,
      });
      
      // Handle third stage evolutions
      if (evolution.evolves_to && evolution.evolves_to.length > 0) {
        const thirdStage: Array<{ id: number; name: string; sprite: string }> = [];
        
        for (const thirdEvo of evolution.evolves_to) {
          const thirdId = getPokemonIdFromUrl(thirdEvo.species.url);
          thirdStage.push({
            id: thirdId,
            name: thirdEvo.species.name,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${thirdId}.png`,
          });
        }
        
        if (thirdStage.length > 0 && stages.length < 3) {
          stages.push(thirdStage);
        }
      }
    }
    
    if (nextStage.length > 0) {
      stages.splice(1, 0, nextStage);
    }
  }

  return stages;
}
