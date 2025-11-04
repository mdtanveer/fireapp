export type InvestmentType = {
  id: string;
  name: string;
  expectedReturn: number; // percentage
};

export type CustomColumn = {
  value: number;
  investmentTypeId?: string; // Reference to investment type
  type: "asset" | "liability";
};

export type Snapshot = {
  id: string;
  date: string; // YYYY-MM-DD
  customColumns?: Record<string, CustomColumn>;
  investmentTypes?: InvestmentType[];
};

export type SnapshotPoint = { date: string; netWorth: number };
