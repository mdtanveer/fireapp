import { Button, Drawer, Group, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import React from 'react';
import { ItemKind, NetWorthItem } from '../../types/networth';

export function ItemDrawer({ opened, onClose, item, onSave }: { opened: boolean; onClose: () => void; item?: NetWorthItem; onSave: (it: NetWorthItem) => void; }) {
  const [local, setLocal] = React.useState<NetWorthItem>(
    item ?? { id: crypto.randomUUID(), kind: 'asset', name: '', category: '', currentValue: 0, monthlyGrowthRate: 0.004 }
  );
  React.useEffect(() => {
    setLocal(item ?? { id: crypto.randomUUID(), kind: 'asset', name: '', category: '', currentValue: 0, monthlyGrowthRate: 0.004 });
  }, [item, opened]);

  return (
    <Drawer opened={opened} onClose={onClose} title={item ? 'Edit Item' : 'Add Item'} position="right" size="md">
      <Stack>
        <Select label="Type" data={[{ label: 'Asset', value: 'asset' }, { label: 'Liability', value: 'liability' }]} value={local.kind} onChange={(v) => setLocal({ ...local, kind: (v as ItemKind) ?? 'asset' })} />
        <TextInput label="Name" value={local.name} onChange={(e) => setLocal({ ...local, name: e.currentTarget.value })} />
        <TextInput label="Category" value={local.category} onChange={(e) => setLocal({ ...local, category: e.currentTarget.value })} />
        <NumberInput label="Current value (₹)" value={local.currentValue} onChange={(v) => setLocal({ ...local, currentValue: Number(v) || 0 })} thousandSeparator />
        <NumberInput label="Monthly growth (%)" value={(local.monthlyGrowthRate ?? 0) * 100} onChange={(v) => setLocal({ ...local, monthlyGrowthRate: (Number(v) || 0) / 100 })} step={0.1} />
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onSave(local); onClose(); }}>Save</Button>
        </Group>
      </Stack>
    </Drawer>
  );
}


