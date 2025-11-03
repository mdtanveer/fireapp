import { NetWorthItem, SeriesPoint, TimeRange } from '../types/networth';

function monthsForRange(range: TimeRange): number {
  switch (range) {
    case '1M':
      return 1;
    case '3M':
      return 3;
    case '1Y':
      return 12;
    case '5Y':
      return 60;
    case '10Y':
      return 120;
    case 'ALL':
    default:
      return 120; // 10Y default when no history present
  }
}

export function generateNetWorthSeries(
  assets: NetWorthItem[],
  liabilities: NetWorthItem[],
  range: TimeRange,
  planStartDate?: string
): SeriesPoint[] {
  const months = monthsForRange(range);
  const base = planStartDate ? new Date(planStartDate) : new Date();
  let assetValues = assets.map((a) => a.currentValue);
  let liabilityValues = liabilities.map((l) => l.currentValue);

  const points: SeriesPoint[] = [];
  for (let m = 0; m <= months; m += 1) {
    const d = new Date(base.getFullYear(), base.getMonth() + m, 1);
    const netWorth = assetValues.reduce((s, v) => s + v, 0) - liabilityValues.reduce((s, v) => s + v, 0);
    points.push({ date: d.toISOString().slice(0, 10), netWorth });

    // advance values
    assetValues = assetValues.map((v, i) => v * (1 + (assets[i].monthlyGrowthRate ?? 0.004)));
    liabilityValues = liabilityValues.map((v, i) => v * (1 + (liabilities[i].monthlyGrowthRate ?? 0.01)));
  }
  return points;
}


