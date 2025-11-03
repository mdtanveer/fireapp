export type AppData = {
  networth?: any;
  forecast?: any;
  progress?: any;
  assumptions?: any;
};

export const STORAGE_KEYS = {
  networth: 'fire.networth',
  forecast: 'fire.forecast',
  progress: 'fire.progress',
  assumptions: 'fire.assumptions',
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

export function exportAppData(): AppData {
  return {
    networth: JSON.parse(localStorage.getItem(STORAGE_KEYS.networth) || 'null'),
    forecast: JSON.parse(localStorage.getItem(STORAGE_KEYS.forecast) || 'null'),
    progress: JSON.parse(localStorage.getItem(STORAGE_KEYS.progress) || 'null'),
    assumptions: JSON.parse(localStorage.getItem(STORAGE_KEYS.assumptions) || 'null'),
  };
}

export function importAppData(data: AppData) {
  if (data.networth) saveJson(STORAGE_KEYS.networth, data.networth);
  if (data.forecast) saveJson(STORAGE_KEYS.forecast, data.forecast);
  if (data.progress) saveJson(STORAGE_KEYS.progress, data.progress);
  if (data.assumptions) saveJson(STORAGE_KEYS.assumptions, data.assumptions);
}


