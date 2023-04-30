import { Box, Flex, Group, createStyles } from "@mantine/core";
import EHRHeader from "@/components/AppShell/EHRHeader";
import EHRMain from "@/components/AppShell/EHRMain";
import EHRInstructions from "@/components/AppShell/EHRInstructions";
import EHRFooter from "@/components/AppShell/EHRFooter";
import EHRPermissions from "@/components/AppShell/EHRPermissions";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  notFooter: {
    width: "100%",
    position: "relative",
    zIndex: 1,
  },
  footer: {
    width: "100%",
    position: "sticky",
    bottom: 0,
    left: 0,
  },
}));

export default function Home() {
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);

  return (
    <main>
      <Box className={classes.notFooter}>
        <EHRHeader opened={opened} setOpened={setOpened} />
        <Flex mih="100vh" direction="column">
          <EHRMain />
        </Flex>
        <Flex mih="100vh" direction="column">
          <EHRInstructions />
        </Flex>
        <Flex mih="100vh" direction="column">
          <EHRPermissions />
        </Flex>
      </Box>
      <Box className={classes.footer}>
        <EHRFooter links={[{ label: "abc", link: "def" }]} />
      </Box>
    </main>
  );
}
