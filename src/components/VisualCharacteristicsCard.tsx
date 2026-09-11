import React, { useState } from 'react';
import { Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { VisualCharacteristics } from '../types';

interface VisualCharacteristicsCardProps {
  evidence?: VisualCharacteristics;
  language: 'both' | 'ml' | 'en';
}

export const VisualCharacteristicsCard: React.FC<VisualCharacteristicsCardProps> = ({
  evidence,
  language,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!evidence) return null;

  const features = [
    { label: 'Overall Shape', value: evidence.overallShape },
    { label: 'Proportions & Ratio', value: evidence.sizeProportions },
    { label: 'Skin Color & Blush', value: evidence.skinColor },
    { label: 'Color Distribution', value: evidence.colorDistribution },
    { label: 'Skin Texture & Spots', value: `${evidence.skinTexture}; ${evidence.spotsAndMarkings}` },
    { label: 'Tip / Beak Shape', value: evidence.tipNoseShape },
    { label: 'Shoulder & Stem Area', value: `${evidence.shoulderShape}; ${evidence.stemArea}` },
    { label: 'Curvature', value: evidence.curvature },
    ...(evidence.visibleFleshOrSeed ? [{ label: 'Visible Flesh / Cut Section', value: evidence.visibleFleshOrSeed }] : []),
    ...(evidence.distinctiveFeatures ? [{ label: 'Distinctive Marks', value: evidence.distinctiveFeatures }] : []),
  ];

  return (
    <div className="comic-panel bg-white p-5 sm:p-6 shadow-[5px_5px_0px_#000000]">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FFD400] to-[#FF9E1B] comic-border shadow-[2px_2px_0px_#000000] flex items-center justify-center text-xl shrink-0">
            🔍
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black text-black">
              {language === 'ml'
                ? 'ദൃശ്യ നിരീക്ഷണ വിശദാംശങ്ങൾ'
                : language === 'en'
                ? 'Visual Evidence & Characteristics Analyzed'
                : 'Visual Evidence | ദൃശ്യ നിരീക്ഷണങ്ങൾ'}
            </h4>
            <p className="text-xs text-stone-600 font-bold">
              Anatomical cues used for suspect identification (shape, beak, skin, shoulders)
            </p>
          </div>
        </div>

        <button
          type="button"
          className="comic-btn p-2 bg-stone-100 text-black hover:bg-black hover:text-white"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Smooth Accordion Container */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[800px] opacity-100 mt-5 pt-4 border-t-2 border-black/20' : 'max-h-0 opacity-0 mt-0 pt-0'
        }`}
      >
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          {features.map((item, idx) => (
            <div key={idx} className="p-3 bg-stone-50 comic-border shadow-xs space-y-1">
              <span className="font-black text-black uppercase tracking-wider block">
                {item.label}:
              </span>
              <p className="text-stone-800 font-semibold leading-relaxed">
                {item.value}
              </p>
            </div>
          ))}
          <div className="col-span-full pt-2 text-[11px] text-stone-500 font-bold italic">
            * Note: Characteristics not directly observable from the photograph are never fabricated by the AI.
          </div>
        </div>
      </div>
    </div>
  );
};
