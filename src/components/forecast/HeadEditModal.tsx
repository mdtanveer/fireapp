import { Button, Group, Modal, NumberInput, SegmentedControl, Stack, Switch, TextInput } from '@mantine/core';
import React from 'react';
import { CashflowHead } from '../../types/forecast';

export function HeadEditModal({ opened, onClose, head, onSave }: { opened: boolean; onClose: () => void; head?: CashflowHead; onSave: (h: CashflowHead) => void; }) {
  const [local, setLocal] = React.useState<CashflowHead>(
    head ?? { id: crypto.randomUUID(), kind: 'expense', name: '', amount: 0, frequency: 'monthly', inputDate: new Date().toISOString().slice(0, 10), annualGrowthRate: 0, matchInflation: false, essential: true, startMonthOffset: 0 }
  );
  React.useEffect(() => {
    setLocal(head ?? { id: crypto.randomUUID(), kind: 'expense', name: '', amount: 0, frequency: 'monthly', inputDate: new Date().toISOString().slice(0, 10), annualGrowthRate: 0, matchInflation: false, essential: true, startMonthOffset: 0 });
  }, [head, opened]);

  return (
    <Modal opened={opened} onClose={onClose} title={(head?.name || 'New item').toUpperCase()} size="lg">
      <Stack>
        <SegmentedControl value={local.kind} onChange={(v) => setLocal({ ...local, kind: v as 'income' | 'expense' })} data={[{ label: 'Income', value: 'income' }, { label: 'Expense', value: 'expense' }]} />
        <TextInput label="Name" value={local.name} onChange={(e) => setLocal({ ...local, name: e.currentTarget.value })} />
        <Group grow>
          <NumberInput label="Starting amount (₹)" value={local.amount} onChange={(v) => setLocal({ ...local, amount: Number(v) || 0 })} thousandSeparator />
          <SegmentedControl data={[{ label: 'Monthly', value: 'monthly' }, { label: 'Yearly', value: 'yearly' }]} value={local.frequency} onChange={(v) => setLocal({ ...local, frequency: v as any })} />
        </Group>

        <TextInput label="Input date (YYYY-MM-DD)" value={local.inputDate ?? ''} onChange={(e) => setLocal({ ...local, inputDate: e.currentTarget.value })} />

        {/* Time Range */}
        <Group grow>
          <NumberInput label="Start offset (months)" value={local.startMonthOffset ?? 0} onChange={(v) => setLocal({ ...local, startMonthOffset: Number(v) || 0 })} />
          <NumberInput label="End offset (months)" value={local.endMonthOffset ?? 0} onChange={(v) => setLocal({ ...local, endMonthOffset: Number(v) || 0 })} placeholder="Ongoing if 0" />
        </Group>

        {/* Change over time */}
        <Group grow>
          <NumberInput label="Annual growth (%)" value={(local.annualGrowthRate ?? 0) * 100} onChange={(v) => setLocal({ ...local, annualGrowthRate: (Number(v) || 0) / 100 })} step={0.1} />
          <Switch label="Match inflation" checked={local.matchInflation ?? false} onChange={(e) => setLocal({ ...local, matchInflation: e.currentTarget.checked })} />
        </Group>

        {/* Flexibility */}
        <SegmentedControl data={[{ label: 'Essential', value: 'true' }, { label: 'Discretionary', value: 'false' }]} value={String(local.essential ?? true)} onChange={(v) => setLocal({ ...local, essential: v === 'true' })} />

        {/* More options */}
        <SegmentedControl data={[{ label: 'Even monthly', value: 'even-monthly' }, { label: 'Annual lump', value: 'annual-lump' }]} value={local.allocationMode ?? 'even-monthly'} onChange={(v) => setLocal({ ...local, allocationMode: v as any })} />

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onSave(local); onClose(); }}>Save</Button>
        </Group>
      </Stack>
    </Modal>
  );
}


