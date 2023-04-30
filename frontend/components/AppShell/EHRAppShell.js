import { useState } from "react";
import { Paper, AppShell, useMantineTheme, LoadingOverlay } from "@mantine/core";
import EHRHeader from "./EHRHeader";
import EHRNavbar from "./EHRNavbar";

export default function EHRAppShell({ loading, navlinks, Controller }) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <Paper>
      <LoadingOverlay visible={loading} overlayBlur={4} />
      <AppShell
        styles={{
          main: {
            background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
          },
        }}
        header={<EHRHeader opened={opened} setOpened={setOpened} />}
        navbar={<EHRNavbar navlinks={navlinks} opened={opened} />}
      >
        <Controller />
      </AppShell>
    </Paper>
  );
}
