export type Snapshot = {
  id: string;
  date: string; // YYYY-MM-DD
  assets: number;
  liabilities: number;
  savings?: number;
  investments?: number;
  realAssetEquity?: number;
  unsecuredDebt?: number;
};

export type SnapshotPoint = { date: string; netWorth: number };


