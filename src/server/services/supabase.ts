/**
 * Supabase Service for Express Backend
 * Simple direct client for server-side operations
 */

// Load environment variables first
import '../env.js';

import { createClient } from '@supabase/supabase-js';

// Support both NEXT_PUBLIC_ and non-prefixed env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
  console.error('⚠️  Supabase not configured. Please update .env file with your Supabase credentials.');
  console.error('   Visit https://supabase.com to create a project and get your credentials.');
  throw new Error('Missing or invalid Supabase environment variables');
}

// Create singleton Supabase client for backend
export const supabase = createClient(supabaseUrl, supabaseKey);
