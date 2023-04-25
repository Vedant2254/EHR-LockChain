import { useEffect, useState } from "react";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { ActionIcon, Box, Button, Menu, Text } from "@mantine/core";
import { ArrowDownIcon } from "@modulz/radix-icons";
import LogosMetamaskIcon from "@/components/Utils/Icons/MetamaskIcon";
import { IconPlugConnectedX } from "@tabler/icons-react";

const IconDisconnect = () => {
  return (
    <ActionIcon color="blue" size="xs">
      <IconPlugConnectedX />
    </ActionIcon>
  );
};

export default function ConnectButton() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, isDisconnected, address } = useAccount();
  const [isDefinitelyConnected, setIsDefinitelyConnected] = useState(false);

  useEffect(() => {
    window && window.localStorage.getItem("connected") && connect({ connector: connectors.at(0) });
  }, []);

  useEffect(() => {
    setIsDefinitelyConnected(isConnected);
    isConnected && window && window.localStorage.setItem("connected", "metamask");
    isDisconnected && window && window.localStorage.removeItem("connected");
  }, [isConnected, isDisconnected]);

  return isDefinitelyConnected ? (
    <Box onClick={disconnect} w="100%" h="100%" sx={{ cursor: "pointer" }}>
      {address &&
        `${address.substring(0, 6)}...${address.substring(address.length - 6, address.length)}`}
      <Text c="dimmed" size="xs">
        Disconnect
      </Text>
    </Box>
  ) : (
    <Box
      onClick={async () => {
        connect({ connector: connectors.at(0) });
      }}
      w="100%"
      h="100%"
      sx={{ cursor: "pointer" }}
    >
      Connect
    </Box>
  );
}
