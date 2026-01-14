import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eqecfiezurkvacbehupv.supabase.co';
// Modern publishable key
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_0-s1jeyozamiJ_LjG-BsaQ_k_VLHite';

console.log('Initializing Supabase with URL:', supabaseUrl.substring(0, 10) + '...');

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});

// For debugging purposes in the browser console
if (typeof window !== 'undefined') {
    (window as any).supabaseDebug = { url: supabaseUrl, isConfigured: !!supabaseUrl };
}

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
