import { useEffect, useState } from "react";
import useGetPatientData from "@/hooks/useGetPatientData";

import { Tabs } from "@mantine/core";
import GeneralDetails from "./GeneralDetails";
import MedicalCertificates from "./MedicalCertificates";

export default function Patient({ address, user, setData }) {
  // get data
  const [activeTab, setActiveTab] = useState("general-details");
  const { generalData, certificates } = useGetPatientData(address);

  useEffect(() => {
    setData && setData({ generalData, certificates });
  }, [generalData, certificates]);

  return (
    <>
      <Tabs value={activeTab} onTabChange={setActiveTab} orientation="horizontal" px="xl" mt="md">
        <Tabs.List grow>
          <Tabs.Tab value="general-details">General Details</Tabs.Tab>
          <Tabs.Tab value="certificates">Medical Certificates</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general-details" mt="md">
          <GeneralDetails data={generalData} />
        </Tabs.Panel>
        <Tabs.Panel value="certificates" mt="md">
          <MedicalCertificates certificates={certificates} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
