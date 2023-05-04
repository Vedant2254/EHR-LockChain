import { WagmiConfig, configureChains, createClient } from "wagmi";
import { hardhat, goerli, sepolia, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import HeadComponent from "@/components/HeadComponent";
import { useState } from "react";
import "@/styles/globals.css";

const { chains, provider, webSocketProvider } = configureChains(
  [hardhat, goerli, sepolia, polygonMumbai],
  [
    publicProvider(),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_GOERLI_RPC_URL }),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL }),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_POLYGON_MUMBAI_RPC_URL }),
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
  webSocketProvider,
});

export default function App({ Component, pageProps }) {
  const [colorScheme, setColorScheme] = useState("light");

  function toggleColorScheme() {
    setColorScheme(colorScheme === "light" ? "dark" : "light");
  }

  return (
    <MantineProvider
      theme={{
        colorScheme,
        loader: "bars",
        defaultGradient: { from: "purple", to: "blue", deg: 90 },
        components: {
          Button: {
            styles: {
              root: {
                transition: "150ms",
              },
            },
          },
        },
      }}
    >
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <WagmiConfig client={client}>
          <HeadComponent />
          <Component {...pageProps} />
        </WagmiConfig>
      </ColorSchemeProvider>
    </MantineProvider>
  );
}
