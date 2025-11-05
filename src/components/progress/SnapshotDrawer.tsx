import {
  Button,
  Drawer,
  Group,
  NumberInput,
  Stack,
  TextInput,
} from "@mantine/core";
import React from "react";
import { Snapshot } from "../../types/progress";

// Load the table schema to get dynamic columns
import tableSchemaData from "../../data/table-schema.json";

export function SnapshotDrawer({
  opened,
  onClose,
  snapshot,
  onSave,
}: {
  opened: boolean;
  onClose: () => void;
  snapshot?: Snapshot;
  onSave: (s: Snapshot) => void;
}) {
  const [local, setLocal] = React.useState<Snapshot>(
    snapshot ?? {
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
    }
  );

  React.useEffect(() => {
    setLocal(
      snapshot ?? {
        id: crypto.randomUUID(),
        date: new Date().toISOString().slice(0, 10),
      }
    );
  }, [snapshot, opened]);

  // Get dynamic columns from table schema
  const tableSchema = tableSchemaData as { columns: any[] };
  const customColumns = tableSchema.columns?.map((col) => col.name) || [];

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={snapshot ? "Edit Snapshot" : "Add Snapshot"}
      position="right"
      size="md"
    >
      <Stack>
        <TextInput
          label="Date (YYYY-MM-DD)"
          value={local.date}
          onChange={(e) => setLocal({ ...local, date: e.currentTarget.value })}
        />
        {customColumns.map((column) => {
          const columnValue = local.customColumns?.[column];
          return (
            <NumberInput
              key={column}
              label={`${column} Value (₹)`}
              value={columnValue?.value ?? 0}
              onChange={(v) =>
                setLocal({
                  ...local,
                  customColumns: {
                    ...local.customColumns,
                    [column]: {
                      value: Number(v) || 0,
                      type: "asset",
                    },
                  },
                })
              }
              thousandSeparator
              thousandsGroupStyle="lakh"
            />
          );
        })}
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(local);
              onClose();
            }}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Drawer>
  );
}
