import React, { useState, useEffect } from 'react';
import { Languages, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { sfx } from '../utils/audio';

interface NavbarProps {
  language: 'both' | 'ml' | 'en';
  setLanguage: (lang: 'both' | 'ml' | 'en') => void;
  onReset: () => void;
  hasResult: boolean;
}

const ROTATING_TAGLINES = [
  'Kidnapping every mango you see.',
  'No mango is safe.',
  'Snitching on sourness since today.',
  'We profile mangoes, not people.',
  '100% seed interrogation accuracy.',
];

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  onReset,
  hasResult,
}) => {
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(sfx.getIsMuted());

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIdx((prev) => (prev + 1) % ROTATING_TAGLINES.length);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const muted = sfx.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="w-full bg-gradient-to-r from-[#FFD400] via-[#FFA826] to-[#FF9E1B] text-black sticky top-0 z-40 border-b-[3.5px] border-black shadow-[0_4px_0px_#000000]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Lockup */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-12 h-12 bg-white comic-border shadow-[2px_2px_0px_#000000] flex items-center justify-center text-3xl group-hover:rotate-6 group-hover:scale-105 transition-transform">
            🥭
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-weirdos text-4xl sm:text-5xl tracking-widest text-black flex items-center gap-1.5 uppercase mt-0.5 leading-none">
                MangAI
              </h1>
            </div>
            {/* Animated Rotating Subtitle / Tagline */}
            <p className="text-[11px] sm:text-xs text-black font-extrabold tracking-wider mt-0.5 uppercase flex items-center gap-1 transition-opacity duration-300">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping mr-0.5" />
              {ROTATING_TAGLINES[taglineIdx]}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound FX Toggle Button */}
          <button
            id="sfx-toggle-btn"
            type="button"
            onClick={handleToggleSound}
            className={`comic-btn p-1.5 sm:px-2.5 sm:py-1.5 flex items-center gap-1 text-xs font-black uppercase shadow-[2px_2px_0px_#000000] ${
              isMuted
                ? 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                : 'bg-white text-black hover:bg-amber-100'
            }`}
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-600" />
                <span className="hidden sm:inline">MUTED</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline">SFX ON</span>
              </>
            )}
          </button>

          {/* Language Selector */}
          <div className="inline-flex items-center bg-white comic-border shadow-[2px_2px_0px_#000000] p-0.5 text-xs font-black text-black">
            <Languages className="w-4 h-4 ml-2 mr-1 text-black" />
            <button
              id="lang-toggle-both"
              onClick={() => setLanguage('both')}
              className={`px-2.5 sm:px-3 py-1 uppercase rounded-md transition-all font-bold cursor-pointer ${
                language === 'both'
                  ? 'bg-black text-white shadow-xs'
                  : 'hover:bg-amber-100 text-black'
              }`}
            >
              Both
            </button>
            <button
              id="lang-toggle-ml"
              onClick={() => setLanguage('ml')}
              className={`px-2.5 sm:px-3 py-1 uppercase rounded-md transition-all font-bold cursor-pointer ${
                language === 'ml'
                  ? 'bg-black text-white shadow-xs'
                  : 'hover:bg-amber-100 text-black'
              }`}
            >
              ML
            </button>
            <button
              id="lang-toggle-en"
              onClick={() => setLanguage('en')}
              className={`px-2.5 sm:px-3 py-1 uppercase rounded-md transition-all font-bold cursor-pointer ${
                language === 'en'
                  ? 'bg-black text-white shadow-xs'
                  : 'hover:bg-amber-100 text-black'
              }`}
            >
              EN
            </button>
          </div>

          {/* Reset button when viewing results */}
          {hasResult && (
            <button
              id="nav-reset-btn"
              onClick={onReset}
              className="comic-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-black text-xs font-black hover:bg-black hover:text-white transition-all uppercase"
              title="Test another mango"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Mango</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
