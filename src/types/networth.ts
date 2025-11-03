export type ItemKind = 'asset' | 'liability';

export type NetWorthItem = {
  id: string;
  kind: ItemKind;
  name: string;
  category?: string;
  currentValue: number;
  monthlyGrowthRate?: number; // 0.004 => 0.4%/mo
};

export type TimeRange = '1M' | '3M' | '1Y' | '5Y' | '10Y' | 'ALL';

export type SeriesPoint = { date: string; netWorth: number };


