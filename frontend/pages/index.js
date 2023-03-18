import Head from "next/head";
import EHRHeader from "@/components/AppShell/EHRHeader";

export default function Home() {
  return (
    <>
      <Head>
        <title>EHR data management system</title>
      </Head>
      <main>
        <EHRHeader />
      </main>
    </>
  );
}
