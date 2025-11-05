import { Card, Grid, Group, Stack, Text } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import progressData from "../data/progress.json";
import { latestSnapshot, toSeries } from "../services/progress";
import { loadJson, saveJson, STORAGE_KEYS } from "../utils/storage";
import { forecastNetWorth } from "../services/forecast";
import { TimeRange } from "../types/networth";
import React from "react";
import { formatInrShort } from "../utils/format";
import { RangeControls } from "../components/dashboard/RangeControls";
import { AssetsList } from "../components/dashboard/AssetsList";
import { LiabilitiesList } from "../components/dashboard/LiabilitiesList";
import { useAssumptions } from "../state/AssumptionsContext";
import { useNetWorth } from "../state/NetWorthContext";

export function Dashboard() {
  const [range, setRange] = React.useState<TimeRange>("ALL");
  const { netWorth, assets, liabilities, latestSnapshot } = useNetWorth();
  const assumptions = useAssumptions();
  const storedProgress = loadJson(STORAGE_KEYS.progress, progressData as any);
  const progressSeries = React.useMemo(
    () => toSeries((storedProgress.snapshots ?? progressData.snapshots) as any),
    [storedProgress]
  );
  const series = progressSeries;
  const currentNet = series[0]?.netWorth ?? 0;
  const latestNet = netWorth ?? 0;
  const latest = latestSnapshot;
  // const assetsTotal = latest?.assets ?? 0;
  // const liabilitiesTotal = latest?.liabilities ?? 0;

  // Forecast series for dashboard
  const storedForecast = loadJson(STORAGE_KEYS.forecast, {} as any);
  const startNetWorth = latest
    ? latest.assets - latest.liabilities
    : storedForecast.startNetWorth ?? 0;
  const computedForecastInputs = React.useMemo(
    () => ({
      ...storedForecast,
      startNetWorth,
      inflationRate: assumptions.inflationRate,
      defaultMonthlyReturn: assumptions.defaultMonthlyReturn,
    }),
    [
      storedForecast,
      startNetWorth,
      assumptions.inflationRate,
      assumptions.defaultMonthlyReturn,
    ]
  );
  const forecastSeries = React.useMemo(
    () =>
      forecastNetWorth(computedForecastInputs, assumptions.planStartDate)
        .points,
    [computedForecastInputs, assumptions.planStartDate]
  );

  return (
    <Stack>
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder>
            <Group justify="space-between">
              <Stack gap={0}>
                <Text size="sm" c="dimmed">
                  Net worth
                </Text>
                <Text fz={28} fw={700}>
                  {formatInrShort(latestNet)}
                </Text>
              </Stack>
              <RangeControls range={range} onChange={setRange} />
            </Group>
            <LineChart
              h={260}
              data={series}
              dataKey="date"
              series={[
                { name: "netWorth", label: "Net Worth", color: "teal.5" },
              ]}
              px="xs"
              curveType="linear"
            />
          </Card>
          <Card withBorder mt="md">
            <Group justify="space-between">
              <Text fw={600}>Forecasted Net Worth</Text>
            </Group>
            <LineChart
              h={260}
              data={forecastSeries}
              dataKey="date"
              series={[
                { name: "netWorth", label: "Net Worth", color: "indigo.5" },
              ]}
              px="xs"
              curveType="linear"
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack>
            <AssetsList
              items={assets}
              onChange={(v) => {
                /* setAssets(v); saveJson(STORAGE_KEYS.networth, { assets: v, liabilities }); */
              }}
            />
            <LiabilitiesList
              items={liabilities}
              onChange={(v) => {
                /* setLiabilities(v); saveJson(STORAGE_KEYS.networth, { assets, liabilities: v }); */
              }}
            />
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
