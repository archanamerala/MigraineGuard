import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rxykgbvoljuowcgvgroo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_PB1S-fQfvh2PeJ5b8ar-iw_FWlMnpfi';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);