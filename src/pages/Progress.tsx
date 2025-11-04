import {
  Button,
  Card,
  Group,
  Stack,
  Table,
  Text,
  TextInput,
  ActionIcon,
} from "@mantine/core";
import { LineChart } from "@mantine/charts";
import React from "react";
import data from "../data/progress.json";
import { Snapshot } from "../types/progress";
import { toSeries } from "../services/progress";
import { formatInrShort } from "../utils/format";
import { SnapshotDrawer } from "../components/progress/SnapshotDrawer";
import { loadJson, saveJson, STORAGE_KEYS } from "../utils/storage";
import { TableSchemaEditor } from "../components/progress/TableSchemaEditor";
import { useNetWorth } from "../state/NetWorthContext";

export function Progress() {
  const [rows, setRows] = React.useState<Snapshot[]>(
    loadJson(STORAGE_KEYS.progress, data as any).snapshots ??
      (data.snapshots as any)
  );
  const series = React.useMemo(() => toSeries(rows), [rows]);
  const [opened, setOpened] = React.useState(false);
  const [editing, setEditing] = React.useState<Snapshot | undefined>(undefined);
  const [customColumns, setCustomColumns] = React.useState<string[]>([
    "Equity",
    "Debt",
    "Foreign Equity",
    "NPS",
    "EPF",
    "Savings",
    "Real Estate",
  ]);
  const [schemaEditorOpened, setSchemaEditorOpened] = React.useState(false);
  const { refreshFromStorage } = useNetWorth();

  // Function to get all unique custom column names from snapshots
  const getAllCustomColumns = React.useCallback(() => {
    const columns = new Set<string>();
    rows.forEach((row) => {
      if (row.customColumns) {
        Object.keys(row.customColumns).forEach((key) => columns.add(key));
      }
    });
    return Array.from(columns).sort();
  }, [rows]);

  // Update custom columns when rows change
  React.useEffect(() => {
    const allColumns = getAllCustomColumns();
    if (allColumns.length > 0) {
      setCustomColumns(allColumns);
    }
  }, [getAllCustomColumns]);

  // Function to calculate net worth with custom columns
  const calculateNetWorth = (snapshot: Snapshot): number => {
    let netWorth = 0;
    if (snapshot.customColumns) {
      for (const column of Object.values(snapshot.customColumns)) {
        if (column.type === "asset") {
          netWorth += column.value;
        } else if (column.type === "liability") {
          netWorth -= column.value;
        }
      }
    }
    return netWorth;
  };

  const handleSaveSchema = (newColumns: string[]) => {
    // Update the custom columns state
    setCustomColumns(newColumns);

    // Update all existing snapshots to ensure they have the new columns
    setRows((prevRows) => {
      return prevRows.map((row) => {
        const updatedRow = { ...row };
        // Ensure customColumns exists
        if (!updatedRow.customColumns) {
          updatedRow.customColumns = {};
        }
        // Add new columns to existing snapshots
        newColumns.forEach((column) => {
          if (!(column in updatedRow.customColumns!)) {
            updatedRow.customColumns![column] = {
              value: 0,
              type: "asset",
            };
          }
        });
        // Remove columns that no longer exist
        Object.keys(updatedRow.customColumns!).forEach((column) => {
          if (!newColumns.includes(column)) {
            delete updatedRow.customColumns![column];
          }
        });
        return updatedRow;
      });
    });
  };

  return (
    <Stack>
      <Card withBorder>
        <Group justify="space-between" mb="sm">
          <Stack gap={0}>
            <Text size="sm" c="dimmed">
              Net worth
            </Text>
            <Text fw={700} fz={24}>
              {formatInrShort(series[series.length - 1]?.netWorth ?? 0)}
            </Text>
          </Stack>
          <Group>
            <Button
              size="xs"
              onClick={() => {
                setEditing(undefined);
                setOpened(true);
              }}
            >
              Add
            </Button>
          </Group>
        </Group>
        <LineChart
          h={260}
          data={series}
          dataKey="date"
          series={[{ name: "netWorth", label: "Net Worth", color: "teal.5" }]}
          px="xs"
          curveType="linear"
        />
      </Card>

      <Card withBorder>
        <Group justify="space-between" mb="xs">
          <Text fw={600}>Progress Points</Text>
          <ActionIcon
            variant="subtle"
            onClick={() => setSchemaEditorOpened(true)}
            title="Edit table schema"
          >
            ⚙️
          </ActionIcon>
        </Group>
        <Table withTableBorder withColumnBorders highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Net Worth</Table.Th>
              {customColumns.map((column) => (
                <Table.Th key={column}>{column}</Table.Th>
              ))}
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
                  <Table.Td>{formatInrShort(calculateNetWorth(r))}</Table.Td>
                  {customColumns.map((column) => (
                    <Table.Td key={`${r.id}-${column}`}>
                      {r.customColumns?.[column] !== undefined
                        ? formatInrShort(r.customColumns[column].value)
                        : "0"}
                    </Table.Td>
                  ))}
                  <Table.Td>
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => {
                        setEditing(r);
                        setOpened(true);
                      }}
                    >
                      Edit
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </Card>

      <SnapshotDrawer
        opened={opened}
        snapshot={editing}
        onClose={() => setOpened(false)}
        onSave={(s) => {
          setRows((prev) => {
            const idx = prev.findIndex((p) => p.id === s.id);
            if (idx >= 0) {
              const copy = [...prev];
              copy[idx] = s;
              saveJson(STORAGE_KEYS.progress, { snapshots: copy });
              // Refresh NetWorthContext when data changes
              refreshFromStorage();
              return copy;
            }
            const next = [...prev, s];
            saveJson(STORAGE_KEYS.progress, { snapshots: next });
            // Refresh NetWorthContext when data changes
            refreshFromStorage();
            return next;
          });
        }}
      />

      <TableSchemaEditor
        opened={schemaEditorOpened}
        onClose={() => setSchemaEditorOpened(false)}
        columns={customColumns}
        onSave={handleSaveSchema}
      />
    </Stack>
  );
}
