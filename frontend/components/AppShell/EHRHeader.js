import { Header, Burger, Text, Flex, Box, MediaQuery, useMantineTheme } from "@mantine/core";
import ConnectButton from "@/components/Utils/ConnectButton";

export default function EHRHeader({ opened, setOpened }) {
  const theme = useMantineTheme();

  return (
    <Header height={{ base: 50, md: 70 }} p="md">
      <Flex justify="space-between" align="center" h="100%">
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <Text>EHR data management system</Text>

        <ConnectButton />
      </Flex>
    </Header>
  );
}
