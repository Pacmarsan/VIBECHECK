const VOICE_MAP: Record<string, string> = {
  // Mapping vibe tones to ElevenLabs Voice IDs
  "Melancholic": "IKne3meq5aSn9XLyUdCD", // Charlie - Deep
  "Ethereal": "FGY2WhTYpPnrIDTdsKH5",    // Laura - Quirky
  "Energetic": "TX3LPaxmHKxFdv7VOQHJ",   // Liam - Energetic
  "Aggressive": "SOYHLrjzK2X1ezoPC6cr",  // Harry - Fierce Warrior
  "Calm": "EXAVITQu4vr4xnSDxMaL",        // Sarah - Reassuring
  "Neutral": "SAz9YHcvj6GT2YYXdXww",     // River - Relaxed, Neutral
};

export async function generateVibeAudio(text: string, tone: string) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY is missing");
  }

  // Find the closest voice based on tone, fallback to Neutral
  const voiceId = VOICE_MAP[tone] || VOICE_MAP["Neutral"];

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`ElevenLabs API error: ${JSON.stringify(errorData)}`);
  }

  // Return the audio as an ArrayBuffer
  return await response.arrayBuffer();
}

import FormData from 'form-data';

export async function transcribeAudio(base64Data: string, mimeType: string): Promise<string> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY is missing");
  }

  const buffer = Buffer.from(base64Data, 'base64');
  const formData = new FormData();
  
  formData.append('file', buffer, {
    filename: 'recording.webm',
    contentType: mimeType,
  });
  formData.append('model_id', 'scribe_v1');

  const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      ...formData.getHeaders(),
    },
    body: formData.getBuffer(),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`ElevenLabs STT error: ${errorData}`);
  }

  const data = await response.json();
  return data.text;
}
