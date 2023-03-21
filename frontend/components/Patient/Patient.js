import useValidTxnData from "@/hooks/useValidTxnData";
import { Tabs } from "@mantine/core";
import { useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import GeneralDetails from "./GeneralDetails";
import MedicalCertificates from "./MedicalCertificates";

export default function Patient({ address, user }) {
  // get data
  const [activeTab, setActiveTab] = useState("general-details");

  return (
    <Tabs value={activeTab} onTabChange={setActiveTab} orientation="horizontal" px="xl" mt="md">
      <Tabs.List grow>
        <Tabs.Tab value="general-details">General Details</Tabs.Tab>
        <Tabs.Tab value="certificates">Medical Certificates</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="general-details">
        <GeneralDetails data={data} />
      </Tabs.Panel>
      {/* <Tabs.Panel value="certificates">
      <MedicalCertificates certificates={certificates} />
    </Tabs.Panel> */}
    </Tabs>
  );
}
