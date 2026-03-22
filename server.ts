import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';
import { processVibe } from './src/lib/gemini.js';
import { generateId } from './src/lib/utils.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API Endpoint to handle VibeCheck logic
app.post('/api/vibecheck', async (req, res) => {
  try {
    const { input, userId } = req.body;
    
    if (!input || !userId) {
       return res.status(400).json({ error: 'Missing input or userId' });
    }

    console.log(`[API] Processing vibe for user ${userId}: "${input}"`);

    // The backend orchestration process happens here asynchronously
    const result = await processVibe(input);
    
    const vibeId = generateId();
    
    // Save to SQLite Database
    const insertVibe = db.prepare(`
      INSERT INTO vibes (id, userId, vibeLabel, pulseCount, growthPercentage, realVoices, aiRemix, supportMessage, originalInput, musicRecommendations, likes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);

    insertVibe.run(
      vibeId,
      userId,
      result.vibeLabel,
      result.pulseCount,
      result.growthPercentage,
      JSON.stringify(result.realVoices),
      result.aiRemix,
      result.supportMessage || '',
      input,
      JSON.stringify(result.musicRecommendations)
    );

    res.json({
      id: vibeId,
      ...result
    });

  } catch (error) {
    console.error('Core orchestration failed:', error);
    res.status(500).json({ error: 'Failed to process vibe' });
  }
});

// API Endpoint to fetch global vibe history (Top/Recent)
app.get('/api/vibes', (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    
    // Sort primarily by actual user likes, then by global pulse resonance, then newest.
    const vibes = db.prepare('SELECT * FROM vibes ORDER BY likes DESC, pulseCount DESC, createdAt DESC LIMIT ?').all(limit);
    
    // Parse JSON for realVoices and musicRecommendations
    const parsedVibes = vibes.map((v: any) => ({
      ...v,
      realVoices: v.realVoices ? JSON.parse(v.realVoices) : [],
      musicRecommendations: v.musicRecommendations ? JSON.parse(v.musicRecommendations) : []
    }));

    res.json(parsedVibes);
  } catch (error) {
    console.error('Error fetching vibes:', error);
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
});

// API Endpoint to react to a vibe (enforcing 1 per browser userId)
app.post('/api/vibes/react', (req, res) => {
  try {
    const { vibeId, userId, reactionType } = req.body;
    
    if (!vibeId || !userId || !reactionType) {
       return res.status(400).json({ error: 'Missing reaction data' });
    }

    // SQLite will throw if primary key (vibeId, userId, reactionType) already exists
    const reactStmt = db.prepare(`
      INSERT INTO reactions (vibeId, userId, reactionType) VALUES (?, ?, ?)
    `);
    
    reactStmt.run(vibeId, userId, reactionType);
    
    // Increment true likes counter on the vibe itself
    const incrementLikes = db.prepare(`
      UPDATE vibes SET likes = likes + 1 WHERE id = ?
    `);
    
    incrementLikes.run(vibeId);
    
    res.json({ success: true });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
      res.status(409).json({ error: 'Already reacted' });
    } else {
      console.error('Reaction failed:', error);
      res.status(500).json({ error: 'Failed to add reaction' });
    }
  }
});

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Backend] Express server running on port ${PORT}`);
  });
}

export default app;
