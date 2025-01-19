import { Box, Group, Text } from "@mantine/core";
import { IconSwitch } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";

export default function SwitchNetworkButton() {
  const { isConnected, isDisconnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();

  const [isDefinitelyConnected, setIsDefinitelyConnected] = useState(false);

  const isOnSupportedChain = useMemo(() => chain && sepolia && chain.id === sepolia.id, [chain]);

  useEffect(() => {
    setIsDefinitelyConnected(isConnected);
  }, [isConnected, isDisconnected]);

  return (
    isDefinitelyConnected &&
    !isOnSupportedChain && (
      <Group spacing="2px" onClick={async () => switchChain({ chainId: sepolia.id })} sx={{ cursor: "pointer" }}>
        <IconSwitch />
        <Box>
          Switch Network
          <Text c="dimmed" size="xs">
            Sepolia (Ethereum Testnet)
          </Text>
        </Box>
      </Group>
    )
  );
}
