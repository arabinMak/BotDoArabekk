import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: 'Café da manhã' | 'Almoço' | 'Jantar' | 'Sobremesa' | 'Lanche';
  calories: number;
  prep_time: number;
  image_url: string;
  ingredients: string[];
  instructions: string[];
  audio_url?: string;
  tags: string[];
  is_bonus: boolean;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  current_day: number;
  completed_days: number[];
  challenge_completed: boolean;
  bonus_unlocked: boolean;
  last_check_in: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
}

export interface DailyCheckIn {
  id: string;
  user_id: string;
  day_number: number;
  checked_in_at: string;
  notes?: string;
}

export interface GeneratedMenu {
  id: string;
  user_id: string;
  goal: string;
  equipment: string[];
  preferences: Record<string, any>;
  menu_data: any;
  created_at: string;
}
