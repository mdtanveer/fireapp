import { Card, Grid, Stack, Text } from '@mantine/core';
import React from 'react';
import defaults from '../data/profile.json';
import { PlanInputs } from '../types/plan';
import { projectPlan } from '../services/calc';
import { formatInrShort } from '../utils/format';

export function KpiCards() {
  const inputs = defaults as unknown as PlanInputs;
  const result = React.useMemo(() => projectPlan(inputs), []);
  return (
    <Grid>
      <Grid.Col span={{ base: 12, sm: 4 }}>
        <Card withBorder>
          <Stack gap={0}>
            <Text size="sm" c="dimmed">Retirement balance</Text>
            <Text fw={700} fz={22}>{formatInrShort(result.retirementBalance)}</Text>
          </Stack>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 4 }}>
        <Card withBorder>
          <Stack gap={0}>
            <Text size="sm" c="dimmed">Success</Text>
            <Text fw={700} fz={22}>{result.success ? 'Likely' : 'At risk'}</Text>
          </Stack>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 4 }}>
        <Card withBorder>
          <Stack gap={0}>
            <Text size="sm" c="dimmed">Depletion age</Text>
            <Text fw={700} fz={22}>{result.depletionAge ?? '—'}</Text>
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>
  );
}


