import { http, createConfig } from "wagmi";
import { hardhat, mainnet, sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [hardhat, mainnet, sepolia],
  connectors: [metaMask()],
  transports: {
    [hardhat.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(`https://shape-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL}`),
  },
});
