import React from 'react';
import { ShieldCheck, Sprout } from 'lucide-react';

interface DisclaimerBoxProps {
  disclaimerEn?: string;
  disclaimerMl?: string;
  language: 'both' | 'ml' | 'en';
}

export const DisclaimerBox: React.FC<DisclaimerBoxProps> = ({
  disclaimerEn,
  disclaimerMl,
  language,
}) => {
  const defaultMl =
    'ശ്രദ്ധിക്കുക: ഒരു ചിത്രത്തിൽ നിന്ന് മാത്രം മാങ്ങയുടെ കൃത്യമായ ഇനമോ രുചിയോ 100% ഉറപ്പുനൽകാൻ കഴിയില്ല. വളരുന്ന മണ്ണ്, കാലാവസ്ഥ, മരത്തിന്റെ മൂപ്പ്, പഴുപ്പ് എന്നിവയെ ആശ്രയിച്ചാണ് യഥാർത്ഥ രുചി. ഓർക്കുക: “അണ്ടിയോട് അടുത്താലേ മാങ്ങയുടെ പുളി അറിയൂ!”';

  const defaultEn =
    'Botanical Advisory: Visual AI interrogation cannot legally convict a mango of sweetness from a 2D photograph alone. Actual sourness depends on terroir, orchard soil, tree maturity, and proximity to the stone. Always bite to verify!';

  return (
    <div className="comic-panel bg-[#FFFDF5] p-5 sm:p-6 shadow-[5px_5px_0px_#000000] text-xs sm:text-sm space-y-3">
      <div className="flex items-center gap-2 font-black text-black">
        <ShieldCheck className="w-5 h-5 text-emerald-700" />
        <span className="text-sm uppercase tracking-wider">
          {language === 'ml'
            ? 'AI ശാസ്ത്രീയ സത്യസന്ധതയും നിരാകരണവും'
            : 'AI Botanical Transparency & Kidnapping Disclaimer'}
        </span>
      </div>

      <div className="space-y-2 leading-relaxed bg-white p-3.5 comic-border">
        {(language === 'both' || language === 'ml') && (
          <p className="font-bold text-black font-sans">
            {disclaimerMl || defaultMl}
          </p>
        )}
        {(language === 'both' || language === 'en') && (
          <p className="text-stone-700 italic font-semibold">
            {disclaimerEn || defaultEn}
          </p>
        )}
      </div>

      <div className="pt-1 flex flex-wrap items-center justify-between text-xs font-bold text-stone-600 gap-2">
        <span className="flex items-center gap-1.5">
          <Sprout className="w-4 h-4 text-emerald-600" />
          Honest Interrogations for Kerala Mango Connoisseurs
        </span>
        <span className="px-2 py-0.5 bg-stone-100 comic-border text-[11px]">
          Powered by Gemini Vision
        </span>
      </div>
    </div>
  );
};
