import { useEffect, useState } from "react";
import { useConnect, useAccount, useDisconnect } from "wagmi";

export default function Home() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();
  const [isDefinitelyConnected, setIsDefinitelyConnected] = useState(false);

  useEffect(() => {
    setIsDefinitelyConnected(isConnected);
  }, [isConnected]);

  return (
    <>
      {isDefinitelyConnected ? (
        <button
          onClick={() => {
            disconnect();
          }}
        >
          Disconnect
        </button>
      ) : (
        <button
          onClick={() => {
            connect({ connector: connectors.at(0) });
          }}
        >
          Connect
        </button>
      )}
    </>
  );
}
