import { Box, Button, Flex, Group, Text } from "@mantine/core";
import { IconSwitch, IconSwitch3 } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

export default function SwitchNetworkButton() {
  const { isConnected, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  const { chains, switchNetworkAsync } = useSwitchNetwork();

  const [isDefinitelyConnected, setIsDefinitelyConnected] = useState(false);

  useEffect(() => {
    setIsDefinitelyConnected(isConnected);
  }, [isConnected, isDisconnected]);

  return (
    isDefinitelyConnected &&
    chain &&
    chain.id !== 11155111 && (
      <Group spacing="2px" onClick={() => switchNetworkAsync(11155111)} sx={{ cursor: "pointer" }}>
        <IconSwitch />
        <Box>
          Switch Network
          <Text c="dimmed" size="xs">
            Sepolia
          </Text>
        </Box>
      </Group>
    )
  );
}
