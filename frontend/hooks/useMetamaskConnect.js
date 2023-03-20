import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function useMetamaskConnect() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const [addresIfAddress, setAddressIfAddress] = useState(null);

  useEffect(() => {
    connect({ connector: connectors.at(0) });
    address && setAddressIfAddress(address);
  }, [address]);

  return {
    addresIfAddress,
    connect: () => connect({ connector: connectors.at(0) }),
    disconnect,
  };
}
