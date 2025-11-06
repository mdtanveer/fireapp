import {
  Card,
  Grid,
  Group,
  NumberInput,
  Stack,
  Text,
  SimpleGrid,
  Box,
} from "@mantine/core";
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
      defaultYearlyReturn: assumptions.defaultYearlyReturn,
    }),
    [
      inputs,
      startNetWorth,
      assumptions.inflationRate,
      assumptions.defaultYearlyReturn,
    ]
  );

  const result = React.useMemo(
    () => forecastNetWorth(computed, assumptions.planStartDate),
    [computed, assumptions.planStartDate]
  );
  const points = result.points;

  const netWorthProjection = (years: number) => {
    return (
      points[Math.min(points.length - 1, 12 * years)]?.netWorth ??
      inputs.startNetWorth
    );
  };

  const yearProjection = (networth: number) => {
    const result = points.findIndex((pt) => pt.netWorth >= networth);
    return result == -1 ? -1 : result / 12;
  };

  const projectionYears = [5, 10, 15, 20];
  const nwProjections = projectionYears.map((val) => netWorthProjection(val));
  const projectionNetWorths = [100000000, 150000000, 250000000, 500000000];
  const yearProjections = projectionNetWorths.map((val) => yearProjection(val));

  return (
    <Stack>
      <Card withBorder>
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
          {projectionYears.map((val, idx) => {
            return (
              <Box>
                <Text size="sm" fw={500} c="dimmed">
                  {`${val}-years`}
                </Text>
                <Text size="lg" fw={700}>
                  {formatInrShort(nwProjections[idx])}
                </Text>
              </Box>
            );
          })}
          {projectionNetWorths.map((val, idx) => {
            return (
              <Box>
                <Text size="sm" fw={500} c="dimmed">
                  {formatInrShort(val)}
                </Text>
                <Text size="lg" fw={700}>
                  {yearProjections[idx] == -1
                    ? "--"
                    : yearProjections[idx].toFixed(0)}{" "}
                  yr
                </Text>
              </Box>
            );
          })}
        </SimpleGrid>
      </Card>

      <Card withBorder>
        <LineChart
          h={520}
          data={points}
          dataKey="date"
          series={[{ name: "netWorth", label: "Net Worth", color: "teal.5" }]}
          valueFormatter={formatInrShort}
          xAxisProps={{
            tickFormatter: (value) => {
              return value.slice(0, 4);
            },
          }}
          withDots={false}
          gridAxis="xy"
        />
      </Card>
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
        <Text fw={600}>{(assumptions.inflationRate * 100).toFixed(2)}%</Text>
      </Group>
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Annual return
        </Text>
        <Text fw={600}>
          {(assumptions.defaultYearlyReturn * 100).toFixed(2)}%
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
  );
}
