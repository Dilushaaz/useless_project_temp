import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, CheckCircle2, Info, Search } from 'lucide-react';
import { TARGET_KERALA_VARIETIES, KeralaMangoVariety } from '../data/keralaVarieties';

interface KeralaVarietiesGuideProps {
  language: 'both' | 'ml' | 'en';
}

export const KeralaVarietiesGuide: React.FC<KeralaVarietiesGuideProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVariety, setSelectedVariety] = useState<KeralaMangoVariety | null>(null);

  const filteredVarieties = TARGET_KERALA_VARIETIES.filter(
    (v) =>
      v.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.nameMl.includes(searchQuery) ||
      v.specialtyEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.specialtyMl.includes(searchQuery)
  );

  return (
    <div className="rounded-3xl bg-white border border-amber-200/90 shadow-xs overflow-hidden transition-all duration-200">
      {/* Header bar / Toggle */}
      <button
        id="toggle-14-varieties-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent hover:bg-amber-500/15 transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-sm shadow-xs shrink-0">
            14
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-stone-900">
                {language === 'ml'
                  ? 'ക്യാമറ തിരിച്ചറിയുന്ന 14 കേരള മാമ്പഴ ഇനങ്ങൾ'
                  : language === 'en'
                  ? 'Target Pool: 14 Kerala Heritage Mango Varieties'
                  : '14 Priority Kerala Mango Varieties | 14 മാമ്പഴ ഇനങ്ങൾ'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                Top 3 Probability
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              {language === 'ml'
                ? 'ക്യാമറയിൽ കാണിക്കുന്ന ചിത്രങ്ങളിൽ നിന്ന് ഏറ്റവും സാധ്യതയുള്ള 3 ഇനങ്ങൾ മാത്രം കണ്ടെത്തുന്നു.'
                : 'The AI analyzes your photo and predicts the top 3 most probable varieties strictly from this set.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs shrink-0 ml-3">
          <span>{isOpen ? (language === 'ml' ? 'ചുരുക്കുക' : 'Collapse') : (language === 'ml' ? 'വിശദാംശങ്ങൾ' : 'Explore All')}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Quick Pills Bar when collapsed */}
      {!isOpen && (
        <div className="px-5 py-3 border-t border-amber-100/80 bg-amber-50/30 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-stone-500 font-bold uppercase tracking-wider shrink-0 text-[10px] mr-1">
            {language === 'ml' ? 'ഇനങ്ങൾ:' : 'Varieties:'}
          </span>
          {TARGET_KERALA_VARIETIES.map((v, i) => (
            <span
              key={v.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-stone-200/90 text-stone-700 whitespace-nowrap shrink-0 shadow-2xs font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>{language === 'ml' ? v.nameMl.split(' ')[0] : v.nameEn.split(' ')[0]}</span>
            </span>
          ))}
        </div>
      )}

      {/* Expanded View */}
      {isOpen && (
        <div className="p-5 sm:p-6 space-y-4 border-t border-amber-200/70 bg-stone-50/40">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                language === 'ml'
                  ? 'ഇനം തിരയുക (ഉദാ: മൂവാണ്ടൻ, കിളിച്ചുണ്ടൻ, കുറ്റ്യാട്ടൂർ...)'
                  : 'Search by variety name or characteristic (e.g., Kuttiattoor, Moovandan)...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white border border-stone-300 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Grid of 14 varieties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredVarieties.map((variety, idx) => {
              const isSelected = selectedVariety?.id === variety.id;
              return (
                <div
                  key={variety.id}
                  id={`variety-item-${variety.id}`}
                  onClick={() => setSelectedVariety(isSelected ? null : variety)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left relative ${
                    isSelected
                      ? 'bg-amber-50 border-amber-400 shadow-sm ring-1 ring-amber-400/40'
                      : 'bg-white border-stone-200 hover:border-amber-300 hover:bg-amber-50/20 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                        <span className="text-xs text-amber-600 font-extrabold">#{idx + 1}</span>
                        <span>{variety.nameEn}</span>
                      </div>
                      <div className="text-xs font-semibold text-emerald-800">
                        {variety.nameMl}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                        variety.tasteTendencyEn.includes('Sweet')
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-lime-100 text-lime-900'
                      }`}
                    >
                      {language === 'ml' ? variety.tasteTendencyMl : variety.tasteTendencyEn}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-600 line-clamp-2 mt-1">
                    {language === 'ml' ? variety.shapeAndVisualMl : variety.shapeAndVisualEn}
                  </p>

                  <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px]">
                    <span className="text-amber-800 font-medium line-clamp-1">
                      {language === 'ml' ? variety.specialtyMl : variety.specialtyEn}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <span className="text-xs text-stone-500 font-medium">
              💡 {language === 'ml'
                ? 'ക്യാമറയിൽ കാണിക്കുന്ന മാങ്ങയുടെ രൂപവും നിറവും നോക്കി AI ഈ 14 എണ്ണത്തിൽ നിന്ന് ഏറ്റവും യോജിച്ച 3 എണ്ണം മാത്രം പ്രോബബിലിറ്റി അനുസരിച്ച് നൽകും.'
                : 'The camera vision model analyzes beak, skin, shoulders & color to rank the top 3 matches strictly from these 14 varieties.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
