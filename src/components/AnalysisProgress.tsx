import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface AnalysisProgressProps {
  language: 'both' | 'ml' | 'en';
}

const STEPS = [
  {
    en: 'Step 1: Checking if it’s genuinely a mango...',
    ml: 'ഘട്ടം 1: ഇത് മാങ്ങ തന്നെയോ എന്ന് പരിശോധിക്കുന്നു...',
    icon: '🔍',
  },
  {
    en: 'Step 2: Inspecting parrot-beak tip, shoulder slope & skin dots...',
    ml: 'ഘട്ടം 2: കിലിമൂക്ക്, തോൾഭാഗം, തൊലിയിലെ പുള്ളികൾ പരിശോധിക്കുന്നു...',
    icon: '📐',
  },
  {
    en: 'Step 3: Calculating sweet vs sour probability & ripeness stage...',
    ml: 'ഘട്ടം 3: മധുരവും പുളിയും പഴുപ്പും കണക്കാക്കുന്നു...',
    icon: '🥭',
  },
  {
    en: 'Step 4: Applying “അണ്ടിയോട് അടുത്താലേ മാങ്ങയുടെ പുളി അറിയൂ” algorithm...',
    ml: 'ഘട്ടം 4: “അണ്ടിയോട് അടുത്താലേ പുളി അറിയൂ” തത്വം പ്രയോഗിക്കുന്നു...',
    icon: '💡',
  },
  {
    en: 'Step 5: Frying fresh Kerala memes with chili & salt...',
    ml: 'ഘട്ടം 5: ചൂടൻ നാടൻ മാങ്ങാ മീമുകൾ തയ്യാറാക്കുന്നു...',
    icon: '🌶️',
  },
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ language }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const step = STEPS[currentStepIndex];

  return (
    <div className="rounded-3xl bg-white p-8 sm:p-12 text-center shadow-lg border border-amber-200/60 max-w-xl mx-auto space-y-6">
      {/* Animated Mango */}
      <div className="relative inline-flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 via-amber-500 to-emerald-500 animate-pulse flex items-center justify-center shadow-xl shadow-amber-500/20 text-5xl">
          🥭
        </div>
        <div className="absolute -top-1 -right-1 text-2xl animate-bounce">
          {step.icon}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-stone-900 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
          <span>
            {language === 'ml'
              ? 'മാങ്ങയെ സൂക്ഷ്മമായി നിരീക്ഷിക്കുന്നു...'
              : 'AI Analyzing Mango Anatomy...'}
          </span>
        </h3>

        {/* Current Step Dynamic Text */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/70 min-h-[64px] flex flex-col items-center justify-center transition-all duration-300">
          {(language === 'both' || language === 'ml') && (
            <p className="text-sm font-semibold text-amber-950">
              {step.ml}
            </p>
          )}
          {(language === 'both' || language === 'en') && (
            <p className="text-xs text-stone-600 italic">
              {step.en}
            </p>
          )}
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-2">
        {STEPS.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentStepIndex
                ? 'w-6 bg-amber-500'
                : 'w-2 bg-stone-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
