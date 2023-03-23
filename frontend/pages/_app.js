import { WagmiConfig, configureChains, createClient } from "wagmi";
import { hardhat, goerli, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { MantineProvider } from "@mantine/core";
import "@/styles/globals.css";

const { chains, provider, webSocketProvider } = configureChains(
  [hardhat, goerli, sepolia],
  [
    publicProvider(),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_GOERLI_RPC_URL }),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL }),
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
  webSocketProvider,
});

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider
      theme={{
        colorScheme: "light",
        loader: "bars",
        components: {
          Button: {
            styles: {
              root: {
                transition: "150ms",
                "&:hover": { transform: "scale(1.005)" },
                "&:active": { transform: "scale(0.98)" },
              },
            },
          },
        },
      }}
    >
      <WagmiConfig client={client}>
        <Component {...pageProps} />
      </WagmiConfig>
    </MantineProvider>
  );
}
