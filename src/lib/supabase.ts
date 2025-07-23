import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,       // in .env definieren
  process.env.REACT_APP_SUPABASE_ANON_KEY!   // in .env definieren
);