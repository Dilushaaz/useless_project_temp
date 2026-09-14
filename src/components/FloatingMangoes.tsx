import React, { useEffect, useState, useRef } from 'react';
import { sfx } from '../utils/audio';

interface FallingMango {
  id: string;
  xPercent: number; // 4 to 88
  size: number; // in px, 42 to 64
  duration: number; // in seconds, 5.5 to 9.0
  wobbleDeg: number; // -20 to 20
  avatar: string;
  emoji: string;
  status: 'falling' | 'splat' | 'bounce' | 'kidnapped' | 'squished';
  landOutcome: 'splat' | 'bounce' | 'kidnapped';
  squishToast?: string;
  landY?: number;
}

const MANGO_AVATARS = [
  { emoji: '🥭', name: 'Alphonso', glow: 'text-amber-400' },
  { emoji: '🥭', name: 'Moovandan', glow: 'text-orange-400' },
  { emoji: '🥭', name: 'Kilichundan', glow: 'text-yellow-400' },
  { emoji: '🥭', name: 'Neelam', glow: 'text-lime-400' },
  { emoji: '🥭', name: 'Chandrakaran', glow: 'text-emerald-400' },
];

const SQUISH_MESSAGES = [
  '+1 MANGO CAPTURED! 🥭',
  'SQUISHED! 💦',
  'READY TO INTERROGATE! 🎯',
  'SEED EXTRACTED! 🔬',
  'MANGO IN CUSTODY! 🚨',
  'KIDNAPPED! 🫳',
];

interface FloatingMangoesProps {
  isAnalyzing?: boolean;
  onCatchMango?: () => void;
  availableCredits?: number;
}

