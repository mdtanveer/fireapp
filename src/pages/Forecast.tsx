import { Card, Grid, Group, NumberInput, Stack, Text } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import React from "react";
import defaults from "../data/forecast.json";
import { ForecastInputs } from "../types/forecast";
import { forecastNetWorth } from "../services/forecast";
import { formatInrShort } from "../utils/format";
import { CashflowForm } from "../components/forecast/CashflowForm";
import { loadJson, saveJson, STORAGE_KEYS } from "../utils/storage";
import { useAssumptions } from "../state/AssumptionsContext";
import progressDefaults from "../data/progress.json";
import { latestSnapshot } from "../services/progress";
import { useNetWorth } from "../state/NetWorthContext";

export function Forecast() {
  const [inputs, setInputs] = React.useState<ForecastInputs>(
    loadJson(STORAGE_KEYS.forecast, defaults as any)
  );
  const assumptions = useAssumptions();
  // derive start net worth from latest snapshot (progress) or 0
  const storedProgress = loadJson(
    STORAGE_KEYS.progress,
    progressDefaults as any
  );
  const latest = latestSnapshot(
    (storedProgress.snapshots ?? progressDefaults.snapshots) as any
  );
  const { netWorth } = useNetWorth();
  const startNetWorth = netWorth ?? inputs.startNetWorth;

  // keep inputs synced with global assumptions and derived start NW during compute (do not persist)
  const computed = React.useMemo(
    () => ({
      ...inputs,
      startNetWorth,
      inflationRate: assumptions.inflationRate,
      defaultMonthlyReturn: assumptions.defaultMonthlyReturn,
    }),
    [
      inputs,
      startNetWorth,
      assumptions.inflationRate,
      assumptions.defaultMonthlyReturn,
    ]
  );

  const result = React.useMemo(
    () => forecastNetWorth(computed, assumptions.planStartDate),
    [computed, assumptions.planStartDate]
  );
  const points = result.points;
  const projected10y =
    points[Math.min(points.length - 1, 120)]?.netWorth ?? inputs.startNetWorth;

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 5 }}>
        <Card withBorder>
          <Stack>
            <Text fw={600}>Cash Flows</Text>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Start Net Worth
              </Text>
              <Text fw={600}>{formatInrShort(startNetWorth)}</Text>
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
                Monthly return
              </Text>
              <Text fw={600}>
                {(assumptions.defaultMonthlyReturn * 100).toFixed(2)}%
              </Text>
            </Group>
            <NumberInput
              label="Horizon (months)"
              value={inputs.horizonMonths}
              onChange={(v) => {
                const next = { ...inputs, horizonMonths: Number(v) || 0 };
                setInputs(next);
                saveJson(STORAGE_KEYS.forecast, next);
              }}
            />
            <CashflowForm
              inputs={computed}
              onChange={(next) => {
                setInputs(next);
                saveJson(STORAGE_KEYS.forecast, next);
              }}
            />
          </Stack>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 7 }}>
        <Card withBorder>
          <Group justify="space-between">
            <Text fw={600}>Forecasted Net Worth</Text>
            <Text size="sm">10Y: {formatInrShort(projected10y)}</Text>
          </Group>
          <LineChart
            h={320}
            data={points}
            dataKey="date"
            series={[{ name: "netWorth", label: "Net Worth", color: "teal.5" }]}
          />
        </Card>
      </Grid.Col>
    </Grid>
  );
}
