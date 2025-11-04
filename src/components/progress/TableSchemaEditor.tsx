import {
  Button,
  Drawer,
  Group,
  Stack,
  TextInput,
  Table,
  ActionIcon,
  Text,
  Select,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import React from "react";

// Mock investment types data - in a real app this would be loaded from investmenttypes.json
const investmentTypes = [
  { id: "equity", name: "Equity", expectedReturn: 12 },
  { id: "debt", name: "Debt", expectedReturn: 6 },
  { id: "savings", name: "Savings", expectedReturn: 4 },
  { id: "real-estate", name: "Real Estate", expectedReturn: 8 },
  { id: "mutual-fund", name: "Mutual Fund", expectedReturn: 10 },
];

export function TableSchemaEditor({
  opened,
  onClose,
  columns,
  onSave,
}: {
  opened: boolean;
  onClose: () => void;
  columns: string[];
  onSave: (newColumns: string[]) => void;
}) {
  const [localColumns, setLocalColumns] = React.useState<string[]>(columns);
  const [newColumn, setNewColumn] = React.useState<string>("");

  const handleAddColumn = () => {
    if (newColumn.trim() && !localColumns.includes(newColumn.trim())) {
      setLocalColumns([...localColumns, newColumn.trim()]);
      setNewColumn("");
    }
  };

  const handleRemoveColumn = (index: number) => {
    const newColumns = [...localColumns];
    newColumns.splice(index, 1);
    setLocalColumns(newColumns);
  };

  const handleSave = () => {
    onSave(localColumns);
    onClose();
  };

  // Convert investment types to Select data format
  const investmentTypeData = investmentTypes.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Edit Table Schema"
      position="right"
      size="md"
    >
      <Stack>
        <Text size="sm" c="dimmed">
          Manage the columns in the net worth table. These columns will be
          applied to all snapshots.
        </Text>
        <Text size="sm" c="dimmed">
          Note: Type and Investment Type are snapshot-specific properties, not
          schema properties.
        </Text>

        <Group>
          <TextInput
            placeholder="New column name"
            value={newColumn}
            onChange={(e) => setNewColumn(e.currentTarget.value)}
            flex={1}
          />
          <Button
            onClick={handleAddColumn}
            leftSection={<IconPlus size={16} />}
            disabled={!newColumn.trim()}
          >
            Add Column
          </Button>
        </Group>

        <Table withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Column Name</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Investment Type</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {localColumns.map((column, index) => (
              <Table.Tr key={index}>
                <Table.Td>{column}</Table.Td>
                <Table.Td>
                  <Select
                    data={[
                      { value: "asset", label: "Asset" },
                      { value: "liability", label: "Liability" },
                    ]}
                    value="asset"
                    placeholder="Select type"
                    size="xs"
                  />
                </Table.Td>
                <Table.Td>
                  <Select
                    data={investmentTypeData}
                    placeholder="Select investment type"
                    size="xs"
                  />
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => handleRemoveColumn(index)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
            {localColumns.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={4} style={{ textAlign: "center" }}>
                  No columns defined
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </Group>
      </Stack>
    </Drawer>
  );
}
