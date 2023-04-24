import { useEffect, useState } from "react";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { ActionIcon, Button, Menu } from "@mantine/core";
import { IconPlugConnected } from "@tabler/icons-react";
import { ArrowDownIcon } from "@modulz/radix-icons";
import LogosMetamaskIcon from "@/components/Utils/Icons/MetamaskIcon";

const IconConnectDisconnect = () => {
  return (
    <ActionIcon color="blue" size="xs">
      <IconPlugConnected />
    </ActionIcon>
  );
};

export default function Home() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();
  const [isDefinitelyConnected, setIsDefinitelyConnected] = useState(false);

  useEffect(() => {
    window && window.localStorage.getItem("connected") && connect({ connector: connectors.at(0) });
  }, []);

  useEffect(() => {
    setIsDefinitelyConnected(isConnected);
    isConnected && window && window.localStorage.setItem("connected", "metamask");
  }, [isConnected]);

  return isDefinitelyConnected ? (
    <Menu showdow="md" trigger="hover">
      <Menu.Target>
        <Button variant="light" radius="sm" leftIcon={<ArrowDownIcon />}>
          {address &&
            `${address.substring(0, 6)}...${address.substring(address.length - 6, address.length)}`}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          icon={<IconConnectDisconnect />}
          p="7px"
          onClick={() => {
            disconnect();
            window && window.localStorage.removeItem("connected");
          }}
        >
          Disconnect
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ) : (
    <Button
      variant="light"
      leftIcon={<LogosMetamaskIcon />}
      onClick={async () => {
        connect({ connector: connectors.at(0) });
      }}
    >
      Connect
    </Button>
  );
}
