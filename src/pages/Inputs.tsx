import { Card, Grid, NumberInput, Stack, Switch, Text, Group } from '@mantine/core';
import React from 'react';
import defaults from '../data/profile.json';
import { PlanInputs } from '../types/plan';
import { projectPlan } from '../services/calc';
import { LineChart } from '@mantine/charts';
import { useAssumptions } from '../state/AssumptionsContext';
import progressDefaults from '../data/progress.json';
import { latestSnapshot } from '../services/progress';
import { loadJson, STORAGE_KEYS } from '../utils/storage';
import { formatInrShort } from '../utils/format';

export function Inputs() {
  const [inputs, setInputs] = React.useState<PlanInputs>(defaults as unknown as PlanInputs);
  const result = React.useMemo(() => projectPlan(inputs), [inputs]);
  const rows = result.rows.map((r) => ({ age: r.age, nominal: r.endBalance, real: r.endBalanceReal }));
  const assumptions = useAssumptions();
  const storedProgress = loadJson(STORAGE_KEYS.progress, progressDefaults as any);
  const latest = latestSnapshot((storedProgress.snapshots ?? progressDefaults.snapshots) as any);
  const startNetWorth = latest ? (latest.assets - latest.liabilities) : undefined;

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 5 }}>
        <Card withBorder>
          <Stack>
            <Text fw={600}>Inputs</Text>
            <NumberInput label="Current age" value={inputs.currentAge} onChange={(v) => setInputs({ ...inputs, currentAge: Number(v) || 0 })} />
            <NumberInput label="Retirement age" value={inputs.retirementAge} onChange={(v) => setInputs({ ...inputs, retirementAge: Number(v) || 0 })} />
            <NumberInput label="Life expectancy" value={inputs.lifeExpectancyAge} onChange={(v) => setInputs({ ...inputs, lifeExpectancyAge: Number(v) || 0 })} />
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Start Net Worth</Text>
              <Text fw={600}>{startNetWorth ? formatInrShort(startNetWorth) : '—'}</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Inflation (annual)</Text>
              <Text fw={600}>{(assumptions.inflationRate * 100).toFixed(2)}%</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Pre/Post returns</Text>
              <Text fw={600}>{(assumptions.preRetirementReturn * 100).toFixed(1)}% / {(assumptions.postRetirementReturn * 100).toFixed(1)}%</Text>
            </Group>
            <NumberInput label="Target retirement spending (₹)" value={inputs.targetRetirementSpending} onChange={(v) => setInputs({ ...inputs, targetRetirementSpending: Number(v) || 0 })} thousandSeparator />
            <Switch label="Spending in today's rupees" checked={inputs.spendingInTodaysDollars} onChange={(e) => setInputs({ ...inputs, spendingInTodaysDollars: e.currentTarget.checked })} />
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
            series={[{ name: 'nominal', label: 'Nominal', color: 'teal.5' }, { name: 'real', label: 'Real', color: 'orange.5' }]}
          />
        </Card>
      </Grid.Col>
    </Grid>
  );
}


