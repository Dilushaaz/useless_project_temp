import React, { useRef } from 'react';
import { AlertTriangle, Upload, Camera, RotateCcw } from 'lucide-react';
import { MangoAnalysisResult } from '../types';

interface ValidationAlertProps {
  result: MangoAnalysisResult;
  language: 'both' | 'ml' | 'en';
  onTryAgain: () => void;
  onImageSelected?: (base64: string, mimeType: string, title?: string) => void;
}

export const ValidationAlert: React.FC<ValidationAlertProps> = ({
  result,
  language,
  onTryAgain,
  onImageSelected,
}) => {
  const isBlurry = result.validationStatus === 'BLURRY_OR_UNCLEAR';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (onImageSelected) {
        onImageSelected(base64, file.type || 'image/jpeg', file.name);
      } else {
        onTryAgain();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="comic-panel bg-gradient-to-br from-rose-50 via-white to-amber-50 p-6 sm:p-10 text-center shadow-[8px_8px_0px_#000000] max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Imposter Emoji Badge */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-rose-100 comic-border shadow-[4px_4px_0px_#000000] flex items-center justify-center text-4xl sm:text-5xl mx-auto animate-bounce">
        {isBlurry ? '🧐' : '🚫🥭'}
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-rose-600 text-white text-xs font-black uppercase tracking-wider comic-badge">
          <AlertTriangle className="w-4 h-4 text-white" />
          <span>{isBlurry ? 'Evidence Out Of Focus' : 'Imposter Detected • Rejection Verdict'}</span>
        </div>

        {/* The Exact Manglish Roast */}
        {!isBlurry && (
          <div className="bg-rose-500/10 border-2 border-rose-600 p-4 rounded-xl shadow-xs space-y-2">
            <h2 className="font-weirdos text-3xl sm:text-5xl text-rose-950 tracking-wider uppercase leading-snug">
              “Ninak ath kandittu manga aytt thonnundo mange?”
            </h2>
            <p className="text-xs sm:text-sm font-black text-rose-900 font-mono italic">
              (Translation: “Do you seriously think that looks like a mango, you absolute mango?”)
            </p>
            {(language === 'both' || language === 'ml') && (
              <p className="text-sm sm:text-base font-bold text-rose-900 font-sans pt-1">
                “നിനക്കത് കണ്ടിട്ട് മാങ്ങയായിട്ട് തോന്നുന്നുണ്ടോ മാങ്ങേ?”
              </p>
            )}
          </div>
        )}

        {isBlurry && (
          <div className="bg-amber-100 border-2 border-amber-500 p-4 rounded-xl space-y-1">
            <h2 className="font-weirdos text-3xl sm:text-4xl text-black">
              SUSPECT IMAGE TOO BLURRY!
            </h2>
            <p className="text-xs sm:text-sm font-bold text-stone-800">
              Could you upload a sharper, well-lit photo so we can interrogate the mango properly?
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons Right on the Rejection Card */}
      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          id="validation-reupload-btn"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="comic-btn inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD400] to-[#FF9E1B] text-black font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_#000000]"
        >
          <Upload className="w-4 h-4 text-black" />
          <span>Upload A Real Mango</span>
        </button>

        <button
          id="validation-try-again-btn"
          type="button"
          onClick={onTryAgain}
          className="comic-btn inline-flex items-center gap-2 px-5 py-3 bg-white text-black font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_#000000]"
        >
          <RotateCcw className="w-4 h-4 text-black" />
          <span>Back to Home</span>
        </button>
      </div>

      <p className="text-xs text-stone-600 font-bold uppercase tracking-wider">
        MangAI only interrogates real mangoes. Apples, bananas, and random objects will be roasted without mercy.
      </p>
    </div>
  );
};
