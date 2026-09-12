import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const PORT = 3000;

// Lazy initialization of Gemini client
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set in environment variables.");
    }
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
- NEVER claim characteristics that cannot be observed (e.g., do not say "fibrous flesh" unless cut and visible fiber is seen; say "suggests... but cannot be confirmed visually").

### STEP 3 — MANGO TYPE CLASSIFICATION (PRIORITY: 14 TARGET KERALA VARIETIES ONLY)
CRITICAL CONSTRAINT: The camera input is dedicated EXCLUSIVELY to identifying among the following 14 Kerala mango varieties. The user has confirmed there will NOT be any other mangoes shown. Give these 14 varieties absolute priority:

1. Moovandan (മൂവാണ്ടൻ)
   - Visual profile: Medium-large, elongated-oblong, prominent curved ventral belly, rounded shoulder, yellowish-green to warm yellow when ripe.
   - Taste profile: Sweet with gentle tang, juicy, moderately fibrous. Backyard staple.
   - Cultural/Meme: "മൂന്നാം ആണ്ടിൽ കായ്ക്കുന്ന മൂവാണ്ടൻ! കേരള തറവാടുകളിലെ നിത്യഹരിത താരം!"

2. Chandrakkaran (ചന്ദ്രക്കാരൻ)
   - Visual profile: Small, round to globular, thin skin, yellowish-amber when ripe, soft shoulders, very juicy.
   - Taste profile: Rich sweet honey nectar. The absolute gold standard for Mambazha Pulissery.
   - Cultural/Meme: "ചന്ദ്രക്കാരൻ ഇല്ലാതെ എന്ത് മാമ്പഴ പുളിശ്ശേരി! ഓണസദ്യയുടെ ജീവൻ!"

3. Kilichundan (കിളിച്ചുണ്ടൻ / കിലിമൂക്കൻ)
   - Visual profile: Distinctive hooked parrot-beak / bird-beak tip ("കിളിയുടെ ചുണ്ട്"), elongated body, firm thick greenish-yellow skin.
   - Taste profile: Crisp, tangy/sour when raw/semi-ripe (legendary with rock salt and chili powder), sweet-tart when ripe.
   - Cultural/Meme: "കിളിച്ചുണ്ടൻ കണ്ടാൽ ഉപ്പും മുളകും തനിയെ കയ്യിൽ വരും! പല്ല് പുളിക്കും ഗ്യാരണ്ടി!"

4. Kuttiattoor (കുറ്റ്യാട്ടൂർ മാങ്ങ / നമ്പ്യാർ മാങ്ങ)
   - Visual profile: Kannur's famous GI-tagged mango. Medium sized, smooth spotless glossy golden orange-yellow skin, elegant oval-oblong shape, rounded shoulders.
   - Taste profile: Exceptionally sweet, rich non-fibrous melt-in-mouth pulp, low acidity.
   - Cultural/Meme: "കണ്ണൂരിന്റെ സ്വന്തം GI Tag കുറ്റ്യാട്ടൂർ! ഒറിജിനൽ റോയൽറ്റി, നാരുകളുടെ ശല്യമില്ല!"

5. Kottoorkonam Varikka (കോട്ടൂർക്കോണം വരിക്ക)
   - Visual profile: Heritage South Kerala (Trivandrum) variety. Large, heavy, broad shoulders, thick textured firm fleshy pulp like jackfruit varikka (വരിക്ക മാങ്ങ), golden yellow.
   - Taste profile: Deep honey-like sweetness, thick meaty fiberless slices.
   - Cultural/Meme: "മാങ്ങയിലെ വരിക്കച്ചക്ക! പീസ് പീസായി മുറിച്ചു കഴിക്കാൻ ഇതിലും മികച്ചതില്ല!"

6. Kalapady (കലപ്പാടി)
   - Visual profile: Compact small to medium, rounded-ovate, olive-greenish-yellow skin, neat compact fruit.
   - Taste profile: Intensely sweet dessert mango, early season delicacy.
   - Cultural/Meme: "വലിപ്പത്തിൽ കുഞ്ഞൻ, മധുരത്തിൽ ഭീമൻ! ഒറ്റയിരിപ്പിന് അഞ്ചെണ്ണം അകത്താക്കാം!"

7. Mallissery (മല്ലിശ്ശേരി)
   - Visual profile: Central Kerala / Thrissur heritage mango. Medium, ovate, smooth yellowish-green skin, distinct sweet fragrance, gentle taper.
   - Taste profile: Rich sweet flavor, succulent aromatic pulp.
   - Cultural/Meme: "മല്ലിശ്ശേരിയുടെ മണം അടിച്ചാൽ മതി, വായിൽ കപ്പലോടും!"

