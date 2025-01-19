import { useState } from "react";
import { WagmiProvider } from "wagmi";
import { config } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HeadComponent from "@/components/HeadComponent";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { Analytics } from "@vercel/analytics/react";
import "@/styles/globals.css";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  const [colorScheme, setColorScheme] = useState("light");

  function toggleColorScheme() {
    setColorScheme(colorScheme === "light" ? "dark" : "light");
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
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
            <HeadComponent />
            <Component {...pageProps} />
            <Analytics />
          </ColorSchemeProvider>
        </MantineProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
