import React, { createContext, useContext, useMemo, useState } from "react";
import defaults from "../data/assumptions.json";
import { loadJson, saveJson, STORAGE_KEYS } from "../utils/storage";
import { ForecastInputs } from "../types/forecast";

export type Assumptions = {
  inflationRate: number;
  defaultYearlyReturn: number;
  displayCashflowsAs?: "current" | "input";
  planStartDate: string;
  forecastInputs?: ForecastInputs;
};

type AssumptionsContextValue = Assumptions & {
  setAssumptions: (next: Partial<Assumptions>) => void;
  resetAssumptions: () => void;
  setForecastInputs: (next: ForecastInputs) => void;
};

const Ctx = createContext<AssumptionsContextValue | null>(null);

export function AssumptionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [assumptions, setAssumptionsState] = useState<Assumptions>(
    loadJson<Assumptions>(STORAGE_KEYS.assumptions, {
      ...defaults,
      displayCashflowsAs: "current",
    })
  );
  const value = useMemo<AssumptionsContextValue>(
    () => ({
      ...assumptions,
      setAssumptions: (next) =>
        setAssumptionsState((prev) => {
          const v = { ...prev, ...next };
          saveJson(STORAGE_KEYS.assumptions, v);
          return v;
        }),
      setForecastInputs: (next) =>
        setAssumptionsState((prev) => {
          const v = { ...prev, forecastInputs: next };
          saveJson(STORAGE_KEYS.assumptions, v);
          return v;
        }),
      resetAssumptions: () =>
        setAssumptionsState(() => {
          const v = { ...(defaults as any), displayCashflowsAs: "current" };
          saveJson(STORAGE_KEYS.assumptions, v);
          return v;
        }),
    }),
    [assumptions]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAssumptions() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useAssumptions must be used within AssumptionsProvider");
  return ctx;
}
