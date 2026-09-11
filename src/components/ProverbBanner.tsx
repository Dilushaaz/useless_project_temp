import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, Quote } from 'lucide-react';

interface ProverbBannerProps {
  language: 'both' | 'ml' | 'en';
}

export const ProverbBanner: React.FC<ProverbBannerProps> = ({ language }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative overflow-hidden comic-panel bg-gradient-to-br from-[#120D08] via-[#1E140A] to-[#2B1B0E] text-[#FFFDF5] p-5 sm:p-7 shadow-[6px_6px_0px_#000000]">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFD400] text-black text-xs font-black uppercase tracking-wider comic-badge">
              <Quote className="w-3.5 h-3.5 text-black" />
              <span>Malayalam Proverb Wisdom • പഴഞ്ചൊല്ല്</span>
            </div>

            {/* Proverb Quotes */}
            <div className="space-y-1.5 pt-1">
              {(language === 'both' || language === 'ml') && (
                <p className="font-weirdos text-3xl sm:text-5xl text-[#FFD400] tracking-wide leading-tight drop-shadow-sm">
                  “അണ്ടിയോട് അടുത്താലേ മാങ്ങയുടെ പുളി അറിയൂ”
                </p>
              )}
              {(language === 'both' || language === 'en') && (
                <p className="font-mono text-xs sm:text-sm text-stone-200 uppercase bg-black/40 border border-amber-500/30 p-2.5 rounded-lg inline-block font-semibold">
                  “You only know how sour a mango is when you get close to the seed.”
                </p>
              )}
            </div>
          </div>

          {/* Expand Button */}
          <button
            id="proverb-expander-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            className="comic-btn self-start md:self-center inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFD400] to-[#FF9E1B] text-black font-black uppercase text-xs hover:from-[#FFE600] hover:to-[#FFAE33] transition-all whitespace-nowrap shadow-[3px_3px_0px_#000000]"
          >
            <Info className="w-4 h-4" />
            <span>{isExpanded ? 'HIDE DEEP MEANING' : 'WHY THIS PROVERB?'}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Animated Wisdom Dropdown Container */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-96 opacity-100 mt-6 pt-4 border-t-2 border-amber-500/40' : 'max-h-0 opacity-0 mt-0 pt-0'
          }`}
        >
          <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-black/50 border-2 border-[#FFD400]/40 rounded-xl p-4 space-y-1.5 shadow-inner">
              <span className="font-black text-[#FFD400] uppercase text-xs flex items-center gap-1.5">
                <span>🥭</span> പ്രകൃതി തത്വം (The Botanical Reality):
              </span>
              <p className="text-stone-300 leading-relaxed font-sans">
                മാങ്ങയുടെ പുറംതൊലിയോടു ചേർന്ന ഭാഗം മധുരമാണെങ്കിലും, വിത്തിന് (അണ്ടിക്ക്) ചുറ്റുമുള്ള നാരുകളിൽ പുളിപ്പ് തങ്ങിനിൽക്കും. അതിനാൽ പുറംകണ്ട് മാത്രം മാങ്ങയുടെ യഥാർത്ഥ രുചി പ്രവചിക്കാൻ കഴിയില്ല!
              </p>
            </div>
            <div className="bg-black/50 border-2 border-[#FFD400]/40 rounded-xl p-4 space-y-1.5 shadow-inner">
              <span className="font-black text-[#FFD400] uppercase text-xs flex items-center gap-1.5">
                <span>🧠</span> ജീവിത തത്വം (Life & AI Philosophy):
              </span>
              <p className="text-stone-300 leading-relaxed font-sans">
                Just like a person’s true nature is only known through deeper acquaintance, an AI image scan can predict varieties and ripeness with high probability, but true sweetness requires tasting right down to the seed!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
