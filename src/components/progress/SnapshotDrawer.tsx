import { Button, Drawer, Group, NumberInput, Stack, TextInput } from '@mantine/core';
import React from 'react';
import { Snapshot } from '../../types/progress';

export function SnapshotDrawer({ opened, onClose, snapshot, onSave }: { opened: boolean; onClose: () => void; snapshot?: Snapshot; onSave: (s: Snapshot) => void; }) {
  const [local, setLocal] = React.useState<Snapshot>(
    snapshot ?? { id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10), assets: 0, liabilities: 0 }
  );

  React.useEffect(() => {
    setLocal(snapshot ?? { id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10), assets: 0, liabilities: 0 });
  }, [snapshot, opened]);

  return (
    <Drawer opened={opened} onClose={onClose} title={snapshot ? 'Edit Snapshot' : 'Add Snapshot'} position="right" size="md">
      <Stack>
        <TextInput label="Date (YYYY-MM-DD)" value={local.date} onChange={(e) => setLocal({ ...local, date: e.currentTarget.value })} />
        <NumberInput label="Assets (₹)" value={local.assets} onChange={(v) => setLocal({ ...local, assets: Number(v) || 0 })} thousandSeparator />
        <NumberInput label="Liabilities (₹)" value={local.liabilities} onChange={(v) => setLocal({ ...local, liabilities: Number(v) || 0 })} thousandSeparator />
        <NumberInput label="Savings (₹)" value={local.savings ?? 0} onChange={(v) => setLocal({ ...local, savings: Number(v) || 0 })} thousandSeparator />
        <NumberInput label="Investments (₹)" value={local.investments ?? 0} onChange={(v) => setLocal({ ...local, investments: Number(v) || 0 })} thousandSeparator />
        <NumberInput label="Real Asset Equity (₹)" value={local.realAssetEquity ?? 0} onChange={(v) => setLocal({ ...local, realAssetEquity: Number(v) || 0 })} thousandSeparator />
        <NumberInput label="Unsecured Debt (₹)" value={local.unsecuredDebt ?? 0} onChange={(v) => setLocal({ ...local, unsecuredDebt: Number(v) || 0 })} thousandSeparator />
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onSave(local); onClose(); }}>Save</Button>
        </Group>
      </Stack>
    </Drawer>
  );
}


