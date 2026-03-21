import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rxykgbvoljuowcgvgroo.supabase.co';
const supabaseAnonKey = 'sb_publishable_PB1S-fQfvh2PeJ5b8ar-iw_FWlMnpfi';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);