import { isDataURL } from "@/utils/isDataURL";
import useHashAndData from "@/hooks/useHashAndData";
import { Badge, Tabs, Button } from "@mantine/core";
import { useState } from "react";
import useIsDoctorPending from "@/hooks/useIsDoctorPending";
import useApproveDoctor from "@/hooks/useApproveDoctor";
import GeneralDetails from "./GeneralDetails";
import Certifications from "./Certifications";

export default function Doctor({ address }) {
  // get hash
  const { data, certificates } = useHashAndData("getDrHash", address || null);
  const { isDoctorPending } = useIsDoctorPending(address);
  const { runApproveDoctor } = useApproveDoctor(address);

  const [activeTab, setActiveTab] = useState("general-details");

  return (
    <>
      <Tabs value={activeTab} onTabChange={setActiveTab} orientation="horizontal" px="xl" mt="md">
        <Tabs.List grow>
          <Tabs.Tab value="general-details">General Details</Tabs.Tab>
          <Tabs.Tab value="certificates">Certificates</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel className="helloworld" value="general-details" mt="md">
          <GeneralDetails data={data} />
        </Tabs.Panel>
        <Tabs.Panel value="certificates">
          <Certifications certificates={certificates} />
        </Tabs.Panel>
      </Tabs>
      {isDoctorPending ? (
        <Button onClick={runApproveDoctor}>Approve Doctor</Button>
      ) : (
        <Badge color="green">Approved</Badge>
      )}
    </>
  );
}
