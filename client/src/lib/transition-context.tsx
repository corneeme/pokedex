import { createContext, useContext, useState, ReactNode } from 'react';

interface TransitionState {
  isTransitioning: boolean;
  color: string;
  position: { x: number; y: number };
  targetPokemonId: number | null;
  spriteUrl: string;
  shouldRevealContent: boolean;
}

interface TransitionContextType {
  transitionState: TransitionState;
  startTransition: (
    color: string, 
    position: { x: number; y: number }, 
    pokemonId: number,
    spriteUrl: string
  ) => void;
  revealContent: () => void;
  completeTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [transitionState, setTransitionState] = useState<TransitionState>({
    isTransitioning: false,
    color: '#E0E0E0',
    position: { x: 0, y: 0 },
    targetPokemonId: null,
    spriteUrl: '',
    shouldRevealContent: false,
  });

  const startTransition = (
    color: string, 
    position: { x: number; y: number }, 
    pokemonId: number,
    spriteUrl: string
  ) => {
    setTransitionState({
      isTransitioning: true,
      color,
      position,
      targetPokemonId: pokemonId,
      spriteUrl,
      shouldRevealContent: false,
    });
  };

  const revealContent = () => {
    setTransitionState((prev) => ({
      ...prev,
      shouldRevealContent: true,
    }));
  };

  const completeTransition = () => {
    setTransitionState({
      isTransitioning: false,
      color: '#E0E0E0',
      position: { x: 0, y: 0 },
      targetPokemonId: null,
      spriteUrl: '',
      shouldRevealContent: false,
    });
  };

  return (
    <TransitionContext.Provider value={{ transitionState, startTransition, revealContent, completeTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within TransitionProvider');
  }
  return context;
}
