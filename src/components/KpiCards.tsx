import { Card, Grid, Stack, Text } from "@mantine/core";
import React from "react";
import { PlanInputs } from "../types/plan";
import { projectPlan } from "../services/calc";
import { formatInrShort } from "../utils/format";

export function KpiCards() {
  // Default inputs for KPI cards - these are not used in the current implementation
  const inputs: PlanInputs = {
    currentAge: 30,
    retirementAge: 60,
    lifeExpectancyAge: 85,
    currentNetWorth: 0,
    annualIncome: 0,
    annualExpenses: 0,
    preRetirementReturn: 0.08,
    postRetirementReturn: 0.04,
    inflationRate: 0.05,
    targetRetirementSpending: 0,
    spendingInTodaysDollars: true,
  };
  const result = React.useMemo(() => projectPlan(inputs), []);
  return (
    <Grid>
      <Grid.Col span={{ base: 12, sm: 4 }}>
        <Card withBorder>
          <Stack gap={0}>
            <Text size="sm" c="dimmed">
              Retirement balance
            </Text>
            <Text fw={700} fz={22}>
              {formatInrShort(result.retirementBalance)}
            </Text>
          </Stack>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 4 }}>
        <Card withBorder>
          <Stack gap={0}>
            <Text size="sm" c="dimmed">
              Success
            </Text>
            <Text fw={700} fz={22}>
              {result.success ? "Likely" : "At risk"}
            </Text>
          </Stack>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 4 }}>
        <Card withBorder>
          <Stack gap={0}>
            <Text size="sm" c="dimmed">
              Depletion age
            </Text>
            <Text fw={700} fz={22}>
              {result.depletionAge ?? "—"}
            </Text>
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
