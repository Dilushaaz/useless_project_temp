import React, { useState } from 'react';
import { sfx } from '../utils/audio';

export const Footer: React.FC = () => {
  const [isDug, setIsDug] = useState(false);
  const [molePoked, setMolePoked] = useState(false);

  const handleMouseEnterDirt = () => {
    setIsDug(true);
    sfx.playDig();
  };

  const handleMoleClick = () => {
    setMolePoked(!molePoked);
    sfx.playDig();
  };

  return (
    <footer className="relative mt-auto w-full pt-12 overflow-hidden select-none z-10">
      {/* Animated Grass Strip Silhouette on Top Edge */}
      <div className="relative w-full h-8 flex items-end justify-between px-2 overflow-hidden pointer-events-none z-10">
        <svg
          viewBox="0 0 1200 40"
          className="w-full h-8 text-[#2E7D32] fill-current animate-grass-sway preserve-3d"
          preserveAspectRatio="none"
        >
          <path d="M0,40 L0,20 Q15,0 30,22 Q45,2 60,25 Q75,-2 90,20 Q105,4 120,24 Q135,1 150,22 Q165,-3 180,25 Q195,5 210,21 Q225,0 240,24 Q255,2 270,22 Q285,-1 300,25 Q315,3 330,20 Q345,1 360,24 Q375,-2 390,21 Q405,4 420,25 Q435,0 450,22 Q465,-3 480,24 Q495,2 510,20 Q525,4 540,25 Q555,1 570,22 Q585,-2 600,24 Q615,3 630,21 Q645,0 660,25 Q675,-3 690,22 Q705,4 720,24 Q735,1 750,20 Q765,-1 780,25 Q795,3 810,22 Q825,0 840,24 Q855,-2 870,21 Q885,4 900,25 Q915,1 930,22 Q945,-3 960,24 Q975,2 990,20 Q1005,4 1020,25 Q1035,0 1050,22 Q1065,-2 1080,24 Q1095,3 1110,21 Q1125,1 1140,25 Q1155,-3 1170,22 Q1185,2 1200,20 L1200,40 Z" />
        </svg>
      </div>

      {/* Dirt / Soil Ground Area */}
      <div 
        onMouseEnter={handleMouseEnterDirt}
        onMouseLeave={() => setIsDug(false)}
        className="relative bg-gradient-to-b from-[#2B1708] via-[#1F1005] to-[#120802] text-white pt-6 pb-12 px-4 border-t-[3.5px] border-black transition-all duration-300"
      >
        {/* Subtle Pebble / Rock Texture Dots */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#D7B483_1.5px,transparent_1.5px)] [background-size:16px_16px]" />

        {/* Easter Egg: Popping Worm / Mole from Soil */}
        <div 
          onClick={handleMoleClick}
          className="absolute top-1 right-12 sm:right-28 cursor-pointer z-20 group"
          title="Click to poke the underground resident!"
        >
          <div className="relative">
            <div className="text-2xl sm:text-3xl animate-mole group-hover:scale-125 transition-transform">
              {molePoked ? '🪱' : '🦔'}
            </div>
            {/* Dirt mound */}
            <div className="w-10 h-3 bg-[#3D220E] rounded-full mx-auto -mt-1 border border-black/40" />
          </div>
        </div>

        {/* Easter Egg: Shovel Tooltip Indicator */}
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10 space-y-4">
          
          {/* Shovel Digging Prompt */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-amber-500/30 text-[11px] font-bold text-amber-300 uppercase tracking-widest cursor-pointer hover:bg-black">
            <span>{isDug ? '⛏️ DIRT UNEARTHED!' : '🪵 HOVER TO DIG IN DIRT'}</span>
          </div>

          {/* Half-Buried Wordmark ("MANGAI") with Submersion Mask Effect */}
          <div className="relative overflow-hidden py-1 px-4">
            <div
              className={`font-weirdos text-6xl sm:text-8xl tracking-widest text-[#FFD400] transition-transform duration-500 select-none ${
                isDug ? 'translate-y-0' : 'translate-y-6 sm:translate-y-8'
              }`}
              style={{
                textShadow: '4px 4px 0px #000000',
              }}
            >
              🥭 MANGAI 🥭
            </div>
            {/* Dirt Submersion Overlap Bar */}
            <div className={`absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#2B1708] to-transparent pointer-events-none transition-opacity duration-300 ${
              isDug ? 'opacity-0' : 'opacity-90'
            }`} />
          </div>

          {/* Half-Buried Kidnapping Warning Notice */}
          <div className="relative overflow-hidden max-w-lg">
            <p
              className={`text-xs sm:text-sm font-extrabold text-amber-100 uppercase tracking-wider transition-transform duration-500 leading-relaxed ${
                isDug ? 'translate-y-0' : 'translate-y-1'
              }`}
            >
              ⚠️ WARNING: WE ARE NOT RESPONSIBLE IF YOU GET CAUGHT KIDNAPPING MANGOES FROM NEIGHBORHOOD TREES.
            </p>
          </div>

          {/* Proverb reminder buried underground */}
          <div className="pt-2 text-[11px] text-amber-400/80 font-mono tracking-widest uppercase">
            “അണ്ടിയോട് അടുത്താലേ മാങ്ങയുടെ പുളി അറിയൂ” • 100% Joke & Novelty App
          </div>
        </div>
      </div>
    </footer>
  );
};
