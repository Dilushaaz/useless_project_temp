import { GoogleGenAI } from "@google/genai";

export const config = {
  maxDuration: 60,
  api: {
    bodyParser: {
      sizeLimit: "25mb",
    },
  },
};

const MANGO_SYSTEM_PROMPT = `
You are the core AI intelligence behind a bilingual AI application called "Mango AI" (മാങ്ങ AI).
The application's theme is inspired by the Malayalam proverb:
"അണ്ടിയോട് അടുത്താലേ മാങ്ങയുടെ പുളി അറിയൂ" (Meaning: "You only know how sour a mango is when you get close to the seed.")

The user will upload an image. Perform the following steps strictly:

### STEP 1 — IMAGE VALIDATION
Determine whether the uploaded image actually contains a mango.
1. If the image does NOT contain a mango:
   - isValidMango: false
   - validationStatus: "NOT_A_MANGO"
   - validationMessageEn: "That doesn't appear to be a mango 😅 Please upload an image of a mango."
   - validationMessageMl: "ഇത് മാങ്ങയാണെന്ന് തോന്നുന്നില്ല 😅 ഒരു മാങ്ങയുടെ ചിത്രം അപ്ലോഡ് ചെയ്യൂ."
   Do not attempt mango classification on unrelated objects. Return minimal placeholder fields for other keys.

2. If the image is extremely blurry, dark, cropped, obstructed, or otherwise unsuitable:
   - isValidMango: false
   - validationStatus: "BLURRY_OR_UNCLEAR"
   - validationMessageEn: "Could you upload a clearer image so I can identify the mango more reliably? 🥭"
   - validationMessageMl: "മാങ്ങയെ ശരിയായി തിരിച്ചറിയാൻ ഈ ചിത്രം കുറച്ച് ക്ലിയർ ആക്കാമോ? 🥭"
   Return minimal placeholder fields for other keys.

3. If the image clearly contains a mango:
   - isValidMango: true
   - validationStatus: "VALID"
   - validationMessageEn: "Mango detected successfully."
   - validationMessageMl: "മാങ്ങ വിജയകരമായി കണ്ടെത്തി."

### STEP 2 — VISUAL ANALYSIS
Analyze all visually relevant characteristics available in the image:
- Overall shape (ovoid, kidney-shaped, round, elongated, beaked)
- Size proportions & curvature
- Skin color & color distribution (green/yellow/orange/red blushed)
- Skin texture & surface markings/lenticels/spots
- Tip/nose shape (prominent beak, rounded, sinus)
- Shoulder shape & stem cavity
- Ripeness indicators
- Visible flesh/seed if sliced/cut
- NEVER claim characteristics that cannot be observed.

### STEP 3 — MANGO TYPE CLASSIFICATION (PRIORITY: 14 TARGET KERALA VARIETIES ONLY)
CRITICAL CONSTRAINT: The camera input is dedicated EXCLUSIVELY to identifying among the following 14 Kerala mango varieties. The user has confirmed there will NOT be any other mangoes shown. Give these 14 varieties absolute priority:

1. Moovandan (മൂവാണ്ടൻ)
2. Chandrakkaran (ചന്ദ്രക്കാരൻ)
3. Kilichundan (കിളിച്ചുണ്ടൻ / കിലിമൂക്കൻ)
4. Kuttiattoor (കുറ്റ്യാട്ടൂർ മാങ്ങ / നമ്പ്യാർ മാങ്ങ)
5. Kottoorkonam Varikka (കോട്ടൂർക്കോണം വരിക്ക)
6. Kalapady (കലപ്പാടി)
7. Mallissery (മല്ലിശ്ശേരി)
8. Olor (ഒളോർ / ഒലൂർ)
9. Suvarnarekha (സുവർണ്ണരേഖ / സുന്ദരി)
10. Priyur (Prior) (പ്രിയൂർ)
11. Sindooram (Bennet Alphonso) (സിന്ദൂരം)
12. Mundappa (മുണ്ടപ്പ)
13. Vellaikolamban (വെള്ളൈക്കൊളമ്പൻ)
14. Neelam (നീലം)

CLASSIFICATION RULES:
- You MUST select and return ONLY the TOP 3 most probable varieties chosen EXCLUSIVELY from this 14-variety list.
- Rank them 1, 2, 3 in the predictions array.
- The 3 probabilities must be rounded integers that sum to ~100%.

### STEP 4 — TASTE PREDICTION & RIPENESS
For each predicted variety:
- Allowed taste labels: "SWEET" | "SOUR" | "SWEET & SOUR" | "MILD / BALANCED"
- Malayalam equivalents: "മധുരം" | "പുളി" | "മധുരവും പുളിയും" | "മിതമായ / ബാലൻസ്ഡ്"
- Sweetness score: 1-10
- Sourness score: 1-10
- Ripeness category: "UNRIPE" ("പച്ച") | "SEMI-RIPE" ("പാകമാകുന്ന ഘട്ടം") | "RIPE" ("പഴുത്തത്") | "VERY RIPE" ("വളരെ പഴുത്തത്") | "UNKNOWN" ("ഉറപ്പില്ല"), with visual confidence percent (1-100%).

### STEP 5 — MEME GENERATION
For EACH predicted variety, generate a short, hilarious, original, family-friendly meme-style reaction in English and Malayalam.

### STEP 6 — OVERALL VERDICT & DISCLAIMER
- Connect with the proverb "അണ്ടിയോട് അടുത്താലേ മാങ്ങയുടെ പുളി അറിയൂ"
- Sourness risk rating: "Very Low (Mostly Sweet)" | "Moderate (Sweet-Tangy)" | "High (Sharp Tang/Sour)" | "Seed Mystery (Wait till the seed!)"
`;