8. Olor (ഒളോർ / ഒലൂർ)
   - Visual profile: Malabar / Kozhikode region classic early variety. Oval to elongated, attractive golden yellow with light blush, thin skin.
   - Taste profile: Sweet-tangy balanced flavor, very juicy and refreshing.
   - Cultural/Meme: "വേനലിന്റെ ആദ്യത്തെ വരവ്! ഒളോർ എത്തിയാൽ മാമ്പഴക്കാലം തുടങ്ങി!"

9. Suvarnarekha (സുവർണ്ണരേഖ / സുന്ദരി)
   - Visual profile: Golden-yellow base with a prominent crimson/red blush or line ("സുവർണ്ണ രേഖ") along the sunny shoulder, ovate-oblong, smooth skin.
   - Taste profile: Sweet, juicy, pleasant floral aroma.
   - Cultural/Meme: "മേക്കപ്പില്ലാതെ തന്നെ സുന്ദരി! ചുവപ്പും മഞ്ഞയും ചേർന്ന കളർഫുൾ മാങ്ങ!"

10. Priyur (Prior) (പ്രിയൂർ)
    - Visual profile: Historic Central Travancore / Kottayam royal lineage. Medium to large, oblong, smooth skin turning golden yellow, fibrous sweet flesh.
    - Taste profile: Rich royal sweetness, aromatic pulp.
    - Cultural/Meme: "തിരുവിതാംകൂർ രാജാക്കന്മാരുടെ ഇഷ്ട മാങ്ങ! രാജകീയ പ്രൗഢിയുള്ള പ്രിയൂർ!"

11. Sindooram (Bennet Alphonso) (സിന്ദൂരം)
    - Visual profile: Intense brilliant scarlet / vermillion / sindoor red blush covering the upper half, roundish-ovate, glowing skin.
    - Taste profile: Intensely sweet and rich, dessert quality with pleasant perfume.
    - Cultural/Meme: "സിന്ദൂരം തൊട്ട സുന്ദരി മാങ്ങ! മധുരം കൊണ്ട് വീഴ്ത്തും!"

12. Mundappa (മുണ്ടപ്പ)
    - Visual profile: Large, round/globular with a stout flattened base ("മുണ്ടൻ"), thick skin, greenish-yellow, dense meaty flesh, low fiber.
    - Taste profile: Sweet, hearty, dense sliceable pulp.
    - Cultural/Meme: "കണ്ടാൽ ഒരു ഗുണ്ട, കഴിച്ചാൽ വെറും പഞ്ചസാര! ഹെവി വെയ്റ്റ് ചാമ്പ്യൻ!"

13. Vellaikolamban (വെള്ളൈക്കൊളമ്പൻ)
    - Visual profile: Medium-small, oblong-oval, pale yellowish-green skin ("വെള്ള"), juicy pulp.
    - Taste profile: Sweet with refreshing mild tangy note.
    - Cultural/Meme: "പേരിൽ വെള്ളയുണ്ടെങ്കിലും മധുരത്തിൽ തനി തങ്കം!"

14. Neelam (നീലം)
    - Visual profile: Renowned late-season icon. Medium size, ovate-oblique, distinct prominent beak and sloping shoulder, deep saffron-yellow when fully ripe, thick skin.
    - Taste profile: Rich, intensely sweet, aromatic floral flavor.
    - Cultural/Meme: "എല്ലാവരും കളം വിടുമ്പോൾ തലയുയർത്തി നിൽക്കുന്ന ലേറ്റ് എൻട്രി സൂപ്പർസ്റ്റാർ നീലം!"

CLASSIFICATION RULES:
- You MUST select and return ONLY the TOP 3 most probable varieties chosen EXCLUSIVELY from this 14-variety list. Do not output varieties outside this list (such as Alphonso, Banganapalli, Kesar, Langra, Dasheri, etc.).
- Rank them 1, 2, 3 in the predictions array.
- The 3 probabilities must be rounded integers (e.g. 55, 30, 15 or 60, 25, 15) that sum to 100%.
- Ensure varietyNameEn and varietyNameMl match the official names from the 14 list above.

