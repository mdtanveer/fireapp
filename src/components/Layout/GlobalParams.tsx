import { Button, Group, Popover, NumberInput, Stack, SegmentedControl, FileButton } from '@mantine/core';
import { IconAdjustments, IconPercentage } from '@tabler/icons-react';
import React from 'react';
import { useAssumptions } from '../../state/AssumptionsContext';
import { exportAppData, importAppData } from '../../utils/storage';

export function GlobalParams() {
  const assumptions = useAssumptions();
  const [openedInf, setOpenedInf] = React.useState(false);
  const [openedInv, setOpenedInv] = React.useState(false);
  const [openedDisp, setOpenedDisp] = React.useState(false);
  const [local, setLocal] = React.useState({
    inflationRate: assumptions.inflationRate,
    pre: assumptions.preRetirementReturn,
    post: assumptions.postRetirementReturn,
    monthly: assumptions.defaultMonthlyReturn,
  });

  React.useEffect(() => {
    setLocal({
      inflationRate: assumptions.inflationRate,
      pre: assumptions.preRetirementReturn,
      post: assumptions.postRetirementReturn,
      monthly: assumptions.defaultMonthlyReturn,
    });
  }, [assumptions]);

  return (
    <Group>
      <Popover opened={openedInf} onChange={setOpenedInf} position="bottom-end" withArrow>
        <Popover.Target>
          <Button size="xs" variant="default" leftSection={<IconPercentage size={16} />} onClick={() => setOpenedInf((o) => !o)}>
            Inflation {(assumptions.inflationRate * 100).toFixed(1)}%
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack>
            <NumberInput label="Annual inflation (%)" value={local.inflationRate * 100} onChange={(v) => setLocal((s) => ({ ...s, inflationRate: (Number(v) || 0) / 100 }))} step={0.1} min={0} max={50} />
            <Group justify="space-between">
              <Button size="xs" variant="default" onClick={() => assumptions.resetAssumptions()}>Reset</Button>
              <Button size="xs" onClick={() => { assumptions.setAssumptions({ inflationRate: local.inflationRate }); setOpenedInf(false); }}>Apply</Button>
            </Group>
          </Stack>
        </Popover.Dropdown>
      </Popover>

      <Button size="xs" variant="default" onClick={() => {
        const data = exportAppData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fire-app-data.json';
        a.click();
        URL.revokeObjectURL(url);
      }}>Export JSON</Button>

      <FileButton accept="application/json" onChange={(file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(String(reader.result));
            importAppData(parsed);
            window.location.reload();
          } catch {}
        };
        reader.readAsText(file);
      }}>
        {(props) => <Button size="xs" variant="filled" {...props}>Import JSON</Button>}
      </FileButton>

      <Popover opened={openedDisp} onChange={setOpenedDisp} position="bottom-end" withArrow>
        <Popover.Target>
          <Button size="xs" variant="default" onClick={() => setOpenedDisp((o) => !o)}>
            {assumptions.displayCashflowsAs === 'current' ? 'Show: Current values' : 'Show: Input values'}
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack>
            <SegmentedControl value={assumptions.displayCashflowsAs ?? 'current'} onChange={(v) => assumptions.setAssumptions({ displayCashflowsAs: v as any })} data={[{ label: 'Current (inflation-adjusted)', value: 'current' }, { label: 'Input (as entered)', value: 'input' }]} />
          </Stack>
        </Popover.Dropdown>
      </Popover>

      <Popover opened={openedInv} onChange={setOpenedInv} position="bottom-end" withArrow>
        <Popover.Target>
          <Button size="xs" variant="default" leftSection={<IconAdjustments size={16} />} onClick={() => setOpenedInv((o) => !o)}>
            Growth {`${(assumptions.preRetirementReturn * 100).toFixed(1)}%/${(assumptions.postRetirementReturn * 100).toFixed(1)}%/${(assumptions.defaultMonthlyReturn * 100).toFixed(1)}% m`}
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack>
            <NumberInput label="Pre-ret annual (%)" value={local.pre * 100} onChange={(v) => setLocal((s) => ({ ...s, pre: (Number(v) || 0) / 100 }))} step={0.1} min={0} max={100} />
            <NumberInput label="Post-ret annual (%)" value={local.post * 100} onChange={(v) => setLocal((s) => ({ ...s, post: (Number(v) || 0) / 100 }))} step={0.1} min={0} max={100} />
            <NumberInput label="Monthly portfolio (%)" value={local.monthly * 100} onChange={(v) => setLocal((s) => ({ ...s, monthly: (Number(v) || 0) / 100 }))} step={0.1} min={-100} max={100} />
            <Group justify="space-between">
              <Button size="xs" variant="default" onClick={() => assumptions.resetAssumptions()}>Reset</Button>
              <Button size="xs" onClick={() => { assumptions.setAssumptions({ preRetirementReturn: local.pre, postRetirementReturn: local.post, defaultMonthlyReturn: local.monthly }); setOpenedInv(false); }}>Apply</Button>
            </Group>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
}


