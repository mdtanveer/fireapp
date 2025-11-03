import { Group, Button } from '@mantine/core';
import React from 'react';
import { TimeRange } from '../../types/networth';

export function RangeControls({ range, onChange }: { range: TimeRange; onChange: (r: TimeRange) => void }) {
  const ranges: TimeRange[] = ['1M', '3M', '1Y', '5Y', '10Y', 'ALL'];
  return (
    <Group>
      {ranges.map((r) => (
        <Button key={r} size="xs" variant={range === r ? 'filled' : 'subtle'} onClick={() => onChange(r)}>
          {r}
        </Button>
      ))}
    </Group>
  );
}


