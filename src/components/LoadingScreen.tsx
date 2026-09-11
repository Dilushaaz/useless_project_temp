import React, { useEffect, useState } from 'react';
import { sfx } from '../utils/audio';

const LOADING_CAPTIONS = [
  { en: 'SHAKING THE TREE...', ml: 'മരം നന്നായി കുലുക്കുന്നു...' },
  { en: 'INTERROGATING THE MANGO...', ml: 'മാങ്ങയെ ചോദ്യം ചെയ്യുന്നു...' },
  { en: 'CHECKING ITS ALIBI...', ml: 'ആലിബി പരിശോധിക്കുന്നു...' },
  { en: 'MEASURING SOURNESS AT GUNPOINT...', ml: 'തോക്കിൻമുനയിൽ പുളി അളക്കുന്നു...' },
  { en: 'CONSULTING THE ELDERS...', ml: 'നാട്ടുകാരണവന്മാരോട് ചോദിക്കുന്നു...' },
  { en: 'GOOGLING IF THIS COUNTS AS KIDNAPPING...', ml: 'ഇത് തട്ടിക്കൊണ്ടുപോകലാണോ എന്ന് ഗൂഗിളിൽ നോക്കുന്നു...' },
  { en: 'PROBING SEED PROXIMITY...', ml: 'അണ്ടിയിലെ പുളി കണക്കാക്കുന്നു...' },
  { en: 'TRANSLATING MALAYALAM SEED WISDOM...', ml: 'പഴഞ്ചൊല്ല് തത്വം വ്യാഖ്യാനിക്കുന്നു...' },
];

export const LoadingScreen: React.FC = () => {
  const [captionIndex, setCaptionIndex] = useState(0);

  useEffect(() => {
    // Initial rustle sound
    sfx.playRustle();

    const timer = setInterval(() => {
      setCaptionIndex((prev) => (prev + 1) % LOADING_CAPTIONS.length);
      sfx.playRustle(); // Tree rustle on every caption change
    }, 1700);
    return () => clearInterval(timer);
  }, []);

  const current = LOADING_CAPTIONS[captionIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 comic-panel w-full max-w-md my-auto bg-gradient-to-b from-amber-100 via-amber-50 to-white relative overflow-hidden shadow-[10px_10px_0px_#000000] border-[4px] border-black">
        
        {/* Sky / Orchard Vibe Accent */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-amber-200/40 to-transparent pointer-events-none" />

        {/* Tree and Staggered Bursting Falling Mangoes */}
        <div className="relative w-44 h-52 sm:w-48 sm:h-56 flex items-end justify-center pt-4">
          
          {/* Rapid Panic Shaking Tree */}
          <div className="text-8xl sm:text-9xl animate-shake-panic drop-shadow-[0_12px_16px_rgba(0,0,0,0.3)] z-10 relative select-none">
            🌳
          </div>
          
          {/* Falling Mango 1 - Left Drop */}
          <div className="absolute text-4xl z-20 left-[18%] top-2 animate-drop-1 drop-shadow-md select-none">
            🥭
          </div>

          {/* Falling Mango 2 - Right Drop */}
          <div className="absolute text-3xl z-20 right-[20%] top-6 animate-drop-2 drop-shadow-md select-none">
            🥭
          </div>

          {/* Falling Mango 3 - Center Little One */}
          <div 
            className="absolute text-2xl z-20 left-[48%] top-10 drop-shadow-md select-none"
            style={{
              animation: 'drop-mango-1 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite 0.7s',
            }}
          >
            🥭
          </div>

          {/* Fallen Leaves */}
          <div className="absolute bottom-2 left-6 text-xl animate-pulse select-none">
            🍃
          </div>
          <div className="absolute bottom-1 right-8 text-lg animate-pulse select-none">
            🍂
          </div>
        </div>

        {/* Dynamic Rotating Interrogation Captions */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center text-center space-y-2 w-full">
          <div className="font-weirdos text-2xl sm:text-4xl text-black bg-[#FFD400] px-4 sm:px-5 py-1.5 comic-border shadow-[3px_3px_0px_#000000] tracking-wider uppercase transition-all duration-300">
            {current.en}
          </div>
          <p className="text-xs sm:text-sm font-bold text-stone-700 font-sans tracking-wide">
            {current.ml}
          </p>
        </div>

        {/* Progress meter bar */}
        <div className="w-full bg-stone-200 h-3 comic-border overflow-hidden mt-6">
          <div 
            className="h-full bg-gradient-to-r from-[#FFD400] via-[#FF9E1B] to-[#E8503A] rounded-full"
            style={{
              animation: 'indeterminate-bar 2.4s ease-in-out infinite',
            }}
          />
        </div>

        <p className="text-[10px] sm:text-[11px] font-black text-stone-600 uppercase tracking-widest mt-3">
          Gemini Vision Analysis in Progress
        </p>
      </div>

      <style>{`
        @keyframes indeterminate-bar {
          0% {
            width: 5%;
            transform: translateX(-10%);
          }
          50% {
            width: 70%;
            transform: translateX(40%);
          }
          100% {
            width: 100%;
            transform: translateX(110%);
          }
        }
      `}</style>
    </div>
  );
};
