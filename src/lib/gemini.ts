import { GoogleGenAI } from '@google/genai';
import { fetchSocialData } from './firecrawl.js';
import { queryIntelligencePrompt } from './prompts.js';

export async function processVibe(input: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  // STEP 1: Query Intelligence Engine
  let intelligence: any = {};
  try {
    const intelResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: queryIntelligencePrompt(input),
      config: { responseMimeType: 'application/json' }
    });
    intelligence = JSON.parse(intelResponse.text || "{}");
  } catch (e) {
    console.error("Query Intelligence Error:", e);
    intelligence = {
      vibe: "Unknown Phase", emotion: "Undefined", tone: "Raw",
      queries: [{ q: `Reddit twitter opinions feeling "${input}"`, weight: 1.0 }]
    };
  }

  let searchQueries: string[] = [];
  if (intelligence.queries && Array.isArray(intelligence.queries) && intelligence.queries.length > 0) {
    if (typeof intelligence.queries[0] === 'object' && intelligence.queries[0].q) {
      searchQueries = intelligence.queries
        .sort((a: any, b: any) => (b.weight || 0) - (a.weight || 0))
        .map((itm: any) => itm.q);
    } else {
      searchQueries = intelligence.queries;
    }
  }
  if (searchQueries.length === 0) searchQueries = [input];

  // STEP 2: Fetch raw web data using the intelligent queries
  const rawData = await fetchSocialData(searchQueries);
  const dataContext = rawData.map(d => d.content).join("\n");

  // STEP 3: Final Synthesis
  const prompt = `You are the core engine of "VibeCheck AI", a real-time emotional intelligence engine.
The user's original feeling input: "${input}"

The Query Intelligence Engine identified:
- Vibe: "${intelligence.vibe}"
- Core Emotion: "${intelligence.emotion}"
- Tone: "${intelligence.tone}"

Here is real-time scraped social data matching this feeling from across the internet:
${dataContext.slice(0, 3000) /* truncate to fit context gracefully */}

Based on the input and the scraped data, generate a JSON object with the following exact keys:
- "vibeLabel": Usually "${intelligence.vibe}", but you MUST aggressively adapt it into highly specific Gen Alpha, Gen Z, "brainrot" or deep TikTok aesthetic slang (e.g. "Crashout Season", "-1000 Aura", "Locked In", "Terminal Brainrot", "Delulu Era"). Make it sound like a viral internet aesthetic.
- "pulseCount": A fictitious but realistic number between 1000 and 5000000 representing how many people are feeling this locally/globally.
- "growthPercentage": A realistic growth percent string, e.g. "+142%" or "-10%".
- "realVoices": An array of 3 to 5 realistic short strings (clean human thoughts, 1-2 sentences) expressing similar emotions. Make them sound like real reddit/twitter posts (slightly poetic or raw). 
- "aiRemix": A single powerful, short (<15 words), screenshot-worthy line derived from the feeling and data. No cringe motivation.
- "supportMessage": An empathetic 2-3 sentence paragraph. If the user's emotion and tone are negative/sad/anxious, provide compassionate, validating encouragement to help them feel seen. If their vibe is positive/excited/motivated, provide high-energy, affirming support to amplify their momentum. Strictly follow their implicit communication style and avoid being vague.
- "musicRecommendations": An array of exactly 3 objects representing songs that match this vibe perfectly. Each object must have "title" (string) and "artist" (string).

RESPOND ONLY IN RAW JSON. DO NOT WRAP WITH MARKDOWN LIKE \`\`\`json.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const respText = response.text || "{}";
    const result = JSON.parse(respText);

    return {
      vibeLabel: result.vibeLabel || intelligence.vibe || "Unknown Frequency",
      pulseCount: result.pulseCount || 100,
      growthPercentage: result.growthPercentage || "0%",
      realVoices: result.realVoices || ["Could not parse voices from the ether."],
      aiRemix: result.aiRemix || "Silence is sometimes the loudest feeling.",
      supportMessage: result.supportMessage || "I see you. You're doing exactly what you're meant to be doing. Keep breathing forward.",
      musicRecommendations: result.musicRecommendations || [
        { title: "432Hz White Noise", artist: "The Void" }
      ]
    };
  } catch (e) {
    console.error("Gemini Error:", e);
    // Fallback response if generation fails
    return {
      vibeLabel: "Void Protocol",
      pulseCount: Math.floor(Math.random() * 5000),
      growthPercentage: "+11%",
      realVoices: ["I whispered into the void and the void was too tired to answer."],
      aiRemix: "Even the algorithms get tired.",
      supportMessage: "The void acknowledges your frequency. Stay grounded.",
      musicRecommendations: [
        { title: "Static", artist: "Unknown" }
      ]
    };
  }
}
