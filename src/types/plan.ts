export type PlanInputs = {
  currentAge: number;
  retirementAge: number;
  lifeExpectancyAge: number;
  currentNetWorth: number;
  annualIncome: number;
  annualExpenses: number;
  preRetirementReturn: number;
  postRetirementReturn: number;
  inflationRate: number;
  targetRetirementSpending: number;
  spendingInTodaysDollars: boolean;
};

export type YearRow = {
  year: number;
  age: number;
  startBalance: number;
  contribution: number;
  withdrawal: number;
  investmentReturn: number;
  endBalance: number;
  endBalanceReal: number;
};

export type ProjectionResult = {
  rows: YearRow[];
  retirementIndex: number;
  retirementBalance: number;
  depletionAge?: number;
  success: boolean;
};


