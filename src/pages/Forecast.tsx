import { Card, Grid, Group, NumberInput, Stack, Text } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import React from 'react';
import defaults from '../data/forecast.json';
import { ForecastInputs } from '../types/forecast';
import { forecastNetWorth } from '../services/forecast';
import { formatInrShort } from '../utils/format';
import { CashflowForm } from '../components/forecast/CashflowForm';

export function Forecast() {
  const [inputs, setInputs] = React.useState<ForecastInputs>(defaults as unknown as ForecastInputs);
  const result = React.useMemo(() => forecastNetWorth(inputs), [inputs]);
  const points = result.points;
  const projected10y = points[Math.min(points.length - 1, 120)]?.netWorth ?? inputs.startNetWorth;

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 5 }}>
        <Card withBorder>
          <Stack>
            <Text fw={600}>Cash Flows</Text>
            <NumberInput label="Start Net Worth (₹)" value={inputs.startNetWorth} onChange={(v) => setInputs({ ...inputs, startNetWorth: Number(v) || 0 })} thousandSeparator />
            <NumberInput label="Inflation (%)" value={inputs.inflationRate * 100} onChange={(v) => setInputs({ ...inputs, inflationRate: (Number(v) || 0) / 100 })} step={0.1} />
            <NumberInput label="Monthly return (%)" value={inputs.defaultMonthlyReturn * 100} onChange={(v) => setInputs({ ...inputs, defaultMonthlyReturn: (Number(v) || 0) / 100 })} step={0.1} />
            <NumberInput label="Horizon (months)" value={inputs.horizonMonths} onChange={(v) => setInputs({ ...inputs, horizonMonths: Number(v) || 0 })} />
            <CashflowForm inputs={inputs} onChange={setInputs} />
          </Stack>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 7 }}>
        <Card withBorder>
          <Group justify="space-between">
            <Text fw={600}>Forecasted Net Worth</Text>
            <Text size="sm">10Y: {formatInrShort(projected10y)}</Text>
          </Group>
          <LineChart h={320} data={points} dataKey="date" series={[{ name: 'netWorth', label: 'Net Worth', color: 'teal.5' }]} />
        </Card>
      </Grid.Col>
    </Grid>
  );
}


