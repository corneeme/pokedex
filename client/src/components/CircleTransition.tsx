import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CircleTransitionProps {
  isActive: boolean;
  color: string;
  startPosition: { x: number; y: number };
  spriteUrl: string;
  onRevealContent: () => void;
  onComplete: () => void;
}

type AnimationStage = 'expand' | 'hold' | 'reveal' | 'complete';

export function CircleTransition({
  isActive,
  color,
  startPosition,
  spriteUrl,
  onRevealContent,
  onComplete,
}: CircleTransitionProps) {
  const [stage, setStage] = useState<AnimationStage>('expand');

  useEffect(() => {
    if (!isActive) {
      setStage('expand');
      return;
    }

    // Stage 1: Expand circle (0-550ms) while sprite fades out (200-550ms)
    const expandTimer = setTimeout(() => {
      setStage('hold');
    }, 550);

    // Stage 2: Hold full-screen color (550-650ms)
    const holdTimer = setTimeout(() => {
      setStage('reveal');
      onRevealContent(); // Signal to show detail content
    }, 650);

    // Stage 3: Fade detail content in while background fades (650-1000ms)
    const revealTimer = setTimeout(() => {
      setStage('complete');
      onComplete();
    }, 1000);

    return () => {
      clearTimeout(expandTimer);
      clearTimeout(holdTimer);
      clearTimeout(revealTimer);
    };
  }, [isActive, onRevealContent, onComplete]);

  if (!isActive) return null;

  const maxDimension = Math.max(window.innerWidth, window.innerHeight) * 2;

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Fullscreen color backdrop */}
          <motion.div
            className="fixed inset-0 pointer-events-none z-[99]"
            style={{ backgroundColor: color }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: stage === 'expand' || stage === 'hold' ? 1 : 0,
            }}
            transition={{
              duration: stage === 'expand' ? 0.55 : 0.35,
              ease: 'easeInOut',
            }}
          />

          {/* Expanding circle */}
          <motion.div
            className="fixed pointer-events-none z-[100]"
            style={{
              left: startPosition.x,
              top: startPosition.y,
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: color,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 1 }}
            animate={{
              scale: stage === 'expand' || stage === 'hold' || stage === 'reveal' 
                ? maxDimension / 100 
                : maxDimension / 100,
            }}
            transition={{
              duration: 0.55,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
          />

          {/* Pokemon sprite that fades out during expansion */}
          <motion.div
            className="fixed pointer-events-none z-[101]"
            style={{
              left: startPosition.x,
              top: startPosition.y,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: stage === 'expand' ? 0 : 0,
              scale: stage === 'expand' ? 1.2 : 1.2,
            }}
            transition={{
              opacity: {
                duration: 0.35,
                delay: 0.2,
                ease: 'easeOut',
              },
              scale: {
                duration: 0.55,
                ease: 'easeOut',
              },
            }}
          >
            <img
              src={spriteUrl}
              alt="Pokemon"
              className="w-20 h-20 md:w-24 md:h-24 object-contain"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
