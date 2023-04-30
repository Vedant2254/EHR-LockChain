import { Box, Flex, Group, createStyles } from "@mantine/core";
import EHRHeader from "@/components/AppShell/EHRHeader";
import EHRMain from "@/components/AppShell/EHRMain";
import EHRInstructions from "@/components/AppShell/EHRInstructions";
import EHRFooter from "@/components/AppShell/EHRFooter";

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

  return (
    <main>
      <Box className={classes.notFooter}>
        <EHRHeader />
        <Flex h="100vh" direction="column">
          <EHRMain />
        </Flex>
        <Flex h="100vh" direction="column">
          <EHRInstructions />
        </Flex>
      </Box>
      <Box className={classes.footer}>
        <EHRFooter links={[{ label: "abc", link: "def" }]} />
      </Box>
    </main>
  );
}
