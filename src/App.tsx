import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { MangoAnalysisResult, MangoPrediction } from './types';
import { Navbar } from './components/Navbar';
import { ProverbBanner } from './components/ProverbBanner';
import { UploadZone } from './components/UploadZone';
import { ValidationAlert } from './components/ValidationAlert';
import { PredictionList } from './components/PredictionList';
import { RipenessCard } from './components/RipenessCard';
import { VisualCharacteristicsCard } from './components/VisualCharacteristicsCard';
import { VerdictAndProverbCard } from './components/VerdictAndProverbCard';
import { SeedWisdomModal } from './components/SeedWisdomModal';
import { MemeShareModal } from './components/MemeShareModal';
import { LoadingScreen } from './components/LoadingScreen';
import { FloatingMangoes } from './components/FloatingMangoes';
import { Footer } from './components/Footer';

export default function App() {
  const [language, setLanguage] = useState<'both' | 'ml' | 'en'>('both');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageTitle, setImageTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MangoAnalysisResult | null>(null);
  const [isSeedModalOpen, setIsSeedModalOpen] = useState(false);
  const [shareMemePrediction, setShareMemePrediction] = useState<MangoPrediction | null>(null);

  // Catch-A-Mango Gamification Credit State
  const [caughtMangoCount, setCaughtMangoCount] = useState<number>(() => {
    const saved = localStorage.getItem('mangai_caught_credits');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const handleCatchMango = () => {
    setCaughtMangoCount((prev) => {
      const next = prev + 1;
      localStorage.setItem('mangai_caught_credits', next.toString());
      return next;
    });
  };

  const handleImageSelected = async (base64: string, mimeType: string, title?: string) => {
    setSelectedImage(base64);
    setImageTitle(title || null);
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze-mango', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data: MangoAnalysisResult = await response.json();
      setResult(data);

      // Consume 5 mango interrogation credits upon successful identification
      setCaughtMangoCount((prev) => {
        const next = Math.max(0, prev - 5);
        localStorage.setItem('mangai_caught_credits', next.toString());
        return next;
      });
    } catch (err: any) {
      console.error('Analysis error:', err);
      let msg = err.message || 'Failed to analyze mango image';
      try {
        if (msg.startsWith('{')) {
          const parsed = JSON.parse(msg);
          msg = parsed.error?.message || parsed.message || msg;
        }
      } catch (_) {}

      if (msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')) {
        msg =
          language === 'ml'
            ? 'AI മോഡലിൽ ഇപ്പോൾ കൂടുതൽ തിരക്ക് അനുഭവപ്പെടുന്നു. ദയവായി അല്പം കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കുക.'
            : 'The AI vision service is currently experiencing high demand. Please try again in a few moments.';
      }

      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (selectedImage) {
      let mime = 'image/jpeg';
      if (selectedImage.startsWith('data:image/png')) mime = 'image/png';
      else if (selectedImage.startsWith('data:image/webp')) mime = 'image/webp';
      handleImageSelected(selectedImage, mime, imageTitle || undefined);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImageTitle(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-mono selection:bg-black selection:text-[#FFD400]">
      {/* Ambient Mango Weather Physics & Interactive Catching Gamification */}
      <FloatingMangoes
        isAnalyzing={isLoading}
        onCatchMango={handleCatchMango}
        availableCredits={caughtMangoCount}
      />

      {/* Navbar Header */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        onReset={handleReset}
        hasResult={Boolean(result || selectedImage)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 relative z-10 pb-20 sm:pb-28">
        {/* Cultural Proverb Hero */}
        <ProverbBanner language={language} />

        {/* Error Alert */}
        {error && (
          <div className="p-4 comic-panel bg-rose-50 border-rose-900 text-rose-950 flex items-start justify-between gap-3 shadow-[4px_4px_0px_#000000]">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm">
                <p className="font-black uppercase">Interrogation Notice</p>
                <p className="font-semibold">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="comic-btn text-xs font-black px-3 py-1 bg-white hover:bg-rose-200 text-rose-950 uppercase"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Upload Zone (shown if no image is active or analyzing) */}
        {!selectedImage && !isLoading && (
          <UploadZone
            onImageSelected={handleImageSelected}
            isLoading={isLoading}
            language={language}
            caughtMangoCount={caughtMangoCount}
          />
        )}

        {/* Failed Analysis Recovery Card */}
        {selectedImage && !isLoading && !result && error && (
          <div className="comic-panel bg-white p-6 flex flex-col sm:flex-row items-center gap-6 shadow-[6px_6px_0px_#000000]">
            <div className="w-36 h-36 comic-border overflow-hidden bg-stone-100 shrink-0">
              <img
                src={selectedImage}
                alt="Failed to analyze"
                className="w-full h-full object-cover grayscale-[30%]"
              />
            </div>
            <div className="space-y-3 flex-1 text-center sm:text-left">
              <h3 className="text-base font-black text-black">
                {language === 'ml'
                  ? 'ചിത്രം വീണ്ടും ചോദ്യം ചെയ്യണോ?'
                  : 'Retry Mango Interrogation?'}
              </h3>
              <p className="text-xs text-stone-700 font-semibold">
                {language === 'ml'
                  ? 'സർവീസ് താത്കാലികമായി ലഭ്യമല്ലായിരുന്നു. വീണ്ടും ശ്രമിക്കുകയോ മറ്റൊരു ചിത്രം നൽകുകയോ ചെയ്യാം.'
                  : 'The AI vision service experienced a temporary demand spike. You can retry with this suspect or upload a different one.'}
              </p>
              <div className="flex flex-wrap items-center gap-2.5 justify-center sm:justify-start pt-1">
                <button
                  id="retry-analysis-btn"
                  onClick={handleRetry}
                  className="comic-btn inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#FFD400] to-[#FF9E1B] text-black font-black text-xs uppercase shadow-[3px_3px_0px_#000000]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'ml' ? 'വീണ്ടും ശ്രമിക്കുക (Retry)' : 'Retry Interrogation'}</span>
                </button>
                <button
                  id="choose-different-photo-btn"
                  onClick={handleReset}
                  className="comic-btn inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-black font-black text-xs uppercase shadow-[3px_3px_0px_#000000]"
                >
                  <span>{language === 'ml' ? 'മറ്റൊരു ചിത്രം തിരഞ്ഞെടുക്കുക' : 'Pick Different Mango'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results View */}
        {result && !isLoading && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* If Validation Failed (Not a Mango or Blurry) */}
            {!result.isValidMango ? (
              <ValidationAlert
                result={result}
                language={language}
                onTryAgain={handleReset}
                onImageSelected={handleImageSelected}
              />
            ) : (
              /* If Valid Mango Detected */
              <div className="space-y-6 sm:space-y-8">
                {/* Active Mango Banner & Image Card */}
                <div className="comic-panel bg-white p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6 shadow-[6px_6px_0px_#000000]">
                  {selectedImage && (
                    <div className="w-full sm:w-52 h-52 comic-border overflow-hidden shrink-0 relative group bg-stone-100 shadow-[3px_3px_0px_#000000]">
                      <img
                        src={selectedImage}
                        alt="Analyzed Mango"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 left-0 px-3 py-1 bg-[#FFD400] border-b-[3px] border-r-[3px] border-black text-black text-[11px] font-black uppercase tracking-wider">
                        🎯 Target Captured
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 flex-1 text-center sm:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-[#FFD400] font-black uppercase text-xs comic-badge shadow-none">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD400]" />
                      <span>
                        {language === 'ml'
                          ? 'മാങ്ങ പരിശോധന പൂർത്തിയായി'
                          : 'Mango Interrogation Complete'}
                      </span>
                    </div>

                    {result.predictions && result.predictions[0] && (
                      <div>
                        <span className="text-xs uppercase font-black text-stone-600 tracking-wider block">
                          Prime Suspect Variety (പ്രധാന ഇനം):
                        </span>
                        <h2 className="font-weirdos text-4xl sm:text-6xl text-black flex flex-wrap items-baseline gap-2 leading-none mt-1">
                          <span>{result.predictions[0].varietyNameEn}</span>
                          <span className="text-2xl sm:text-3xl font-bold font-sans text-emerald-800 ml-1">
                            {result.predictions[0].varietyNameMl}
                          </span>
                          <span className="text-xs font-black px-2.5 py-1 bg-gradient-to-r from-[#FFD400] to-[#FF9E1B] comic-badge text-black ml-2 shadow-[2px_2px_0px_#000000]">
                            {result.predictions[0].probabilityPercent}% Match
                          </span>
                        </h2>
                      </div>
                    )}

                    <div className="font-mono text-xs sm:text-sm text-stone-800 font-bold bg-[#FFFDF5] p-3 comic-border shadow-xs">
                      Kidnapped, profiled, and cross-referenced with traditional Kerala seed wisdom.
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                      <button
                        id="test-another-btn"
                        onClick={handleReset}
                        className="comic-btn inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-black hover:bg-black hover:text-white transition-all uppercase shadow-[3px_3px_0px_#000000]"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>KIDNAP ANOTHER</span>
                      </button>

                      <button
                        id="open-seed-wisdom-quick-btn"
                        onClick={() => setIsSeedModalOpen(true)}
                        className="comic-btn inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FFD400] via-[#FFA826] to-[#FF9E1B] text-black text-xs font-black hover:from-[#FFE600] hover:to-[#FFAE33] transition-all uppercase shadow-[3px_3px_0px_#000000]"
                      >
                        <span>🌱 SEED WISDOM</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Ranked Predictions with Taste */}
                {result.predictions && result.predictions.length > 0 && (
                  <PredictionList
                    predictions={result.predictions}
                    isVarietyUncertain={result.isVarietyUncertain}
                    uncertaintyMessageEn={result.uncertaintyMessageEn}
                    uncertaintyMessageMl={result.uncertaintyMessageMl}
                    language={language}
                  />
                )}

                {/* Ripeness Estimation */}
                <RipenessCard
                  ripeness={result.ripeness}
                  language={language}
                />

                {/* Visual Evidence Breakdown */}
                <VisualCharacteristicsCard
                  evidence={result.visualEvidence}
                  language={language}
                />

                {/* Overall Verdict & Cultural Preparation */}
                <VerdictAndProverbCard
                  result={result}
                  language={language}
                  onOpenSeedVisualizer={() => setIsSeedModalOpen(true)}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* In-Progress Interrogation Loading Modal (Highest Z-Index Overlay) */}
      {isLoading && <LoadingScreen />}

      {/* Interactive Seed Wisdom Modal */}
      <SeedWisdomModal
        isOpen={isSeedModalOpen}
        onClose={() => setIsSeedModalOpen(false)}
        language={language}
      />

      {/* Share Meme Card Modal */}
      {shareMemePrediction && (
        <MemeShareModal
          isOpen={Boolean(shareMemePrediction)}
          onClose={() => setShareMemePrediction(null)}
          prediction={shareMemePrediction}
          imageUrl={selectedImage || undefined}
          language={language}
        />
      )}

      {/* Buried in the Dirt Ground Footer */}
      <Footer />
    </div>
  );
}
