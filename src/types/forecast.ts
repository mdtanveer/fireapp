export type Frequency = 'monthly' | 'yearly';

export type CashflowHead = {
  id: string;
  kind: 'income' | 'expense';
  name: string;
  amount: number;
  inputDate?: string; // YYYY-MM-DD when the amount was entered
  frequency: Frequency;
  startMonthOffset?: number; // 0 = this month
  endMonthOffset?: number; // inclusive, undefined = ongoing
  annualGrowthRate?: number; // 0.03
  matchInflation?: boolean;
  essential?: boolean; // for "Flexibility" preset
  notes?: string;
  allocationMode?: 'even-monthly' | 'annual-lump';
};

export type ForecastInputs = {
  startNetWorth: number;
  inflationRate: number;
  defaultMonthlyReturn: number;
  horizonMonths: number;
  heads: CashflowHead[];
};

export type ForecastPoint = { monthIndex: number; date: string; netWorth: number };

export type ForecastResult = { points: ForecastPoint[] };


