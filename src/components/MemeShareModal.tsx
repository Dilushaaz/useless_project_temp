import React, { useRef, useState } from 'react';
import { X, Copy, Check, Download, Share2, Sparkles } from 'lucide-react';
import { MangoPrediction } from '../types';

interface MemeShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: MangoPrediction;
  imageUrl?: string;
  language: 'both' | 'ml' | 'en';
}

export const MemeShareModal: React.FC<MemeShareModalProps> = ({
  isOpen,
  onClose,
  prediction,
  imageUrl,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleCopyText = () => {
    const text = `🥭 Mango AI Variety: ${prediction.varietyNameEn} (${prediction.varietyNameMl})\n` +
      `Confidence: ${prediction.probabilityPercent}%\n` +
      `Taste: ${prediction.tasteClassificationEn} (Sweet: ${prediction.sweetnessScore}/10, Sour: ${prediction.sournessScore}/10)\n\n` +
      `😂 Malayalam Meme: "${prediction.memeMl}"\n` +
      `English: "${prediction.memeEn}"\n\n` +
      `“അണ്ടിയോട് അടുത്താലേ മാങ്ങയുടെ പുളി അറിയൂ” 🥭`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-3xl bg-stone-900 shadow-2xl border border-amber-500/40 overflow-hidden text-white animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Kerala Meme Share Card</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Card preview */}
        <div className="p-5">
          <div
            ref={cardRef}
            className="rounded-2xl bg-gradient-to-br from-[#122e23] via-[#1b3d2f] to-[#254b3a] p-5 border-2 border-amber-400/50 shadow-xl space-y-4 text-amber-50"
          >
            {/* Top Brand Tag */}
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-amber-400 flex items-center gap-1">
                🥭 Mango AI • മാങ്ങ AI
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                {prediction.memeTag || 'Kerala Meme'}
              </span>
            </div>

            {/* Mango Image if available */}
            {imageUrl && (
              <div className="w-full h-40 rounded-xl overflow-hidden bg-black/40 border border-emerald-700/50 relative">
                <img
                  src={imageUrl}
                  alt={prediction.varietyNameEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-amber-400 text-xs font-black backdrop-blur-xs">
                  {prediction.probabilityPercent}% Match
                </div>
              </div>
            )}

            {/* Variety Titles */}
            <div>
              <h3 className="text-xl font-black text-white">
                {prediction.varietyNameEn}
              </h3>
              <p className="text-sm font-semibold text-emerald-300">
                {prediction.varietyNameMl}
              </p>
            </div>

            {/* Meme Quote Box */}
            <div className="p-4 rounded-xl bg-black/30 border border-emerald-600/40 space-y-2">
              <p className="text-lg font-extrabold text-amber-300 leading-snug">
                {prediction.memeMl}
              </p>
              <p className="text-xs text-emerald-100/80 italic">
                “{prediction.memeEn}”
              </p>
            </div>

            {/* Proverb Tagline */}
            <div className="text-[10px] text-center text-emerald-200/70 border-t border-emerald-800/60 pt-2 font-medium">
              “അണ്ടിയോട് അടുത്താലേ മാങ്ങയുടെ പുളി അറിയൂ” • You only know the sourness near the seed
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-end gap-3">
          <button
            id="modal-copy-text-btn"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-950" />
                <span>Copied for WhatsApp!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Text for WhatsApp</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
