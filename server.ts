import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supabase from './db.js';
import { processVibe } from './src/lib/gemini.js';
import { generateId } from './src/lib/utils.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Diagnostic endpoint to verify Vercel booted the Express app correctly
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.VERCEL ? 'vercel' : 'local',
    supabaseConfigured: !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY
  });
});

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
    
    // Save to Supabase (PostgreSQL)
    const { error: dbError } = await supabase
      .from('vibes')
      .insert({
        id: vibeId,
        user_id: userId,
        vibe_label: result.vibeLabel,
        pulse_count: result.pulseCount,
        growth_percentage: result.growthPercentage,
        real_voices: result.realVoices,
        ai_remix: result.aiRemix,
        support_message: result.supportMessage || '',
        original_input: input,
        music_recommendations: result.musicRecommendations,
        likes: 0
      });

    if (dbError) {
      console.error('Supabase Insert Error:', dbError);
      throw new Error(dbError.message);
    }

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
app.get('/api/vibes', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    
    // Sort primarily by actual user likes, then by global pulse resonance, then newest.
    const { data: vibes, error: dbError } = await supabase
      .from('vibes')
      .select('*')
      .order('likes', { ascending: false })
      .order('pulse_count', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (dbError) {
      console.error('Supabase Fetch Error:', dbError);
      throw new Error(dbError.message);
    }

    // Map snake_case from Postgres to camelCase for the frontend (to maintain compatibility)
    const mappedVibes = vibes.map((v: any) => ({
      id: v.id,
      userId: v.user_id,
      vibeLabel: v.vibe_label,
      pulseCount: v.pulse_count,
      growthPercentage: v.growth_percentage,
      realVoices: v.real_voices || [],
      aiRemix: v.ai_remix,
      supportMessage: v.support_message,
      originalInput: v.original_input,
      musicRecommendations: v.music_recommendations || [],
      likes: v.likes,
      createdAt: v.created_at
    }));

    res.json(mappedVibes);
  } catch (error) {
    console.error('Error fetching vibes:', error);
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
});

// API Endpoint to react to a vibe (enforcing 1 per browser userId)
app.post('/api/vibes/react', async (req, res) => {
  try {
    const { vibeId, userId, reactionType } = req.body;
    
    if (!vibeId || !userId || !reactionType) {
       return res.status(400).json({ error: 'Missing reaction data' });
    }

    // Record the reaction in the reactions table
    const { error: reactionError } = await supabase
      .from('reactions')
      .insert({ vibe_id: vibeId, user_id: userId, reaction_type: reactionType });

    if (reactionError) {
      if (reactionError.code === '23505') { // Postgres Unique Constraint error
        return res.status(409).json({ error: 'Already reacted' });
      }
      console.error('Supabase Reaction Error:', reactionError);
      throw new Error(reactionError.message);
    }

    // Increment true likes counter on the vibe itself
    const { error: updateError } = await supabase.rpc('increment_likes', { row_id: vibeId });

    if (updateError) {
      // Fallback if the RPC isn't set up yet: manual increment (less reliable)
      console.warn('RPC increment_likes failed, falling back to manual update', updateError);
      
      const { data: currentVibe } = await supabase
        .from('vibes')
        .select('likes')
        .eq('id', vibeId)
        .single();
        
      await supabase
        .from('vibes')
        .update({ likes: (currentVibe?.likes || 0) + 1 })
        .eq('id', vibeId);
    }
    
    res.json({ success: true });
  } catch (error: any) {
    console.error('Reaction failed:', error);
    res.status(500).json({ error: 'Failed to add reaction' });
  }
});

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Backend] Express server running on port ${PORT}`);
  });
}

export default app;
