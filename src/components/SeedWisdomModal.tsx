import React, { useState } from 'react';
import { X, Quote } from 'lucide-react';

interface SeedWisdomModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'both' | 'ml' | 'en';
}

export const SeedWisdomModal: React.FC<SeedWisdomModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [biteDepth, setBiteDepth] = useState(30); // 0 (skin) to 100 (seed core)

  if (!isOpen) return null;

  // Compute sourness & sweetness based on bite depth
  const sweetness = Math.max(10 - Math.round(biteDepth / 12), 2);
  const sourness = Math.min(Math.round(biteDepth / 10) + 1, 10);

  const getBiteStatus = () => {
    if (biteDepth < 35) {
      return {
        titleEn: 'Outer Flesh (തൊലിക്കടുത്ത ഭാഗം)',
        descEn: 'Sun-drenched, smooth, pure tropical sweetness. You think you found the sweetest mango in God’s Own Country!',
        descMl: 'സൂര്യപ്രകാശമേറ്റ് പാകമായ മധുരമൂറുന്ന മാംസളമായ ഭാഗം. ലോകത്തിലെ ഏറ്റവും മധുരമുള്ള മാങ്ങയെന്ന് തെറ്റിദ്ധരിക്കുന്ന നിമിഷം!',
        reaction: '😋 Honey Mode',
        bgColor: 'bg-amber-100',
      };
    } else if (biteDepth < 75) {
      return {
        titleEn: 'Mid-Pulp Transition (ഇടത്തരം ഭാഗം)',
        descEn: 'Pleasant tang begins to emerge. Fibers appear, giving a balanced sweet-tangy kick.',
        descMl: 'ചെറിയൊരു പുളിപ്പ് തലപൊക്കുന്നു! മധുരവും പുളിയും ഇഴചേരുന്ന ഉത്തമ നിമിഷം.',
        reaction: '🤤 Sweet-Sour Balance',
        bgColor: 'bg-orange-100',
      };
    } else {
      return {
        titleEn: 'Next to the Seed / അണ്ടി (The Proverb Zone!)',
        descEn: 'BOOM! The acid pocket! Your eyes twitch, cheek muscles clench! “അണ്ടിയോട് അടുത്താലേ മാങ്ങയുടെ പുളി അറിയൂ” proves 100% true!',
        descMl: 'അതാ വന്നു യഥാർത്ഥ പുളി! കണ്ണുചിമ്മും, പല്ല് പുളിക്കും! പഴഞ്ചൊല്ല് അക്ഷരംപ്രതി സത്യമായ നിമിഷം 😂',
        reaction: '😖💥 MAXIMUM PULI (പുളി) ALERT!',
        bgColor: 'bg-rose-100',
      };
    }
  };

  const status = getBiteStatus();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg comic-panel bg-white shadow-[10px_10px_0px_#000000] overflow-hidden text-black animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFD400] via-[#FFA826] to-[#FF9E1B] border-b-[3.5px] border-black p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🌱</span>
            <div>
              <h3 className="text-lg sm:text-xl font-weirdos text-black tracking-wide leading-none">
                Seed Depth Anatomy • അണ്ടി വിജ്ഞാനം
              </h3>
              <p className="text-xs font-bold text-stone-900 mt-0.5">
                “അണ്ടിയോട് അടുത്താലേ മാങ്ങയുടെ പുളി അറിയൂ”
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="comic-btn p-1.5 bg-white text-black hover:bg-black hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Visual Interactive Mango Cross-Section */}
          <div className="relative h-44 comic-border bg-gradient-to-r from-[#FFE57F] via-[#FFCA28] to-[#FF9800] flex items-center justify-center overflow-hidden shadow-inner p-4">
            {/* Outer skin border */}
            <div className="absolute inset-0 border-8 border-emerald-600 rounded-xl pointer-events-none" />

            {/* Seed (Center) */}
            <div
              className={`relative z-10 w-28 h-36 rounded-full bg-gradient-to-b from-[#FFF3D6] to-[#D7B483] comic-border flex flex-col items-center justify-center shadow-lg transition-transform ${
                biteDepth > 75 ? 'scale-110 ring-4 ring-rose-600 animate-sour-wobble' : ''
              }`}
            >
              <span className="text-xs font-black text-black uppercase tracking-wider">
                അണ്ടി
              </span>
              <span className="text-[10px] font-black text-stone-700">
                (The Seed)
              </span>
              <span className="text-[10px] text-rose-700 font-extrabold mt-1">
                പുളി കേന്ദ്രം! 💥
              </span>
            </div>

            {/* Indicator of Current Bite Depth */}
            <div
              className="absolute top-0 bottom-0 w-2 bg-black shadow-md transition-all z-20"
              style={{ left: `${biteDepth}%` }}
            >
              <div className="absolute top-2 -left-3 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold shadow-md">
                👄
              </div>
            </div>
          </div>

          {/* Interactive Depth Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-stone-900 uppercase">
              <span>Outer Peel (തൊലി)</span>
              <span className="text-black bg-[#FFD400] px-2.5 py-0.5 comic-badge">
                Bite Depth: {biteDepth}%
              </span>
              <span className="text-rose-700">Seed Core (അണ്ടി)</span>
            </div>
            <input
              id="bite-depth-slider"
              type="range"
              min="0"
              max="100"
              value={biteDepth}
              onChange={(e) => setBiteDepth(Number(e.target.value))}
              className="w-full accent-black h-3 bg-stone-200 comic-border cursor-pointer"
            />
          </div>

          {/* Current Depth Status */}
          <div className={`p-4 comic-border ${status.bgColor} shadow-[3px_3px_0px_#000000] space-y-2`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-black uppercase">
                {status.titleEn}
              </span>
              <span className="px-3 py-1 comic-badge bg-black text-white text-xs font-black">
                {status.reaction}
              </span>
            </div>

            <p className="text-xs text-stone-800 font-semibold leading-relaxed">
              {status.descEn}
            </p>
            <p className="text-xs font-bold text-emerald-950 font-sans leading-relaxed">
              {status.descMl}
            </p>

            {/* Meters */}
            <div className="pt-2 flex items-center gap-4 text-xs font-black uppercase">
              <div className="flex items-center gap-1.5">
                <span>Sweetness:</span>
                <span className="bg-white px-2 py-0.5 comic-border text-amber-700">
                  {sweetness}/10
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>Sourness:</span>
                <span className="bg-white px-2 py-0.5 comic-border text-rose-700">
                  {sourness}/10
                </span>
              </div>
            </div>
          </div>

          {/* Close button */}
          <div className="pt-1 flex justify-end">
            <button
              onClick={onClose}
              className="comic-btn px-5 py-2 bg-gradient-to-r from-[#FFD400] to-[#FF9E1B] text-black font-black uppercase text-xs tracking-wider"
            >
              Close Wisdom
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
