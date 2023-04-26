import { Flex } from "@mantine/core";
import EHRHeader from "@/components/AppShell/EHRHeader";
import EHRMain from "@/components/AppShell/EHRMain";

export default function Home() {
  return (
    <main>
      <Flex h="100vh" direction="column">
        <EHRHeader />
        <EHRMain />
      </Flex>
    </main>
  );
}
