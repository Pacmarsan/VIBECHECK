import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('[Supabase] CRITICAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from environment.');
} else {
  console.log('[Supabase] Client initialized with URL:', supabaseUrl.substring(0, 10) + '...');
}

export const supabase = createClient(supabaseUrl, supabaseKey);


// Default export for compatibility if needed, though named export is preferred
export default supabase;
