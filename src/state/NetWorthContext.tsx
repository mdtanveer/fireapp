import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Snapshot } from "../types/progress";
import { NetWorthItem } from "../types/networth";
import { loadJson, STORAGE_KEYS } from "../utils/storage";
import progressData from "../data/progress.json";

interface NetWorthContextType {
  netWorth: number | null;
  assets: NetWorthItem[];
  liabilities: NetWorthItem[];
  latestSnapshot: Snapshot | null;
  calculateNetWorth: (snapshots: Snapshot[]) => number;
  calculateAssets: (snapshots: Snapshot[]) => NetWorthItem[];
  calculateLiabilities: (snapshots: Snapshot[]) => NetWorthItem[];
  refreshFromStorage: () => void;
}

const NetWorthContext = createContext<NetWorthContextType | undefined>(
  undefined
);

export function useNetWorth() {
  const context = useContext(NetWorthContext);
  if (context === undefined) {
    throw new Error("useNetWorth must be used within a NetWorthProvider");
  }
  return context;
}

interface NetWorthProviderProps {
  children: ReactNode;
  snapshots: Snapshot[];
}

export function NetWorthProvider({
  children,
  snapshots,
}: NetWorthProviderProps) {
  const [netWorth, setNetWorth] = useState<number | null>(null);
  const [assets, setAssets] = useState<NetWorthItem[]>([]);
  const [liabilities, setLiabilities] = useState<NetWorthItem[]>([]);
  const [latestSnapshot, setLatestSnapshot] = useState<Snapshot | null>(null);

  // Calculate net worth from snapshots
  const calculateNetWorth = (snapshots: Snapshot[]): number => {
    if (!snapshots || snapshots.length === 0) return 0;

    // Get the latest snapshot
    const latest = snapshots[snapshots.length - 1];
    setLatestSnapshot(latest);

    // Calculate total assets and liabilities
    let totalAssets = 0;
    let totalLiabilities = 0;

    if (latest.customColumns) {
      Object.values(latest.customColumns).forEach((column) => {
        if (column.type === "asset") {
          totalAssets += column.value;
        } else if (column.type === "liability") {
          totalLiabilities += column.value;
        }
      });
    }

    return totalAssets - totalLiabilities;
  };

  // Calculate assets from snapshots
  const calculateAssets = (snapshots: Snapshot[]): NetWorthItem[] => {
    if (!snapshots || snapshots.length === 0) return [];

    const latest = snapshots[snapshots.length - 1];
    const assetItems: NetWorthItem[] = [];

    if (latest.customColumns) {
      Object.entries(latest.customColumns).forEach(([name, column]) => {
        if (column.type === "asset") {
          assetItems.push({
            id: column.investmentTypeId || crypto.randomUUID(),
            kind: "asset",
            name: name,
            currentValue: column.value,
            monthlyGrowthRate: 0.004, // Default rate, could be enhanced with real data
          });
        }
      });
    }

    return assetItems;
  };

  // Calculate liabilities from snapshots
  const calculateLiabilities = (snapshots: Snapshot[]): NetWorthItem[] => {
    if (!snapshots || snapshots.length === 0) return [];

    const latest = snapshots[snapshots.length - 1];
    const liabilityItems: NetWorthItem[] = [];

    if (latest.customColumns) {
      Object.entries(latest.customColumns).forEach(([name, column]) => {
        if (column.type === "liability") {
          liabilityItems.push({
            id: column.investmentTypeId || crypto.randomUUID(),
            kind: "liability",
            name: name,
            currentValue: column.value,
            monthlyGrowthRate: 0.01, // Default rate, could be enhanced with real data
          });
        }
      });
    }

    return liabilityItems;
  };

  // Refresh data from storage to ensure we have the latest changes
  const refreshFromStorage = useCallback(() => {
    const storedProgress = loadJson(STORAGE_KEYS.progress, progressData as any);
    const updatedSnapshots = storedProgress.snapshots ?? progressData.snapshots;

    if (updatedSnapshots && updatedSnapshots.length > 0) {
      const calculatedNetWorth = calculateNetWorth(updatedSnapshots);
      setNetWorth(calculatedNetWorth);

      const calculatedAssets = calculateAssets(updatedSnapshots);
      setAssets(calculatedAssets);

      const calculatedLiabilities = calculateLiabilities(updatedSnapshots);
      setLiabilities(calculatedLiabilities);
    } else {
      // Reset to empty state if no snapshots
      setNetWorth(null);
      setAssets([]);
      setLiabilities([]);
      setLatestSnapshot(null);
    }
  }, [calculateNetWorth, calculateAssets, calculateLiabilities]);

  useEffect(() => {
    if (snapshots && snapshots.length > 0) {
      const calculatedNetWorth = calculateNetWorth(snapshots);
      setNetWorth(calculatedNetWorth);

      const calculatedAssets = calculateAssets(snapshots);
      setAssets(calculatedAssets);

      const calculatedLiabilities = calculateLiabilities(snapshots);
      setLiabilities(calculatedLiabilities);
    }
  }, [snapshots]);

  // Set up a listener to refresh when progress data changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.progress) {
        refreshFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshFromStorage]);

  const value = {
    netWorth,
    assets,
    liabilities,
    latestSnapshot,
    calculateNetWorth,
    calculateAssets,
    calculateLiabilities,
    refreshFromStorage,
  };

  return (
    <NetWorthContext.Provider value={value}>
      {children}
    </NetWorthContext.Provider>
  );
}