### STEP 4 — TASTE PREDICTION & RIPENESS
For each predicted variety:
- Allowed taste labels: "SWEET" | "SOUR" | "SWEET & SOUR" | "MILD / BALANCED"
- Malayalam equivalents: "മധുരം" | "പുളി" | "മധുരവും പുളിയും" | "മിതമായ / ബാലൻസ്ഡ്"
- Sweetness score: 1-10
- Sourness score: 1-10
- Taste note MUST state that taste is inferred from the predicted variety and visual ripeness, NOT directly tasted. (e.g. "If correctly identified as Alphonso and properly ripe, it is typically expected to be rich and sweet.")
- Ripeness category: "UNRIPE" ("പച്ച") | "SEMI-RIPE" ("പാകമാകുന്ന ഘട്ടം") | "RIPE" ("പഴുത്തത്") | "VERY RIPE" ("വളരെ പഴുത്തത്") | "UNKNOWN" ("ഉറപ്പില്ല"), with visual confidence percent (1-100%).

### STEP 5 — MEME GENERATION (CRITICAL & HIGH PRIORITY)
For EACH predicted variety, generate a short, hilarious, original, family-friendly meme-style reaction.
Themes: Kerala culture, Malayalam expressions, mango eating, sweet vs sour shock, family situations, summer holidays at tharavadu, tree climbing, salt & chili powder ("ഉപ്പും മുളകും"), ammamma's pickle jar ("അച്ചാർ ഭരണി"), the famous proverb "അണ്ടിയോട് അടുത്താലേ മാങ്ങയുടെ പുളി അറിയൂ", AI judging a mango with supreme confidence.
Provide both an English meme and a Malayalam meme for each!
Examples:
- Alphonso: En: "Looks expensive. Tastes like it knows it. 😂" | Ml: "മാങ്ങയല്ല… VIP ആണ് 😂"
- Totapuri: En: "AI says: Sour mode activated. Uppum mulakum ready cheytho! 😭" | Ml: "പല്ല് പുളിക്കും ഗ്യാരണ്ടി! ഉപ്പും മുളകും എടുത്തോ 😂"

### STEP 6 — OVERALL VERDICT & DISCLAIMER
- Connect with the proverb "അണ്ടിയോട് അടുത്താലേ മാങ്ങയുടെ പുളി അറിയൂ"
- Sourness risk rating: "Very Low (Mostly Sweet)" | "Moderate (Sweet-Tangy)" | "High (Sharp Tang/Sour)" | "Seed Mystery (Wait till the seed!)"
- Recommended preparation (slice cold, salt & chili, pulissery, pickle, mango shake, etc.)
- Clear disclaimer in both languages that visual analysis cannot guarantee exact variety or flavor from an image alone.
`;

async function startServer() {
  const app = express();

  // Support up to 25mb payload for image uploads
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true, limit: "25mb" }));

  // API Health Check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Main Analyze Mango API Route
  app.post("/api/analyze-mango", async (req, res) => {
    try {
      const { imageBase64, mimeType = "image/jpeg" } = req.body;

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
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite",
        "gemini-3.1-flash-lite-preview",
        "gemini-3.7-flash",
        "gemini-3-flash-preview",
        "gemini-3.6-flash",
        "gemini-3.8-flash",
        "gemini-3.5-flash",
        "gemini-flash-latest",
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
          console.warn(`Model ${modelName} failed, attempting next candidate:`, err.message || err);
          // If it's 503 UNAVAILABLE or temporary spike, continue to next model
          continue;
        }
      }

      if (!responseText) {
        throw lastError || new Error("All AI vision models are currently busy. Please try again in a moment.");
      }

      let parsed;
      try {
        const cleanedText = responseText.replace(/```(?:json)?\n?/g, '').replace(/```\n?/g, '').trim();
        parsed = JSON.parse(cleanedText);
      } catch (parseErr) {
        console.error("Failed to parse JSON response:", responseText);
        return res.status(500).json({
          error: "Failed to parse model response",
          rawText: responseText,
        });
      }

      return res.json(parsed);
    } catch (error: any) {
      console.error("Error analyzing mango:", error);
      let userFriendlyMessage = error.message || "Failed to analyze mango image";
      try {
        // If error message is a JSON string from the API, extract cleaner message
        const parsedErr = typeof error.message === 'string' && error.message.startsWith('{') ? JSON.parse(error.message) : null;
        if (parsedErr?.error?.message) {
          userFriendlyMessage = parsedErr.error.message;
        }
      } catch (_) {}

      return res.status(500).json({
        error: userFriendlyMessage,
      });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mango AI server running at http://localhost:${PORT}`);
  });
}

startServer();
