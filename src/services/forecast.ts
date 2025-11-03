import { CashflowHead, ForecastInputs, ForecastPoint, ForecastResult } from '../types/forecast';

function valueForYear(base: number, years: number, growth: number): number {
  return base * Math.pow(1 + growth, years);
}

function monthlyAmountForHead(head: CashflowHead, monthIndex: number, inflation: number): number {
  const { amount, frequency, annualGrowthRate = 0, matchInflation } = head;
  const yearsElapsed = Math.floor(monthIndex / 12);
  const effGrowth = annualGrowthRate + (matchInflation ? inflation : 0);
  const grown = valueForYear(amount, yearsElapsed, effGrowth);
  if (frequency === 'yearly') {
    if (head.allocationMode === 'annual-lump') {
      // pay once per year in the first month of the year
      return monthIndex % 12 === 0 ? grown : 0;
    }
    // even monthly
    return grown / 12;
  }
  return grown; // monthly
}

export function currentAmountForHead(head: CashflowHead, inflation: number, now: Date = new Date()): number {
  const inputDate = head.inputDate ? new Date(head.inputDate) : new Date();
  const years = Math.max(0, (now.getFullYear() - inputDate.getFullYear()) + (now.getMonth() - inputDate.getMonth()) / 12);
  const effGrowth = (head.annualGrowthRate ?? 0) + (head.matchInflation ? inflation : 0);
  const grown = valueForYear(head.amount, years, effGrowth);
  if (head.frequency === 'yearly') return grown; // yearly amount as of now
  return grown; // monthly amount as of now
}

export function forecastNetWorth(inputs: ForecastInputs, planStartDate?: string): ForecastResult {
  const points: ForecastPoint[] = [];
  let nw = inputs.startNetWorth;
  for (let m = 0; m <= inputs.horizonMonths; m += 1) {
    const incomes = inputs.heads.filter((h) => h.kind === 'income');
    const expenses = inputs.heads.filter((h) => h.kind === 'expense');
    const income = incomes.reduce((s, h) => s + monthlyAmountForHead(h, m, inputs.inflationRate), 0);
    const expense = expenses.reduce((s, h) => s + monthlyAmountForHead(h, m, inputs.inflationRate), 0);
    const surplus = income - expense;
    nw = (nw + surplus) * (1 + inputs.defaultMonthlyReturn);
    const base = planStartDate ? new Date(planStartDate) : new Date();
    const d = new Date(base.getFullYear(), base.getMonth() + m, 1);
    points.push({ monthIndex: m, date: d.toISOString().slice(0, 10), netWorth: nw });
  }
  return { points };
}


