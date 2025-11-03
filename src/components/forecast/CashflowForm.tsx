import { ActionIcon, Button, Card, Group, Stack, Table, Text } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import React from 'react';
import { CashflowHead, ForecastInputs } from '../../types/forecast';
import { formatInrShort } from '../../utils/format';
import { HeadEditModal } from './HeadEditModal';
import { useAssumptions } from '../../state/AssumptionsContext';
import { currentAmountForHead } from '../../services/forecast';

export function CashflowForm({ inputs, onChange }: { inputs: ForecastInputs; onChange: (next: ForecastInputs) => void }) {
  const income = inputs.heads.filter((h) => h.kind === 'income');
  const expenses = inputs.heads.filter((h) => h.kind === 'expense');
  const [opened, setOpened] = React.useState(false);
  const [editing, setEditing] = React.useState<CashflowHead | undefined>(undefined);
  const assumptions = useAssumptions();

  function amountDisplay(h: CashflowHead) {
    if ((assumptions.displayCashflowsAs ?? 'current') === 'current') {
      const amt = currentAmountForHead(h, assumptions.inflationRate);
      return `${formatInrShort(amt)} / ${h.frequency}`;
    }
    return `${formatInrShort(h.amount)} / ${h.frequency} (${h.inputDate?.slice(0, 7) ?? '—'})`;
  }

  function upsertHead(head: CashflowHead) {
    const idx = inputs.heads.findIndex((h) => h.id === head.id);
    const heads = [...inputs.heads];
    if (idx >= 0) heads[idx] = head; else heads.push(head);
    onChange({ ...inputs, heads });
  }

  function deleteHead(id: string) {
    onChange({ ...inputs, heads: inputs.heads.filter((h) => h.id !== id) });
  }

  return (
    <Stack>
      <Card withBorder>
        <Group justify="space-between" mb="xs">
          <Text fw={600}>Income</Text>
          <Button size="xs" leftSection={<IconPlus size={14} />} onClick={() => { setEditing(undefined); setOpened(true); }}>Add</Button>
        </Group>
        <Table withTableBorder withColumnBorders>
          <Table.Tbody>
            {income.map((h) => (
              <Table.Tr key={h.id}>
                <Table.Td>{h.name}</Table.Td>
                <Table.Td>{amountDisplay(h)}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon size="sm" variant="subtle" onClick={() => { setEditing(h); setOpened(true); }}>
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon size="sm" color="red" variant="subtle" onClick={() => deleteHead(h.id)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <Card withBorder>
        <Group justify="space-between" mb="xs">
          <Text fw={600}>Expenses</Text>
          <Button size="xs" leftSection={<IconPlus size={14} />} onClick={() => { setEditing({ id: crypto.randomUUID(), kind: 'expense', name: '', amount: 0, frequency: 'monthly' }); setOpened(true); }}>Add</Button>
        </Group>
        <Table withTableBorder withColumnBorders>
          <Table.Tbody>
            {expenses.map((h) => (
              <Table.Tr key={h.id}>
                <Table.Td>{h.name}</Table.Td>
                <Table.Td>{amountDisplay(h)}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon size="sm" variant="subtle" onClick={() => { setEditing(h); setOpened(true); }}>
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon size="sm" color="red" variant="subtle" onClick={() => deleteHead(h.id)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <HeadEditModal opened={opened} head={editing} onClose={() => setOpened(false)} onSave={upsertHead} />
    </Stack>
  );
}


