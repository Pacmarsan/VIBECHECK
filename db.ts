import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let clientUrl = supabaseUrl;
let clientKey = supabaseKey;

if (!supabaseUrl || !supabaseKey) {
  console.error('[Supabase] CRITICAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from environment.');
  // Provide dummy values to prevent `createClient` from throwing synchronously on boot
  // This allows the Express server to actually start so we can see the logs/health check
  clientUrl = 'https://dummy-url-to-prevent-crash.supabase.co';
  clientKey = 'dummy-key';
} else {
  console.log('[Supabase] Client initialized with URL:', supabaseUrl.substring(0, 10) + '...');
}

export const supabase = createClient(clientUrl, clientKey);



// Default export for compatibility if needed, though named export is preferred
export default supabase;
