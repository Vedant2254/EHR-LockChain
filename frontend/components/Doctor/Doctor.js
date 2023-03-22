import useGetDoctorData from "@/hooks/useGetDoctorData";
import { Box, Tabs } from "@mantine/core";
import { useState } from "react";
import GeneralDetails from "./GeneralDetails";
import Certifications from "./Certifications";
import DoctorButtons from "./DoctorButtons";

export default function Doctor({ address, user }) {
  // get data
  const { generalData, certificates } = useGetDoctorData(address);

  const [activeTab, setActiveTab] = useState("general-details");

  return (
    <Tabs value={activeTab} onTabChange={setActiveTab} orientation="horizontal" px="xl" mt="md">
      <Tabs.List grow>
        <Tabs.Tab value="general-details">General Details</Tabs.Tab>
        <Tabs.Tab value="certificates">Doctor's Certificates</Tabs.Tab>
      </Tabs.List>

      <Box my="md">
        <DoctorButtons address={address} user={user} />

        <Tabs.Panel value="general-details" mt="md">
          <GeneralDetails data={generalData} />
        </Tabs.Panel>
        <Tabs.Panel value="certificates" mt="md">
          <Certifications certificates={certificates} />
        </Tabs.Panel>
      </Box>
    </Tabs>
  );
}
