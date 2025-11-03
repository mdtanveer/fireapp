import { Button, Card, Grid, Group, Pagination, Select, Stack, Table, Text } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import React from 'react';
import data from '../data/progress.json';
import { Snapshot } from '../types/progress';
import { toSeries } from '../services/progress';
import { formatInrShort } from '../utils/format';
import { SnapshotDrawer } from '../components/progress/SnapshotDrawer';
import { loadJson, saveJson, STORAGE_KEYS } from '../utils/storage';

export function Progress() {
  const [rows, setRows] = React.useState<Snapshot[]>(loadJson(STORAGE_KEYS.progress, data as any).snapshots ?? (data.snapshots as any));
  const series = React.useMemo(() => toSeries(rows), [rows]);
  const [opened, setOpened] = React.useState(false);
  const [editing, setEditing] = React.useState<Snapshot | undefined>(undefined);

  return (
    <Stack>
      <Card withBorder>
        <Group justify="space-between" mb="sm">
          <Stack gap={0}>
            <Text size="sm" c="dimmed">Net worth</Text>
            <Text fw={700} fz={24}>{formatInrShort(series.at(-1)?.netWorth ?? 0)}</Text>
          </Stack>
          <Group>
            <Button size="xs" onClick={() => { setEditing(undefined); setOpened(true); }}>Add</Button>
          </Group>
        </Group>
        <LineChart h={260} data={series} dataKey="date" series={[{ name: 'netWorth', label: 'Net Worth', color: 'teal.5' }]} px="xs" curveType="linear" />
      </Card>

      <Card withBorder>
        <Group justify="space-between" mb="xs">
          <Text fw={600}>Progress Points</Text>
        </Group>
        <Table withTableBorder withColumnBorders highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Net Worth</Table.Th>
              <Table.Th>Assets</Table.Th>
              <Table.Th>Liabilities</Table.Th>
              <Table.Th>Savings</Table.Th>
              <Table.Th>Investments</Table.Th>
              <Table.Th>Real Asset Equity</Table.Th>
              <Table.Th>Unsecured Debt</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows
              .slice()
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((r) => (
                <Table.Tr key={r.id}>
                  <Table.Td>{r.date}</Table.Td>
                  <Table.Td>{formatInrShort(r.assets - r.liabilities)}</Table.Td>
                  <Table.Td>{formatInrShort(r.assets)}</Table.Td>
                  <Table.Td>{formatInrShort(r.liabilities)}</Table.Td>
                  <Table.Td>{formatInrShort(r.savings ?? 0)}</Table.Td>
                  <Table.Td>{formatInrShort(r.investments ?? 0)}</Table.Td>
                  <Table.Td>{formatInrShort(r.realAssetEquity ?? 0)}</Table.Td>
                  <Table.Td>{formatInrShort(r.unsecuredDebt ?? 0)}</Table.Td>
                  <Table.Td>
                    <Button size="xs" variant="subtle" onClick={() => { setEditing(r); setOpened(true); }}>Edit</Button>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </Card>

      <SnapshotDrawer opened={opened} snapshot={editing} onClose={() => setOpened(false)} onSave={(s) => {
        setRows((prev) => {
          const idx = prev.findIndex((p) => p.id === s.id);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = s;
            saveJson(STORAGE_KEYS.progress, { snapshots: copy });
            return copy;
          }
          const next = [...prev, s];
          saveJson(STORAGE_KEYS.progress, { snapshots: next });
          return next;
        });
      }} />
    </Stack>
  );
}


