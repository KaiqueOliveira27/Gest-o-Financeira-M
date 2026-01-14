import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eqecfiezurkvacbehupv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxZWNmaWV6dXJrdmFjYmVodXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzODM2MTYsImV4cCI6MjA4Mzk1OTYxNn0.DGEgrNcSyG5-c7UR-53UUi6LmOlmf4-Iafydd7WyUzc';

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
