import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AppLayout } from "./components/Layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Plan } from "./pages/Plan";
import { Forecast } from "./pages/Forecast";
import { Progress } from "./pages/Progress";
import { LivingExpenses } from "./pages/LivingExpenses";
import { AssumptionsProvider } from "./state/AssumptionsContext";

export default function App() {
  return (
    <AssumptionsProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="plan" element={<Plan />} />
          <Route path="forecast" element={<Forecast />} />
          <Route path="progress" element={<Progress />} />
          <Route path="expenses" element={<LivingExpenses />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AssumptionsProvider>
  );
}
