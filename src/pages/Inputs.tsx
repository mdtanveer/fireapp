import { Card, Grid, NumberInput, Stack, Switch, Text } from '@mantine/core';
import React from 'react';
import defaults from '../data/profile.json';
import { PlanInputs } from '../types/plan';
import { projectPlan } from '../services/calc';
import { LineChart } from '@mantine/charts';

export function Inputs() {
  const [inputs, setInputs] = React.useState<PlanInputs>(defaults as unknown as PlanInputs);
  const result = React.useMemo(() => projectPlan(inputs), [inputs]);
  const rows = result.rows.map((r) => ({ age: r.age, nominal: r.endBalance, real: r.endBalanceReal }));

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 5 }}>
        <Card withBorder>
          <Stack>
            <Text fw={600}>Inputs</Text>
            <NumberInput label="Current age" value={inputs.currentAge} onChange={(v) => setInputs({ ...inputs, currentAge: Number(v) || 0 })} />
            <NumberInput label="Retirement age" value={inputs.retirementAge} onChange={(v) => setInputs({ ...inputs, retirementAge: Number(v) || 0 })} />
            <NumberInput label="Life expectancy" value={inputs.lifeExpectancyAge} onChange={(v) => setInputs({ ...inputs, lifeExpectancyAge: Number(v) || 0 })} />
            <NumberInput label="Current net worth (₹)" value={inputs.currentNetWorth} onChange={(v) => setInputs({ ...inputs, currentNetWorth: Number(v) || 0 })} thousandSeparator />
            <NumberInput label="Annual income (₹)" value={inputs.annualIncome} onChange={(v) => setInputs({ ...inputs, annualIncome: Number(v) || 0 })} thousandSeparator />
            <NumberInput label="Annual expenses (₹)" value={inputs.annualExpenses} onChange={(v) => setInputs({ ...inputs, annualExpenses: Number(v) || 0 })} thousandSeparator />
            <NumberInput label="Pre-ret return (%)" value={inputs.preRetirementReturn * 100} onChange={(v) => setInputs({ ...inputs, preRetirementReturn: (Number(v) || 0) / 100 })} precision={2} />
            <NumberInput label="Post-ret return (%)" value={inputs.postRetirementReturn * 100} onChange={(v) => setInputs({ ...inputs, postRetirementReturn: (Number(v) || 0) / 100 })} precision={2} />
            <NumberInput label="Inflation (%)" value={inputs.inflationRate * 100} onChange={(v) => setInputs({ ...inputs, inflationRate: (Number(v) || 0) / 100 })} precision={2} />
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


