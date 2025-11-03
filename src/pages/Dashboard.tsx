import { Card, Grid, Group, Stack, Text } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import assetsLiabilities from '../data/networth.json';
import progressData from '../data/progress.json';
import { latestSnapshot } from '../services/progress';
import { generateNetWorthSeries } from '../services/netWorth';
import { TimeRange } from '../types/networth';
import React from 'react';
import { formatInrShort } from '../utils/format';
import { KpiCards } from '../components/KpiCards';
import { RangeControls } from '../components/dashboard/RangeControls';
import { AssetsList } from '../components/dashboard/AssetsList';
import { LiabilitiesList } from '../components/dashboard/LiabilitiesList';

export function Dashboard() {
  const [range, setRange] = React.useState<TimeRange>('1Y');
  const [assets, setAssets] = React.useState<any[]>(assetsLiabilities.assets as any[]);
  const [liabilities, setLiabilities] = React.useState<any[]>(assetsLiabilities.liabilities as any[]);
  const series = React.useMemo(() => generateNetWorthSeries(assets, liabilities, range), [range, assets, liabilities]);
  const currentNet = series[0]?.netWorth ?? 0;
  const latestNet = series[series.length - 1]?.netWorth ?? 0;
  const latest = latestSnapshot(progressData.snapshots as any);
  const assetsTotal = latest?.assets ?? (assetsLiabilities.assets as any[]).reduce((s, a) => s + a.currentValue, 0);
  const liabilitiesTotal = latest?.liabilities ?? (assetsLiabilities.liabilities as any[]).reduce((s, l) => s + l.currentValue, 0);

  return (
    <Stack>
      <KpiCards />
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder>
            <Group justify="space-between">
              <Stack gap={0}>
                <Text size="sm" c="dimmed">Net worth</Text>
                <Text fz={28} fw={700}>{formatInrShort(latestNet)}</Text>
              </Stack>
              <RangeControls range={range} onChange={setRange} />
            </Group>
            <LineChart h={260} data={series} dataKey="date" series={[{ name: 'netWorth', label: 'Net Worth', color: 'teal.5' }]} px="xs" curveType="linear" />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack>
            <AssetsList items={assets} onChange={setAssets} />
            <LiabilitiesList items={liabilities} onChange={setLiabilities} />
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}


