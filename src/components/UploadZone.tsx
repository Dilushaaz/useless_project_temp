import React, { useRef, useState } from 'react';
import { Upload, Camera, Lock, Unlock, Sparkles } from 'lucide-react';

interface UploadZoneProps {
  onImageSelected: (base64: string, mimeType: string, title?: string) => void;
  isLoading: boolean;
  language: 'both' | 'ml' | 'en';
  caughtMangoCount: number;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onImageSelected,
  isLoading,
  language,
  caughtMangoCount,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [shakeLockAlert, setShakeLockAlert] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const isLocked = caughtMangoCount <= 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    if (isLocked) {
      triggerLockShake();
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert(
        language === 'en'
          ? 'Please upload an image file (JPEG, PNG, or WEBP).'
          : 'ദയവായി ഒരു ചിത്രം (JPEG, PNG, അല്ലെങ്കിൽ WEBP) തിരഞ്ഞെടുക്കുക.'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1200;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.88);
          onImageSelected(compressed, 'image/jpeg', file.name);
        } else {
          onImageSelected(rawDataUrl, file.type || 'image/jpeg', file.name);
        }
      };
      img.onerror = () => {
        onImageSelected(rawDataUrl, file.type || 'image/jpeg', file.name);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLocked) return;
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLocked) {
      triggerLockShake();
      return;
    }
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerLockShake = () => {
    setShakeLockAlert(true);
    setTimeout(() => setShakeLockAlert(false), 800);
  };

  const handleActionClick = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (isLocked) {
      triggerLockShake();
      return;
    }
    ref.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Wanted Poster / Kidnap Upload Card */}
      <div
        id="upload-dropzone"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => isLocked && triggerLockShake()}
        className={`relative transition-all duration-300 p-8 sm:p-12 text-center flex flex-col items-center justify-center comic-panel ${
          isLocked
            ? 'bg-stone-50/90 border-stone-800 opacity-95 cursor-default'
            : dragActive
            ? 'bg-gradient-to-b from-[#FFF6D6] to-[#FFE899] scale-[1.01] shadow-[8px_8px_0px_#000000]'
            : 'bg-white hover:shadow-[8px_8px_0px_#000000] cursor-pointer'
        } ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Lock / Unlock Status Badge */}
        <div className="absolute top-3 left-4 flex items-center gap-1.5">
          {isLocked ? (
            <div
              className={`px-3 py-1 bg-stone-900 text-rose-400 text-[11px] font-black uppercase tracking-wider comic-badge shadow-none flex items-center gap-1.5 ${
                shakeLockAlert ? 'animate-bounce text-rose-300 ring-2 ring-rose-500' : ''
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>🥭 Catch a mango to unlock</span>
            </div>
          ) : (
            <div className="px-3 py-1 bg-black text-[#FFD400] text-[11px] font-black uppercase tracking-wider comic-badge shadow-none flex items-center gap-1.5 animate-pulse">
              <Unlock className="w-3.5 h-3.5 text-[#FFD400]" />
              <span>{caughtMangoCount} {caughtMangoCount === 1 ? 'Mango' : 'Mangoes'} in Hand • Unlocked</span>
            </div>
          )}
        </div>

        {/* Avatar Icon */}
        <div
          className={`w-20 h-20 sm:w-24 sm:h-24 comic-border shadow-[3px_3px_0px_#000000] flex items-center justify-center text-4xl sm:text-5xl mb-4 transition-transform ${
            isLocked
              ? 'bg-stone-200 grayscale opacity-80'
              : 'bg-gradient-to-br from-[#FFF5CC] to-[#FFE066] hover:rotate-6 hover:scale-110'
          }`}
        >
          {isLocked ? '🔒' : '🥭'}
        </div>

        {/* Headline */}
        <div className="space-y-2 max-w-lg">
          <h2 className="font-weirdos text-4xl sm:text-5xl text-black uppercase tracking-wide leading-tight break-words">
            {language === 'en'
              ? 'Interrogate a Mango Photograph'
              : language === 'ml'
              ? 'മാങ്ങയുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക'
              : 'Upload Mango Photo | ഫോട്ടോ അപ്‌ലോഡ്'}
          </h2>

          {/* Gamification Locked / Unlocked Notice */}
          <div
            className={`border-2 border-black p-3.5 rounded-xl shadow-xs transition-colors ${
              isLocked
                ? 'bg-rose-50 text-stone-900 border-rose-900'
                : 'bg-[#FFF8E1] text-stone-900'
            }`}
          >
            {isLocked ? (
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-black text-rose-900 uppercase flex items-center justify-center gap-1">
                  <span>⚠️</span> Mango Required for Interrogation
                </p>
                <p className="text-xs font-bold text-stone-800 leading-relaxed">
                  You need a mango in hand before we can interrogate it! Click and catch any falling mango from the sky to unlock upload access.
                </p>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-stone-900 font-bold leading-relaxed">
                {language === 'en'
                  ? 'Mango secured! Drop a photo or snap one now to identify its variety and predict seed sourness.'
                  : language === 'ml'
                  ? 'മാങ്ങ കയ്യിൽ കിട്ടി! ക്യാമറയിലൂടെ ഫോട്ടോയെടുക്കൂ അല്ലെങ്കിൽ അപ്‌ലോഡ് ചെയ്യൂ.'
                  : 'Mango in hand! Upload or snap a photo to classify variety and seed sourness!'}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
          <button
            id="upload-file-btn"
            type="button"
            onClick={() => handleActionClick(fileInputRef)}
            disabled={isLoading}
            className={`comic-btn inline-flex items-center gap-2.5 px-6 py-3 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_#000000] ${
              isLocked
                ? 'bg-stone-300 text-stone-600 hover:bg-stone-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#FFD400] via-[#FFA826] to-[#FF9E1B] text-black hover:from-[#FFE600] hover:to-[#FFAE33]'
            }`}
          >
            {isLocked ? <Lock className="w-4 h-4 text-stone-600" /> : <Upload className="w-4 h-4 text-black" />}
            <span>{isLocked ? 'CATCH MANGO TO UNLOCK' : language === 'ml' ? 'ഫോട്ടോ തിരഞ്ഞെടുക്കുക' : 'CHOOSE PHOTO'}</span>
          </button>

          <button
            id="camera-snap-btn"
            type="button"
            onClick={() => handleActionClick(cameraInputRef)}
            disabled={isLoading}
            className={`comic-btn inline-flex items-center gap-2.5 px-6 py-3 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_#000000] ${
              isLocked
                ? 'bg-stone-200 text-stone-500 hover:bg-stone-200 cursor-not-allowed'
                : 'bg-white hover:bg-stone-50 text-black'
            }`}
          >
            {isLocked ? <Lock className="w-4 h-4 text-stone-500" /> : <Camera className="w-4 h-4 text-black" />}
            <span>{isLocked ? 'LOCKED' : language === 'ml' ? 'ക്യാമറ' : 'SNAP PHOTO'}</span>
          </button>
        </div>

        <p className="mt-4 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
          {isLocked ? '1 Catch = 1 Interrogation Credit' : 'Supports JPG, PNG, WEBP • Max 20MB'}
        </p>
      </div>
    </div>
  );
};
