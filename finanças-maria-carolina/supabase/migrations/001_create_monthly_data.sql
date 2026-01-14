-- Migration: Create monthly_data table for financial tracking
-- Created: 2026-01-14

-- Create monthly_data table
CREATE TABLE IF NOT EXISTS monthly_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- Format: YYYY-MM
  income DECIMAL(10, 2) NOT NULL DEFAULT 0,
  expenses DECIMAL(10, 2) NOT NULL DEFAULT 0,
  savings_balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_month UNIQUE(user_id, month)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_monthly_data_user_month 
  ON monthly_data(user_id, month);

-- Create index for date-based queries
CREATE INDEX IF NOT EXISTS idx_monthly_data_created_at 
  ON monthly_data(created_at DESC);

-- Enable Row Level Security
ALTER TABLE monthly_data ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own monthly data" ON monthly_data;
DROP POLICY IF EXISTS "Users can insert own monthly data" ON monthly_data;
DROP POLICY IF EXISTS "Users can update own monthly data" ON monthly_data;
DROP POLICY IF EXISTS "Users can delete own monthly data" ON monthly_data;

-- RLS Policy: Users can only view their own data
CREATE POLICY "Users can view own monthly data"
  ON monthly_data
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own data
CREATE POLICY "Users can insert own monthly data"
  ON monthly_data
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own data
CREATE POLICY "Users can update own monthly data"
  ON monthly_data
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own data
CREATE POLICY "Users can delete own monthly data"
  ON monthly_data
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
DROP TRIGGER IF EXISTS update_monthly_data_updated_at ON monthly_data;
CREATE TRIGGER update_monthly_data_updated_at
  BEFORE UPDATE ON monthly_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add helpful comment
COMMENT ON TABLE monthly_data IS 'Stores monthly financial data for users including income, expenses, and savings balance';
