import { Card, Grid, Group, Stack, Text } from "@mantine/core";
import React from "react";
import { CashflowHead } from "../types/forecast";
import { formatInrShort } from "../utils/format";
import { CashflowForm } from "../components/forecast/CashflowForm";
import { loadJson, saveJson, STORAGE_KEYS } from "../utils/storage";
import { useAssumptions } from "../state/AssumptionsContext";
import progressDefaults from "../data/progress.json";
import livingExpensesDefaults from "../data/living-expenses.json";
import { latestSnapshot } from "../services/progress";
import { currentAmountForHead } from "../services/forecast";
import { useNetWorth } from "../state/NetWorthContext";

// Define a separate data structure for living expenses with a different storage key
export type LivingExpenseInputs = {
  heads: CashflowHead[];
};

export function LivingExpenses() {
  // Use a separate storage key for living expenses to ensure no data sharing
  const [inputs, setInputs] = React.useState<LivingExpenseInputs>(
    loadJson(STORAGE_KEYS.livingExpenses, livingExpensesDefaults as any)
  );
  const assumptions = useAssumptions();
  const { netWorth } = useNetWorth();

  // derive start net worth from latest snapshot (progress) or 0
  const storedProgress = loadJson(
    STORAGE_KEYS.progress,
    progressDefaults as any
  );
  const latest = latestSnapshot(
    (storedProgress.snapshots ?? progressDefaults.snapshots) as any
  );
  const startNetWorth = netWorth ?? 0;

  // Calculate total monthly living expenses (properly handling yearly expenses)
  const totalMonthlyExpenses = React.useMemo(() => {
    const expenses = inputs.heads.filter((h) => h.kind === "expense");
    if (expenses.length === 0) return 0;

    return expenses.reduce((total, expense) => {
      try {
        // Get the current amount for this expense
        const currentAmount = currentAmountForHead(
          expense,
          assumptions.inflationRate,
          new Date(assumptions.planStartDate)
        );

        // If it's a yearly expense, divide by 12 to get monthly equivalent
        const monthlyAmount =
          expense.frequency === "yearly" ? currentAmount / 12 : currentAmount;

        return total + monthlyAmount;
      } catch {
        // If there's an error calculating the amount, skip this expense
        return total;
      }
    }, 0);
  }, [inputs.heads, assumptions.inflationRate, assumptions.planStartDate]);

  return (
    <Stack>
      <Text fw={600}>Living Expenses</Text>
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Total Monthly Expenses
        </Text>
        <Text fw={600} size="xl">
          {formatInrShort(totalMonthlyExpenses)}
        </Text>
      </Group>
      <CashflowForm
        inputs={{
          heads: inputs.heads,
          startNetWorth,
          inflationRate: assumptions.inflationRate,
          defaultYearlyReturn: assumptions.defaultYearlyReturn,
          horizonMonths: 0, // Not used in this context
        }}
        onChange={(next) => {
          setInputs({ heads: next.heads });
          saveJson(STORAGE_KEYS.livingExpenses, { heads: next.heads });
        }}
      />
    </Stack>
  );
}
