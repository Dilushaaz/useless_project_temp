export type TasteLabel = 'SWEET' | 'SOUR' | 'SWEET & SOUR' | 'MILD / BALANCED';
export type MalayalamTasteLabel = 'മധുരം' | 'പുളി' | 'മധുരവും പുളിയും' | 'മിതമായ / ബാലൻസ്ഡ്';

export type RipenessCategory = 'UNRIPE' | 'SEMI-RIPE' | 'RIPE' | 'VERY RIPE' | 'UNKNOWN';
export type MalayalamRipenessCategory = 'പച്ച' | 'പാകമാകുന്ന ഘട്ടം' | 'പഴുത്തത്' | 'വളരെ പഴുത്തത്' | 'ഉറപ്പില്ല';

export interface VisualCharacteristics {
  overallShape: string;
  sizeProportions: string;
  skinColor: string;
  colorDistribution: string;
  skinTexture: string;
  spotsAndMarkings: string;
  tipNoseShape: string;
  shoulderShape: string;
  stemArea: string;
  curvature: string;
  visibleFleshOrSeed?: string;
  distinctiveFeatures: string;
}

export interface MangoPrediction {
  rank: number;
  varietyNameEn: string;
  varietyNameMl: string;
  probabilityPercent: number; // e.g. 46 (sum to approx 100)
  tasteClassificationEn: TasteLabel;
  tasteClassificationMl: MalayalamTasteLabel;
  sweetnessScore: number; // 1-10
  sournessScore: number; // 1-10
  tasteNoteEn: string; // explicitly inferred, not guaranteed
  tasteNoteMl: string;
  memeEn: string;
  memeMl: string;
  memeTag: string; // e.g. "VIP Mango", "Uppu & Mulaku Alert"
}

export interface MangoAnalysisResult {
  isValidMango: boolean;
  validationStatus: 'VALID' | 'NOT_A_MANGO' | 'BLURRY_OR_UNCLEAR';
  validationMessageEn: string;
  validationMessageMl: string;
  
  isVarietyUncertain?: boolean;
  uncertaintyMessageEn?: string;
  uncertaintyMessageMl?: string;
  
  visualEvidence?: VisualCharacteristics;
  
  ripeness?: {
    categoryEn: RipenessCategory;
    categoryMl: MalayalamRipenessCategory;
    visualConfidencePercent: number;
    explanationEn: string;
    explanationMl: string;
  };
  
  predictions?: MangoPrediction[];
  
  proverbWisdom?: {
    malayalamProverb: string;
    englishProverb: string;
    proverbInterpretationEn: string;
    proverbInterpretationMl: string;
  };
  
  overallVerdict?: {
    verdictEn: string;
    verdictMl: string;
    recommendedPreparationEn: string;
    recommendedPreparationMl: string;
    sournessRiskRatingEn: 'Very Low (Mostly Sweet)' | 'Moderate (Sweet-Tangy)' | 'High (Sharp Tang/Sour)' | 'Seed Mystery (Wait till the seed!)';
    sournessRiskRatingMl: 'വളരെ കുറവ്' | 'മിതമായ പുളി' | 'നല്ല പുളി' | 'അണ്ടിയോട് അടുത്താലേ അറിയൂ!';
  };
  
  disclaimerEn: string;
  disclaimerMl: string;
}

export interface SampleMango {
  id: string;
  titleEn: string;
  titleMl: string;
  varietyHint: string;
  imageUrl: string;
  descriptionEn: string;
  descriptionMl: string;
}
