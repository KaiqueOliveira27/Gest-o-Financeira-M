import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
    return !!(supabaseUrl && supabaseAnonKey);
};

// Database types (will be auto-generated after migration)
export interface MonthlyDataRow {
    id: string;
    user_id: string;
    month: string;
    income: number;
    expenses: number;
    savings_balance: number;
    created_at: string;
    updated_at: string;
}
