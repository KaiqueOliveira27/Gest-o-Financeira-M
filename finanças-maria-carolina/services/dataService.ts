import { MonthlyData } from '../types';
import { supabase, isSupabaseConfigured, MonthlyDataRow } from './supabaseClient';

const STORAGE_KEY = 'financial_data';

/**
 * Data service that uses Supabase when available, falls back to localStorage
 */
export class DataService {
    /**
     * Get all monthly data for the current user
     */
    static async getMonthlyData(): Promise<MonthlyData[]> {
        if (isSupabaseConfigured()) {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                // Fetch from Supabase (works with or without authentication)
                const { data, error } = await supabase
                    .from('monthly_data')
                    .select('*')
                    .or(`user_id.is.null,user_id.eq.${user?.id || 'null'}`)
                    .order('month', { ascending: true });

                if (error) {
                    console.error('Supabase fetch error:', error);
                    throw error;
                }

                if (data && data.length > 0) {
                    console.log('Data loaded from Supabase:', data.length, 'records');
                    return data.map(this.mapRowToMonthlyData);
                }
            } catch (error) {
                console.error('Error fetching from Supabase, falling back to localStorage:', error);
            }
        }

        // Fallback to localStorage
        return this.getLocalData();
    }

    /**
     * Save or update monthly data
     */
    static async saveMonthlyData(monthlyData: MonthlyData): Promise<void> {
        if (isSupabaseConfigured()) {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                // Save to Supabase (works with or without authentication)
                const { error } = await supabase
                    .from('monthly_data')
                    .upsert({
                        id: monthlyData.id,
                        user_id: user?.id || null, // Allow NULL for anonymous users
                        month: monthlyData.month,
                        income: monthlyData.income,
                        expenses: monthlyData.expenses,
                        savings_balance: monthlyData.savingsBalance,
                    }, {
                        onConflict: 'id' // Use id as unique constraint
                    });

                if (error) {
                    console.error('Supabase save error:', error);
                    throw error;
                }

                // Also save to localStorage as backup
                this.saveLocalData(monthlyData);
                console.log('Data saved successfully to Supabase');
                return;
            } catch (error) {
                console.error('Error saving to Supabase, falling back to localStorage:', error);
            }
        }

        // Fallback to localStorage
        this.saveLocalData(monthlyData);
    }

    /**
     * Delete monthly data
     */
    static async deleteMonthlyData(id: string): Promise<void> {
        if (isSupabaseConfigured()) {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                // Delete from Supabase (works with or without authentication)
                const { error } = await supabase
                    .from('monthly_data')
                    .delete()
                    .eq('id', id);

                if (error) {
                    console.error('Supabase delete error:', error);
                    throw error;
                }

                // Also delete from localStorage
                this.deleteLocalData(id);
                console.log('Data deleted successfully from Supabase');
                return;
            } catch (error) {
                console.error('Error deleting from Supabase, falling back to localStorage:', error);
            }
        }

        // Fallback to localStorage
        this.deleteLocalData(id);
    }

    /**
     * Map database row to MonthlyData type
     */
    private static mapRowToMonthlyData(row: MonthlyDataRow): MonthlyData {
        return {
            id: row.id,
            month: row.month,
            income: Number(row.income),
            expenses: Number(row.expenses),
            savingsBalance: Number(row.savings_balance),
        };
    }

    /**
     * Get data from localStorage
     */
    private static getLocalData(): MonthlyData[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    }

    /**
     * Save data to localStorage
     */
    private static saveLocalData(monthlyData: MonthlyData): void {
        try {
            const existingData = this.getLocalData();
            const index = existingData.findIndex(d => d.id === monthlyData.id);

            if (index >= 0) {
                existingData[index] = monthlyData;
            } else {
                existingData.push(monthlyData);
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    /**
     * Delete data from localStorage
     */
    private static deleteLocalData(id: string): void {
        try {
            const existingData = this.getLocalData();
            const filtered = existingData.filter(d => d.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        } catch (error) {
            console.error('Error deleting from localStorage:', error);
        }
    }

    /**
     * Sync localStorage data to Supabase (useful for migration)
     */
    static async syncLocalToSupabase(): Promise<void> {
        if (!isSupabaseConfigured()) {
            console.warn('Supabase not configured, cannot sync');
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                console.warn('User not authenticated, cannot sync');
                return;
            }

            const localData = this.getLocalData();

            for (const item of localData) {
                await this.saveMonthlyData(item);
            }

            console.log(`Synced ${localData.length} items to Supabase`);
        } catch (error) {
            console.error('Error syncing to Supabase:', error);
        }
    }
}