let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    genAI = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (_) {}
    }

    const { imageBase64, mimeType = "image/jpeg" } = body || {};

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 data" });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, "");
    const ai = getGenAI();

    const imagePart = {
      inlineData: {
        mimeType,
        data: cleanBase64,
      },
    };

    const promptText = `Analyze this mango photograph in detail according to the system prompt instructions.
IMPORTANT VARIETY SCOPE: The camera input is strictly showing one of these 14 Kerala mango varieties:
[Moovandan, Chandrakkaran, Kilichundan, Kuttiattoor, Kottoorkonam Varikka, Kalapady, Mallissery, Olor, Suvarnarekha, Priyur (Prior), Sindooram (Bennet Alphonso), Mundappa, Vellaikolamban, Neelam].
In the "predictions" array, return ONLY the TOP 3 most probable varieties chosen EXCLUSIVELY from this 14-variety list (Rank 1, 2, and 3), with integer percentages that sum to ~100%.

Return a valid JSON object matching this exact structure:
{
  "isValidMango": boolean,
  "validationStatus": "VALID" | "NOT_A_MANGO" | "BLURRY_OR_UNCLEAR",
  "validationMessageEn": string,
  "validationMessageMl": string,
  "isVarietyUncertain": boolean,
  "uncertaintyMessageEn": string,
  "uncertaintyMessageMl": string,
  "visualEvidence": {
    "overallShape": string,
    "sizeProportions": string,
    "skinColor": string,
    "colorDistribution": string,
    "skinTexture": string,
    "spotsAndMarkings": string,
    "tipNoseShape": string,
    "shoulderShape": string,
    "stemArea": string,
    "curvature": string,
    "visibleFleshOrSeed": string,
    "distinctiveFeatures": string
  },
  "ripeness": {
    "categoryEn": "UNRIPE" | "SEMI-RIPE" | "RIPE" | "VERY RIPE" | "UNKNOWN",
    "categoryMl": "പച്ച" | "പാകമാകുന്ന ഘട്ടം" | "പഴുത്തത്" | "വളരെ പഴുത്തത്" | "ഉറപ്പില്ല",
    "visualConfidencePercent": number,
    "explanationEn": string,
    "explanationMl": string
  },
  "predictions": [
    {
      "rank": 1,
      "varietyNameEn": string,
      "varietyNameMl": string,
      "probabilityPercent": number,
      "tasteClassificationEn": "SWEET" | "SOUR" | "SWEET & SOUR" | "MILD / BALANCED",
      "tasteClassificationMl": "മധുരം" | "പുളി" | "മധുരവും പുളിയും" | "മിതമായ / ബാലൻസ്ഡ്",
      "sweetnessScore": number,
      "sournessScore": number,
      "tasteNoteEn": string,
      "tasteNoteMl": string,
      "memeEn": string,
      "memeMl": string,
      "memeTag": string
    }
  ],
  "proverbWisdom": {
    "malayalamProverb": "അണ്ടിയോട് അടുത്താലേ മാങ്ങയുടെ പുളി അറിയൂ",
    "englishProverb": "You only know how sour a mango is when you get close to the seed.",
    "proverbInterpretationEn": string,
    "proverbInterpretationMl": string
  },
  "overallVerdict": {
    "verdictEn": string,
    "verdictMl": string,
    "recommendedPreparationEn": string,
    "recommendedPreparationMl": string,
    "sournessRiskRatingEn": "Very Low (Mostly Sweet)" | "Moderate (Sweet-Tangy)" | "High (Sharp Tang/Sour)" | "Seed Mystery (Wait till the seed!)",
    "sournessRiskRatingMl": "വളരെ കുറവ്" | "മിതമായ പുളി" | "നല്ല പുളി" | "അണ്ടിയോട് അടുത്താലേ അറിയൂ!"
  },
  "disclaimerEn": string,
  "disclaimerMl": string
}`;

    const CANDIDATE_MODELS = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-2.5-pro",
      "gemini-1.5-pro",
    ];

    let lastError: any = null;
    let responseText = "";

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [imagePart, { text: promptText }],
          },
          config: {
            systemInstruction: MANGO_SYSTEM_PROMPT,
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        });

        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed on Vercel:`, err.message || err);
        continue;
      }
    }

    if (!responseText) {
      throw lastError || new Error("All AI vision models are currently busy. Please try again in a moment.");
    }

    const cleanedText = responseText.replace(/```(?:json)?\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleanedText);

    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error("Error analyzing mango on Vercel:", error);
    let userFriendlyMessage = error.message || "Failed to analyze mango image";
    try {
      const parsedErr = typeof error.message === "string" && error.message.startsWith("{") ? JSON.parse(error.message) : null;
      if (parsedErr?.error?.message) {
        userFriendlyMessage = parsedErr.error.message;
      }
    } catch (_) {}

    return res.status(500).json({
      error: userFriendlyMessage,
    });
  }
}
