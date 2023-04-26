import Head from "next/head";

export default function HeadComponent({ title, logo }) {
  return (
    <Head>
      <title>{title || "EHR data management system"}</title>
      <link rel="icon" type="image/png" href={logo || "/ehr-logo-main.png"} />
    </Head>
  );
}
