import Head from "next/head";
import EHRHeader from "@/components/AppShell/EHRHeader";
import Link from "next/link";
import { NavLink, Button, Group, Image, BackgroundImage, Flex, Box } from "@mantine/core";
import IndexMain from "@/components/IndexMain";

export default function Home() {
  return (
    <>
      <Head>
        <title>EHR data management system</title>
      </Head>
      <main>
        <Flex h="100vh" direction="column">
          <EHRHeader />
          <IndexMain />
        </Flex>
      </main>
    </>
  );
}
