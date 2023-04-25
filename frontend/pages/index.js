import Head from "next/head";
import EHRHeader from "@/components/AppShell/EHRHeader";
import Link from "next/link";
import { NavLink, Button, Group, Image, BackgroundImage } from "@mantine/core";

export default function Home() {
  return (
    <>
      <Head>
        <title>EHR data management system</title>
      </Head>
      <main>
        <EHRHeader />
        {/* <Group m="md">
          <Button component={Link} href="/register">
            Register
          </Button>
          <Button component={Link} href="/admin">
            Admin
          </Button>
          <Button component={Link} href="/doctor">
            Doctor
          </Button>
          <Button component={Link} href="/patient">
            Patient
          </Button>
        </Group> */}
        <Image maw="240px" radius="md" src="/ehr-logo-main-animated.gif" alt="Random image" />
      </main>
    </>
  );
}