export const FloatingMangoes: React.FC<FloatingMangoesProps> = ({
  isAnalyzing = false,
  onCatchMango,
  availableCredits = 0,
}) => {
  const [mangoes, setMangoes] = useState<FallingMango[]>([]);
  const nextIdRef = useRef(0);

  // Spawn mangoes at comfortable intervals
  useEffect(() => {
    if (isAnalyzing) return; // thin out during active interrogation

    const spawnMango = () => {
      const id = `mango-${Date.now()}-${nextIdRef.current++}`;
      const randomAvatar = MANGO_AVATARS[Math.floor(Math.random() * MANGO_AVATARS.length)];
      
      // 60% chance splat, 25% chance bounce, 15% chance kidnapped easter-egg
      const outcomeRoll = Math.random();
      const landOutcome: 'splat' | 'bounce' | 'kidnapped' = 
        outcomeRoll < 0.60 ? 'splat' : outcomeRoll < 0.85 ? 'bounce' : 'kidnapped';

      const newMango: FallingMango = {
        id,
        xPercent: 4 + Math.random() * 82,
        size: Math.floor(44 + Math.random() * 20),
        duration: 5.5 + Math.random() * 3.5, // Relaxed 5.5s - 9.0s fall time
        wobbleDeg: (Math.random() - 0.5) * 30,
        avatar: randomAvatar.name,
        emoji: randomAvatar.emoji,
        status: 'falling',
        landOutcome,
      };

      setMangoes((prev) => [...prev.slice(-12), newMango]);
    };

    // Immediate initial drops so screen is alive right away
    const initialTimer1 = setTimeout(spawnMango, 250);
    const initialTimer2 = setTimeout(spawnMango, 1200);

    // Continuous smooth cadence (every 2.5 - 5.5s)
    let intervalId: any;
    const scheduleNext = () => {
      const nextDelay = 2400 + Math.random() * 3200;
      intervalId = setTimeout(() => {
        spawnMango();
        if (Math.random() > 0.45) {
          setTimeout(spawnMango, 500 + Math.random() * 700);
        }
        scheduleNext();
      }, nextDelay);
    };

    scheduleNext();

    return () => {
      clearTimeout(initialTimer1);
      clearTimeout(initialTimer2);
      clearTimeout(intervalId);
    };
  }, [isAnalyzing]);

  // Handle Mango Catch (Immediate on pointerdown/click/tap)
  const handleMangoCatch = (e: React.PointerEvent | React.MouseEvent | React.TouchEvent, mango: FallingMango) => {
    e.stopPropagation();
    if (mango.status !== 'falling') return;

    // Instant sound trigger with overlapping polyphony
    sfx.playSquish();

    // Increment unlock credits in state & localStorage
    if (onCatchMango) {
      onCatchMango();
    }

    const randomMsg = SQUISH_MESSAGES[Math.floor(Math.random() * SQUISH_MESSAGES.length)];
    
    // Capture click coordinate
    let clickY = (e as any).clientY;
    if (clickY === undefined && (e as any).touches && (e as any).touches[0]) {
      clickY = (e as any).touches[0].clientY;
    }

    setMangoes((prev) =>
      prev.map((m) =>
        m.id === mango.id
          ? {
              ...m,
              status: 'squished',
              squishToast: randomMsg,
              landY: clickY,
            }
          : m
      )
    );

    // Clean up squished mango after animation
    setTimeout(() => {
      setMangoes((prev) => prev.filter((m) => m.id !== mango.id));
    }, 1400);
  };

  // When animation ends on ground
  const handleAnimationEnd = (mango: FallingMango) => {
    if (mango.status !== 'falling') return;

    if (mango.landOutcome === 'bounce') {
      sfx.playBounce();
    }

    // Transition to ground state
    setMangoes((prev) =>
      prev.map((m) =>
        m.id === mango.id ? { ...m, status: m.landOutcome } : m
      )
    );

    // Clean up after outcome finishes
    const cleanupDelay = mango.landOutcome === 'splat' ? 2200 : mango.landOutcome === 'kidnapped' ? 1800 : 1200;
    setTimeout(() => {
      setMangoes((prev) => prev.filter((m) => m.id !== mango.id));
    }, cleanupDelay);
  };

  return (
    <>
      {/* Falling Mangoes Weather Layer */}
      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none">
        {mangoes.map((mango) => {
          return (
            <div
              key={mango.id}
              className="absolute"
              style={{
                left: `${mango.xPercent}%`,
                top: 0,
                bottom: 0,
              }}
            >
              {/* Falling State with Generous 2x Hitbox and Zero-Dodge Hover */}
              {mango.status === 'falling' && (
                <div
                  onPointerDown={(e) => handleMangoCatch(e, mango)}
                  onClick={(e) => handleMangoCatch(e, mango)}
                  onAnimationEnd={() => handleAnimationEnd(mango)}
                  className="pointer-events-auto cursor-pointer absolute -translate-x-1/2 p-6 sm:p-8 group touch-manipulation"
                  style={{
                    animation: `fall-to-bottom ${mango.duration}s linear forwards`,
                  }}
                  title="Catch me to unlock interrogation!"
                >
                  {/* Visual Mango with subtle hover glow (no hitbox movement) */}
                  <div
                    style={{
                      fontSize: `${mango.size}px`,
                      transform: `rotate(${mango.wobbleDeg}deg)`,
                      animation: `wobble-mango 1.8s ease-in-out infinite alternate`,
                    }}
                    className="drop-shadow-[0_8px_14px_rgba(0,0,0,0.35)] transition-all duration-150 group-hover:scale-110 group-hover:drop-shadow-[0_0_18px_rgba(255,212,0,0.95)]"
                  >
                    {mango.emoji}
                  </div>
                </div>
              )}

              {/* Squished by User Catch */}
              {mango.status === 'squished' && (
                <div
                  className="absolute pointer-events-none -translate-x-1/2 flex flex-col items-center"
                  style={{
                    top: mango.landY !== undefined ? `${mango.landY - 30}px` : '40vh',
                  }}
                >
                  {/* Juice Splatter & Seed */}
                  <div className="text-4xl sm:text-5xl animate-splat select-none">
                    💥💦 <span className="text-2xl sm:text-3xl">🌱</span>
                  </div>
                  {/* Floating Kidnapped Toast */}
                  <div className="mt-1 px-3 py-1 bg-black text-[#FFD400] font-black text-xs comic-border animate-float-toast whitespace-nowrap shadow-lg select-none">
                    {mango.squishToast}
                  </div>
                </div>
              )}

              {/* Ground Outcome: Splat with seed */}
              {mango.status === 'splat' && (
                <div className="absolute bottom-6 -translate-x-1/2 flex flex-col items-center pointer-events-none animate-splat">
                  <div className="relative flex items-center justify-center">
                    <span className="text-3xl filter drop-shadow">💦</span>
                    <span className="text-xl -ml-2 -mt-1 font-bold">🌱</span>
                  </div>
                  <span className="text-[10px] font-bold bg-black text-amber-300 px-1.5 py-0.5 rounded comic-border scale-90">
                    SPLAT!
                  </span>
                </div>
              )}

              {/* Ground Outcome: Bounce & roll off */}
              {mango.status === 'bounce' && (
                <div
                  className="absolute bottom-6 -translate-x-1/2 pointer-events-none"
                  style={{
                    animation: 'bounce-roll-off 1.2s cubic-bezier(0.2, 0.8, 0.3, 1) forwards',
                    fontSize: `${mango.size * 0.85}px`,
                  }}
                >
                  🥭💨
                </div>
              )}

              {/* Ground Outcome: Rare Kidnapped by Cartoon Hand Easter Egg */}
              {mango.status === 'kidnapped' && (
                <div className="absolute bottom-6 -translate-x-1/2 flex items-center gap-1 pointer-events-none">
                  <div
                    style={{
                      animation: 'kidnap-hand-snatch 1.5s ease-in-out forwards',
                    }}
                    className="flex items-center"
                  >
                    <span className="text-3xl">🫳</span>
                    <span className="text-2xl -ml-2">🥭</span>
                    <span className="ml-1 px-2 py-0.5 bg-black text-red-400 font-extrabold text-xs comic-border shadow-md">
                      GOTCHA! 🚨
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Kidnapped Mango Ready Badge (Bottom Right) */}
      <div
        className={`fixed bottom-5 right-5 z-40 transition-all duration-300 ${
          availableCredits >= 5 ? 'scale-100 opacity-100' : 'scale-95 opacity-90'
        }`}
      >
        <div
          className={`comic-panel p-2.5 px-4 flex items-center gap-2.5 shadow-[4px_4px_0px_#000000] select-none ${
            availableCredits >= 5
              ? 'bg-gradient-to-r from-[#FFD400] to-[#FF9E1B] text-black ring-2 ring-black animate-pulse'
              : 'bg-white text-stone-700'
          }`}
          title="Catch 5 falling mangoes from the sky to unlock interrogation!"
        >
          <span className="text-2xl animate-bounce">
            🥭
          </span>
          <div className="text-left leading-tight">
            <div className="text-[10px] font-black uppercase tracking-wider text-black">
              {availableCredits >= 5 ? 'Unlocked • Ready to Interrogate' : `Catch 5 to Unlock (${5 - availableCredits} more)`}
            </div>
            <div className="font-weirdos text-xl text-black">
              {availableCredits}/5 Mangoes Caught
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
