import {
  Button,
  Group,
  Modal,
  NumberInput,
  SegmentedControl,
  Stack,
  Switch,
  TextInput,
} from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import React from "react";
import { CashflowHead } from "../../types/forecast";
import { useAssumptions } from "../../state/AssumptionsContext";
import {
  differenceInMonths,
  parseISO,
  addMonths,
  startOfMonth,
} from "date-fns";

export function HeadEditModal({
  opened,
  onClose,
  head,
  onSave,
  onDelete,
}: {
  opened: boolean;
  onClose: () => void;
  head?: CashflowHead;
  onSave: (h: CashflowHead) => void;
  onDelete?: (h: CashflowHead) => void;
}) {
  const assumptions = useAssumptions();
  const planStartDate = React.useMemo(
    () => parseISO(assumptions.planStartDate),
    [assumptions.planStartDate]
  );

  const [local, setLocal] = React.useState<CashflowHead>(
    head ?? {
      id: crypto.randomUUID(),
      kind: "expense",
      name: "",
      amount: 0,
      frequency: "monthly",
      inputDate: new Date().toISOString().slice(0, 10),
      annualGrowthRate: 0,
      matchInflation: false,
      essential: true,
      startMonthOffset: 0,
    }
  );

  // Calculate dates from offsets
  const startDate = React.useMemo(
    () => addMonths(planStartDate, local.startMonthOffset ?? 0),
    [planStartDate, local.startMonthOffset]
  );

  const endDate = React.useMemo(
    () =>
      local.endMonthOffset !== undefined && local.endMonthOffset !== null
        ? addMonths(planStartDate, local.endMonthOffset)
        : null,
    [planStartDate, local.endMonthOffset]
  );

  React.useEffect(() => {
    setLocal(
      head ?? {
        id: crypto.randomUUID(),
        kind: "expense",
        name: "",
        amount: 0,
        frequency: "monthly",
        inputDate: new Date().toISOString().slice(0, 10),
        annualGrowthRate: 0,
        matchInflation: false,
        essential: true,
        startMonthOffset: 0,
      }
    );
  }, [head, opened]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={(head?.name || "New item").toUpperCase()}
      size="lg"
    >
      <Stack>
        <SegmentedControl
          value={local.kind}
          onChange={(v) =>
            setLocal({ ...local, kind: v as "income" | "expense" })
          }
          data={[
            { label: "Income", value: "income" },
            { label: "Expense", value: "expense" },
          ]}
        />
        <TextInput
          label="Name"
          value={local.name}
          onChange={(e) => setLocal({ ...local, name: e.currentTarget.value })}
        />
        <Group grow>
          <NumberInput
            label="Starting amount (₹)"
            value={local.amount}
            onChange={(v) => setLocal({ ...local, amount: Number(v) || 0 })}
            thousandSeparator
            thousandsGroupStyle="lakh"
            step={1000}
            stepHoldDelay={500}
            stepHoldInterval={100}
          />
          <SegmentedControl
            data={[
              { label: "Monthly", value: "monthly" },
              { label: "Yearly", value: "yearly" },
            ]}
            value={local.frequency}
            onChange={(v) => setLocal({ ...local, frequency: v as any })}
          />
        </Group>

        <MonthPickerInput
          label="Input month"
          value={new Date(local.inputDate ?? assumptions.planStartDate)}
          onChange={(date) => {
            if (date) {
              const inputDateStr = date.toISOString().split("T")[0];
              setLocal({ ...local, inputDate: inputDateStr });
            }
          }}
        />

        {/* Time Range */}
        <Group grow>
          <MonthPickerInput
            label="Start month"
            value={startDate}
            onChange={(date) => {
              if (date) {
                const monthOffset = differenceInMonths(
                  startOfMonth(date),
                  planStartDate
                );
                setLocal({ ...local, startMonthOffset: monthOffset });
              }
            }}
          />
          <MonthPickerInput
            label="End month"
            value={endDate}
            clearable
            placeholder="Ongoing if empty"
            onChange={(date) => {
              if (date) {
                const monthOffset = differenceInMonths(
                  startOfMonth(date),
                  planStartDate
                );
                setLocal({ ...local, endMonthOffset: monthOffset });
              } else {
                setLocal({ ...local, endMonthOffset: undefined });
              }
            }}
          />
        </Group>

        {/* Change over time */}
        <Group grow>
          <NumberInput
            label="Annual growth (%)"
            value={(local.annualGrowthRate ?? 0) * 100}
            onChange={(v) =>
              setLocal({ ...local, annualGrowthRate: (Number(v) || 0) / 100 })
            }
            step={0.1}
          />
          <Switch
            label="Match inflation"
            checked={local.matchInflation ?? false}
            onChange={(e) =>
              setLocal({ ...local, matchInflation: e.currentTarget.checked })
            }
          />
        </Group>

        {/* Flexibility */}
        <SegmentedControl
          data={[
            { label: "Essential", value: "true" },
            { label: "Discretionary", value: "false" },
          ]}
          value={String(local.essential ?? true)}
          onChange={(v) => setLocal({ ...local, essential: v === "true" })}
        />

        {/* More options */}
        <SegmentedControl
          data={[
            { label: "Even monthly", value: "even-monthly" },
            { label: "Annual lump", value: "annual-lump" },
          ]}
          value={local.allocationMode ?? "even-monthly"}
          onChange={(v) => setLocal({ ...local, allocationMode: v as any })}
        />

        <Group justify="flex-end">
          {head && onDelete && (
            <Button
              color="red"
              variant="outline"
              onClick={() => {
                onDelete(local);
                onClose();
              }}
            >
              Delete
            </Button>
          )}
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
    </Modal>
  );
}
