import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AppLayout } from "./components/Layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Forecast } from "./pages/Forecast";
import { Progress } from "./pages/Progress";
import { LivingExpenses } from "./pages/LivingExpenses";
import { AssumptionsProvider } from "./state/AssumptionsContext";
import { NetWorthProvider } from "./state/NetWorthContext";
import { loadJson, STORAGE_KEYS } from "./utils/storage";
import progressData from "./data/progress.json";

export default function App() {
  const storedProgress = loadJson(STORAGE_KEYS.progress, progressData as any);

  return (
    <AssumptionsProvider>
      <NetWorthProvider
        snapshots={storedProgress.snapshots ?? progressData.snapshots}
      >
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="plan" element={<div>Plan not available</div>} />
            <Route path="forecast" element={<Forecast />} />
            <Route path="progress" element={<Progress />} />
            <Route path="expenses" element={<LivingExpenses />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </NetWorthProvider>
    </AssumptionsProvider>
  );
}
