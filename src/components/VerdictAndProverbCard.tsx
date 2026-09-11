import React from 'react';
import { Quote, Utensils, Zap, HelpCircle } from 'lucide-react';
import { MangoAnalysisResult } from '../types';

interface VerdictAndProverbCardProps {
  result: MangoAnalysisResult;
  language: 'both' | 'ml' | 'en';
  onOpenSeedVisualizer: () => void;
}

export const VerdictAndProverbCard: React.FC<VerdictAndProverbCardProps> = ({
  result,
  language,
  onOpenSeedVisualizer,
}) => {
  const verdict = result.overallVerdict;

  if (!verdict) return null;

  return (
    <div className="comic-panel bg-gradient-to-br from-[#FFFDF5] via-[#FFF8E6] to-[#FFEAB0] p-6 sm:p-7 shadow-[6px_6px_0px_#000000] space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Overall Verdict Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/20 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-[#FFD400] text-xs font-black uppercase tracking-wider comic-badge shadow-none">
            <Zap className="w-3.5 h-3.5 text-[#FFD400]" />
            <span>AI Final Verdict & Recommendation</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-black">
            {language === 'ml'
              ? 'മാങ്ങയെക്കുറിച്ചുള്ള മൊത്തത്തിലുള്ള വിധി'
              : 'Official Mango Verdict'}
          </h3>
        </div>

        {/* Sourness Risk Pill with Proportional Wobble Animation */}
        {verdict.sournessRiskRatingEn && (
          <div className="text-right flex flex-col items-end">
            <div className="text-[10px] uppercase font-black text-stone-600">
              Seed Sourness Risk
            </div>
            <div className="inline-flex items-center gap-1.5 mt-0.5 px-3.5 py-1.5 bg-rose-600 text-white font-black text-xs comic-badge animate-sour-wobble shadow-[2px_2px_0px_#000000]">
              <span>🔥</span>
              <span>
                {language === 'ml'
                  ? verdict.sournessRiskRatingMl
                  : verdict.sournessRiskRatingEn}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Verdict text */}
      <div className="space-y-2 bg-white p-4 comic-border shadow-[3px_3px_0px_#000000]">
        {(language === 'both' || language === 'ml') && (
          <p className="text-base sm:text-lg font-bold text-black leading-relaxed font-sans">
            {verdict.verdictMl}
          </p>
        )}
        {(language === 'both' || language === 'en') && (
          <p className="text-sm sm:text-base text-stone-800 leading-relaxed italic font-medium">
            “{verdict.verdictEn}”
          </p>
        )}
      </div>

      {/* Recommended Kerala Preparation Style */}
      {verdict.recommendedPreparationEn && (
        <div className="bg-white p-4 comic-border shadow-[3px_3px_0px_#000000] flex items-start gap-3.5">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FFD400] to-[#FF9E1B] comic-border shadow-[2px_2px_0px_#000000] flex items-center justify-center shrink-0 text-2xl">
            🍽️
          </div>
          <div className="space-y-1 flex-1">
            <h4 className="text-xs sm:text-sm font-black text-black flex items-center gap-1.5 uppercase tracking-wide">
              <Utensils className="w-3.5 h-3.5 text-black" />
              <span>Recommended Way to Enjoy (കഴിക്കേണ്ട രീതി):</span>
            </h4>
            <div className="text-xs text-stone-800 space-y-1">
              {(language === 'both' || language === 'ml') && (
                <p className="font-bold text-emerald-950 font-sans">
                  {verdict.recommendedPreparationMl}
                </p>
              )}
              {(language === 'both' || language === 'en') && (
                <p className="text-stone-700 font-medium">
                  {verdict.recommendedPreparationEn}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* The Proverb Anchor Box with Interactive Trigger & Cracking Seed */}
      <div className="comic-panel-dark p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="text-xs text-[#FFD400] font-black uppercase flex items-center gap-1.5 tracking-wider">
            <Quote className="w-3.5 h-3.5 text-[#FFD400]" />
            <span>The Traditional Proverb Reality</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-white font-weirdos tracking-wider">
            “അണ്ടിയോട് അടുത്താലേ മാങ്ങയുടെ പുളി അറിയൂ”
          </p>
          <p className="text-xs text-amber-200/90 italic">
            Outer sweetness can be deceptive until you bite right down to the seed!
          </p>
        </div>

        <button
          id="open-seed-visualizer-btn"
          type="button"
          onClick={onOpenSeedVisualizer}
          className="comic-btn group inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FFD400] via-[#FFA826] to-[#FF9E1B] text-black text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000000] whitespace-nowrap shrink-0"
        >
          <span className="text-base group-hover:scale-125 group-hover:rotate-12 transition-transform inline-block">
            🌱
          </span>
          <span>Seed Anatomy Visualizer</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
};
