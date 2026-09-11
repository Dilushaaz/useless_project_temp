import React, { useState, useEffect } from 'react';
import { Award, Sparkles, AlertCircle } from 'lucide-react';
import { MangoPrediction } from '../types';
import { sfx } from '../utils/audio';

interface PredictionListProps {
  predictions: MangoPrediction[];
  isVarietyUncertain?: boolean;
  uncertaintyMessageEn?: string;
  uncertaintyMessageMl?: string;
  language: 'both' | 'ml' | 'en';
}

export const PredictionList: React.FC<PredictionListProps> = ({
  predictions,
  isVarietyUncertain,
  uncertaintyMessageEn,
  uncertaintyMessageMl,
  language,
}) => {
  const [animatedWidths, setAnimatedWidths] = useState<number[]>([0, 0, 0]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Animate the confidence bars from 0 to target on mount
    const timer = setTimeout(() => {
      setAnimatedWidths(predictions.slice(0, 3).map((p) => p.probabilityPercent));
    }, 150);

    // If top match > 70%, trigger mango confetti burst and victory sting
    if (predictions[0] && predictions[0].probabilityPercent >= 70) {
      setShowCelebration(true);
      sfx.playSting(); // Play celebratory fanfare
      const confTimer = setTimeout(() => setShowCelebration(false), 3500);
      return () => {
        clearTimeout(timer);
        clearTimeout(confTimer);
      };
    }

    return () => clearTimeout(timer);
  }, [predictions]);

  return (
    <div className="space-y-4 relative">
      {/* Mango Confetti Celebration Burst */}
      {showCelebration && (
        <div className="absolute -top-6 inset-x-0 flex justify-center pointer-events-none z-30 overflow-visible">
          <div className="flex gap-3 text-2xl animate-bounce">
            <span className="animate-spin text-3xl">🥭</span>
            <span className="text-3xl">✨</span>
            <span className="animate-pulse text-3xl">🎉</span>
            <span className="animate-spin text-3xl">🥭</span>
            <span className="text-3xl">✨</span>
          </div>
        </div>
      )}

      {/* Uncertainty Alert if applicable */}
      {isVarietyUncertain && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-100 to-amber-50 border-2 border-black shadow-[3px_3px_0px_#000000] text-xs sm:text-sm text-stone-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            {(language === 'both' || language === 'ml') && (
              <p className="font-bold">
                {uncertaintyMessageMl ||
                  'ഈ ചിത്രത്തിൽ നിന്ന് കൃത്യമായ ഇനം ഉറപ്പിക്കാൻ കഴിയില്ല. ഏറ്റവും സാധ്യതയുള്ളത് താഴെ നൽകുന്നു:'}
              </p>
            )}
            {(language === 'both' || language === 'en') && (
              <p className="text-stone-800 font-semibold">
                {uncertaintyMessageEn ||
                  'The exact variety cannot be confirmed from this image alone. The most likely possibilities are:'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <div>
          <h3 className="font-weirdos text-3xl sm:text-4xl font-bold text-black flex items-center gap-2">
            <span>
              {language === 'ml'
                ? 'സാധ്യതയുള്ള 3 മാങ്ങാ ഇനങ്ങൾ'
                : language === 'en'
                ? 'Top 3 Suspect Mango Varieties'
                : 'Top 3 Probable Varieties | സാധ്യതയുള്ള 3 ഇനങ്ങൾ'}
            </span>
          </h3>
        </div>
        <span className="text-xs text-black font-extrabold bg-white comic-badge px-3 py-1 shadow-[2px_2px_0px_#000000]">
          Interrogation Confidence
        </span>
      </div>

      {/* Predictions Cards Grid (Top 3) */}
      <div className="space-y-4">
        {predictions.slice(0, 3).map((pred, idx) => {
          const isTop = idx === 0;
          const currentWidth = animatedWidths[idx] || 0;

          return (
            <div
              key={idx}
              id={`prediction-card-${idx}`}
              className={`p-6 comic-panel transition-all duration-300 ${
                isTop
                  ? 'bg-gradient-to-br from-[#FFFDF5] via-[#FFF8E6] to-[#FFEFC2] shadow-[6px_6px_0px_#000000]'
                  : 'bg-white shadow-[4px_4px_0px_#000000]'
              }`}
            >
              {/* Header row: Rank, Names & Probability */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 flex items-center justify-center font-black text-base shrink-0 comic-border shadow-[2px_2px_0px_#000000] ${
                      isTop
                        ? 'bg-gradient-to-br from-[#FFD400] to-[#FF9E1B] text-black'
                        : 'bg-black text-white'
                    }`}
                  >
                    #{pred.rank || idx + 1}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h4 className="text-xl sm:text-2xl font-black text-black">
                        {pred.varietyNameEn}
                      </h4>
                      <span className="text-base sm:text-lg font-bold text-emerald-800 font-sans">
                        {pred.varietyNameMl}
                      </span>
                    </div>
                    {isTop && (
                      <span className="inline-block mt-1 px-2.5 py-0.5 bg-black text-[#FFD400] rounded-full text-[10px] font-black uppercase tracking-wider comic-badge shadow-none">
                        ★ Prime Suspect Match
                      </span>
                    )}
                  </div>
                </div>

                {/* Probability Badge */}
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-black tracking-tight text-black flex items-baseline justify-end">
                    {pred.probabilityPercent}
                    <span className="text-lg font-bold text-stone-700 ml-0.5">%</span>
                  </div>
                  <div className="text-[10px] uppercase font-black text-stone-600">
                    Confidence
                  </div>
                </div>
              </div>

              {/* Animated Probability Bar */}
              <div className="w-full bg-stone-100 h-3.5 comic-border overflow-hidden mb-4 p-0.5">
                <div
                  className={`h-full rounded transition-all duration-1000 ease-out ${
                    isTop
                      ? 'bg-gradient-to-r from-[#FFD400] via-[#FF9E1B] to-[#E8503A]'
                      : 'bg-gradient-to-r from-stone-400 via-amber-400 to-amber-500'
                  }`}
                  style={{ width: `${Math.min(currentWidth, 100)}%` }}
                />
              </div>

              {/* Taste Profile Section */}
              <div className="p-4 bg-white comic-border shadow-[3px_3px_0px_#000000] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-black uppercase tracking-wider">
                      Taste Profile:
                    </span>
                    <span className="px-3 py-1 text-xs font-black comic-badge bg-gradient-to-r from-[#FFD400] to-[#FF9E1B] text-black">
                      {pred.tasteClassificationEn} • {pred.tasteClassificationMl}
                    </span>
                  </div>

                  {/* Scores */}
                  <div className="flex items-center gap-3 text-xs font-black uppercase tracking-wider bg-stone-100 px-3 py-1 rounded-lg border border-black">
                    <div className="flex items-center gap-1">
                      <span className="text-stone-700">Sweet:</span>
                      <span className="text-amber-800">
                        {pred.sweetnessScore}/10
                      </span>
                    </div>
                    <span className="text-stone-400">|</span>
                    <div className="flex items-center gap-1">
                      <span className="text-stone-700">Sour:</span>
                      <span className="text-rose-700">
                        {pred.sournessScore}/10
                      </span>
                    </div>
                  </div>
                </div>

                {/* Taste Note */}
                <div className="text-xs space-y-1 pt-2 border-t-2 border-stone-200 text-stone-800">
                  {(language === 'both' || language === 'en') && (
                    <p className="font-bold">
                      <span className="uppercase text-black underline">Taste Expectation:</span> {pred.tasteNoteEn}
                    </p>
                  )}
                  {(language === 'both' || language === 'ml') && (
                    <p className="font-bold text-emerald-950 mt-1 font-sans">
                      {pred.tasteNoteMl}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
