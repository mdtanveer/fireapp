export type AppData = {
  networth?: any;
  forecast?: any;
  progress?: any;
  assumptions?: any;
  investmenttypes?: any;
  tableSchema?: any;
  livingExpenses?: any;
};

export const STORAGE_KEYS = {
  networth: "fire.networth",
  forecast: "fire.forecast",
  progress: "fire.progress",
  assumptions: "fire.assumptions",
  investmenttypes: "fire.investmenttypes",
  tableSchema: "fire.table-schema",
  livingExpenses: "fire.living-expenses",
};

export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJson<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// Lazy-load defaults to ensure export works even before user edits (no LS yet)
let defaultForecast: any;
try {
  defaultForecast = (await import("../data/forecast.json")).default;
} catch {}
let defaultProgress: any;
try {
  defaultProgress = (await import("../data/progress.json")).default;
} catch {}
let defaultAssumptions: any;
try {
  defaultAssumptions = (await import("../data/assumptions.json")).default;
} catch {}
let defaultInvestmentTypes: any;
try {
  defaultInvestmentTypes = (await import("../data/investmenttypes.json"))
    .default;
} catch {}
let defaultTableSchema: any;
try {
  defaultTableSchema = (await import("../data/table-schema.json")).default;
} catch {}
let defaultLivingExpenses: any;
try {
  defaultLivingExpenses = (await import("../data/living-expenses.json"))
    .default;
} catch {}

export function exportAppData(): AppData {
  const forecastRaw = localStorage.getItem(STORAGE_KEYS.forecast);
  const progressRaw = localStorage.getItem(STORAGE_KEYS.progress);
  const assumptionsRaw = localStorage.getItem(STORAGE_KEYS.assumptions);
  const investmenttypesRaw = localStorage.getItem(STORAGE_KEYS.investmenttypes);
  const tableSchemaRaw = localStorage.getItem(STORAGE_KEYS.tableSchema);
  const livingExpensesRaw = localStorage.getItem(STORAGE_KEYS.livingExpenses);

  return {
    forecast: forecastRaw ? JSON.parse(forecastRaw) : defaultForecast ?? null,
    progress: progressRaw ? JSON.parse(progressRaw) : defaultProgress ?? null,
    assumptions: assumptionsRaw
      ? JSON.parse(assumptionsRaw)
      : defaultAssumptions ?? null,
    investmenttypes: investmenttypesRaw
      ? JSON.parse(investmenttypesRaw)
      : defaultInvestmentTypes ?? null,
    tableSchema: tableSchemaRaw
      ? JSON.parse(tableSchemaRaw)
      : defaultTableSchema ?? null,
    livingExpenses: livingExpensesRaw
      ? JSON.parse(livingExpensesRaw)
      : defaultLivingExpenses ?? null,
  };
}

export function importAppData(data: AppData) {
  if (data.forecast) saveJson(STORAGE_KEYS.forecast, data.forecast);
  if (data.progress) saveJson(STORAGE_KEYS.progress, data.progress);
  if (data.assumptions) saveJson(STORAGE_KEYS.assumptions, data.assumptions);
  if (data.investmenttypes)
    saveJson(STORAGE_KEYS.investmenttypes, data.investmenttypes);
  if (data.tableSchema) saveJson(STORAGE_KEYS.tableSchema, data.tableSchema);
  if (data.livingExpenses)
    saveJson(STORAGE_KEYS.livingExpenses, data.livingExpenses);
}
