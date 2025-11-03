import React, { createContext, useContext, useMemo, useState } from 'react';
import defaults from '../data/assumptions.json';

export type Assumptions = {
  inflationRate: number;
  preRetirementReturn: number;
  postRetirementReturn: number;
  defaultMonthlyReturn: number;
  displayCashflowsAs?: 'current' | 'input';
};

type AssumptionsContextValue = Assumptions & {
  setAssumptions: (next: Partial<Assumptions>) => void;
  resetAssumptions: () => void;
};

const Ctx = createContext<AssumptionsContextValue | null>(null);

export function AssumptionsProvider({ children }: { children: React.ReactNode }) {
  const [assumptions, setAssumptionsState] = useState<Assumptions>({ ...defaults, displayCashflowsAs: 'current' });
  const value = useMemo<AssumptionsContextValue>(() => ({
    ...assumptions,
    setAssumptions: (next) => setAssumptionsState((prev) => ({ ...prev, ...next })),
    resetAssumptions: () => setAssumptionsState(defaults),
  }), [assumptions]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAssumptions() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAssumptions must be used within AssumptionsProvider');
  return ctx;
}


