export interface MonthlyData {
  id: string;
  month: string; // Format: YYYY-MM
  income: number;
  expenses: number;
  savingsBalance: number; // Total money guarded (invested) at end of month
}

export interface SimulationResult {
  month: number;
  amount: number;
  yieldEarned: number;
}

export enum CDIConstants {
  CURRENT_RATE_YEARLY = 0.1065, // 10.65% approx current CDI
  TAX_RATE_AVERAGE = 0.175 // Average tax for simulation
}