import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client for backend operations
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey);
};

// Singleton instance for convenience
export const supabaseServer = createServerClient();
