import { useEffect, useState } from "react";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { Button, Popover, useMantineTheme } from "@mantine/core";

export default function Home() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();
  const [isDefinitelyConnected, setIsDefinitelyConnected] = useState(false);

  const theme = useMantineTheme();

  useEffect(() => {
    setIsDefinitelyConnected(isConnected);
  }, [isConnected]);

  return isDefinitelyConnected ? (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button variant="outline">
          {address &&
            `${address.substring(0, 6)}...${address.substring(
              address.length - 6,
              address.length
            )}`}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Button w="100%" onClick={disconnect}>
          Disconnect
        </Button>
      </Popover.Dropdown>
    </Popover>
  ) : (
    <Button
      variant="outline"
      onClick={() => {
        connect({ connector: connectors.at(0) });
      }}
    >
      Connect
    </Button>
  );
}
