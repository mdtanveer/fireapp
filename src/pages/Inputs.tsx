import {
  Card,
  Grid,
  NumberInput,
  Stack,
  Switch,
  Text,
  Group,
} from "@mantine/core";
import React from "react";
import { PlanInputs } from "../types/plan";
import { projectPlan } from "../services/calc";
import { LineChart } from "@mantine/charts";
import { useAssumptions } from "../state/AssumptionsContext";
import progressDefaults from "../data/progress.json";
import { latestSnapshot } from "../services/progress";
import { loadJson, saveJson, STORAGE_KEYS } from "../utils/storage";
import { formatInrShort } from "../utils/format";
import { useNetWorth } from "../state/NetWorthContext";

export function Inputs() {
  type PlannerForm = Pick<
    PlanInputs,
    | "currentAge"
    | "retirementAge"
    | "lifeExpectancyAge"
    | "targetRetirementSpending"
    | "spendingInTodaysDollars"
  >;
  const [form, setForm] = React.useState<PlannerForm>(
    loadJson("fire.planner", {} as any)
  );
  const assumptions = useAssumptions();
  const { netWorth } = useNetWorth();
  const storedProgress = loadJson(
    STORAGE_KEYS.progress,
    progressDefaults as any
  );
  const latest = latestSnapshot(
    (storedProgress.snapshots ?? progressDefaults.snapshots) as any
  );
  const startNetWorth = netWorth ?? undefined;
  const projectionInputs: PlanInputs = React.useMemo(
    () => ({
      currentAge: form.currentAge,
      retirementAge: form.retirementAge,
      lifeExpectancyAge: form.lifeExpectancyAge,
      currentNetWorth: startNetWorth ?? 0,
      annualIncome: 0,
      annualExpenses: 0,
      preRetirementReturn: assumptions.preRetirementReturn,
      postRetirementReturn: assumptions.postRetirementReturn,
      inflationRate: assumptions.inflationRate,
      targetRetirementSpending: form.targetRetirementSpending,
      spendingInTodaysDollars: form.spendingInTodaysDollars,
    }),
    [form, startNetWorth, assumptions]
  );
  const result = React.useMemo(
    () => projectPlan(projectionInputs),
    [projectionInputs]
  );
  const rows = result.rows.map((r) => ({
    age: r.age,
    nominal: r.endBalance,
    real: r.endBalanceReal,
  }));

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 5 }}>
        <Card withBorder>
          <Stack>
            <Text fw={600}>Inputs</Text>
            <NumberInput
              label="Current age"
              value={form.currentAge}
              onChange={(v) => {
                const next = { ...form, currentAge: Number(v) || 0 };
                setForm(next);
                saveJson(STORAGE_KEYS.planner, next);
              }}
            />
            <NumberInput
              label="Retirement age"
              value={form.retirementAge}
              onChange={(v) => {
                const next = { ...form, retirementAge: Number(v) || 0 };
                setForm(next);
                saveJson(STORAGE_KEYS.planner, next);
              }}
            />
            <NumberInput
              label="Life expectancy"
              value={form.lifeExpectancyAge}
              onChange={(v) => {
                const next = { ...form, lifeExpectancyAge: Number(v) || 0 };
                setForm(next);
                saveJson(STORAGE_KEYS.planner, next);
              }}
            />
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Start Net Worth
              </Text>
              <Text fw={600}>
                {startNetWorth ? formatInrShort(startNetWorth) : "—"}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Inflation (annual)
              </Text>
              <Text fw={600}>
                {(assumptions.inflationRate * 100).toFixed(2)}%
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Pre/Post returns
              </Text>
              <Text fw={600}>
                {(assumptions.preRetirementReturn * 100).toFixed(1)}% /{" "}
                {(assumptions.postRetirementReturn * 100).toFixed(1)}%
              </Text>
            </Group>
            <NumberInput
              label="Target retirement spending (₹)"
              value={form.targetRetirementSpending}
              onChange={(v) => {
                const next = {
                  ...form,
                  targetRetirementSpending: Number(v) || 0,
                };
                setForm(next);
                saveJson(STORAGE_KEYS.planner, next);
              }}
              thousandSeparator
            />
            <Switch
              label="Spending in today's rupees"
              checked={form.spendingInTodaysDollars}
              onChange={(e) => {
                const next = {
                  ...form,
                  spendingInTodaysDollars: e.currentTarget.checked,
                };
                setForm(next);
                saveJson(STORAGE_KEYS.planner, next);
              }}
            />
          </Stack>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 7 }}>
        <Card withBorder>
          <Text fw={600}>Projection</Text>
          <LineChart
            h={320}
            data={rows}
            dataKey="age"
            series={[
              { name: "nominal", label: "Nominal", color: "teal.5" },
              { name: "real", label: "Real", color: "orange.5" },
            ]}
          />
        </Card>
      </Grid.Col>
    </Grid>
  );
}
