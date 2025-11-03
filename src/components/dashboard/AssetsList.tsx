import { ActionIcon, Button, Card, Group, Stack, Table, Text } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import React from 'react';
import { NetWorthItem } from '../../types/networth';
import { formatInrShort } from '../../utils/format';
import { ItemDrawer } from './ItemDrawer';

export function AssetsList({ items, onChange }: { items: NetWorthItem[]; onChange: (items: NetWorthItem[]) => void }) {
  const [opened, setOpened] = React.useState(false);
  const [editing, setEditing] = React.useState<NetWorthItem | undefined>(undefined);
  const total = items.reduce((s, i) => s + i.currentValue, 0);

  return (
    <Card withBorder>
      <Group justify="space-between" mb="sm">
        <Text fw={600}>Assets</Text>
        <Button size="xs" onClick={() => { setEditing(undefined); setOpened(true); }}>Add</Button>
      </Group>
      <Stack gap="xs">
        <Text size="sm" c="dimmed">Total: {formatInrShort(total)}</Text>
        <Table striped withTableBorder withColumnBorders highlightOnHover>
          <Table.Tbody>
            {items.map((i) => (
              <Table.Tr key={i.id}>
                <Table.Td>{i.name}</Table.Td>
                <Table.Td>{formatInrShort(i.currentValue)}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon size="sm" variant="subtle" onClick={() => { setEditing(i); setOpened(true); }}>
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon size="sm" color="red" variant="subtle" onClick={() => onChange(items.filter((x) => x.id !== i.id))}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
      <ItemDrawer
        opened={opened}
        item={editing}
        onClose={() => setOpened(false)}
        onSave={(it) => {
          if (editing) onChange(items.map((x) => (x.id === it.id ? it : x)));
          else onChange([...items, it]);
        }}
      />
    </Card>
  );
}


