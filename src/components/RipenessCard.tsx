import React from 'react';
import { Sun, CheckCircle2, AlertCircle } from 'lucide-react';
import { MangoAnalysisResult } from '../types';

interface RipenessCardProps {
  ripeness?: MangoAnalysisResult['ripeness'];
  language: 'both' | 'ml' | 'en';
}

export const RipenessCard: React.FC<RipenessCardProps> = ({
  ripeness,
  language,
}) => {
  if (!ripeness) return null;

  return (
    <div className="comic-panel bg-white p-5 sm:p-6 shadow-[5px_5px_0px_#000000] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FFD400] to-[#FF9E1B] comic-border shadow-[2px_2px_0px_#000000] flex items-center justify-center text-xl shrink-0">
            ☀️
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black text-black">
              {language === 'ml'
                ? 'പഴുപ്പ് കണക്കാക്കൽ (Ripeness Estimation)'
                : 'Ripeness Estimation & Visual Stage'}
            </h4>
            <span className="text-xs text-stone-600 font-bold">
              Assessed from skin blush, shoulder rounding & color transition
            </span>
          </div>
        </div>

        {/* Ripeness Badge & Confidence */}
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1 comic-badge bg-gradient-to-r from-[#FFD400] to-[#FF9E1B] text-black text-xs font-black shadow-[2px_2px_0px_#000000]">
            {ripeness.categoryEn} • {ripeness.categoryMl}
          </span>
          <span className="text-xs font-black text-black bg-stone-100 px-2.5 py-1 comic-border">
            {ripeness.visualConfidencePercent}% Visual Confidence
          </span>
        </div>
      </div>

      {/* Explanations */}
      <div className="p-4 bg-stone-50 comic-border shadow-inner text-xs sm:text-sm space-y-1.5 text-stone-900">
        {(language === 'both' || language === 'ml') && (
          <p className="font-bold text-black font-sans leading-relaxed">
            {ripeness.explanationMl}
          </p>
        )}
        {(language === 'both' || language === 'en') && (
          <p className="text-stone-700 font-medium italic leading-relaxed">
            {ripeness.explanationEn}
          </p>
        )}
      </div>

      {/* Distinction Reminder */}
      <div className="text-xs text-stone-700 flex items-start gap-2 pt-1 font-semibold">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <span>
          <strong className="text-black uppercase">Interrogator's Rule:</strong> Do not confuse yellow skin with guaranteed sweetness. Green varieties (like Moovandan or raw Chandrakaran) carry unique sourness independent of peel color!
        </span>
      </div>
    </div>
  );
};
