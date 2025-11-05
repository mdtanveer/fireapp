import {
  ActionIcon,
  Button,
  Card,
  Group,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { NetWorthItem } from "../../types/networth";
import { formatInrShort } from "../../utils/format";

export function AssetsList({
  items,
  onChange,
}: {
  items: NetWorthItem[];
  onChange: (items: NetWorthItem[]) => void;
}) {
  const total = items.reduce((s, i) => s + i.currentValue, 0);

  return (
    <Card withBorder>
      <Group justify="space-between" mb="sm">
        <Text fw={600}>Assets</Text>
      </Group>
      <Stack gap="xs">
        <Text size="sm" c="dimmed">
          Total: {formatInrShort(total)}
        </Text>
        <Table striped withTableBorder withColumnBorders highlightOnHover>
          <Table.Tbody>
            {items.map((i) => (
              <Table.Tr key={i.id}>
                <Table.Td>{i.name}</Table.Td>
                <Table.Td>{formatInrShort(i.currentValue)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Card>
  );
}
