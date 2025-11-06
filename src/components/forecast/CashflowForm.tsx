import {
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  Stack,
  Text,
  SimpleGrid,
  Table,
  Switch,
} from "@mantine/core";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import React from "react";
import { CashflowHead, ForecastInputs } from "../../types/forecast";
import { formatInrShort, friendlyDate } from "../../utils/format";
import { HeadEditModal } from "./HeadEditModal";
import { useAssumptions } from "../../state/AssumptionsContext";
import { currentAmountForHead } from "../../services/forecast";
import { addMonths } from "date-fns";

function amountDisplay(h: CashflowHead) {
  const assumptions = useAssumptions();
  var displayFreq = h.frequency == "monthly" ? "mo" : "yr";
  if (
    h.startMonthOffset &&
    h.startMonthOffset !== 0 &&
    h.startMonthOffset === h.endMonthOffset
  ) {
    displayFreq = "once";
  }
  if ((assumptions.displayCashflowsAs ?? "current") === "current") {
    const amt = currentAmountForHead(
      h,
      assumptions.inflationRate,
      new Date(assumptions.planStartDate)
    );
    return `${formatInrShort(amt)} / ${displayFreq}`;
  }
  return `${formatInrShort(h.amount)} / ${displayFreq} (${
    h.inputDate?.slice(0, 7) ?? "—"
  })`;
}

function durationDisplay(h: CashflowHead) {
  const assumptions = useAssumptions();
  if ((h.startMonthOffset ?? 0) === 0 && (h.endMonthOffset ?? 0) === 0) {
    return "Indefinite";
  }
  const startDate = addMonths(
    new Date(assumptions.planStartDate),
    h.startMonthOffset ?? 0
  );
  const endDate = h.endMonthOffset
    ? addMonths(new Date(assumptions.planStartDate), h.endMonthOffset)
    : null;

  if (h.startMonthOffset === h.endMonthOffset) {
    return `${friendlyDate(startDate)}`;
  }

  return `${friendlyDate(startDate)} to ${
    endDate ? friendlyDate(endDate) : "End of Plan"
  }`;
}

function CashflowCard({ h, onEdit }: { h: CashflowHead; onEdit: () => void }) {
  return (
    <Card onClick={onEdit}>
      <Stack gap="xs">
        <Group justify="space-between">
          <Text fw={500}>{h.name}</Text>
          <Stack>
            <Text size="sm">{amountDisplay(h)}</Text>
          </Stack>
        </Group>
        <Text size="xs" c="dimmed">
          {durationDisplay(h)}
        </Text>
        <Text size="xs" c="dimmed">
          {h.matchInflation
            ? "Increased to match inflation"
            : "Not inflation adjusted"}
        </Text>
      </Stack>
    </Card>
  );
}

function CashflowTable({
  heads,
  onEdit,
  onAdd,
  title,
}: {
  heads: CashflowHead[];
  onEdit: (h: CashflowHead) => void;
  onAdd: () => void;
  title: string;
}) {
  return (
    <Box mb="lg">
      <Group justify="space-between" mb="xs">
        <Text fw={600}>{title}</Text>
        <Button size="xs" leftSection={<IconPlus size={14} />} onClick={onAdd}>
          Add
        </Button>
      </Group>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Duration</Table.Th>
            <Table.Th>Inflation</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {heads.map((h) => (
            <Table.Tr key={h.id}>
              <Table.Td>{h.name}</Table.Td>
              <Table.Td>{amountDisplay(h)}</Table.Td>
              <Table.Td>{durationDisplay(h)}</Table.Td>
              <Table.Td>{h.matchInflation ? "Yes" : "No"}</Table.Td>
              <Table.Td>
                <ActionIcon onClick={() => onEdit(h)}>
                  <IconEdit size={16} />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
}

export function CashflowForm({
  inputs,
  onChange,
  viewMode = "cards",
}: {
  inputs: ForecastInputs;
  onChange: (next: ForecastInputs) => void;
  viewMode?: "cards" | "table";
}) {
  const income = inputs.heads.filter((h) => h.kind === "income");
  const expenses = inputs.heads.filter((h) => h.kind === "expense");
  const [opened, setOpened] = React.useState(false);
  const [editing, setEditing] = React.useState<CashflowHead | undefined>(
    undefined
  );

  function upsertHead(head: CashflowHead) {
    const idx = inputs.heads.findIndex((h) => h.id === head.id);
    const heads = [...inputs.heads];
    if (idx >= 0) heads[idx] = head;
    else heads.push(head);
    onChange({ ...inputs, heads });
  }

  function deleteHead(id: string) {
    onChange({ ...inputs, heads: inputs.heads.filter((h) => h.id !== id) });
  }

  return (
    <>
      {viewMode === "cards" ? (
        <Stack>
          <Box>
            <Group justify="space-between" mb="xs">
              <Text fw={600}>Income</Text>
              <Button
                size="xs"
                leftSection={<IconPlus size={14} />}
                onClick={() => {
                  setEditing({
                    id: crypto.randomUUID(),
                    kind: "income",
                    name: "",
                    amount: 0,
                    frequency: "monthly",
                  });
                  setOpened(true);
                }}
              >
                Add
              </Button>
            </Group>
            <SimpleGrid cols={3}>
              {income.map((h) => (
                <CashflowCard
                  h={h}
                  key={h.id}
                  onEdit={() => {
                    setEditing(h);
                    setOpened(true);
                  }}
                />
              ))}
            </SimpleGrid>
          </Box>

          <Box>
            <Group justify="space-between" mb="xs">
              <Text fw={600}>Expenses</Text>
              <Button
                size="xs"
                leftSection={<IconPlus size={14} />}
                onClick={() => {
                  setEditing({
                    id: crypto.randomUUID(),
                    kind: "expense",
                    name: "",
                    amount: 0,
                    frequency: "monthly",
                  });
                  setOpened(true);
                }}
              >
                Add
              </Button>
            </Group>
            <SimpleGrid cols={3}>
              {expenses.map((h) => (
                <CashflowCard
                  h={h}
                  key={h.id}
                  onEdit={() => {
                    setEditing(h);
                    setOpened(true);
                  }}
                />
              ))}
            </SimpleGrid>
          </Box>
        </Stack>
      ) : (
        <>
          <CashflowTable
            heads={income}
            onEdit={(h) => {
              setEditing(h);
              setOpened(true);
            }}
            onAdd={() => {
              setEditing({
                id: crypto.randomUUID(),
                kind: "income",
                name: "",
                amount: 0,
                frequency: "monthly",
              });
              setOpened(true);
            }}
            title="Income"
          />

          <CashflowTable
            heads={expenses}
            onEdit={(h) => {
              setEditing(h);
              setOpened(true);
            }}
            onAdd={() => {
              setEditing({
                id: crypto.randomUUID(),
                kind: "expense",
                name: "",
                amount: 0,
                frequency: "monthly",
              });
              setOpened(true);
            }}
            title="Expenses"
          />
        </>
      )}

      <HeadEditModal
        opened={opened}
        head={editing}
        onClose={() => setOpened(false)}
        onSave={upsertHead}
        onDelete={editing ? (head) => deleteHead(head.id) : undefined}
      />
    </>
  );
}
