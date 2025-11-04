import { AppShell, Burger, Group, Text } from "@mantine/core";
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { GlobalParams } from "../Layout/GlobalParams";

export function AppLayout() {
  const [opened, setOpened] = React.useState(false);
  const location = useLocation();
  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 240, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              hiddenFrom="sm"
              size="sm"
            />
            <Text fw={700}>Financial Planner</Text>
          </Group>
          <GlobalParams />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Group gap="xs" align="stretch" style={{ flexDirection: "column" }}>
          <Link to="/">Dashboard</Link>
          <Link to="/forecast">Forecast</Link>
          <Link to="/progress">Progress</Link>
          <Link to="/expenses">Living Expenses</Link>
          <Text size="xs" c="dimmed">
            {location.pathname}
          </Text>
        </Group>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
