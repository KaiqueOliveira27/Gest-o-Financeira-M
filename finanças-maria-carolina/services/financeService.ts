import { MonthlyData, CDIConstants } from '../types';

// Helper to format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Calculate monthly CDI rate from yearly rate
export const getMonthlyCDIRate = (): number => {
  return Math.pow(1 + CDIConstants.CURRENT_RATE_YEARLY, 1 / 12) - 1;
};

// Simulate Porquinho (CDB Liquidez Diária approx)
export const simulatePorquinho = (
  initialAmount: number,
  monthlyContribution: number,
  months: number
) => {
  const monthlyRate = getMonthlyCDIRate();
  let currentAmount = initialAmount;
  const data = [];

  for (let i = 1; i <= months; i++) {
    const yieldEarned = currentAmount * monthlyRate;
    currentAmount += yieldEarned + monthlyContribution;
    
    data.push({
      month: i,
      amount: currentAmount,
      yieldEarned: yieldEarned,
      totalInvested: initialAmount + (monthlyContribution * i)
    });
  }
  return data;
};

// Sort data by date
export const sortFinancialData = (data: MonthlyData[]): MonthlyData[] => {
  return [...data].sort((a, b) => a.month.localeCompare(b.month));
};