export type AppData = {
  networth?: any;
  forecast?: any;
  progress?: any;
  assumptions?: any;
  planner?: any;
  investmenttypes?: any;
};

export const STORAGE_KEYS = {
  networth: "fire.networth",
  forecast: "fire.forecast",
  progress: "fire.progress",
  assumptions: "fire.assumptions",
  planner: "fire.planner",
  investmenttypes: "fire.investmenttypes",
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
let defaultNetworth: any;
try {
  defaultNetworth = (await import("../data/networth.json")).default;
} catch {}
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
let defaultPlanner: any;
try {
  defaultPlanner = (await import("../data/profile.json")).default;
} catch {}
let defaultInvestmentTypes: any;
try {
  defaultInvestmentTypes = (await import("../data/investmenttypes.json"))
    .default;
} catch {}

export function exportAppData(): AppData {
  const networthRaw = localStorage.getItem(STORAGE_KEYS.networth);
  const forecastRaw = localStorage.getItem(STORAGE_KEYS.forecast);
  const progressRaw = localStorage.getItem(STORAGE_KEYS.progress);
  const assumptionsRaw = localStorage.getItem(STORAGE_KEYS.assumptions);
  const plannerRaw = localStorage.getItem(STORAGE_KEYS.planner);
  const investmenttypesRaw = localStorage.getItem(STORAGE_KEYS.investmenttypes);

  return {
    networth: networthRaw ? JSON.parse(networthRaw) : defaultNetworth ?? null,
    forecast: forecastRaw ? JSON.parse(forecastRaw) : defaultForecast ?? null,
    progress: progressRaw ? JSON.parse(progressRaw) : defaultProgress ?? null,
    assumptions: assumptionsRaw
      ? JSON.parse(assumptionsRaw)
      : defaultAssumptions ?? null,
    planner: plannerRaw ? JSON.parse(plannerRaw) : defaultPlanner ?? null,
    investmenttypes: investmenttypesRaw
      ? JSON.parse(investmenttypesRaw)
      : defaultInvestmentTypes ?? null,
  };
}

export function importAppData(data: AppData) {
  if (data.networth) saveJson(STORAGE_KEYS.networth, data.networth);
  if (data.forecast) saveJson(STORAGE_KEYS.forecast, data.forecast);
  if (data.progress) saveJson(STORAGE_KEYS.progress, data.progress);
  if (data.assumptions) saveJson(STORAGE_KEYS.assumptions, data.assumptions);
  if (data.planner) saveJson(STORAGE_KEYS.planner, data.planner);
  if (data.investmenttypes)
    saveJson(STORAGE_KEYS.investmenttypes, data.investmenttypes);
}
