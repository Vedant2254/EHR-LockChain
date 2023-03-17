import { useState } from "react";
import { Paper, AppShell, useMantineTheme } from "@mantine/core";
import EHRHeader from "./EHRHeader";
import EHRNavbar from "./EHRNavbar";

export default function EHRAppShell({ navlinks, Controller }) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <Paper>
      <AppShell
        styles={{
          main: {
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        }}
        header={<EHRHeader opened={opened} setOpened={setOpened} />}
        navbar={<EHRNavbar opened={opened} navlinks={navlinks} />}
      >
        <Controller />
      </AppShell>
    </Paper>
  );
}
